'use client';

import { useState } from 'react';
import type { Vehicle } from '@/lib/vehicle-utils';
import type { ReactNode } from 'react';
import { ModelVehiclesByGeneration } from './model-vehicles-by-generation';
import { ArrowUpDown } from 'lucide-react';

interface ModelVehiclesByGenerationInteractiveProps {
  vehicles: Vehicle[];
  modelSlug: string;
  modelName: string;
  children: ReactNode;
}

export function ModelVehiclesByGenerationInteractive({
  vehicles,
  modelSlug,
  modelName,
  children,
}: ModelVehiclesByGenerationInteractiveProps) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const isDefault = sortOrder === 'desc';

  return (
    <>
      {/* Sort toggle — always interactive */}
      <div className="mb-8 flex items-center justify-end">
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

      {isDefault ? (
        children
      ) : (
        <ModelVehiclesByGeneration
          vehicles={vehicles}
          modelSlug={modelSlug}
          modelName={modelName}
          sortOrder={sortOrder}
        />
      )}
    </>
  );
}
