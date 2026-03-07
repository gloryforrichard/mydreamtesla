import { formatSpec } from '@/lib/vehicle-utils';
import type { TeslaModel, Vehicle } from '@/lib/vehicle-utils';
import { getVehicleGeneration } from '@/lib/vehicle-generations';
import { getAnglePhotos, DEFAULT_ANGLE } from '@/lib/vehicle-angles';
import { VehicleImage } from './vehicle-image';
import { ComparisonTable } from './comparison-table';

interface ComparePageContentProps {
  vehicles: Vehicle[];
  models: TeslaModel[];
}

export function ComparePageContent({
  vehicles,
  models,
}: ComparePageContentProps) {
  const bestRange = [...vehicles].sort(
    (a, b) => (b.rangeKm ?? 0) - (a.rangeKm ?? 0),
  )[0];

  const bestPower = [...vehicles].sort(
    (a, b) => (b.horsepower ?? 0) - (a.horsepower ?? 0),
  )[0];

  const bestValue = [...vehicles].sort(
    (a, b) => (a.effectivePrice ?? Infinity) - (b.effectivePrice ?? Infinity),
  )[0];

  return (
    <>
      <div className="sticky top-12 z-40 border-b border-[#E5E2DC] bg-[#FDFCF9]/90 backdrop-blur-[20px]">
        <div
          className="mx-auto max-w-[980px] px-5 py-4"
          style={{
            display: 'grid',
            gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)`,
          }}
        >
          <div />
          {vehicles.map((vehicle) => {
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
                    alt={vehicle.title}
                    width={288}
                    height={192}
                    className="h-full w-full mix-blend-multiply object-contain"
                    fallbackClassName="flex h-full w-full items-center justify-center"
                    fallbackLabel={model?.name.replace('Model ', '') ?? '?'}
                  />
                </div>
                <div className="text-[15px] font-semibold tracking-[-0.3px]">
                  {vehicle.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-8">
        <ComparisonTable vehicles={vehicles} />
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
                {bestRange.title}
              </div>
              <div className="mt-1 text-[13px] text-[#777777]">
                {formatSpec(bestRange.rangeKm, 'km')}
              </div>
            </div>
            <div className="rounded-sm bg-white p-8 text-center">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
                Most Powerful
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
                {bestPower.title}
              </div>
              <div className="mt-1 text-[13px] text-[#777777]">
                {formatSpec(bestPower.horsepower, 'hp')}
              </div>
            </div>
            <div className="rounded-sm bg-white p-8 text-center">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
                Best Value
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
                {bestValue.title}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
