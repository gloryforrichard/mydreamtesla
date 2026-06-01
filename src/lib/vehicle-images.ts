import { getVehicleGeneration } from '@/lib/vehicle-generations';

const MODEL_DETAIL_IMAGES: Record<string, string> = {
  'model-3': '/images/vehicles/studio/model-3-highland.jpg',
  'model-y': '/images/vehicles/studio/model-y-juniper.jpg',
  'model-s': '/images/vehicles/studio/model-s-refresh.jpg',
  'model-x': '/images/vehicles/studio/model-x-original.jpg',
  cybertruck: '/images/vehicles/studio/cybertruck-production.jpg',
};

export function getModelDetailImage(slug: string): string {
  return MODEL_DETAIL_IMAGES[slug] ?? `/images/vehicles/${slug}-detail.png`;
}

/**
 * Card thumbnail for the /models listing page.
 * Uses the latest-generation studio image for consistent model cards.
 */
const MODEL_CARD_IMAGES: Record<string, string> = {
  'model-3': '/images/vehicles/studio/model-3-highland.jpg',
  'model-y': '/images/vehicles/studio/model-y-juniper.jpg',
  'model-s': '/images/vehicles/studio/model-s-refresh.jpg',
  'model-x': '/images/vehicles/studio/model-x-original.jpg',
  cybertruck: '/images/vehicles/studio/cybertruck-production.jpg',
};

export function getModelCardImage(slug: string): string {
  return MODEL_CARD_IMAGES[slug] ?? `/images/vehicles/${slug}-tile.png`;
}

const VEHICLE_STUDIO_IMAGES: Record<string, Record<string, string>> = {
  'model-3': {
    Highland: '/images/vehicles/studio/model-3-highland.jpg',
    'Refresh / Chrome Delete': '/images/vehicles/studio/model-3-refresh.jpg',
    'Original / Chrome Trim': '/images/vehicles/studio/model-3-original.jpg',
  },
  'model-y': {
    Juniper: '/images/vehicles/studio/model-y-juniper.jpg',
    Original: '/images/vehicles/studio/model-y-original.jpg',
  },
  'model-s': {
    Refresh: '/images/vehicles/studio/model-s-refresh.jpg',
    Original: '/images/vehicles/studio/model-s-original.jpg',
  },
  'model-x': {
    Refresh: '/images/vehicles/studio/model-x-original.jpg',
    Original: '/images/vehicles/studio/model-x-original.jpg',
  },
  cybertruck: {
    Production: '/images/vehicles/studio/cybertruck-production.jpg',
  },
};

export function getVehicleStudioImage(
  modelSlug: string,
  year: number
): string | null {
  const generation = getVehicleGeneration(modelSlug, year);
  if (!generation) return MODEL_CARD_IMAGES[modelSlug] ?? null;

  return (
    VEHICLE_STUDIO_IMAGES[modelSlug]?.[generation.name] ??
    MODEL_CARD_IMAGES[modelSlug] ??
    null
  );
}

export function getStudioImageForVehicleSlug(
  vehicleSlug: string,
  year: number
): string | null {
  const modelSlug = resolveModelSlugFromVehicleSlug(vehicleSlug);
  if (!modelSlug) return null;

  return getVehicleStudioImage(modelSlug, year);
}

function resolveModelSlugFromVehicleSlug(vehicleSlug: string): string | null {
  if (vehicleSlug.startsWith('model-3-')) return 'model-3';
  if (vehicleSlug.startsWith('model-y-')) return 'model-y';
  if (vehicleSlug.startsWith('model-s-')) return 'model-s';
  if (vehicleSlug.startsWith('model-x-')) return 'model-x';
  if (vehicleSlug.startsWith('cybertruck')) return 'cybertruck';

  return null;
}
