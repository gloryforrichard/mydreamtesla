import { groupVehiclesByGeneration } from '@/lib/vehicle-generations';
import { isVehicleAvailableInRegion } from '@/lib/vehicle-region';
import type { Region } from '@/lib/vehicle-region';
import type { Vehicle } from '@/lib/vehicle-utils';
import { GenerationSection } from './generation-section';

interface ModelVehiclesByGenerationProps {
  vehicles: Vehicle[];
  modelSlug: string;
  modelName: string;
  region: Region;
  sortOrder?: 'desc' | 'asc';
}

export function ModelVehiclesByGeneration({
  vehicles,
  modelSlug,
  modelName,
  region,
  sortOrder = 'desc',
}: ModelVehiclesByGenerationProps) {
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

  let groups = groupVehiclesByGeneration(visibleVehicles, modelSlug);

  if (sortOrder === 'asc') {
    groups = [...groups].reverse().map((g) => ({
      ...g,
      vehicles: [...g.vehicles].reverse(),
    }));
  }

  return (
    <>
      {/* Stats */}
      <div className="mb-8">
        <p className="text-sm text-[#999999]">
          <span className="font-mono font-semibold text-[#1A1A1A]">
            {visibleVehicles.length}
          </span>{' '}
          configurations across{' '}
          <span className="font-mono font-semibold text-[#1A1A1A]">
            {groups.length}
          </span>{' '}
          generations
        </p>
      </div>

      {groups.map(({ generation, vehicles: genVehicles }) => (
        <GenerationSection
          key={generation.name}
          generation={generation}
          vehicles={genVehicles}
          modelName={modelName}
          region={region}
        />
      ))}
    </>
  );
}
