'use client';

import { useRegion } from '@/contexts/region-context';
import { isVehicleAvailableInRegion } from '@/lib/vehicle-region';
import type { TeslaModel, Vehicle } from '@/lib/vehicle-utils';
import { ModelCard } from './model-card';
import type { ReactNode } from 'react';

interface ModelsListRegionProps {
  models: TeslaModel[];
  vehicles: Vehicle[];
  children: ReactNode;
}

export function ModelsListRegion({
  models,
  vehicles,
  children,
}: ModelsListRegionProps) {
  const { region } = useRegion();

  if (region === 'US') {
    return <>{children}</>;
  }

  const vehicleCountByModel: Record<number, number> = {};
  for (const v of vehicles) {
    if (isVehicleAvailableInRegion(v, region)) {
      vehicleCountByModel[v.modelId] =
        (vehicleCountByModel[v.modelId] ?? 0) + 1;
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          vehicleCount={vehicleCountByModel[model.id]}
        />
      ))}
    </div>
  );
}
