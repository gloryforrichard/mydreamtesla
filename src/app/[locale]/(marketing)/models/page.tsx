import type { Metadata } from 'next';
import { getAllVehicles } from '@/lib/db/queries';
import { ModelsList } from '@/components/tesla/models-list';
import { ModelsListRegion } from '@/components/tesla/models-list-region';
import { JsonLd } from '@/components/seo/json-ld';
import { buildItemListJsonLd } from '@/lib/seo/structured-data';
import { generateAlternates } from '@/lib/hreflang';
import { getBaseUrl } from '@/lib/urls/urls';

export const metadata: Metadata = {
  title: 'All Tesla Models & Cars Compared (2025) | MyDreamTesla',
  description:
    'Compare all Tesla models side by side — Model 3, Model Y, Model S, Model X & Cybertruck. Full specs, EPA range, pricing & performance for every trim and year.',
  alternates: generateAlternates('/models'),
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
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {models.length > 0 && (
        <JsonLd
          data={buildItemListJsonLd(modelListItems, 'All Tesla Models')}
        />
      )}

      <header className="mb-12 text-center">
        <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-[#1A1A1A] sm:text-[48px]">
          All Tesla Models
        </h1>
        <p className="mt-4 text-[21px] font-light text-[#777777]">
          Explore every Tesla vehicle. Compare specs across all model years and
          trims.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#999999]">
          Browse all Tesla cars from the affordable Model 3 sedan to the
          flagship Model S Plaid. Compare Tesla models by range, performance,
          and price to find the right EV for you.
        </p>
        <a
          href="/models/compare-all"
          className="mt-4 inline-block text-[15px] font-medium text-[#3B82F6] hover:underline"
        >
          Compare all Tesla models side by side &rarr;
        </a>
      </header>

      <ModelsListRegion models={models} vehicles={vehicles}>
        <ModelsList models={models} vehicles={vehicles} region="US" />
      </ModelsListRegion>

      {models.length === 0 && (
        <div className="py-20 text-center text-[#999999]">
          <p>No models available yet. Check back soon.</p>
        </div>
      )}
    </main>
  );
}
