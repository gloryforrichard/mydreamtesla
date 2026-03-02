import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllVehicles } from '@/lib/db/queries';
import { formatPrice, formatSpec, formatAcceleration } from '@/lib/vehicle-utils';
import type { Vehicle, TeslaModel } from '@/lib/vehicle-utils';
import { JsonLd } from '@/components/seo/json-ld';
import { buildItemListJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/structured-data';
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav';
import { generateAlternates } from '@/lib/hreflang';
import { getBaseUrl } from '@/lib/urls/urls';
import { getOgImageUrl } from '@/lib/metadata';

const ogImage = getOgImageUrl({
  title: 'Every Tesla, Compared',
  subtitle: 'Side-by-Side Specs & Pricing',
  type: 'compare',
});

export const metadata: Metadata = {
  title: 'All Tesla Models Compared — Side-by-Side Specs | MyDreamTesla',
  description:
    'Compare every Tesla model side by side. Starting price, EPA range, 0-60 mph, top speed, seating, and cargo for Model 3, Model Y, Model S, Model X, and Cybertruck.',
  alternates: generateAlternates('/models/compare-all'),
  openGraph: { images: [ogImage] },
  twitter: { card: 'summary_large_image', images: [ogImage] },
};

/** Pick the cheapest current-year trim per model as the "base" representative */
function getBaseVehiclePerModel(
  models: TeslaModel[],
  vehicles: Vehicle[]
): Map<number, Vehicle> {
  const map = new Map<number, Vehicle>();

  for (const model of models) {
    const modelVehicles = vehicles
      .filter((v) => v.modelId === model.id && v.isCurrentModel)
      .sort((a, b) => (a.basePriceMSRP ?? Infinity) - (b.basePriceMSRP ?? Infinity));

    if (modelVehicles.length > 0) {
      map.set(model.id, modelVehicles[0]);
    }
  }

  return map;
}

const SPEC_ROWS = [
  {
    label: 'Starting Price',
    render: (v: Vehicle) => formatPrice(v.basePriceMSRP),
  },
  {
    label: 'EPA Range',
    render: (v: Vehicle) => formatSpec(v.rangeEPA, 'mi'),
  },
  {
    label: '0–60 mph',
    render: (v: Vehicle) => formatAcceleration(v.acceleration060),
  },
  {
    label: 'Top Speed',
    render: (v: Vehicle) => formatSpec(v.topSpeed, 'mph'),
  },
  {
    label: 'Seating',
    render: (v: Vehicle) =>
      v.seatingCapacity != null ? `${v.seatingCapacity}` : 'N/A',
  },
  {
    label: 'Cargo Volume',
    render: (v: Vehicle) => formatSpec(v.cargoVolume, 'cu ft'),
  },
] as const;

export default async function CompareAllPage() {
  const { models, vehicles } = await getAllVehicles();
  const baseVehicles = getBaseVehiclePerModel(models, vehicles);
  const baseUrl = getBaseUrl();

  const modelListItems = models.map((m, i) => ({
    name: `Tesla ${m.name}`,
    url: `${baseUrl}/models/${m.slug}`,
    position: i + 1,
  }));

  return (
    <>
      <JsonLd data={buildItemListJsonLd(modelListItems, 'All Tesla Models Compared')} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', href: '/' },
          { name: 'Models', href: '/models' },
          { name: 'Compare All' },
        ])}
      />

      {/* Hero */}
      <section className="bg-[#FDFCF9] pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Models', href: '/models' },
              { label: 'Compare All' },
            ]}
          />

          <h1 className="mt-2 font-display text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-[#1A1A1A] sm:text-[56px]">
            Every Tesla, compared.
          </h1>
          <p className="mt-3 max-w-2xl text-[21px] font-light text-[#777777]">
            A quick-glance table of every current Tesla model — base trim specs,
            pricing, and key numbers side by side.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-x-auto rounded-sm border border-[#E5E2DC]">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[#E5E2DC] bg-[#FDFCF9]">
                <th className="px-5 py-4 text-[13px] font-medium uppercase tracking-[0.5px] text-[#999999]">
                  Spec
                </th>
                {models.map((model) => (
                  <th
                    key={model.id}
                    className="px-5 py-4 text-[15px] font-semibold text-[#1A1A1A]"
                  >
                    <Link
                      href={`/models/${model.slug}`}
                      className="transition-colors hover:text-[#555555] hover:underline"
                    >
                      {model.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row, i) => (
                <tr
                  key={row.label}
                  className={
                    i < SPEC_ROWS.length - 1
                      ? 'border-b border-[#E5E2DC]'
                      : ''
                  }
                >
                  <td className="px-5 py-4 text-[14px] font-medium text-[#777777]">
                    {row.label}
                  </td>
                  {models.map((model) => {
                    const v = baseVehicles.get(model.id);
                    return (
                      <td
                        key={model.id}
                        className="px-5 py-4 text-[15px] tabular-nums text-[#1A1A1A]"
                      >
                        {v ? row.render(v) : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[13px] text-[#999999]">
          Showing base (lowest-price) trim for each model. Specs reflect the
          current model year.
        </p>

        {/* CTA */}
        <section className="mt-16 rounded-sm bg-[#F5F2ED] px-6 py-12 text-center sm:px-12">
          <h2 className="font-display text-[28px] font-bold tracking-[-1px] text-[#1A1A1A]">
            Need a detailed head-to-head?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[17px] font-light text-[#777777]">
            Pick any two trims and compare every single spec — battery,
            charging, dimensions, efficiency, and more.
          </p>
          <Link
            href="/compare"
            className="mt-6 inline-block rounded-sm bg-[#1A1A1A] px-8 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#333333]"
          >
            Build Your Comparison
          </Link>
        </section>
      </main>
    </>
  );
}
