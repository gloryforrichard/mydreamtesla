'use client';

import { useRegion } from '@/contexts/region-context';
import {
  groupVehiclesByGeneration,
} from '@/lib/vehicle-generations';
import { isVehicleAvailableInRegion } from '@/lib/vehicle-region';
import type { Vehicle } from '@/lib/vehicle-utils';
import { VehicleCard } from './vehicle-card';

interface ModelVehiclesByGenerationProps {
  vehicles: Vehicle[];
  modelSlug: string;
}

function formatYearRange(yearStart: number, yearEnd: number): string {
  const endDisplay = yearEnd >= 2099 ? 'Present' : String(yearEnd);
  return `${yearStart}–${endDisplay}`;
}

export function ModelVehiclesByGeneration({
  vehicles,
  modelSlug,
}: ModelVehiclesByGenerationProps) {
  const { region } = useRegion();

  const visibleVehicles = vehicles.filter((vehicle) =>
    isVehicleAvailableInRegion(vehicle, region),
  );

  if (visibleVehicles.length === 0) {
    return (
      <div className="py-20 text-center text-[#999999]">
        <p>No vehicles available in the selected region yet.</p>
      </div>
    );
  }

  const groups = groupVehiclesByGeneration(visibleVehicles, modelSlug);

  return (
    <>
      {groups.map(({ generation, vehicles: genVehicles }) => (
        <section key={generation.name} className="mb-12">
          <h2 className="mb-1 font-display text-[28px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
            {generation.name}{' '}
            <span className="text-[22px] font-normal text-[#999999]">
              ({formatYearRange(generation.yearStart, generation.yearEnd)})
            </span>
          </h2>
          {generation.description && (
            <p className="mb-6 max-w-3xl text-[14px] leading-relaxed text-[#777777]">
              {generation.description}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
