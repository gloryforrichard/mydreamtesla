const MODEL_DETAIL_IMAGES: Record<string, string> = {
  'model-3': '/images/vehicles/model-3-detail.jpg',
};

export function getModelDetailImage(slug: string): string {
  return MODEL_DETAIL_IMAGES[slug] ?? `/images/vehicles/${slug}-detail.png`;
}
