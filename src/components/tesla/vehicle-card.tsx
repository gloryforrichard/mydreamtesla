import Link from 'next/link';
import { formatSpec } from '@/lib/vehicle-utils';
import type { Vehicle } from '@/lib/vehicle-utils';
import { VehicleImage } from './vehicle-image';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-300 hover:bg-card-hover hover:shadow-md"
    >
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden">
        <VehicleImage
          src={`/images/vehicles/${vehicle.slug}.png`}
          alt={vehicle.title}
          width={1000}
          height={500}
          className="h-full w-full object-contain p-4"
          fallbackClassName="flex h-full w-full items-center justify-center"
          fallbackLabel={String(vehicle.year)}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[1.5px] text-muted-foreground">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h3 className="mt-1.5 text-lg font-bold text-foreground">
          {vehicle.trimName}
        </h3>
        <div className="mt-4 flex items-center gap-6 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="font-mono font-medium text-foreground">
            {formatSpec(vehicle.rangeKm, 'km')}
          </span>
          <span className="font-mono font-medium text-foreground">
            {vehicle.acceleration060 ? `${vehicle.acceleration060}s` : 'N/A'}
          </span>
          <span className="font-mono font-medium text-foreground">
            {formatSpec(vehicle.horsepower, 'hp')}
          </span>
        </div>
      </div>
    </Link>
  );
}
