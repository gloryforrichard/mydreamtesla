import type { Metadata } from 'next';
import { getAllVehicles } from '@/lib/db/queries';
import { ModelsList } from '@/components/tesla/models-list';
import { JsonLd } from '@/components/seo/json-ld';
import {
  buildItemListJsonLd,
  buildFAQPageJsonLd,
} from '@/lib/seo/structured-data';
import { generateAlternates } from '@/lib/hreflang';
import { getBaseUrl } from '@/lib/urls/urls';
import { getOgImageUrl } from '@/lib/metadata';

const MODELS_PAGE_FAQS = [
  {
    question: 'How many Tesla models are currently available?',
    answer:
      'Tesla currently sells five models: Model 3 (compact sedan), Model Y (mid-size SUV), Model S (luxury sedan), Model X (luxury SUV), and Cybertruck (pickup truck). Each model comes in multiple trims with different range, performance, and pricing options.',
  },
  {
    question: 'Which Tesla has the longest range?',
    answer:
      'The Tesla Model S Long Range offers the highest EPA-rated range in the Tesla lineup, exceeding 400 miles on a single charge. The Model 3 Long Range and Model Y Long Range also offer excellent range above 300 miles.',
  },
  {
    question: 'What is the cheapest Tesla you can buy?',
    answer:
      'The Tesla Model 3 Standard Range (rear-wheel drive) is the most affordable Tesla, starting around $35,000-$39,000 before incentives. The Model Y is the next most affordable option. Federal and state EV tax credits can reduce the effective price further.',
  },
  {
    question: 'Which Tesla is best for families?',
    answer:
      'The Tesla Model Y is the most popular choice for families thanks to its spacious interior, large cargo area (76 cu ft with seats folded), and optional third-row seating for 7 passengers. The Model X offers even more space plus falcon-wing doors for easy child-seat access.',
  },
  {
    question: 'How do I compare different Tesla trims and years?',
    answer:
      'Use the Compare page on MyDreamTesla to select any two Tesla vehicles for a detailed side-by-side breakdown. You can compare different trims (e.g., Long Range vs Performance), different model years (e.g., 2024 vs 2025), or entirely different models (e.g., Model 3 vs Model Y).',
  },
];

export const metadata: Metadata = {
  title: 'All Tesla Models: Compare Model 3, Y, S, X & Cybertruck',
  description:
    'See every Tesla model and trim in one place. Compare Model 3, Model Y, Model S, Model X, and Cybertruck by price, range, 0-60, years, and body style.',
  alternates: generateAlternates('/models'),
  openGraph: {
    images: [
      getOgImageUrl({
        title: 'All Tesla Models',
        subtitle: 'Compare Every Model, Trim & Year',
        type: 'default',
      }),
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      getOgImageUrl({
        title: 'All Tesla Models',
        subtitle: 'Compare Every Model, Trim & Year',
        type: 'default',
      }),
    ],
  },
};

export default async function ModelsPage() {
  const { models, vehicles } = await getAllVehicles();

  const baseUrl = getBaseUrl();
  const modelListItems = models.map((m, i) => ({
    name: `Tesla ${m.name}`,
    url: `${baseUrl}/models/${m.slug}`,
    position: i + 1,
  }));

  return (
    <main className="mx-auto max-w-[1400px] px-8 py-12">
      {models.length > 0 && (
        <JsonLd
          data={buildItemListJsonLd(modelListItems, 'All Tesla Models')}
        />
      )}

      <header className="mb-12 text-center">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
          Complete Lineup
        </span>
        <h1 className="mt-3 font-display text-[32px] font-bold leading-[1.05] tracking-[-1.5px] text-foreground sm:text-[40px] md:text-[48px]">
          All Tesla Models, Trims & Years
        </h1>
        <p className="mt-4 text-lg font-light text-ink-2 sm:text-[21px]">
          Compare Model 3, Model Y, Model S, Model X, and Cybertruck across
          current and past trims.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-3">
          Browse Tesla models by price, range, performance, body style, and
          model year to find the right EV for your budget and driving needs.
        </p>
        <a
          href="/models/compare-all"
          className="mt-4 inline-block text-[15px] font-medium text-ed-accent hover:underline"
        >
          Compare all Tesla models side by side &rarr;
        </a>
      </header>

      <ModelsList models={models} vehicles={vehicles} />

      {/* FAQ Section */}
      <JsonLd data={buildFAQPageJsonLd(MODELS_PAGE_FAQS)} />
      <section className="mt-16">
        <span className="mb-2 block text-center font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
          FAQ
        </span>
        <h2 className="mb-6 text-center font-display text-[28px] font-bold tracking-[-1.5px] text-foreground sm:text-[36px]">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {MODELS_PAGE_FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-line bg-paper"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 text-[15px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span className="ml-4 text-ink-3 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {models.length === 0 && (
        <div className="py-20 text-center text-ink-3">
          <p>
            We&apos;re building our database. Check back soon for the complete
            Tesla lineup!
          </p>
        </div>
      )}
    </main>
  );
}
