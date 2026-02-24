import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllVehicles } from '@/lib/db/queries'
import { POPULAR_COMPARISONS, getCompareUrl } from '@/config/comparisons'
import { CompareBuilder } from '@/components/tesla/compare-builder'
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav'
import { getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = {
	title: 'Compare Tesla Vehicles Side by Side | MyDreamTesla',
	description:
		'Compare any two Tesla vehicles side by side. Specs, range, performance, and pricing — find the Tesla that fits your life.',
	openGraph: {
		images: [
			getOgImageUrl({
				title: 'Compare Any Tesla',
				subtitle: 'Side-by-Side Specs & Pricing',
				type: 'compare',
			}),
		],
	},
}

export default async function CompareIndexPage() {
	const { models, vehicles } = await getAllVehicles()

	return (
		<main>
			{/* Breadcrumb */}
			<div className="mx-auto max-w-[980px] px-5 pt-16">
				<BreadcrumbNav
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Compare' },
					]}
				/>
			</div>

			{/* Hero */}
			<header className="mx-auto max-w-[980px] px-5 pb-16 pt-4 text-center">
				<h1 className="text-[48px] font-bold leading-[1.08] tracking-[-2.5px] text-[#1D1D1F]">
					Compare any Tesla.
				</h1>
				<p className="mx-auto mt-3 max-w-[560px] text-[19px] font-light leading-[1.4] text-[#6E6E73]">
					Select two vehicles to see a detailed side-by-side breakdown of specs, range, performance, and pricing.
				</p>
			</header>

			{/* Comparison Builder */}
			<section className="bg-[#F5F5F7] py-16">
				<div className="mx-auto max-w-[980px] px-5">
					<h2 className="mb-8 text-center text-[28px] font-bold tracking-[-1px] text-[#1D1D1F]">
						Build your comparison
					</h2>
					<CompareBuilder models={models} vehicles={vehicles} />
				</div>
			</section>

			{/* Popular Comparisons */}
			<section className="mx-auto max-w-[980px] px-5 py-20">
				<h2 className="text-[32px] font-bold tracking-[-1.5px] text-[#1D1D1F]">
					Popular comparisons.
				</h2>
				<p className="mt-2 text-[17px] font-light text-[#6E6E73]">
					The matchups Tesla shoppers search for most.
				</p>

				<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{POPULAR_COMPARISONS.map((c) => (
						<Link
							key={c.slug}
							href={getCompareUrl(c.slug)}
							className="group flex flex-col justify-between rounded-2xl bg-[#F5F5F7] px-6 py-5 transition-colors hover:bg-[#EBEBED]"
						>
							<div>
								<div className="text-[17px] font-semibold tracking-[-0.3px] text-[#1D1D1F]">
									{c.label}
								</div>
								<p className="mt-1 text-[14px] font-light leading-[1.4] text-[#6E6E73]">
									{c.description}
								</p>
							</div>
							<div className="mt-4 text-[14px] font-medium text-[#1D1D1F]">
								Compare ›
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}
