'use client';

import { useRegion } from '@/contexts/region-context';
import { isVehicleAvailableInRegion } from '@/lib/vehicle-region';
import type { Vehicle } from '@/lib/vehicle-utils';
import { VehicleCard } from './vehicle-card';

interface ModelVehiclesByYearProps {
  vehicles: Vehicle[];
}

export function ModelVehiclesByYear({ vehicles }: ModelVehiclesByYearProps) {
  const { region } = useRegion();

  const visibleVehicles = vehicles.filter((vehicle) =>
    isVehicleAvailableInRegion(vehicle, region)
  );

  const vehiclesByYear: Record<number, Vehicle[]> = {};
  for (const vehicle of visibleVehicles) {
    const yearVehicles = vehiclesByYear[vehicle.year] ?? [];
    yearVehicles.push(vehicle);
    vehiclesByYear[vehicle.year] = yearVehicles;
  }

  const years = Object.keys(vehiclesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (visibleVehicles.length === 0) {
    return (
      <div className="py-20 text-center text-[#86868B]">
        <p>No vehicles available in the selected region yet.</p>
      </div>
    );
  }

  return (
    <>
      {years.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="mb-6 text-[28px] font-bold tracking-[-0.5px] text-[#1D1D1F]">
            {year} Lineup
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehiclesByYear[year].map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
