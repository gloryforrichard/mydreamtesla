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
      <div className="sticky top-12 z-40 border-b border-line bg-background/90 backdrop-blur-[20px]">
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div
            className="mx-auto min-w-[360px] max-w-[1400px] px-8 py-4 sm:min-w-[480px]"
            style={{
              display: 'grid',
              gridTemplateColumns: `clamp(90px, 22vw, 180px) repeat(${vehicles.length}, 1fr)`,
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
                <div key={vehicle.id} className="px-2 text-center sm:px-4">
                  <div className="mx-auto mb-2 flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg bg-paper sm:mb-2.5 sm:h-24 sm:w-36">
                    <VehicleImage
                      src={imageSrc}
                      alt={vehicle.title}
                      width={288}
                      height={192}
                      className="h-full w-full mix-blend-multiply object-contain dark:mix-blend-normal"
                      fallbackClassName="flex h-full w-full items-center justify-center"
                      fallbackLabel={model?.name.replace('Model ', '') ?? '?'}
                    />
                  </div>
                  <div className="text-[12px] font-semibold tracking-[-0.3px] sm:text-[15px]">
                    {vehicle.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-8">
        <ComparisonTable vehicles={vehicles} />
      </div>

      <section className="bg-paper py-20" aria-label="Comparison verdict">
        <div className="mx-auto max-w-[1400px] px-8 text-center">
          <h2 className="font-display text-[28px] font-bold tracking-[-2px] text-foreground sm:text-[36px] md:text-[40px]">
            Which should you buy?
          </h2>
          <p className="mt-2 text-[17px] font-light text-ink-2">
            How they compare on the dimensions that matter most.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-lg bg-background p-6 text-center sm:p-8">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-ink-3">
                Best Range
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-foreground">
                {bestRange.title}
              </div>
              <div className="mt-1 text-[13px] text-ink-2">
                {formatSpec(bestRange.rangeKm, 'km')}
              </div>
            </div>
            <div className="rounded-lg bg-background p-6 text-center sm:p-8">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-ink-3">
                Most Powerful
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-foreground">
                {bestPower.title}
              </div>
              <div className="mt-1 text-[13px] text-ink-2">
                {formatSpec(bestPower.horsepower, 'hp')}
              </div>
            </div>
            <div className="rounded-lg bg-background p-6 text-center sm:p-8">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-ink-3">
                Best Value
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px] text-foreground">
                {bestValue.title}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
