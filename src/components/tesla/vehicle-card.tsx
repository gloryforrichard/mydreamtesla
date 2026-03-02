'use client';

import Link from 'next/link';
import { useRegion } from '@/contexts/region-context';
import {
  formatRegionSpecValue,
  getDisplayTrimName,
} from '@/lib/vehicle-region';
import { formatPrice } from '@/lib/vehicle-utils';
import type { Vehicle } from '@/lib/vehicle-utils';
import { VehicleImage } from './vehicle-image';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { region } = useRegion();

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-[#F5F2ED] transition-colors hover:bg-[#EDEAE4]"
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
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#999999]">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-[#1A1A1A]">
          {getDisplayTrimName(vehicle, region)}
        </h3>
        {/* Price hidden for now */}
        <div className="mt-4 flex items-center gap-6 border-t border-[#E5E2DC] pt-4 text-xs text-[#999999]">
          <span className="font-mono font-medium text-[#1A1A1A]">
            {formatRegionSpecValue(vehicle, 'rangeEPA', region)}
          </span>
          <span className="font-mono font-medium text-[#1A1A1A]">
            {formatRegionSpecValue(vehicle, 'acceleration', region)}
          </span>
          <span className="font-mono font-medium text-[#1A1A1A]">
            {formatRegionSpecValue(vehicle, 'horsepower', region)}
          </span>
        </div>
      </div>
    </Link>
  );
}
