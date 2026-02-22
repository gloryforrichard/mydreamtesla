import { formatSpec, formatAcceleration } from '@/lib/vehicle-utils'
import type { Vehicle } from '@/lib/vehicle-utils'
import { BatteryChargingIcon, GaugeIcon, ZapIcon, WindIcon } from 'lucide-react'

interface KeySpecsGridProps {
  vehicle: Vehicle
}

export function KeySpecsGrid({ vehicle }: KeySpecsGridProps) {
  const specs = [
    {
      label: 'EPA Range',
      value: formatSpec(vehicle.rangeEPA, 'mi'),
      icon: BatteryChargingIcon,
    },
    {
      label: '0-60 mph',
      value: formatAcceleration(vehicle.acceleration060),
      icon: GaugeIcon,
    },
    {
      label: 'Horsepower',
      value: formatSpec(vehicle.horsepower, 'hp'),
      icon: ZapIcon,
    },
    {
      label: 'Top Speed',
      value: formatSpec(vehicle.topSpeed, 'mph'),
      icon: WindIcon,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center"
        >
          <spec.icon className="mb-3 size-6 text-muted-foreground" />
          <p className="text-2xl font-bold tracking-tight">{spec.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{spec.label}</p>
        </div>
      ))}
    </div>
  )
}
