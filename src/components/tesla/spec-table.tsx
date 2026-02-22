import { formatPrice, formatSpec, formatAcceleration } from '@/lib/vehicle-utils'
import type { Vehicle } from '@/lib/vehicle-utils'

interface SpecTableProps {
  vehicle: Vehicle
}

interface SpecRow {
  label: string
  value: string
}

interface SpecSection {
  title: string
  rows: SpecRow[]
}

function getSpecSections(vehicle: Vehicle): SpecSection[] {
  return [
    {
      title: 'Performance',
      rows: [
        { label: 'EPA Range', value: formatSpec(vehicle.rangeEPA, 'mi') },
        { label: '0-60 mph', value: formatAcceleration(vehicle.acceleration060) },
        { label: 'Top Speed', value: formatSpec(vehicle.topSpeed, 'mph') },
        { label: 'Horsepower', value: formatSpec(vehicle.horsepower, 'hp') },
        { label: 'Torque', value: formatSpec(vehicle.torque, 'lb-ft') },
        { label: 'Quarter Mile', value: vehicle.quarterMile ? `${vehicle.quarterMile}s` : 'N/A' },
      ],
    },
    {
      title: 'Battery & Charging',
      rows: [
        { label: 'Battery Capacity', value: vehicle.batteryCapacity ? `${vehicle.batteryCapacity} kWh` : 'N/A' },
        { label: 'Battery Type', value: vehicle.batteryType ?? 'N/A' },
        { label: 'Supercharger Max', value: formatSpec(vehicle.superchargerRateMax, 'kW') },
        { label: 'Charge Time (10-50%)', value: vehicle.chargingTime1050 ?? 'N/A' },
        { label: 'Onboard Charger', value: vehicle.onboardCharger ? `${vehicle.onboardCharger} kW` : 'N/A' },
        { label: 'Charge Port', value: vehicle.chargePort ?? 'N/A' },
      ],
    },
    {
      title: 'Dimensions & Weight',
      rows: [
        { label: 'Length', value: vehicle.length ? `${vehicle.length} in` : 'N/A' },
        { label: 'Width', value: vehicle.width ? `${vehicle.width} in` : 'N/A' },
        { label: 'Height', value: vehicle.height ? `${vehicle.height} in` : 'N/A' },
        { label: 'Wheelbase', value: vehicle.wheelbase ? `${vehicle.wheelbase} in` : 'N/A' },
        { label: 'Curb Weight', value: formatSpec(vehicle.curbWeight, 'lbs') },
        { label: 'Ground Clearance', value: vehicle.groundClearance ? `${vehicle.groundClearance} in` : 'N/A' },
        { label: 'Cargo Volume', value: vehicle.cargoVolume ? `${vehicle.cargoVolume} cu ft` : 'N/A' },
        { label: 'Frunk Volume', value: vehicle.frunkVolume ? `${vehicle.frunkVolume} cu ft` : 'N/A' },
        { label: 'Towing Capacity', value: formatSpec(vehicle.towingCapacity, 'lbs') },
      ],
    },
    {
      title: 'Pricing',
      rows: [
        { label: 'Base Price (MSRP)', value: formatPrice(vehicle.basePriceMSRP) },
        { label: 'Destination Fee', value: formatPrice(vehicle.destinationFee) },
        { label: 'Federal Tax Credit', value: vehicle.federalTaxCredit ? `-${formatPrice(vehicle.federalTaxCredit)}` : 'N/A' },
        { label: 'Effective Price', value: formatPrice(vehicle.effectivePrice) },
      ],
    },
    {
      title: 'Interior & Comfort',
      rows: [
        { label: 'Seating Capacity', value: formatSpec(vehicle.seatingCapacity) },
        { label: 'Display Size', value: vehicle.displaySize ?? 'N/A' },
        { label: 'Rear Display', value: vehicle.hasRearDisplay == null ? 'N/A' : vehicle.hasRearDisplay ? 'Yes' : 'No' },
        { label: 'Sound System', value: vehicle.soundSystem ?? 'N/A' },
      ],
    },
    {
      title: 'Safety & Autopilot',
      rows: [
        { label: 'NCAP Rating', value: vehicle.ncapRating ? `${vehicle.ncapRating}/5` : 'N/A' },
        { label: 'Autopilot', value: vehicle.autopilotStandard ?? 'N/A' },
        { label: 'FSD Available', value: vehicle.fsdAvailable == null ? 'N/A' : vehicle.fsdAvailable ? 'Yes' : 'No' },
        { label: 'FSD Price', value: formatPrice(vehicle.fsdPrice) },
      ],
    },
    {
      title: 'Efficiency',
      rows: [
        { label: 'Energy Consumption', value: formatSpec(vehicle.energyConsumption, 'Wh/mi') },
        { label: 'MPGe', value: formatSpec(vehicle.mpge) },
      ],
    },
  ]
}

export function SpecTable({ vehicle }: SpecTableProps) {
  const sections = getSpecSections(vehicle)

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            {section.rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3 ${
                  i % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                }`}
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
