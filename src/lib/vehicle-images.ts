const MODEL_DETAIL_IMAGES: Record<string, string> = {
  'model-3': '/images/vehicles/model-3-detail.jpg',
  'model-y': '/images/vehicles/model-y-detail.jpg',
};

export function getModelDetailImage(slug: string): string {
  return MODEL_DETAIL_IMAGES[slug] ?? `/images/vehicles/${slug}-detail.png`;
}

/**
 * Card thumbnail for the /models listing page.
 * Uses the "original" generation image (clean, no background).
 */
const MODEL_CARD_IMAGES: Record<string, string> = {
  'model-3': '/images/vehicles/generations/model-3-original.webp',
  'model-y': '/images/vehicles/generations/model-y-original.webp',
};

export function getModelCardImage(slug: string): string {
  return MODEL_CARD_IMAGES[slug] ?? `/images/vehicles/${slug}-tile.png`;
}
