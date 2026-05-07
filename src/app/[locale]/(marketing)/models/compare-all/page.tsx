import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllVehicles } from '@/lib/db/queries';
import {
  formatPrice,
  formatSpec,
  formatAcceleration,
} from '@/lib/vehicle-utils';
import type { Vehicle, TeslaModel } from '@/lib/vehicle-utils';
import { JsonLd } from '@/components/seo/json-ld';
import {
  buildItemListJsonLd,
  buildBreadcrumbJsonLd,
} from '@/lib/seo/structured-data';
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav';
import { getBaseUrl } from '@/lib/urls/urls';
import { constructMetadata, getOgImageUrl } from '@/lib/metadata';

const ogImage = getOgImageUrl({
  title: 'Every Tesla, Compared',
  subtitle: 'Side-by-Side Specs & Pricing',
  type: 'compare',
});

export const metadata: Metadata = constructMetadata({
  title: 'All Tesla Models Compared — Side-by-Side Specs',
  description:
    'Compare every Tesla model side by side by starting price, EPA range, 0-60 mph, top speed, seating, and cargo across Model 3, Y, S, X, and Cybertruck.',
  image: ogImage,
  pathname: '/models/compare-all',
});

/** Pick the cheapest current-year trim per model as the "base" representative */
function getBaseVehiclePerModel(
  models: TeslaModel[],
  vehicles: Vehicle[]
): Map<number, Vehicle> {
  const map = new Map<number, Vehicle>();

  for (const model of models) {
    const modelVehicles = vehicles
      .filter((v) => v.modelId === model.id && v.isCurrentModel)
      .sort(
        (a, b) => (a.basePriceMSRP ?? Infinity) - (b.basePriceMSRP ?? Infinity)
      );

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
      <JsonLd
        data={buildItemListJsonLd(modelListItems, 'All Tesla Models Compared')}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', href: '/' },
          { name: 'Models', href: '/models' },
          { name: 'Compare All' },
        ])}
      />

      {/* Hero */}
      <section className="bg-card/50 pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Models', href: '/models' },
              { label: 'Compare All' },
            ]}
          />

          <h1 className="mt-2 font-display text-[32px] font-bold leading-[1.05] tracking-[-1.5px] text-foreground sm:text-[40px] md:text-[56px]">
            Every Tesla, compared.
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] font-light text-secondary-text sm:text-[21px]">
            A quick-glance table of every current Tesla model — base trim specs,
            pricing, and key numbers side by side.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full min-w-[480px] text-left sm:min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="px-3 py-3 text-[12px] font-medium uppercase tracking-[0.5px] text-muted-foreground sm:px-5 sm:py-4 sm:text-[13px]">
                  Spec
                </th>
                {models.map((model) => (
                  <th
                    key={model.id}
                    className="px-3 py-3 text-[13px] font-semibold text-foreground sm:px-5 sm:py-4 sm:text-[15px]"
                  >
                    <Link
                      href={`/models/${model.slug}`}
                      className="transition-colors hover:text-secondary-text hover:underline"
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
                    i < SPEC_ROWS.length - 1 ? 'border-b border-border' : ''
                  }
                >
                  <td className="px-3 py-3 text-[13px] font-medium text-muted-foreground sm:px-5 sm:py-4 sm:text-[14px]">
                    {row.label}
                  </td>
                  {models.map((model) => {
                    const v = baseVehicles.get(model.id);
                    return (
                      <td
                        key={model.id}
                        className="px-3 py-3 text-[13px] tabular-nums text-foreground sm:px-5 sm:py-4 sm:text-[15px]"
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

        <p className="mt-4 text-[13px] text-muted-foreground">
          Showing base (lowest-price) trim for each model. Specs reflect the
          current model year.
        </p>

        {/* CTA */}
        <section className="mt-16 rounded-sm bg-card px-5 py-10 text-center sm:px-12 sm:py-12">
          <h2 className="font-display text-[24px] font-bold tracking-[-1px] text-foreground sm:text-[28px]">
            Need a detailed head-to-head?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] font-light text-secondary-text sm:text-[17px]">
            Pick any two trims and compare every single spec — battery,
            charging, dimensions, efficiency, and more.
          </p>
          <Link
            href="/compare"
            className="mt-6 inline-block rounded-sm bg-foreground px-8 py-3 text-[15px] font-medium text-background transition-colors hover:opacity-90"
          >
            Build Your Comparison
          </Link>
        </section>
      </main>
    </>
  );
}
