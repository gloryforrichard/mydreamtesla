'use client';

import { useRegion } from '@/contexts/region-context';
import { formatRegionSpecValue, getRegionSpecMeta } from '@/lib/vehicle-region';
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

function getSpecSections(vehicle: Vehicle, region: 'US' | 'CA'): SpecSection[] {
  const perfRange = getRegionSpecMeta(vehicle, 'rangeEPA', region);
  const perfAccel = getRegionSpecMeta(vehicle, 'acceleration', region);
  const perfTopSpeed = getRegionSpecMeta(vehicle, 'topSpeed', region);
  const perfHp = getRegionSpecMeta(vehicle, 'horsepower', region);
  const supercharger = getRegionSpecMeta(
    vehicle,
    'superchargerRateMax',
    region
  );

  const length = getRegionSpecMeta(vehicle, 'length', region);
  const width = getRegionSpecMeta(vehicle, 'width', region);
  const height = getRegionSpecMeta(vehicle, 'height', region);
  const wheelbase = getRegionSpecMeta(vehicle, 'wheelbase', region);
  const curbWeight = getRegionSpecMeta(vehicle, 'curbWeight', region);
  const groundClearance = getRegionSpecMeta(vehicle, 'groundClearance', region);
  const cargoVolume = getRegionSpecMeta(vehicle, 'cargoVolume', region);
  const frunkVolume = getRegionSpecMeta(vehicle, 'frunkVolume', region);
  const towingCapacity = getRegionSpecMeta(vehicle, 'towingCapacity', region);

  const basePrice = getRegionSpecMeta(vehicle, 'basePriceMSRP', region);
  const destinationFee = getRegionSpecMeta(vehicle, 'destinationFee', region);
  const taxCredit = getRegionSpecMeta(vehicle, 'federalTaxCredit', region);
  const effectivePrice = getRegionSpecMeta(vehicle, 'effectivePrice', region);
  const energy = getRegionSpecMeta(vehicle, 'energyConsumption', region);

  return [
    {
      title: 'Performance',
      rows: [
        {
          label: perfRange.label,
          value: formatRegionSpecValue(vehicle, 'rangeEPA', region),
        },
        {
          label: perfAccel.label,
          value: formatRegionSpecValue(vehicle, 'acceleration', region),
        },
        {
          label: perfTopSpeed.label,
          value: formatRegionSpecValue(vehicle, 'topSpeed', region),
        },
        {
          label: perfHp.label,
          value: formatRegionSpecValue(vehicle, 'horsepower', region),
        },
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
          label: supercharger.label,
          value: formatRegionSpecValue(vehicle, 'superchargerRateMax', region),
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
        {
          label: length.label,
          value: formatRegionSpecValue(vehicle, 'length', region),
        },
        {
          label: width.label,
          value: formatRegionSpecValue(vehicle, 'width', region),
        },
        {
          label: height.label,
          value: formatRegionSpecValue(vehicle, 'height', region),
        },
        {
          label: wheelbase.label,
          value: formatRegionSpecValue(vehicle, 'wheelbase', region),
        },
        {
          label: curbWeight.label,
          value: formatRegionSpecValue(vehicle, 'curbWeight', region),
        },
        {
          label: groundClearance.label,
          value: formatRegionSpecValue(vehicle, 'groundClearance', region),
        },
        {
          label: cargoVolume.label,
          value: formatRegionSpecValue(vehicle, 'cargoVolume', region),
        },
        {
          label: frunkVolume.label,
          value: formatRegionSpecValue(vehicle, 'frunkVolume', region),
        },
        {
          label: towingCapacity.label,
          value: formatRegionSpecValue(vehicle, 'towingCapacity', region),
        },
      ],
    },
    /* Pricing section hidden for now */
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
        /* FSD Price hidden for now */
      ],
    },
    {
      title: 'Efficiency',
      rows: [
        {
          label: energy.label,
          value: formatRegionSpecValue(vehicle, 'energyConsumption', region),
        },
        { label: 'MPGe', value: formatSpec(vehicle.mpge) },
      ],
    },
  ];
}

export function SpecTable({ vehicle }: SpecTableProps) {
  const { region } = useRegion();
  const sections = getSpecSections(vehicle, region);

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#999999]">{section.title}</h3>
          <div className="overflow-hidden rounded-sm border border-[#E5E2DC]">
            {section.rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3 ${
                  i % 2 === 0 ? 'bg-background' : 'bg-[#F5F2ED]'
                }`}
              >
                <span className="text-sm text-muted-foreground">
                  {row.label}
                </span>
                <span className="text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
