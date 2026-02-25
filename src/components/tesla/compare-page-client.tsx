'use client';

import { useRegion } from '@/contexts/region-context';
import {
  formatRegionSpecValue,
  getDisplayTitle,
  getRegionSpecMeta,
  isVehicleAvailableInRegion,
} from '@/lib/vehicle-region';
import {
  formatPrice,
  type TeslaModel,
  type Vehicle,
} from '@/lib/vehicle-utils';
import { ComparisonTable } from './comparison-table';

interface ComparePageClientProps {
  vehicles: Vehicle[];
  models: TeslaModel[];
}

function toNumber(value: number | string | null | undefined) {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ComparePageClient({
  vehicles,
  models,
}: ComparePageClientProps) {
  const { region } = useRegion();

  const visibleVehicles = vehicles.filter((vehicle) =>
    isVehicleAvailableInRegion(vehicle, region)
  );

  if (visibleVehicles.length < 2) {
    return (
      <div className="mx-auto max-w-[980px] px-5 py-8">
        <div className="rounded-2xl border border-[#D2D2D7] bg-[#F5F5F7] p-6 text-center">
          <h2 className="text-[20px] font-semibold tracking-[-0.3px] text-[#1D1D1F]">
            Comparison unavailable in {region}
          </h2>
          <p className="mt-2 text-[14px] text-[#6E6E73]">
            One or more selected trims are not currently sold in this region.
            Switch back to US to view the full comparison.
          </p>
        </div>
      </div>
    );
  }

  const bestRange = [...visibleVehicles].sort((a, b) => {
    const aVal = toNumber(getRegionSpecMeta(a, 'rangeEPA', region).value) ?? 0;
    const bVal = toNumber(getRegionSpecMeta(b, 'rangeEPA', region).value) ?? 0;
    return bVal - aVal;
  })[0];

  const bestPower = [...visibleVehicles].sort((a, b) => {
    const aVal =
      toNumber(getRegionSpecMeta(a, 'horsepower', region).value) ?? 0;
    const bVal =
      toNumber(getRegionSpecMeta(b, 'horsepower', region).value) ?? 0;
    return bVal - aVal;
  })[0];

  const bestValue = [...visibleVehicles].sort(
    (a, b) => (a.effectivePrice ?? Infinity) - (b.effectivePrice ?? Infinity)
  )[0];

  return (
    <>
      <div className="sticky top-12 z-40 border-b border-black/[0.06] bg-[rgba(251,251,253,0.88)] backdrop-blur-[20px] backdrop-saturate-[180%]">
        <div
          className="mx-auto max-w-[980px] px-5 py-4"
          style={{
            display: 'grid',
            gridTemplateColumns: `180px repeat(${visibleVehicles.length}, 1fr)`,
          }}
        >
          <div />
          {visibleVehicles.map((vehicle) => {
            const model = models.find((m) => m.id === vehicle.modelId);
            return (
              <div key={vehicle.id} className="px-4 text-center">
                <div className="mx-auto mb-2.5 flex h-16 w-24 items-center justify-center rounded-xl bg-[#F5F5F7] text-2xl font-bold text-[#D2D2D7]">
                  {model?.name.replace('Model ', '') ?? '?'}
                </div>
                <div className="text-[15px] font-semibold tracking-[-0.3px]">
                  {getDisplayTitle(vehicle, region)}
                </div>
                <div className="font-mono text-[13px] font-semibold">
                  {formatPrice(vehicle.basePriceMSRP)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-8">
        <ComparisonTable vehicles={visibleVehicles} />
      </div>

      <section className="bg-[#F5F5F7] py-20" aria-label="Comparison verdict">
        <div className="mx-auto max-w-[980px] px-5 text-center">
          <h2 className="text-[40px] font-bold tracking-[-2px]">
            Which should you buy?
          </h2>
          <p className="mt-2 text-[17px] font-light text-[#6E6E73]">
            How they compare on the dimensions that matter most.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-[20px] bg-white p-8 text-center">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">
                Best Range
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px]">
                {getDisplayTitle(bestRange, region)}
              </div>
              <div className="mt-1 text-[13px] text-[#6E6E73]">
                {formatRegionSpecValue(bestRange, 'rangeEPA', region)} EPA
              </div>
            </div>
            <div className="rounded-[20px] bg-white p-8 text-center">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">
                Most Powerful
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px]">
                {getDisplayTitle(bestPower, region)}
              </div>
              <div className="mt-1 text-[13px] text-[#6E6E73]">
                {formatRegionSpecValue(bestPower, 'horsepower', region)}
              </div>
            </div>
            <div className="rounded-[20px] bg-white p-8 text-center">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">
                Best Value
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px]">
                {getDisplayTitle(bestValue, region)}
              </div>
              <div className="mt-1 text-[13px] text-[#6E6E73]">
                {formatPrice(bestValue.effectivePrice)} after credit
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
