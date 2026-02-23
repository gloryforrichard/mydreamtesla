import Link from 'next/link'
import { formatPrice, formatSpec, formatAcceleration } from '@/lib/vehicle-utils'
import type { Vehicle } from '@/lib/vehicle-utils'

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-[#F5F5F7] transition-transform hover:scale-[1.02]"
    >
      <div className="flex aspect-[16/10] items-center justify-center p-8">
        <p className="text-4xl font-bold tracking-tight text-black/[0.06]">
          {vehicle.year}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#86868B]">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-[#1D1D1F]">
          {vehicle.trimName}
        </h3>
        <p className="mt-2 font-mono text-xl font-bold text-[#1D1D1F]">
          {formatPrice(vehicle.basePriceMSRP)}
        </p>
        <div className="mt-4 flex items-center gap-6 border-t border-black/[0.06] pt-4 text-xs text-[#86868B]">
          <span className="font-mono font-medium text-[#1D1D1F]">
            {formatSpec(vehicle.rangeEPA, 'mi')}
          </span>
          <span className="font-mono font-medium text-[#1D1D1F]">
            {formatAcceleration(vehicle.acceleration060)}
          </span>
          <span className="font-mono font-medium text-[#1D1D1F]">
            {formatSpec(vehicle.horsepower, 'hp')}
          </span>
        </div>
      </div>
    </Link>
  )
}
