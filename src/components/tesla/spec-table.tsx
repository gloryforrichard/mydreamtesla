import { formatPrice, formatSpec } from '@/lib/vehicle-utils';
import type { Vehicle } from '@/lib/vehicle-utils';

interface SpecTableProps {
  vehicle: Vehicle;
}

interface SpecRow {
  label: string;
  value: string;
}

interface SpecSection {
  title: string;
  rows: SpecRow[];
}

function getSpecSections(vehicle: Vehicle): SpecSection[] {
  return [
    {
      title: 'Performance',
      rows: [
        { label: 'Range', value: formatSpec(vehicle.rangeKm, 'km') },
        {
          label: '0–60 mph',
          value: vehicle.acceleration060
            ? `${vehicle.acceleration060}s`
            : 'N/A',
        },
        { label: 'Top Speed', value: formatSpec(vehicle.topSpeed, 'mph') },
        { label: 'Horsepower', value: formatSpec(vehicle.horsepower, 'hp') },
        { label: 'Torque', value: formatSpec(vehicle.torque, 'lb-ft') },
        {
          label: 'Quarter Mile',
          value: vehicle.quarterMile ? `${vehicle.quarterMile}s` : 'N/A',
        },
      ],
    },
    {
      title: 'Battery & Charging',
      rows: [
        {
          label: 'Battery Capacity',
          value: vehicle.batteryCapacity
            ? `${vehicle.batteryCapacity} kWh`
            : 'N/A',
        },
        { label: 'Battery Type', value: vehicle.batteryType ?? 'N/A' },
        {
          label: 'Supercharger Max',
          value: formatSpec(vehicle.superchargerRateMax, 'kW'),
        },
        {
          label: 'Charge Time (10-50%)',
          value: vehicle.chargingTime1050 ?? 'N/A',
        },
        {
          label: 'Onboard Charger',
          value: vehicle.onboardCharger
            ? `${vehicle.onboardCharger} kW`
            : 'N/A',
        },
        { label: 'Charge Port', value: vehicle.chargePort ?? 'N/A' },
      ],
    },
    {
      title: 'Dimensions & Weight',
      rows: [
        { label: 'Length', value: formatSpec(vehicle.length, 'in') },
        { label: 'Width', value: formatSpec(vehicle.width, 'in') },
        { label: 'Height', value: formatSpec(vehicle.height, 'in') },
        { label: 'Wheelbase', value: formatSpec(vehicle.wheelbase, 'in') },
        { label: 'Curb Weight', value: formatSpec(vehicle.curbWeight, 'lbs') },
        {
          label: 'Ground Clearance',
          value: formatSpec(vehicle.groundClearance, 'in'),
        },
        {
          label: 'Cargo Volume',
          value: formatSpec(vehicle.cargoVolume, 'cu ft'),
        },
        {
          label: 'Frunk Volume',
          value: formatSpec(vehicle.frunkVolume, 'cu ft'),
        },
        {
          label: 'Towing Capacity',
          value: formatSpec(vehicle.towingCapacity, 'lbs'),
        },
      ],
    },
    {
      title: 'Interior & Comfort',
      rows: [
        {
          label: 'Seating Capacity',
          value: formatSpec(vehicle.seatingCapacity),
        },
        { label: 'Display Size', value: vehicle.displaySize ?? 'N/A' },
        {
          label: 'Rear Display',
          value:
            vehicle.hasRearDisplay == null
              ? 'N/A'
              : vehicle.hasRearDisplay
                ? 'Yes'
                : 'No',
        },
        { label: 'Sound System', value: vehicle.soundSystem ?? 'N/A' },
      ],
    },
    {
      title: 'Safety & Autopilot',
      rows: [
        {
          label: 'NCAP Rating',
          value: vehicle.ncapRating ? `${vehicle.ncapRating}/5` : 'N/A',
        },
        { label: 'Autopilot', value: vehicle.autopilotStandard ?? 'N/A' },
        {
          label: 'FSD Available',
          value:
            vehicle.fsdAvailable == null
              ? 'N/A'
              : vehicle.fsdAvailable
                ? 'Yes'
                : 'No',
        },
      ],
    },
    {
      title: 'Efficiency',
      rows: [
        {
          label: 'Energy Consumption',
          value: formatSpec(vehicle.energyConsumption, 'Wh/mi'),
        },
        { label: 'MPGe', value: formatSpec(vehicle.mpge) },
      ],
    },
  ];
}

export function SpecTable({ vehicle }: SpecTableProps) {
  const sections = getSpecSections(vehicle);

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-4 font-mono text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">{section.title}</h3>
          <div className="overflow-hidden rounded-xl border border-line">
            {section.rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3.5 sm:px-5 ${
                  i % 2 === 0 ? 'bg-background' : 'bg-card'
                }`}
              >
                <span className="text-[15px] text-ink-2">{row.label}</span>
                <span className="text-[15px] font-medium text-foreground">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
