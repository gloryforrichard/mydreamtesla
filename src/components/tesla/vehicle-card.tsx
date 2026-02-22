import Link from 'next/link'
import { formatPrice, formatSpec, formatAcceleration } from '@/lib/vehicle-utils'
import type { Vehicle } from '@/lib/vehicle-utils'
import { BatteryChargingIcon, GaugeIcon, ZapIcon } from 'lucide-react'

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg"
    >
      <div className="flex aspect-[16/10] items-center justify-center bg-muted/50 p-8">
        <p className="text-4xl font-bold tracking-tight text-muted-foreground/20">
          {vehicle.year}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h3 className="mt-1 text-lg font-semibold group-hover:text-blue-600">
          {vehicle.trimName}
        </h3>
        <p className="mt-2 text-xl font-bold">{formatPrice(vehicle.basePriceMSRP)}</p>
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BatteryChargingIcon className="size-3.5" />
            {formatSpec(vehicle.rangeEPA, 'mi')}
          </span>
          <span className="flex items-center gap-1">
            <GaugeIcon className="size-3.5" />
            {formatAcceleration(vehicle.acceleration060)}
          </span>
          <span className="flex items-center gap-1">
            <ZapIcon className="size-3.5" />
            {formatSpec(vehicle.horsepower, 'hp')}
          </span>
        </div>
      </div>
    </Link>
  )
}
