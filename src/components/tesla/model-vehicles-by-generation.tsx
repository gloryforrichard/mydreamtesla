'use client';

import { useState } from 'react';
import { useRegion } from '@/contexts/region-context';
import { groupVehiclesByGeneration } from '@/lib/vehicle-generations';
import { isVehicleAvailableInRegion } from '@/lib/vehicle-region';
import type { Vehicle } from '@/lib/vehicle-utils';
import { GenerationSection } from './generation-section';
import { ArrowUpDown } from 'lucide-react';

interface ModelVehiclesByGenerationProps {
  vehicles: Vehicle[];
  modelSlug: string;
  modelName: string;
}

export function ModelVehiclesByGeneration({
  vehicles,
  modelSlug,
  modelName,
}: ModelVehiclesByGenerationProps) {
  const { region } = useRegion();
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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

  // When asc, reverse generation order and vehicle order within each generation
  if (sortOrder === 'asc') {
    groups = [...groups].reverse().map((g) => ({
      ...g,
      vehicles: [...g.vehicles].reverse(),
    }));
  }

  return (
    <>
      {/* Stats + sort toggle */}
      <div className="mb-8 flex items-center justify-between">
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
        <button
          type="button"
          onClick={() =>
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
          }
          className="inline-flex items-center gap-1.5 rounded-sm border border-[#E5E2DC] px-3 py-1.5 text-xs font-medium text-[#777777] transition-colors hover:border-[#CCCCCC] hover:text-[#1A1A1A]"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {groups.map(({ generation, vehicles: genVehicles }) => (
        <GenerationSection
          key={generation.name}
          generation={generation}
          vehicles={genVehicles}
          modelName={modelName}
        />
      ))}
    </>
  );
}
