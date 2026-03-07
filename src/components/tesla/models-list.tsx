import type { TeslaModel, Vehicle } from '@/lib/vehicle-utils';
import { ModelCard } from './model-card';

interface ModelsListProps {
  models: TeslaModel[];
  vehicles: Vehicle[];
}

export function ModelsList({ models, vehicles }: ModelsListProps) {
  const vehicleCountByModel: Record<number, number> = {};
  for (const v of vehicles) {
    vehicleCountByModel[v.modelId] =
      (vehicleCountByModel[v.modelId] ?? 0) + 1;
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
