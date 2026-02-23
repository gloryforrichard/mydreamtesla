import { formatSpec, formatAcceleration } from '@/lib/vehicle-utils'
import type { Vehicle } from '@/lib/vehicle-utils'

interface KeySpecsGridProps {
  vehicle: Vehicle
}

export function KeySpecsGrid({ vehicle }: KeySpecsGridProps) {
  const specs = [
    { label: 'EPA Range', value: formatSpec(vehicle.rangeEPA, 'mi') },
    { label: '0-60 mph', value: formatAcceleration(vehicle.acceleration060) },
    { label: 'Horsepower', value: formatSpec(vehicle.horsepower, 'hp') },
    { label: 'Top Speed', value: formatSpec(vehicle.topSpeed, 'mph') },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-col items-center rounded-2xl bg-[#F5F5F7] p-6 text-center"
        >
          <p className="font-mono text-[28px] font-bold tracking-tight text-[#1D1D1F]">
            {spec.value}
          </p>
          <p className="mt-1 text-[13px] text-[#86868B]">{spec.label}</p>
        </div>
      ))}
    </div>
  )
}
