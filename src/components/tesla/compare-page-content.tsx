import {
  formatRegionSpecValue,
  getDisplayTitle,
  getRegionSpecMeta,
  isVehicleAvailableInRegion,
} from '@/lib/vehicle-region';
import type { Region } from '@/lib/vehicle-region';
import {
  formatPrice,
  type TeslaModel,
  type Vehicle,
} from '@/lib/vehicle-utils';
import { getVehicleGeneration } from '@/lib/vehicle-generations';
import { getAnglePhotos, DEFAULT_ANGLE } from '@/lib/vehicle-angles';
import { VehicleImage } from './vehicle-image';
import { ComparisonTable } from './comparison-table';

interface ComparePageContentProps {
  vehicles: Vehicle[];
  models: TeslaModel[];
  region: Region;
}

function toNumber(value: number | string | null | undefined) {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ComparePageContent({
  vehicles,
  models,
  region,
}: ComparePageContentProps) {
  const visibleVehicles = vehicles.filter((vehicle) =>
    isVehicleAvailableInRegion(vehicle, region)
  );

  if (visibleVehicles.length < 2) {
    return (
      <div className="mx-auto max-w-[980px] px-5 py-8">
        <div className="rounded-sm border border-[#E5E2DC] bg-[#F5F2ED] p-6 text-center">
          <h2 className="text-[20px] font-semibold tracking-[-0.3px] text-[#1A1A1A]">
            Comparison unavailable in {region}
          </h2>
          <p className="mt-2 text-[14px] text-[#777777]">
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
      <div className="sticky top-12 z-40 border-b border-[#E5E2DC] bg-[#FDFCF9]/90 backdrop-blur-[20px]">
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
            const generation = model
              ? getVehicleGeneration(model.slug, vehicle.year)
              : null;
            const anglePhotos = model
              ? getAnglePhotos(model.slug, vehicle.year)
              : null;
            const defaultAngle = anglePhotos?.find(
              (p) => p.angle === DEFAULT_ANGLE,
            );
            const imageSrc =
              defaultAngle?.src ??
              generation?.image ??
              `/images/vehicles/${vehicle.slug}.png`;
            return (
              <div key={vehicle.id} className="px-4 text-center">
                <div className="mx-auto mb-2.5 flex h-24 w-36 items-center justify-center overflow-hidden rounded-sm bg-[#F5F2ED]">
                  <VehicleImage
                    src={imageSrc}
                    alt={getDisplayTitle(vehicle, region)}
                    width={288}
                    height={192}
                    className="h-full w-full mix-blend-multiply object-contain"
                    fallbackClassName="flex h-full w-full items-center justify-center"
                    fallbackLabel={model?.name.replace('Model ', '') ?? '?'}
                  />
                </div>
                <div className="text-[15px] font-semibold tracking-[-0.3px]">
                  {getDisplayTitle(vehicle, region)}
                </div>
                {/* Price hidden for now */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-8">
        <ComparisonTable vehicles={visibleVehicles} region={region} />
      </div>

      <section className="bg-[#F5F2ED] py-20" aria-label="Comparison verdict">
        <div className="mx-auto max-w-[980px] px-5 text-center">
          <h2 className="font-display text-[40px] font-bold tracking-[-2px] text-[#1A1A1A]">
            Which should you buy?
          </h2>
          <p className="mt-2 text-[17px] font-light text-[#777777]">
            How they compare on the dimensions that matter most.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-sm bg-white p-8 text-center">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
                Best Range
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
                {getDisplayTitle(bestRange, region)}
              </div>
              <div className="mt-1 text-[13px] text-[#777777]">
                {formatRegionSpecValue(bestRange, 'rangeEPA', region)} EPA
              </div>
            </div>
            <div className="rounded-sm bg-white p-8 text-center">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
                Most Powerful
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
                {getDisplayTitle(bestPower, region)}
              </div>
              <div className="mt-1 text-[13px] text-[#777777]">
                {formatRegionSpecValue(bestPower, 'horsepower', region)}
              </div>
            </div>
            <div className="rounded-sm bg-white p-8 text-center">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
                Best Value
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
                {getDisplayTitle(bestValue, region)}
              </div>
              {/* Price hidden for now */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
