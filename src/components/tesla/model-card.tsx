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
      className="group flex flex-col overflow-hidden rounded-sm bg-[#F5F2ED] transition-colors hover:bg-[#EDEAE4]"
    >
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden">
        <VehicleImage
          src={getModelCardImage(model.slug)}
          alt={`Tesla ${model.name}`}
          width={1200}
          height={600}
          className="h-full w-full object-contain p-4"
          fallbackClassName="flex h-full w-full items-center justify-center"
          fallbackLabel={model.name}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#999999]">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h3 className="mt-1 text-xl font-semibold text-[#1A1A1A]">
          Tesla {model.name}
        </h3>
        {model.tagline && (
          <p className="mt-1 text-sm text-[#777777]">{model.tagline}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-[#E5E2DC] pt-4">
          {vehicleCount != null && (
            <span className="text-xs text-[#999999]">
              {vehicleCount} {vehicleCount === 1 ? 'trim' : 'trims'} available
            </span>
          )}
          <span className="ml-auto text-sm font-medium text-[#1A1A1A] group-hover:text-[#777777]">
            View Details ›
          </span>
        </div>
      </div>
    </Link>
  );
}
