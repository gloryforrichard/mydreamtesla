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
          className="flex flex-col items-center rounded-sm bg-card p-4 text-center sm:p-6"
        >
          <p className="font-display text-[24px] font-bold tracking-tight text-foreground sm:text-[28px] md:text-[36px]">
            {spec.value}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">{spec.label}</p>
        </div>
      ))}
    </div>
  );
}
