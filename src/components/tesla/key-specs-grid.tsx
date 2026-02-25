'use client';

import { useRegion } from '@/contexts/region-context';
import { getRegionSpecMeta, formatRegionSpecValue } from '@/lib/vehicle-region';
import type { Vehicle } from '@/lib/vehicle-utils';

interface KeySpecsGridProps {
  vehicle: Vehicle;
}

export function KeySpecsGrid({ vehicle }: KeySpecsGridProps) {
  const { region } = useRegion();

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
          className="flex flex-col items-center rounded-2xl bg-[#F5F5F7] p-6 text-center"
        >
          <p className="font-mono text-[28px] font-bold tracking-tight text-[#1D1D1F]">
            {spec.value}
          </p>
          <p className="mt-1 text-[13px] text-[#86868B]">{spec.label}</p>
        </div>
      ))}
    </div>
  );
}
