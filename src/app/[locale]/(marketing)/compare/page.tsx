import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllVehicles } from '@/lib/db/queries';
import {
  POPULAR_COMPARISONS,
  COMPARISON_CATEGORIES,
  getCompareUrl,
  type ComparisonCategory,
} from '@/config/comparisons';
import { CompareBuilder } from '@/components/tesla/compare-builder';
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav';
import { JsonLd } from '@/components/seo/json-ld';
import { buildFAQPageJsonLd } from '@/lib/seo/structured-data';
import { getOgImageUrl } from '@/lib/metadata';

const COMPARE_FAQS = [
  {
    question: 'How do I compare two Tesla models side by side?',
    answer:
      'Use the comparison builder at the top of this page. Select the year, model, and trim for each vehicle, then click "Compare" to see a full side-by-side breakdown of specs, range, performance, acceleration, and pricing.',
  },
  {
    question: 'What is the difference between Tesla Model 3 and Model Y?',
    answer:
      'The Model 3 is a compact sedan while the Model Y is a mid-size SUV built on the same platform. The Model Y offers more cargo space (76 cu ft vs 23 cu ft), higher ground clearance, and optional third-row seating. The Model 3 is lighter, slightly faster, and more energy-efficient. Both share the same powertrain options.',
  },
  {
    question:
      'Should I buy the Tesla Model 3 Standard Range or Long Range?',
    answer:
      'The Standard Range Plus (SR+) is the most affordable Tesla with ~270 miles of range and rear-wheel drive. The Long Range adds ~80+ miles of range, all-wheel drive, and faster acceleration. If you frequently drive long distances or live in a cold climate, the Long Range is worth the upgrade.',
  },
  {
    question: 'What changed in the 2025 Tesla Model 3 Highland refresh?',
    answer:
      'The 2025 Model 3 "Highland" refresh includes a redesigned front and rear exterior, new headlights, an updated interior with ambient lighting, a new 15.4-inch center screen, rear passenger screen, improved sound insulation, and better efficiency resulting in increased range across all trims.',
  },
  {
    question: 'Is the Tesla Model Y Juniper worth the upgrade over 2024?',
    answer:
      'The 2025 Model Y "Juniper" features a major exterior redesign, a new light bar, updated interior similar to Highland Model 3, improved range, and a faster infotainment system. If you are buying new, the 2025 Juniper is the clear choice. For used 2024 models, the value depends on the price difference.',
  },
];

export const metadata: Metadata = {
  title:
    'Compare Tesla Models Side by Side — Model 3 vs Model Y, Specs & Pricing | MyDreamTesla',
  description:
    'Compare any Tesla vehicles side by side: Model 3 vs Model Y, Long Range vs Performance, 2024 vs 2025. Full specs, range, horsepower, battery capacity, and pricing compared.',
  keywords: [
    'tesla comparison',
    'compare tesla models',
    'tesla model 3 vs model y',
    'tesla specs comparison',
    'tesla model 3 long range vs performance',
    'all tesla models compared',
    'tesla model y 2024 vs 2025',
  ],
  openGraph: {
    images: [
      getOgImageUrl({
        title: 'Compare Any Tesla',
        subtitle: 'Side-by-Side Specs & Pricing',
        type: 'compare',
      }),
    ],
  },
};

export default async function CompareIndexPage() {
  const { models, vehicles } = await getAllVehicles();

  const comparisonsByCategory = (category: ComparisonCategory) =>
    POPULAR_COMPARISONS.filter((c) => c.category === category);

  return (
    <main>
      <JsonLd data={buildFAQPageJsonLd(COMPARE_FAQS)} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1060px] px-5 pt-16">
        <BreadcrumbNav
          items={[{ label: 'Home', href: '/' }, { label: 'Compare' }]}
        />
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-[1060px] px-5 pb-16 pt-4 text-center">
        <h1 className="font-display text-[32px] font-bold leading-[1.05] tracking-[-2.5px] text-foreground sm:text-[40px] md:text-[56px]">
          Compare Any Tesla.
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] text-[17px] font-light leading-[1.5] text-secondary-text sm:text-[19px]">
          Model 3 vs Model Y, Long Range vs Performance, 2024 vs 2025 — select
          any two Tesla vehicles for a detailed side-by-side breakdown of specs,
          range, horsepower, battery capacity, and pricing.
        </p>
      </header>

      {/* Comparison Builder */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-[1060px] px-5">
          <h2 className="mb-8 text-center font-display text-[24px] font-bold tracking-[-1px] text-foreground sm:text-[28px]">
            Build your comparison
          </h2>
          <CompareBuilder models={models} vehicles={vehicles} />
        </div>
      </section>

      {/* Categorized Popular Comparisons */}
      {(['trim', 'cross', 'year'] as ComparisonCategory[]).map((category) => {
        const items = comparisonsByCategory(category);
        const config = COMPARISON_CATEGORIES[category];
        if (items.length === 0) return null;

        return (
          <section
            key={category}
            className="mx-auto max-w-[1060px] px-5 py-16"
          >
            <h2 className="font-display text-[28px] font-bold tracking-[-1.5px] text-foreground sm:text-[36px]">
              {config.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[16px] font-light leading-relaxed text-secondary-text">
              {config.subtitle}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  href={getCompareUrl(c.slug)}
                  className="group flex flex-col justify-between rounded-lg border border-border bg-background p-6 transition-all duration-200 hover:border-border-muted hover:bg-card hover:shadow-md"
                >
                  <div>
                    <div className="mb-3 inline-block rounded-full bg-card px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                      {c.shortLabel}
                    </div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.3px] text-foreground">
                      {c.label}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-secondary-text">
                      {c.description}
                    </p>
                  </div>
                  <div className="mt-5 text-[14px] font-medium text-muted-foreground transition-colors group-hover:text-brand">
                    View full comparison →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* FAQ Section — SEO content */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-[760px] px-5">
          <h2 className="text-center font-display text-[28px] font-bold tracking-[-1.5px] text-foreground sm:text-[36px]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-center text-[16px] font-light text-secondary-text">
            Common questions about comparing Tesla vehicles.
          </p>

          <div className="mt-12 space-y-8">
            {COMPARE_FAQS.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-[17px] font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary-text">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
