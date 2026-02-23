import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getVehiclesBySlugList, getAllModels } from '@/lib/db/queries'
import { parseCompareSlug, formatPrice } from '@/lib/vehicle-utils'
import { ComparisonTable } from '@/components/tesla/comparison-table'
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav'
import { JsonLd } from '@/components/seo/json-ld'
import { buildItemListJsonLd } from '@/lib/seo/structured-data'
import { getBaseUrl } from '@/lib/urls/urls'
import { getOgImageUrl } from '@/lib/metadata'
import Link from 'next/link'
import { AdSensePlacement } from '@/components/ads/adsense-placement'

interface Props {
	params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const vehicleSlugs = parseCompareSlug(slug)
	const vehicles = await getVehiclesBySlugList(vehicleSlugs)

	if (vehicles.length < 2) return {}

	const names = vehicles.map((v) => v.title).join(' vs ')
	const ogImage = getOgImageUrl({
		title: names,
		subtitle: 'Side-by-Side Comparison',
		type: 'compare',
	})
	return {
		title: `${names} — Side-by-Side Comparison | MyDreamTesla`,
		description: `Compare ${names} specs, range, performance, and pricing side by side. Find which Tesla is right for you.`,
		openGraph: { images: [ogImage] },
		twitter: { card: 'summary_large_image', images: [ogImage] },
	}
}

export default async function ComparePage({ params }: Props) {
	const { slug } = await params
	const vehicleSlugs = parseCompareSlug(slug)
	const vehicles = await getVehiclesBySlugList(vehicleSlugs)

	if (vehicles.length < 2) notFound()

	const baseUrl = getBaseUrl()
	const allModels = await getAllModels()

	const names = vehicles.map((v) => v.title).join(' vs ')

	const listItems = vehicles.map((v, i) => ({
		name: v.title,
		url: `${baseUrl}/vehicles/${v.slug}`,
		position: i + 1,
	}))

	// Find best range, performance, value for verdict
	const bestRange = [...vehicles].sort((a, b) => (b.rangeEPA ?? 0) - (a.rangeEPA ?? 0))[0]
	const bestPower = [...vehicles].sort((a, b) => (b.horsepower ?? 0) - (a.horsepower ?? 0))[0]
	const bestValue = [...vehicles].sort((a, b) => (a.effectivePrice ?? Infinity) - (b.effectivePrice ?? Infinity))[0]

	return (
		<main>
			<JsonLd data={buildItemListJsonLd(listItems, names)} />

			{/* Breadcrumb */}
			<div className="mx-auto max-w-[980px] px-5 pt-16">
				<BreadcrumbNav
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Compare', href: '/models' },
						{ label: names },
					]}
				/>
			</div>

			{/* Hero */}
			<header className="mx-auto max-w-[980px] px-5 pb-12 text-center">
				<h1 className="text-[48px] font-bold leading-[1.08] tracking-[-2.5px] text-[#1D1D1F]">
					{vehicles.map((v, i) => (
						<span key={v.id}>
							{v.title}
							{i < vehicles.length - 1 && <br />}
							{i < vehicles.length - 1 && (
								<span className="text-[#86868B]">vs </span>
							)}
						</span>
					))}
				</h1>
				<p className="mx-auto mt-3 max-w-[560px] text-[19px] font-light leading-[1.4] text-[#6E6E73]">
					Side-by-side specs, pricing, and range compared — find the Tesla that fits your life.
				</p>
			</header>

			{/* Sticky vehicle header */}
			<div className="sticky top-12 z-40 border-b border-black/[0.06] bg-[rgba(251,251,253,0.88)] backdrop-blur-[20px] backdrop-saturate-[180%]">
				<div
					className="mx-auto max-w-[980px] px-5 py-4"
					style={{ display: 'grid', gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)` }}
				>
					<div />
					{vehicles.map((v) => {
						const model = allModels.find((m) => m.id === v.modelId)
						return (
							<div key={v.id} className="px-4 text-center">
								<div className="mx-auto mb-2.5 flex h-16 w-24 items-center justify-center rounded-xl bg-[#F5F5F7] text-2xl font-bold text-[#D2D2D7]">
									{model?.name.replace('Model ', '') ?? '?'}
								</div>
								<div className="text-[15px] font-semibold tracking-[-0.3px]">{v.title}</div>
								<div className="font-mono text-[13px] font-semibold">{formatPrice(v.basePriceMSRP)}</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Comparison table */}
			<div className="py-8">
				<ComparisonTable vehicles={vehicles} />
			</div>

			{/* Ad placement */}
			<AdSensePlacement format="in-article" slot="compare-1" className="my-4" />

			{/* Verdict */}
			<section className="bg-[#F5F5F7] py-20" aria-label="Comparison verdict">
				<div className="mx-auto max-w-[980px] px-5 text-center">
					<h2 className="text-[40px] font-bold tracking-[-2px]">Which should you buy?</h2>
					<p className="mt-2 text-[17px] font-light text-[#6E6E73]">
						How they compare on the dimensions that matter most.
					</p>

					<div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-5">
						<div className="rounded-[20px] bg-white p-8 text-center">
							<div className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">Best Range</div>
							<div className="text-[20px] font-bold tracking-[-0.5px]">{bestRange.title}</div>
							<div className="mt-1 text-[13px] text-[#6E6E73]">{bestRange.rangeEPA ?? 'N/A'} mi EPA</div>
						</div>
						<div className="rounded-[20px] bg-white p-8 text-center">
							<div className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">Most Powerful</div>
							<div className="text-[20px] font-bold tracking-[-0.5px]">{bestPower.title}</div>
							<div className="mt-1 text-[13px] text-[#6E6E73]">{bestPower.horsepower ?? 'N/A'} hp</div>
						</div>
						<div className="rounded-[20px] bg-white p-8 text-center">
							<div className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">Best Value</div>
							<div className="text-[20px] font-bold tracking-[-0.5px]">{bestValue.title}</div>
							<div className="mt-1 text-[13px] text-[#6E6E73]">{formatPrice(bestValue.effectivePrice)} after credit</div>
						</div>
					</div>
				</div>
			</section>

			{/* Related comparisons (internal linking for SEO) */}
			<section className="mx-auto max-w-[980px] px-5 py-20" aria-label="Related comparisons">
				<h2 className="text-[32px] font-bold tracking-[-1.5px]">More comparisons.</h2>
				<p className="mt-2 text-[17px] font-light text-[#6E6E73]">
					Explore other head-to-head matchups across the Tesla lineup.
				</p>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{vehicles.map((v) => (
						<Link
							key={v.id}
							href={`/vehicles/${v.slug}`}
							className="flex items-center justify-between rounded-2xl bg-[#F5F5F7] px-6 py-5 text-[14px] font-medium transition-colors hover:bg-[#EBEBED]"
						>
							<span>View {v.title} details</span>
							<span className="text-[#86868B]">›</span>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}
