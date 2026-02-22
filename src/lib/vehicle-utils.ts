/**
 * Format a price in cents to USD string
 * e.g., 38990 → "$38,990"
 */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format a spec value with unit
 * e.g., formatSpec(341, 'mi') → "341 mi"
 */
export function formatSpec(
  value: number | string | null | undefined,
  unit?: string,
): string {
  if (value == null) return 'N/A'
  const formatted = typeof value === 'number'
    ? new Intl.NumberFormat('en-US').format(value)
    : value
  return unit ? `${formatted} ${unit}` : formatted
}

/**
 * Format acceleration value
 * e.g., "2.9" → "2.9s"
 */
export function formatAcceleration(value: string | null | undefined): string {
  if (value == null) return 'N/A'
  return `${value}s`
}

/**
 * Determine best value from array of numbers
 * Returns index of the best value, or -1 if all equal
 * higherIsBetter: true for range, hp, etc. false for price, 0-60 time
 */
export function getBestValueIndex(
  values: (number | null | undefined)[],
  higherIsBetter: boolean,
): number {
  const validValues = values.map((v, i) => ({ value: v, index: i }))
    .filter((v) => v.value != null) as { value: number; index: number }[]

  if (validValues.length < 2) return -1

  const allEqual = validValues.every((v) => v.value === validValues[0].value)
  if (allEqual) return -1

  const best = higherIsBetter
    ? validValues.reduce((a, b) => (a.value > b.value ? a : b))
    : validValues.reduce((a, b) => (a.value < b.value ? a : b))

  return best.index
}

/**
 * Generate a comparison slug from vehicle slugs
 * e.g., ["model-3-2025-lr", "model-3-2024-lr"] → "model-3-2025-lr-vs-model-3-2024-lr"
 */
export function generateCompareSlug(vehicleSlugs: string[]): string {
  return vehicleSlugs.join('-vs-')
}

/**
 * Vehicle type inferred from DB schema
 */
export type Vehicle = {
  id: number
  title: string
  slug: string
  modelId: number
  year: number
  trimName: string
  driveType: string
  basePriceMSRP: number | null
  destinationFee: number | null
  federalTaxCredit: number | null
  effectivePrice: number | null
  rangeEPA: number | null
  acceleration060: string | null
  topSpeed: number | null
  horsepower: number | null
  torque: number | null
  quarterMile: string | null
  batteryCapacity: string | null
  batteryType: string | null
  superchargerRateMax: number | null
  chargingTime1050: string | null
  onboardCharger: string | null
  chargePort: string | null
  length: string | null
  width: string | null
  height: string | null
  wheelbase: string | null
  curbWeight: number | null
  groundClearance: string | null
  cargoVolume: string | null
  frunkVolume: string | null
  towingCapacity: number | null
  seatingCapacity: number | null
  displaySize: string | null
  hasRearDisplay: boolean | null
  soundSystem: string | null
  wheelOptions: string[] | null
  colorOptions: string[] | null
  ncapRating: number | null
  autopilotStandard: string | null
  fsdAvailable: boolean | null
  fsdPrice: number | null
  energyConsumption: number | null
  mpge: number | null
  prosAndCons: { pros: string[]; cons: string[] } | null
  keyChangesFromPriorYear: string | null
  seoTitle: string | null
  seoDescription: string | null
  isCurrentModel: boolean | null
  discontinuedDate: string | null
  lastUpdated: Date | null
  createdAt: Date | null
}

export type TeslaModel = {
  id: number
  name: string
  slug: string
  tagline: string | null
  description: string | null
  bodyType: string
  productionStart: number | null
  productionEnd: number | null
  isActive: boolean | null
  sortOrder: number | null
  seoTitle: string | null
  seoDescription: string | null
  createdAt: Date | null
  updatedAt: Date | null
}
