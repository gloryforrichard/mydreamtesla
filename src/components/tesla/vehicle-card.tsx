import Link from 'next/link';
import { getStudioImageForVehicleSlug } from '@/lib/vehicle-images';
import { formatSpec } from '@/lib/vehicle-utils';
import type { Vehicle } from '@/lib/vehicle-utils';
import { VehicleImage } from './vehicle-image';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const imageSrc =
    getStudioImageForVehicleSlug(vehicle.slug, vehicle.year) ??
    `/images/vehicles/${vehicle.slug}.png`;

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-secondary/40">
        <VehicleImage
          src={imageSrc}
          alt={vehicle.title}
          width={1000}
          height={500}
          className="h-full w-full object-contain p-4"
          fallbackClassName="flex h-full w-full items-center justify-center"
          fallbackLabel={String(vehicle.year)}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[1px] text-ink-3">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h3 className="mt-2 text-[19px] font-bold text-foreground">
          {vehicle.trimName}
        </h3>
        <div className="mt-4 flex items-center gap-5 border-t border-line pt-4 sm:gap-7">
          <div>
            <p className="font-mono text-[17px] font-semibold text-foreground">
              {formatSpec(vehicle.rangeKm, 'km')}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-3">Range</p>
          </div>
          <div>
            <p className="font-mono text-[17px] font-semibold text-foreground">
              {vehicle.acceleration060 ? `${vehicle.acceleration060}s` : 'N/A'}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-3">0–60 mph</p>
          </div>
          <div>
            <p className="font-mono text-[17px] font-semibold text-foreground">
              {formatSpec(vehicle.horsepower, 'hp')}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-3">Power</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
