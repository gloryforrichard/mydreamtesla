import { getVehicleGeneration } from '@/lib/vehicle-generations';

export type VehicleAngle = 'front' | 'front-angle' | 'side' | 'rear';

export const ANGLE_LABELS: Record<VehicleAngle, string> = {
  front: 'Front',
  'front-angle': 'Front ¾',
  side: 'Side',
  rear: 'Rear',
};

export const ANGLES: VehicleAngle[] = [
  'front',
  'front-angle',
  'side',
  'rear',
];

export const DEFAULT_ANGLE: VehicleAngle = 'front-angle';

/**
 * Maps generation name → photo year prefix used in file names.
 * Only Model 3 has multi-angle photos for now.
 */
const ANGLE_PHOTO_CONFIG: Record<
  string,
  Record<string, string>
> = {
  'model-3': {
    'Original / Chrome Trim': '2019',
    'Refresh / Chrome Delete': '2021',
    Highland: '2025',
  },
};

export interface AnglePhoto {
  angle: VehicleAngle;
  label: string;
  src: string;
}

/**
 * Returns angle photos for a vehicle, or null if not available.
 */
export function getAnglePhotos(
  modelSlug: string,
  year: number,
): AnglePhoto[] | null {
  const genMap = ANGLE_PHOTO_CONFIG[modelSlug];
  if (!genMap) return null;

  const generation = getVehicleGeneration(modelSlug, year);
  if (!generation) return null;

  const photoYear = genMap[generation.name];
  if (!photoYear) return null;

  return ANGLES.map((angle) => ({
    angle,
    label: ANGLE_LABELS[angle],
    src: `/images/vehicles/angles/${modelSlug}/${photoYear}-${angle}.png`,
  }));
}
