---
platform: Dev.to
title: "Building a Tesla Vehicle Comparison Tool with Next.js and Drizzle ORM"
suggested_tags: nextjs, typescript, drizzle, postgresql, webdev
canonical_url: https://mydreamtesla.com
---

# Building a Tesla Vehicle Comparison Tool with Next.js and Drizzle ORM

When I set out to build [MyDreamTesla](https://mydreamtesla.com), I wanted to create the most comprehensive Tesla vehicle comparison tool on the web — one that covers every model, every generation, every trim, with 50+ specs per vehicle. What started as a weekend project quickly turned into an exercise in data modeling, performance optimization, and making architectural decisions that would scale.

Here's how I built it.

## The Problem

Tesla's lineup is deceptively complex. The Model 3 alone has gone through three distinct generations (Original 2017–2023, Refresh 2021–2023, and Highland 2024+), with multiple trims per year — Standard Range Plus, Long Range, Performance — each with different drive types, battery packs, and pricing. Multiply that across five active models (Model 3, Model Y, Model S, Model X, Cybertruck), and you're looking at 100+ vehicle configurations, each with 50+ individual spec fields.

Most comparison tools online show you the current model year. I wanted to show buyers the full picture: how has the Model 3 Long Range changed from 2017 to 2025? When did the range jump? When did the price drop? That historical context matters when you're deciding whether to buy new or used.

## Tech Stack

- **Next.js 14** with App Router (server components by default)
- **PostgreSQL** for structured vehicle data
- **Drizzle ORM** for type-safe database access
- **TailwindCSS** + **Radix UI** for the component layer
- **next-intl** for English/Chinese internationalization
- **Vercel** for deployment

I chose this stack deliberately. Let me walk through the key decisions.

## Data Modeling: The Hard Part

### Schema Design

The core schema has two tables: `tesla_model` (the 5 model lines) and `vehicle` (individual trims/years). Here's a simplified version of the vehicle table:

```typescript
export const vehicle = pgTable('vehicle', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  modelId: integer('model_id').references(() => teslaModel.id).notNull(),
  year: integer('year').notNull(),
  trimName: varchar('trim_name', { length: 100 }).notNull(),
  driveType: varchar('drive_type', { length: 50 }).notNull(),

  // Pricing (4 fields)
  basePriceMSRP: integer('base_price_msrp'),
  destinationFee: integer('destination_fee'),
  federalTaxCredit: integer('federal_tax_credit'),
  effectivePrice: integer('effective_price'),

  // Performance (7 fields)
  rangeEPA: integer('range_epa'),
  acceleration060: numeric('acceleration_060'),
  topSpeed: integer('top_speed'),
  horsepower: integer('horsepower'),
  torque: integer('torque'),
  quarterMile: numeric('quarter_mile'),

  // Battery & Charging (6 fields)
  batteryCapacity: numeric('battery_capacity'),
  superchargerRateMax: integer('supercharger_rate_max'),
  onboardCharger: numeric('onboard_charger'),
  // ... more fields

  // Dimensions, Interior, Safety, Efficiency...
  // 50+ columns total

  prosAndCons: json('pros_and_cons').$type<{ pros: string[]; cons: string[] }>(),
  keyChangesFromPriorYear: text('key_changes_from_prior_year'),
  isCurrentModel: boolean('is_current_model').default(true),
});
```

### Why One Wide Table Instead of EAV?

I considered an Entity-Attribute-Value pattern (vehicle_id, spec_name, spec_value) for flexibility. I rejected it for three reasons:

1. **Type safety is gone.** A range value of `310` and an acceleration of `3.5` are both strings in EAV. With Drizzle ORM, `rangeEPA` is an `integer` and `acceleration060` is a `numeric` — caught at compile time.

2. **Query complexity explodes.** A comparison query that fetches range, acceleration, and price for two vehicles requires three self-joins in EAV. With a wide table, it's a single `SELECT`.

3. **The schema is stable.** Tesla doesn't add new spec categories often. When they do (like adding towing capacity for Cybertruck), a migration is trivial.

### Handling Generational Changes

One non-obvious challenge: the same "Model 3 Long Range AWD" means very different things in 2020 vs. 2024 (Highland). The `year` column alone doesn't capture this. I handle it with a combination of `keyChangesFromPriorYear` (free text describing what changed) and query-level grouping in the UI that visually separates generations.

## Drizzle ORM Patterns

Drizzle shines for this project. Here are patterns I rely on heavily:

### Type-Safe Queries with Relations

```typescript
// Get all vehicles for a model, ordered by year descending
const vehicles = await db
  .select()
  .from(vehicle)
  .where(eq(vehicle.modelId, modelId))
  .orderBy(desc(vehicle.year), asc(vehicle.trimName));
```

The return type is fully inferred. If I try to access `vehicles[0].nonExistentField`, TypeScript catches it immediately.

### Comparison Engine

The comparison feature needs to fetch two or more vehicles and display their specs side-by-side. The key insight is that the comparison logic lives in the **component layer**, not the database layer:

```typescript
// Server component: fetch vehicles by slugs
const vehicleA = await db.select().from(vehicle)
  .where(eq(vehicle.slug, slugA)).limit(1);
const vehicleB = await db.select().from(vehicle)
  .where(eq(vehicle.slug, slugB)).limit(1);

// Pass both to a client component that renders the diff
```

The comparison component then iterates over a spec configuration array that defines which fields to show, their labels, their units, and which direction is "better" (higher range = better, lower 0-60 = better). This makes the comparison engine data-driven and easy to extend.

### Region-Aware Filtering

Canadian specs differ from US specs (kilometers vs. miles, different trim availability). I added region-specific columns:

```typescript
caRangeEPAkm: integer('ca_range_epa_km'),
caAcceleration0100: numeric('ca_acceleration_0_100'),
caAvailable: boolean('ca_available'),
```

A React context (`useRegion()`) controls which fields to display, and a server-side utility filters vehicles by regional availability.

## App Router and SSR

Every model page and vehicle detail page is a **server component** by default. This means:

- The database query runs on the server at request time
- The HTML is streamed to the client with full SEO content
- No loading spinners for initial content

For the comparison tool (which requires user interaction to select vehicles), I use a client component that receives the full vehicle list from a server component parent. The comparison selection state lives in Zustand, not in URL params, to avoid unnecessary re-renders.

## Performance Considerations

With 100+ vehicles and 50+ specs each, the dataset is small enough to fit in memory. But I still index strategically:

```typescript
vehicleSlugIdx: index("vehicle_slug_idx").on(table.slug),
vehicleModelIdIdx: index("vehicle_model_id_idx").on(table.modelId),
vehicleYearIdx: index("vehicle_year_idx").on(table.year),
vehicleIsCurrentIdx: index("vehicle_is_current_idx").on(table.isCurrentModel),
```

The slug index is critical — every vehicle detail page resolves by slug, so it needs to be fast.

## Lessons Learned

1. **Start with the data model.** I spent more time on the seed data (researching every trim's exact EPA range, MSRP, horsepower) than on the UI. Good data makes good products.

2. **Wide tables are fine for structured data.** The ORM community has a bias toward normalization, but for a fixed-schema dataset with 50 known columns, a single wide table with proper types is simpler and faster than any alternative.

3. **Server components change the game.** Being able to query PostgreSQL directly in a React component without an API layer is genuinely transformative for data-heavy apps like this.

4. **Drizzle > Prisma for this use case.** Drizzle's SQL-like API made it easy to write the exact queries I needed without fighting an abstraction layer. The type inference is excellent.

## Try It

The tool is live at [mydreamtesla.com](https://mydreamtesla.com). You can compare any Tesla across all years and trims — Model 3 Highland vs. the original, Model Y Juniper vs. pre-Juniper, Cybertruck AWD vs. Cyberbeast. If you're in the market for a Tesla (or just curious about how the specs have evolved), give it a spin.

The stack — Next.js App Router, Drizzle ORM, PostgreSQL, TailwindCSS — turned out to be an excellent fit for a data-dense comparison tool. If you're building something similar, I'd recommend this combination without hesitation.

---

*What's your go-to stack for data-heavy web apps? I'd love to hear about your approach in the comments.*
