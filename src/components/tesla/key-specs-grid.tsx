import { formatSpec } from '@/lib/vehicle-utils';
import type { Vehicle } from '@/lib/vehicle-utils';

interface KeySpecsGridProps {
  vehicle: Vehicle;
}

export function KeySpecsGrid({ vehicle }: KeySpecsGridProps) {
  const specs = [
    {
      label: 'Range',
      value: formatSpec(vehicle.rangeKm, 'km'),
    },
    {
      label: '0–60 mph',
      value: vehicle.acceleration060 ? `${vehicle.acceleration060}s` : 'N/A',
    },
    {
      label: 'Horsepower',
      value: formatSpec(vehicle.horsepower, 'hp'),
    },
    {
      label: 'Top Speed',
      value: formatSpec(vehicle.topSpeed, 'mph'),
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
