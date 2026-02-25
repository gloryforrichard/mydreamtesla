/**
 * Pre-defined popular comparisons for homepage, sitemap, and internal linking
 * Each slug is a -vs- separated pair of vehicle slugs
 */
export const POPULAR_COMPARISONS = [
  {
    slug: 'model-3-2025-long-range-awd-vs-model-3-2025-performance-awd',
    label: 'Model 3 Long Range vs Performance',
    shortLabel: '3 LR vs 3 Perf',
    description: 'Range efficiency vs raw speed — the eternal Model 3 debate.',
  },
  {
    slug: 'model-3-2025-standard-range-plus-rwd-vs-model-3-2025-long-range-awd',
    label: 'Model 3 SR+ vs Long Range',
    shortLabel: '3 SR+ vs 3 LR',
    description: 'Is the range upgrade worth the extra cost?',
  },
  {
    slug: 'model-3-2024-long-range-awd-vs-model-3-2025-long-range-awd',
    label: '2024 vs 2025 Model 3 Long Range',
    shortLabel: '2024 vs 2025 3 LR',
    description: 'Year-over-year improvements on the Highland refresh.',
  },
  {
    slug: 'model-3-2024-performance-awd-vs-model-3-2025-performance-awd',
    label: '2024 vs 2025 Model 3 Performance',
    shortLabel: '2024 vs 2025 3 Perf',
    description: 'How the Performance trim evolved year over year.',
  },
  {
    slug: 'model-3-2017-long-range-rwd-vs-model-3-2025-long-range-awd',
    label: '2017 vs 2025 Model 3 Long Range',
    shortLabel: 'OG vs 2025 3 LR',
    description: 'Eight years of progress — the original vs the latest.',
  },
  {
    slug: 'model-3-2021-performance-awd-vs-model-3-2025-performance-awd',
    label: '2021 vs 2025 Model 3 Performance',
    shortLabel: '2021 vs 2025 3 Perf',
    description: 'Pre-Highland vs post-Highland Performance showdown.',
  },
  {
    slug: 'model-3-2023-standard-range-plus-rwd-vs-model-3-2025-standard-range-plus-rwd',
    label: '2023 vs 2025 Model 3 Standard Range',
    shortLabel: '2023 vs 2025 3 SR+',
    description:
      'The entry-level Model 3 before and after the Highland redesign.',
  },
  // ── Cross-model: Model 3 vs Model Y ──────────────────────────────────
  {
    slug: 'model-3-2025-long-range-awd-vs-model-y-2025-long-range-awd',
    label: 'Model 3 LR vs Model Y LR (2025)',
    shortLabel: '3 LR vs Y LR',
    description: 'The #1 Tesla comparison — sedan vs SUV, same platform.',
  },
  {
    slug: 'model-3-2025-performance-awd-vs-model-y-2025-performance-awd',
    label: 'Model 3 Perf vs Model Y Perf (2025)',
    shortLabel: '3 Perf vs Y Perf',
    description:
      'Performance sedan vs performance SUV — which is the better daily driver?',
  },
  // ── Within Model Y ────────────────────────────────────────────────────
  {
    slug: 'model-y-2025-standard-range-rwd-vs-model-y-2025-long-range-awd',
    label: 'Model Y SR vs Long Range (2025)',
    shortLabel: 'Y SR vs Y LR',
    description:
      'Is the range and AWD upgrade worth the extra cost on Model Y?',
  },
  {
    slug: 'model-y-2024-long-range-awd-vs-model-y-2025-long-range-awd',
    label: '2024 vs 2025 Model Y Long Range',
    shortLabel: '2024 vs 2025 Y LR',
    description: 'Pre-Juniper vs Juniper — the biggest Model Y refresh yet.',
  },
] as const;

/**
 * Get comparison URL from slug
 */
export function getCompareUrl(slug: string): string {
  return `/compare/${slug}`;
}
