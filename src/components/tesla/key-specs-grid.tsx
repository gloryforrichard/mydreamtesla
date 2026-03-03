import { getRegionSpecMeta, formatRegionSpecValue } from '@/lib/vehicle-region';
import type { Region } from '@/lib/vehicle-region';
import type { Vehicle } from '@/lib/vehicle-utils';

interface KeySpecsGridProps {
  vehicle: Vehicle;
  region: Region;
}

export function KeySpecsGrid({ vehicle, region }: KeySpecsGridProps) {

  const rangeMeta = getRegionSpecMeta(vehicle, 'rangeEPA', region);
  const accelMeta = getRegionSpecMeta(vehicle, 'acceleration', region);
  const hpMeta = getRegionSpecMeta(vehicle, 'horsepower', region);
  const speedMeta = getRegionSpecMeta(vehicle, 'topSpeed', region);

  const specs = [
    {
      label: rangeMeta.label,
      value: formatRegionSpecValue(vehicle, 'rangeEPA', region),
    },
    {
      label: accelMeta.label,
      value: formatRegionSpecValue(vehicle, 'acceleration', region),
    },
    {
      label: hpMeta.label,
      value: formatRegionSpecValue(vehicle, 'horsepower', region),
    },
    {
      label: speedMeta.label,
      value: formatRegionSpecValue(vehicle, 'topSpeed', region),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-col items-center rounded-sm bg-[#F5F2ED] p-6 text-center"
        >
          <p className="font-display text-[36px] font-bold tracking-tight text-[#1A1A1A]">
            {spec.value}
          </p>
          <p className="mt-1 text-[13px] text-[#999999]">{spec.label}</p>
        </div>
      ))}
    </div>
  );
}
