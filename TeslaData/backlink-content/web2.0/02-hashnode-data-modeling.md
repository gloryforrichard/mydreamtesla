---
platform: Hashnode
title: "How I Modeled 100+ Vehicle Trims in PostgreSQL for a Spec Comparison Engine"
suggested_tags: postgresql, drizzle-orm, data-modeling, typescript, database-design
canonical_url: https://mydreamtesla.com
---

# How I Modeled 100+ Vehicle Trims in PostgreSQL for a Spec Comparison Engine

Building a vehicle comparison engine sounds straightforward until you sit down and think about the data. I built [MyDreamTesla](https://mydreamtesla.com), a tool that lets you compare every Tesla ever made — every model, every year, every trim — across 50+ specifications. Along the way, I learned that the hardest part isn't the UI or the queries. It's getting the schema right.

This post is a deep-dive into the data modeling decisions, the tradeoffs I made, and the Drizzle ORM patterns that keep everything type-safe.

## The Data Landscape

Let's scope the problem. Tesla currently sells five model lines: Model 3, Model Y, Model S, Model X, and Cybertruck. But "five models" drastically understates the complexity:

- **Model 3** has been in production since 2017, with 3–4 trims per year, across three generations (Original, Refresh, Highland). That's roughly 30 distinct vehicle configurations.
- **Model Y** spans 2020–2025 with a similar pattern, plus the 2025 Juniper redesign.
- **Model S and X** have had multiple motor configurations (single motor, dual motor, Plaid, the discontinued Plaid+).
- **Cybertruck** launched with Foundation Series variants and now has standard AWD, Cyberbeast, and Long Range RWD trims.

Total: **100+ unique vehicle trims**, each with 50+ spec fields covering pricing, performance, battery, dimensions, interior features, safety, and efficiency.

## Schema Design: The Wide Table Approach

### The Tables

I landed on two core tables:

```sql
CREATE TABLE tesla_model (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  tagline VARCHAR(255),
  description TEXT,
  body_type VARCHAR(50) NOT NULL,  -- 'Sedan', 'SUV', 'Truck'
  production_start INTEGER,
  production_end INTEGER,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE vehicle (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,       -- '2024 Tesla Model 3 Highland Long Range AWD'
  slug VARCHAR(255) NOT NULL UNIQUE, -- 'model-3-2024-long-range-awd'
  model_id INTEGER REFERENCES tesla_model(id) NOT NULL,
  year INTEGER NOT NULL,
  trim_name VARCHAR(100) NOT NULL,   -- 'Long Range'
  drive_type VARCHAR(50) NOT NULL,   -- 'AWD', 'RWD'

  -- 50+ spec columns follow...
  base_price_msrp INTEGER,
  range_epa INTEGER,
  acceleration_060 NUMERIC,
  horsepower INTEGER,
  -- etc.
);
```

### Why Not Normalize Further?

You might ask: why not a `specs` table with rows like `(vehicle_id, spec_name, spec_value)`? The Entity-Attribute-Value (EAV) pattern is flexible, but it creates real problems for this use case.

**Problem 1: Type erasure.** In EAV, every value is a string. The range `310` (miles, integer), the acceleration `3.5` (seconds, decimal), and the battery type `LFP` (string, categorical) all live in the same `TEXT` column. You lose the ability to do numeric comparisons, sorting, or validation at the database level.

**Problem 2: Query complexity.** The fundamental operation of this tool is: "Show me the range, price, acceleration, and horsepower of Vehicle A and Vehicle B side by side." In EAV, that's:

```sql
-- EAV: 4 self-joins for 4 specs
SELECT
  v.title,
  s1.value AS range,
  s2.value AS price,
  s3.value AS acceleration,
  s4.value AS horsepower
FROM vehicle v
JOIN spec s1 ON s1.vehicle_id = v.id AND s1.name = 'range_epa'
JOIN spec s2 ON s2.vehicle_id = v.id AND s2.name = 'base_price_msrp'
JOIN spec s3 ON s3.vehicle_id = v.id AND s3.name = 'acceleration_060'
JOIN spec s4 ON s4.vehicle_id = v.id AND s4.name = 'horsepower'
WHERE v.id IN (1, 2);
```

In a wide table:

```sql
-- Wide table: simple SELECT
SELECT title, range_epa, base_price_msrp, acceleration_060, horsepower
FROM vehicle
WHERE id IN (1, 2);
```

**Problem 3: Schema stability.** Tesla doesn't invent new spec categories every month. In the rare case they do (towing capacity was added for Cybertruck and Model X), a single `ALTER TABLE ADD COLUMN` handles it. Meanwhile, every query benefits from the simplicity.

### The 50+ Columns

Here's the full breakdown by category:

| Category | Fields | Examples |
|----------|--------|----------|
| Pricing | 4 | MSRP, destination fee, tax credit, effective price |
| Performance | 7 | Range (EPA), 0-60, top speed, HP, torque, quarter mile, range (km) |
| Battery & Charging | 6 | Capacity, type, Supercharger max rate, 10-50% time, onboard charger, charge port |
| Dimensions | 7 | Length, width, height, wheelbase, curb weight, ground clearance, cargo volume |
| Interior | 6 | Seating capacity, display size, rear display, sound system, wheel options, colors |
| Safety | 3 | NCAP rating, Autopilot standard, FSD availability + price |
| Efficiency | 2 | Energy consumption (Wh/mi), MPGe |
| Content | 2 | Pros/cons (JSON), key changes from prior year (text) |
| Meta | 4 | Current model flag, region note, discontinued date, last updated |

That's 41 typed columns plus JSON fields. It's a wide table, yes. But every column has a clear type, a clear meaning, and maps directly to what the UI displays.

## Drizzle ORM: Type Safety from Schema to Component

I use Drizzle ORM instead of Prisma for a specific reason: Drizzle's schema definition **is** the TypeScript type. There's no separate schema file and generated client — the Drizzle schema you write is the source of truth for both migrations and TypeScript types.

```typescript
import { pgTable, serial, varchar, integer, numeric, boolean, json } from 'drizzle-orm/pg-core';

export const vehicle = pgTable('vehicle', {
  id: serial('id').primaryKey(),
  rangeEPA: integer('range_epa'),
  acceleration060: numeric('acceleration_060'),
  horsepower: integer('horsepower'),
  prosAndCons: json('pros_and_cons').$type<{ pros: string[]; cons: string[] }>(),
  // ...
});
```

When I query this table, the result type is automatically inferred:

```typescript
const results = await db.select().from(vehicle).where(eq(vehicle.year, 2025));
// results[0].rangeEPA → number | null (integer column, nullable)
// results[0].acceleration060 → string | null (numeric is string in pg)
// results[0].prosAndCons → { pros: string[]; cons: string[] } | null
```

No `as any`. No manual type assertions. If Tesla adds a new field and I add a column to the schema, every component that consumes vehicle data gets automatic type-checking.

## Handling Generational Complexity

The trickiest modeling challenge is generations. "Model 3 Long Range AWD" in 2020 and "Model 3 Long Range AWD" in 2024 are fundamentally different cars — different exterior, different interior, different battery chemistry, different range. But they share the same model name and trim name.

### Approach: Year-Based Grouping with Change Annotations

Rather than adding a formal `generation` column (which would require defining the boundary years — and those boundaries differ by region), I use:

1. **`year`** as the primary differentiator.
2. **`keyChangesFromPriorYear`** as a human-readable annotation that captures what changed.
3. **UI-level grouping** that visually separates pre-Highland and Highland trims.

This keeps the data model simple while letting the presentation layer handle the narrative. The `keyChangesFromPriorYear` field for the 2024 Model 3 Highland reads:

> "Highland facelift: completely redesigned front fascia, full-width light bars front and rear, new ambient lighting inside, rear entertainment screen added, improved NVH, ventilated front seats, 11.5kW onboard charger."

That's more useful to a buyer than a `generation: "highland"` enum value.

## Region-Specific Data

Tesla sells different configurations in different markets. The Canadian Model Y lineup doesn't include an AWD-only trim that exists in the US. Canadian specs use kilometers and metric acceleration (0-100 km/h instead of 0-60 mph).

I handle this with additional columns:

```typescript
caRangeEPAkm: integer('ca_range_epa_km'),
caAcceleration0100: numeric('ca_acceleration_0_100'),
caAvailable: boolean('ca_available'),
```

At the application level, a `RegionProvider` context controls which fields to display, and a utility function filters vehicles by availability:

```typescript
function isVehicleAvailableInRegion(vehicle: Vehicle, region: 'US' | 'CA'): boolean {
  if (region === 'US') return true; // all vehicles are US-available
  return vehicle.caAvailable !== false;
}
```

This avoids the complexity of a separate `vehicle_region` junction table while still supporting the two markets that matter most for Tesla.

## Query Patterns for Comparison

### Fetching a Model's Full History

```typescript
const model3History = await db
  .select()
  .from(vehicle)
  .innerJoin(teslaModel, eq(vehicle.modelId, teslaModel.id))
  .where(eq(teslaModel.slug, 'model-3'))
  .orderBy(desc(vehicle.year), asc(vehicle.trimName));
```

This returns every Model 3 ever made, sorted by year descending. The UI groups these by year and renders them as a timeline.

### Side-by-Side Comparison

```typescript
const [vehicleA, vehicleB] = await Promise.all([
  db.select().from(vehicle).where(eq(vehicle.slug, slugA)).limit(1),
  db.select().from(vehicle).where(eq(vehicle.slug, slugB)).limit(1),
]);
```

The comparison rendering is driven by a spec configuration array:

```typescript
const COMPARISON_SPECS = [
  { key: 'rangeEPA', label: 'Range (EPA)', unit: 'mi', better: 'higher' },
  { key: 'acceleration060', label: '0-60 mph', unit: 's', better: 'lower' },
  { key: 'basePriceMSRP', label: 'Base Price', unit: '$', better: 'lower' },
  { key: 'horsepower', label: 'Horsepower', unit: 'hp', better: 'higher' },
  // ... 40+ more
];
```

This data-driven approach means adding a new comparison dimension is a one-line change to the config array — no new components, no new queries.

## Indexing Strategy

With ~100 rows, PostgreSQL doesn't technically need indexes. But query patterns matter for response time predictability:

```typescript
vehicleSlugIdx: index("vehicle_slug_idx").on(table.slug),    // Detail page lookups
vehicleModelIdIdx: index("vehicle_model_id_idx").on(table.modelId), // Model page listings
vehicleYearIdx: index("vehicle_year_idx").on(table.year),    // Year-based filtering
```

The slug index is the most critical — every vehicle detail page resolves by slug in the URL.

## What I'd Do Differently

1. **Add a `generation` enum from the start.** While my year-based approach works, having a formal generation field would simplify UI grouping logic.

2. **Use a `specs` JSONB column for rarely-compared fields.** Fields like `colorOptions` and `wheelOptions` don't need to be top-level columns. A JSONB column for "nice-to-have" specs would reduce table width without sacrificing queryability.

3. **Version the seed data.** My seed script is a 2,000+ line TypeScript file. A versioned CSV or JSON format would make it easier for contributors to update specs.

## See It in Action

You can explore the result at [mydreamtesla.com](https://mydreamtesla.com). Compare a 2017 Model 3 against a 2025 Highland, or pit the Cybertruck Cyberbeast against a Model X Plaid. The data model described here powers every comparison on the site.

If you're building a comparison tool — whether for vehicles, phones, laptops, or anything with structured specs — I hope these patterns are useful. The wide-table approach with Drizzle ORM's type safety is a powerful combination that keeps your queries simple and your types honest.

---

*Have questions about the schema design or Drizzle patterns? Drop a comment below — I'm happy to dig into specifics.*
