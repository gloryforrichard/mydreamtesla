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

const VEHICLE_NAME_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Standard Range Plus/g, 'SR+'],
  [/Standard Range/g, 'SR'],
  [/Long Range Plus/g, 'LR+'],
  [/Long Range/g, 'LR'],
  [/Rear-Wheel Drive/g, 'RWD'],
  [/All-Wheel Drive/g, 'AWD'],
  [/Foundation Series/g, 'Foundation'],
];

type SeoVehicleFields = Pick<
  Vehicle,
  | 'title'
  | 'rangeEPA'
  | 'acceleration060'
  | 'basePriceMSRP'
  | 'seoTitle'
  | 'seoDescription'
>;

function normalizeVehicleName(
  title: string,
  {
    includeYear = false,
    includeBrand = false,
  }: { includeYear?: boolean; includeBrand?: boolean } = {}
): string {
  let name = title.replace(/\s+/g, ' ').trim();

  if (!includeYear) {
    name = name.replace(/^\d{4}\s+/, '');
  }

  if (!includeBrand) {
    name = name.replace(/^(\d{4}\s+)?Tesla\s+/, '$1');
  }

  for (const [pattern, replacement] of VEHICLE_NAME_REPLACEMENTS) {
    name = name.replace(pattern, replacement);
  }

  return name;
}

export function getShortVehicleName(
  title: string,
  options?: { includeYear?: boolean; includeBrand?: boolean }
): string {
  return normalizeVehicleName(title, options);
}

export function buildVehicleSeoTitle(vehicle: SeoVehicleFields): string {
  const name = getShortVehicleName(vehicle.title, {
    includeYear: true,
    includeBrand: true,
  });

  return `${name} Specs, Range & Price`;
}

export function buildVehicleSeoDescription(vehicle: SeoVehicleFields): string {
  const name = getShortVehicleName(vehicle.title, {
    includeYear: true,
    includeBrand: true,
  });
  const specs = [
    vehicle.rangeEPA != null && `${vehicle.rangeEPA} mi range`,
    vehicle.acceleration060 && `${vehicle.acceleration060}s 0-60`,
    vehicle.basePriceMSRP != null &&
      `${formatPrice(vehicle.basePriceMSRP)} MSRP`,
  ].filter(Boolean);

  if (specs.length === 0) {
    return `${name} specs, range, pricing, and performance details.`;
  }

  return `${name}: ${specs.join(', ')}. Compare charging, dimensions, cargo, and related trims.`;
}

export function buildCompareSeoTitle(vehicles: SeoVehicleFields[]): string {
  const names = vehicles.map((vehicle) =>
    getShortVehicleName(vehicle.title, { includeYear: false })
  );

  return `${names.join(' vs ')} | Specs`;
}

export function buildCompareSeoDescription(
  vehicles: SeoVehicleFields[]
): string {
  const [a, b] = vehicles;
  const names = vehicles.map((vehicle) =>
    getShortVehicleName(vehicle.title, { includeYear: false })
  );
  const accelerationA = a.acceleration060 ? `${a.acceleration060}s` : 'N/A';
  const accelerationB = b.acceleration060 ? `${b.acceleration060}s` : 'N/A';

  return `Compare ${names.join(' vs ')}: range ${a.rangeEPA ?? 'N/A'} vs ${b.rangeEPA ?? 'N/A'} mi, 0-60 ${accelerationA} vs ${accelerationB}, price ${formatPrice(a.basePriceMSRP)} vs ${formatPrice(b.basePriceMSRP)}.`;
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

/**
 * Calculate a vehicle rating (1-5) based on key specs.
 * Used for Review schema to display star ratings in SERP.
 */
export function calculateVehicleRating(vehicle: Vehicle): number {
  let totalScore = 0;
  let weightSum = 0;

  // Range score (weight 3): 400mi = 5.0
  if (vehicle.rangeEPA) {
    const rangeScore = Math.min((vehicle.rangeEPA / 400) * 5, 5);
    totalScore += rangeScore * 3;
    weightSum += 3;
  }

  // Performance score (weight 2): 2s 0-60 = 5.0, 6s = 2.1
  if (vehicle.acceleration060) {
    const acc = Number.parseFloat(vehicle.acceleration060);
    const perfScore = Math.min(Math.max(6.4 - acc * 0.7, 1), 5);
    totalScore += perfScore * 2;
    weightSum += 2;
  }

  // Value score (weight 2): range per $10k spent
  if (vehicle.rangeEPA && vehicle.basePriceMSRP) {
    const valueRatio = vehicle.rangeEPA / (vehicle.basePriceMSRP / 10000);
    const valueScore = Math.min((valueRatio / 80) * 5, 5);
    totalScore += valueScore * 2;
    weightSum += 2;
  }

  if (weightSum === 0) return 4.0;

  const raw = totalScore / weightSum;
  return Math.round(Math.max(3.5, Math.min(4.9, raw)) * 10) / 10;
}

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
