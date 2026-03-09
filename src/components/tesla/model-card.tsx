import Link from 'next/link';
import type { TeslaModel } from '@/lib/vehicle-utils';
import { VehicleImage } from './vehicle-image';
import { getModelCardImage } from '@/lib/vehicle-images';

interface ModelCardProps {
  model: TeslaModel;
  vehicleCount?: number;
}

export function ModelCard({ model, vehicleCount }: ModelCardProps) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-300 hover:bg-card-hover hover:shadow-md"
    >
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden">
        <VehicleImage
          src={getModelCardImage(model.slug)}
          alt={`Tesla ${model.name}`}
          width={1200}
          height={600}
          className="h-full w-full mix-blend-multiply object-contain p-4 dark:mix-blend-normal"
          fallbackClassName="flex h-full w-full items-center justify-center"
          fallbackLabel={model.name}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[1.5px] text-muted-foreground">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h3 className="mt-1.5 text-xl font-bold text-foreground">
          Tesla {model.name}
        </h3>
        {model.tagline && (
          <p className="mt-1 text-sm text-secondary-text">{model.tagline}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          {vehicleCount != null && (
            <span className="text-xs text-muted-foreground">
              {vehicleCount} {vehicleCount === 1 ? 'trim' : 'trims'} available
            </span>
          )}
          <span className="ml-auto text-sm font-medium text-brand">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
