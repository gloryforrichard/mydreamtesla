import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/db/index.js';
import { vehicle } from '../src/db/schema.js';

dotenv.config();

// slug → { seoTitle, seoDescription }
// seoTitle max 70 chars, seoDescription max 160 chars
const SEO_DATA: Record<string, { seoTitle: string; seoDescription: string }> = {
  // ── 2024 Model 3 (Highland) ────────────────────────────────────────────────
  'model-3-2024-standard-range-plus-rwd': {
    seoTitle: '2024 Tesla Model 3 SR+ RWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2024 Model 3 Highland SR+ RWD — 272-mile range, $38,990 MSRP, $7,500 tax credit. Full specs and comparison.',
  },
  'model-3-2024-long-range-awd': {
    seoTitle: '2024 Tesla Model 3 LR AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2024 Model 3 Highland Long Range AWD — 341-mile range, 4.4s 0-60, $7,500 credit. Full specs and comparison.',
  },
  'model-3-2024-performance-awd': {
    seoTitle: '2024 Tesla Model 3 Performance Specs & Price | MyDreamTesla',
    seoDescription:
      '2024 Model 3 Performance AWD — 510 hp, 3.1s 0-60, 303-mile range. Full specs, pricing, and comparison.',
  },

  // ── 2025 Model 3 (Highland, current) ───────────────────────────────────────
  'model-3-2025-standard-range-plus-rwd': {
    seoTitle: '2025 Tesla Model 3 RWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model 3 RWD — 321-mile range, $38,990, $7,500 tax credit. Highland refresh specs, pricing, and comparison.',
  },
  'model-3-2025-premium-rwd': {
    seoTitle: '2025 Tesla Model 3 Premium RWD Specs | MyDreamTesla',
    seoDescription:
      '2025 Model 3 Premium RWD — 363-mile range, 4.9s 0-60. Highland long-range single-motor specs and comparison.',
  },
  'model-3-2025-long-range-awd': {
    seoTitle: '2025 Tesla Model 3 LR AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model 3 Premium AWD — 346-mile range, 4.2s 0-60, $42,990. Highland dual-motor specs and comparison.',
  },
  'model-3-2025-performance-awd': {
    seoTitle: '2025 Tesla Model 3 Performance Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model 3 Performance AWD — 510 hp, 2.9s 0-60, 163 mph. Highland performance specs, pricing, and comparison.',
  },

  // ── 2024 Model Y ───────────────────────────────────────────────────────────
  'model-y-2024-standard-range-rwd': {
    seoTitle: '2024 Tesla Model Y SR RWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2024 Model Y Standard Range RWD — 283-mile range, $44,990, $7,500 credit. Full specs, pricing, and comparison.',
  },
  'model-y-2024-long-range-awd': {
    seoTitle: '2024 Tesla Model Y LR AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2024 Model Y Long Range AWD — 310-mile range, 4.8s 0-60, $49,990. Full specs, pricing, and comparison.',
  },
  'model-y-2024-performance-awd': {
    seoTitle: '2024 Tesla Model Y Performance Specs & Price | MyDreamTesla',
    seoDescription:
      '2024 Model Y Performance AWD — 430 hp, 3.5s 0-60, 303-mile range. Full specs, pricing, and comparison.',
  },

  // ── 2025 Model Y (Juniper, current) ────────────────────────────────────────
  'model-y-2025-standard-range-rwd': {
    seoTitle: '2025 Tesla Model Y RWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model Y Juniper RWD — 321-mile range, $44,990, $7,500 credit. Full specs, pricing, and comparison.',
  },
  'model-y-2025-awd': {
    seoTitle: '2025 Tesla Model Y AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model Y Juniper AWD — 294-mile range, 4.6s 0-60. Dual-motor specs, pricing, and comparison.',
  },
  'model-y-2025-premium-rwd': {
    seoTitle: '2025 Tesla Model Y Premium RWD Specs | MyDreamTesla',
    seoDescription:
      '2025 Model Y Juniper Premium RWD — 357-mile range, 5.4s 0-60. Long-range single-motor specs and comparison.',
  },
  'model-y-2025-long-range-awd': {
    seoTitle: '2025 Tesla Model Y LR AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model Y Juniper Premium AWD — 327-mile range, 4.6s 0-60, 3,500 lb towing. Full specs and pricing.',
  },
  'model-y-2025-performance-awd': {
    seoTitle: '2025 Tesla Model Y Performance Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Model Y Performance — 510 hp, 3.3s 0-60, 306-mile range. Juniper performance specs and comparison.',
  },

  // ── 2025 Model S ───────────────────────────────────────────────────────────
  'model-s-2025-awd': {
    seoTitle: '2025 Tesla Model S AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Tesla Model S AWD — 402 miles range, 670 hp, 3.1s 0-60. Full specs, pricing, and comparison.',
  },
  'model-s-2025-plaid': {
    seoTitle: '2025 Tesla Model S Plaid Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Tesla Model S Plaid — 1,020 hp tri-motor, 1.99s 0-60, 200 mph. Full specs, pricing, and comparison.',
  },

  // ── 2025 Model X ───────────────────────────────────────────────────────────
  'model-x-2025-awd': {
    seoTitle: '2025 Tesla Model X AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Tesla Model X AWD — 329 miles range, 670 hp, falcon wing doors, 5,000 lbs towing. Full specs and pricing.',
  },
  'model-x-2025-plaid': {
    seoTitle: '2025 Tesla Model X Plaid Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Tesla Model X Plaid — 1,020 hp tri-motor, 2.5s 0-60, falcon wing doors. Full specs and pricing.',
  },

  // ── 2024 Cybertruck ────────────────────────────────────────────────────────
  'cybertruck-2024-foundation-series-awd': {
    seoTitle: '2024 Tesla Cybertruck Foundation Series AWD | MyDreamTesla',
    seoDescription:
      '2024 Cybertruck Foundation Series AWD — 600 hp, 318-mile range, 11,000 lbs towing. Limited edition with FSD included.',
  },
  'cybertruck-2024-foundation-series-cyberbeast': {
    seoTitle: '2024 Tesla Cybertruck Foundation Cyberbeast | MyDreamTesla',
    seoDescription:
      '2024 Cybertruck Foundation Cyberbeast — 845 hp tri-motor, 2.6s 0-60, 11.0s quarter mile. The ultimate electric truck.',
  },

  // ── 2025 Cybertruck ────────────────────────────────────────────────────────
  'cybertruck-2025-awd': {
    seoTitle: '2025 Tesla Cybertruck AWD Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Cybertruck AWD — 600 hp, 325-mile range, 11,000 lbs towing. Full specs, pricing, and comparison.',
  },
  'cybertruck-2025-cyberbeast': {
    seoTitle: '2025 Tesla Cybertruck Cyberbeast Specs & Price | MyDreamTesla',
    seoDescription:
      '2025 Cybertruck Cyberbeast — 845 hp tri-motor, 2.6s 0-60, 301-mile range. Full specs, pricing, and comparison.',
  },
  'cybertruck-2025-long-range-rwd': {
    seoTitle: '2025 Tesla Cybertruck Long Range RWD | MyDreamTesla',
    seoDescription:
      '2025 Cybertruck Long Range RWD — single motor, 350+ mile range, most affordable Cybertruck. Specs and pricing.',
  },
};

async function updateSeoTitles() {
  const db = await getDb();
  console.log('Starting SEO title update...\n');

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [slug, seo] of Object.entries(SEO_DATA)) {
    const existing = await db
      .select({ id: vehicle.id, seoTitle: vehicle.seoTitle })
      .from(vehicle)
      .where(eq(vehicle.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      console.log(`  SKIP (not in DB): ${slug}`);
      notFound++;
      continue;
    }

    await db
      .update(vehicle)
      .set({
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
        lastUpdated: new Date(),
      })
      .where(eq(vehicle.slug, slug));

    const changed = existing[0].seoTitle !== seo.seoTitle;
    if (changed) {
      console.log(`  UPDATED: ${slug}`);
      console.log(`    title: ${seo.seoTitle}`);
    } else {
      console.log(`  OK (unchanged): ${slug}`);
    }
    updated++;
  }

  console.log(`\nDone! ${updated} updated, ${skipped} skipped, ${notFound} not found in DB.`);
  console.log(`Total entries in SEO_DATA: ${Object.keys(SEO_DATA).length}`);
  process.exit(0);
}

updateSeoTitles().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
