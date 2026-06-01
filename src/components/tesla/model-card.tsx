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
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-secondary/40">
        <VehicleImage
          src={getModelCardImage(model.slug)}
          alt={`Tesla ${model.name}`}
          width={1200}
          height={600}
          className="h-full w-full object-contain p-5"
          fallbackClassName="flex h-full w-full items-center justify-center"
          fallbackLabel={model.name}
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="font-mono text-[13px] font-medium uppercase tracking-[1px] text-ink-3">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h3 className="mt-2 font-display text-[22px] font-bold tracking-[-0.5px] text-foreground">
          Tesla {model.name}
        </h3>
        {model.tagline && (
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            {model.tagline}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          {vehicleCount != null && (
            <span className="text-[13px] text-ink-3">
              {vehicleCount} {vehicleCount === 1 ? 'trim' : 'trims'} available
            </span>
          )}
          <span className="ml-auto text-[15px] font-medium text-ed-accent">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
