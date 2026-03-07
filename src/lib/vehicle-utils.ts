/**
 * Format a price in cents to USD string
 * e.g., 38990 → "$38,990"
 */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format a spec value with unit
 * e.g., formatSpec(341, 'mi') → "341 mi"
 */
export function formatSpec(
  value: number | string | null | undefined,
  unit?: string
): string {
  if (value == null) return 'N/A';
  const formatted =
    typeof value === 'number'
      ? new Intl.NumberFormat('en-US').format(value)
      : value;
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format acceleration value
 * e.g., "2.9" → "2.9s"
 */
export function formatAcceleration(value: string | null | undefined): string {
  if (value == null) return 'N/A';
  return `${value}s`;
}

/**
 * Determine best value from array of numbers
 * Returns index of the best value, or -1 if all equal
 * higherIsBetter: true for range, hp, etc. false for price, 0-60 time
 */
export function getBestValueIndex(
  values: (number | null | undefined)[],
  higherIsBetter: boolean
): number {
  const validValues = values
    .map((v, i) => ({ value: v, index: i }))
    .filter((v) => v.value != null) as { value: number; index: number }[];

  if (validValues.length < 2) return -1;

  const allEqual = validValues.every((v) => v.value === validValues[0].value);
  if (allEqual) return -1;

  const best = higherIsBetter
    ? validValues.reduce((a, b) => (a.value > b.value ? a : b))
    : validValues.reduce((a, b) => (a.value < b.value ? a : b));

  return best.index;
}

/**
 * Generate a comparison slug from vehicle slugs
 * e.g., ["model-3-2025-lr", "model-3-2024-lr"] → "model-3-2025-lr-vs-model-3-2024-lr"
 */
export function generateCompareSlug(vehicleSlugs: string[]): string {
  return vehicleSlugs.join('-vs-');
}

/**
 * Parse a comparison slug back into vehicle slugs
 * e.g., "model-3-2025-long-range-awd-vs-model-3-2025-performance-awd" → ["model-3-2025-long-range-awd", "model-3-2025-performance-awd"]
 */
export function parseCompareSlug(slug: string): string[] {
  return slug.split('-vs-');
}

/**
 * Spec comparison config: defines which specs to compare and their display metadata
 */
export const COMPARISON_SPEC_CONFIG = [
  // Performance
  {
    group: 'Performance',
    key: 'acceleration060',
    label: '0–60 mph',
    unit: 's',
    higherIsBetter: false,
    isNumericString: true,
  },
  {
    group: 'Performance',
    key: 'topSpeed',
    label: 'Top Speed',
    unit: 'mph',
    higherIsBetter: true,
  },
  {
    group: 'Performance',
    key: 'horsepower',
    label: 'Horsepower',
    unit: 'hp',
    higherIsBetter: true,
  },
  {
    group: 'Performance',
    key: 'torque',
    label: 'Torque',
    unit: 'lb-ft',
    higherIsBetter: true,
  },
  {
    group: 'Performance',
    key: 'quarterMile',
    label: 'Quarter Mile',
    unit: 's',
    higherIsBetter: false,
    isNumericString: true,
  },
  {
    group: 'Performance',
    key: 'driveType',
    label: 'Drive Type',
    unit: '',
    higherIsBetter: null,
  },
  // Battery & Charging
  {
    group: 'Battery & Charging',
    key: 'rangeKm',
    label: 'Range',
    unit: 'km',
    higherIsBetter: true,
  },
  {
    group: 'Battery & Charging',
    key: 'batteryCapacity',
    label: 'Battery',
    unit: 'kWh',
    higherIsBetter: true,
    isNumericString: true,
  },
  {
    group: 'Battery & Charging',
    key: 'superchargerRateMax',
    label: 'Supercharger Max',
    unit: 'kW',
    higherIsBetter: true,
  },
  {
    group: 'Battery & Charging',
    key: 'chargingTime1050',
    label: '10→50% Time',
    unit: '',
    higherIsBetter: null,
  },
  // Dimensions
  {
    group: 'Dimensions & Weight',
    key: 'length',
    label: 'Length',
    unit: 'in',
    higherIsBetter: null,
    isNumericString: true,
  },
  {
    group: 'Dimensions & Weight',
    key: 'width',
    label: 'Width',
    unit: 'in',
    higherIsBetter: null,
    isNumericString: true,
  },
  {
    group: 'Dimensions & Weight',
    key: 'height',
    label: 'Height',
    unit: 'in',
    higherIsBetter: null,
    isNumericString: true,
  },
  {
    group: 'Dimensions & Weight',
    key: 'curbWeight',
    label: 'Curb Weight',
    unit: 'lbs',
    higherIsBetter: false,
  },
  {
    group: 'Dimensions & Weight',
    key: 'cargoVolume',
    label: 'Cargo Volume',
    unit: 'cu ft',
    higherIsBetter: true,
    isNumericString: true,
  },
  {
    group: 'Dimensions & Weight',
    key: 'seatingCapacity',
    label: 'Seating',
    unit: '',
    higherIsBetter: true,
  },
  // Pricing
  {
    group: 'Pricing',
    key: 'basePriceMSRP',
    label: 'Base MSRP',
    unit: '$',
    higherIsBetter: false,
    isCurrency: true,
  },
  {
    group: 'Pricing',
    key: 'federalTaxCredit',
    label: 'Tax Credit',
    unit: '$',
    higherIsBetter: true,
    isCurrency: true,
  },
  {
    group: 'Pricing',
    key: 'effectivePrice',
    label: 'Effective Price',
    unit: '$',
    higherIsBetter: false,
    isCurrency: true,
  },
  // Efficiency
  {
    group: 'Efficiency',
    key: 'mpge',
    label: 'MPGe',
    unit: '',
    higherIsBetter: true,
  },
  {
    group: 'Efficiency',
    key: 'energyConsumption',
    label: 'Energy Use',
    unit: 'Wh/mi',
    higherIsBetter: false,
  },
] as const;

/**
 * Vehicle type inferred from DB schema
 */
export type Vehicle = {
  id: number;
  title: string;
  slug: string;
  modelId: number;
  year: number;
  trimName: string;
  driveType: string;
  basePriceMSRP: number | null;
  destinationFee: number | null;
  federalTaxCredit: number | null;
  effectivePrice: number | null;
  rangeEPA: number | null;
  rangeKm: number | null;
  acceleration060: string | null;
  topSpeed: number | null;
  horsepower: number | null;
  torque: number | null;
  quarterMile: string | null;
  batteryCapacity: string | null;
  batteryType: string | null;
  superchargerRateMax: number | null;
  chargingTime1050: string | null;
  onboardCharger: string | null;
  chargePort: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  wheelbase: string | null;
  curbWeight: number | null;
  groundClearance: string | null;
  cargoVolume: string | null;
  frunkVolume: string | null;
  towingCapacity: number | null;
  seatingCapacity: number | null;
  displaySize: string | null;
  hasRearDisplay: boolean | null;
  soundSystem: string | null;
  wheelOptions: string[] | null;
  colorOptions: string[] | null;
  ncapRating: number | null;
  autopilotStandard: string | null;
  fsdAvailable: boolean | null;
  fsdPrice: number | null;
  energyConsumption: number | null;
  mpge: number | null;
  prosAndCons: { pros: string[]; cons: string[] } | null;
  keyChangesFromPriorYear: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isCurrentModel: boolean | null;
  regionNote: string | null;
  discontinuedDate: string | null;
  lastUpdated: Date | null;
  createdAt: Date | null;
};

export type TeslaModel = {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  bodyType: string;
  productionStart: number | null;
  productionEnd: number | null;
  isActive: boolean | null;
  sortOrder: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
