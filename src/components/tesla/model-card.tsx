import Link from 'next/link'
import type { TeslaModel } from '@/lib/vehicle-utils'

interface ModelCardProps {
  model: TeslaModel
  vehicleCount?: number
}

export function ModelCard({ model, vehicleCount }: ModelCardProps) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-[#F5F5F7] transition-transform hover:scale-[1.02]"
    >
      <div className="flex aspect-[16/9] items-center justify-center">
        <p className="text-5xl font-bold tracking-tight text-black/[0.06]">
          {model.name}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#86868B]">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h3 className="mt-1 text-xl font-semibold text-[#1D1D1F]">
          Tesla {model.name}
        </h3>
        {model.tagline && (
          <p className="mt-1 text-sm text-[#6E6E73]">{model.tagline}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-4">
          {vehicleCount != null && (
            <span className="text-xs text-[#86868B]">
              {vehicleCount} {vehicleCount === 1 ? 'trim' : 'trims'} available
            </span>
          )}
          <span className="ml-auto text-sm font-medium text-[#1D1D1F] group-hover:text-[#424245]">
            View Details ›
          </span>
        </div>
      </div>
    </Link>
  )
}
