/**
 * Pre-defined popular comparisons for homepage, sitemap, and internal linking
 * Each slug is a -vs- separated pair of vehicle slugs
 */
export const POPULAR_COMPARISONS = [
	{
		slug: 'model-3-2025-long-range-awd-vs-model-3-2025-performance-awd',
		label: 'Model 3 LR vs Model 3 Performance',
		shortLabel: '3 LR vs 3 Perf',
	},
	{
		slug: 'model-3-2025-standard-range-plus-rwd-vs-model-3-2025-long-range-awd',
		label: 'Model 3 SR+ vs Model 3 LR',
		shortLabel: '3 SR+ vs 3 LR',
	},
	{
		slug: 'model-3-2024-long-range-awd-vs-model-3-2025-long-range-awd',
		label: '2024 vs 2025 Model 3 LR',
		shortLabel: '2024 vs 2025 3 LR',
	},
] as const

/**
 * Get comparison URL from slug
 */
export function getCompareUrl(slug: string): string {
	return `/compare/${slug}`
}
