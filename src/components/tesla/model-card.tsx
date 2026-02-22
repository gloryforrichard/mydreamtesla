import Link from 'next/link'
import type { TeslaModel } from '@/lib/vehicle-utils'
import { ChevronRightIcon } from 'lucide-react'

interface ModelCardProps {
  model: TeslaModel
  vehicleCount?: number
}

export function ModelCard({ model, vehicleCount }: ModelCardProps) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg"
    >
      <div className="flex aspect-[16/9] items-center justify-center bg-muted/50">
        <p className="text-5xl font-bold tracking-tight text-muted-foreground/20">
          {model.name}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h3 className="mt-1 text-xl font-semibold group-hover:text-blue-600">
          Tesla {model.name}
        </h3>
        {model.tagline && (
          <p className="mt-1 text-sm text-muted-foreground">{model.tagline}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          {vehicleCount != null && (
            <span className="text-xs text-muted-foreground">
              {vehicleCount} {vehicleCount === 1 ? 'trim' : 'trims'} available
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
            View Details
            <ChevronRightIcon className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
