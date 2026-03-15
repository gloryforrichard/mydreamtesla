/**
 * Mapping from model slug to related blog post slugs.
 * Used on vehicle detail pages to show "Related Articles".
 */
export const MODEL_BLOG_LINKS: Record<string, string[]> = {
  'model-3': [
    'tesla-model-3-highland-changes',
    'model-3-long-range-vs-performance',
    'tesla-model-3-vs-model-y-2025',
    'tesla-model-s-vs-model-3',
    'cheapest-tesla-2025',
  ],
  'model-y': [
    'tesla-model-y-juniper-changes',
    'model-y-trim-comparison-2025',
    'tesla-model-3-vs-model-y-2025',
    'tesla-model-y-seating-guide',
    'best-tesla-for-families-2025',
    'tesla-model-y-compact-prototype',
  ],
  'model-s': [
    'tesla-model-s-vs-model-3',
    'tesla-autopilot-vs-fsd',
  ],
  'model-x': [
    'tesla-model-x-vs-cybertruck',
    'best-tesla-for-families-2025',
    'tesla-autopilot-vs-fsd',
  ],
  'cybertruck': [
    'tesla-model-x-vs-cybertruck',
    'tesla-autopilot-vs-fsd',
  ],
};
