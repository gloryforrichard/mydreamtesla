import type { Metadata } from 'next'
import Link from 'next/link'
import { getRepresentativeVehicles, getSiteCounts } from '@/lib/db/queries'
import { formatPrice, formatAcceleration, formatSpec } from '@/lib/vehicle-utils'
import { POPULAR_COMPARISONS, getCompareUrl } from '@/config/comparisons'
import { JsonLd } from '@/components/seo/json-ld'
import {
	buildWebSiteJsonLd,
	buildOrganizationJsonLd,
	buildItemListJsonLd,
} from '@/lib/seo/structured-data'
import { getBaseUrl } from '@/lib/urls/urls'

export const metadata: Metadata = {
	title: 'MyDreamTesla — Every Tesla. Every Year. Compared.',
	description:
		'The most comprehensive Tesla vehicle database. Compare specs, pricing, and performance across every model year and trim — all in one place.',
}

export default async function HomePage() {
	const [modelData, counts] = await Promise.all([
		getRepresentativeVehicles(),
		getSiteCounts(),
	])

	const baseUrl = getBaseUrl()
	const modelListItems = modelData.map((m, i) => ({
		name: `Tesla ${m.model.name}`,
		url: `${baseUrl}/models/${m.model.slug}`,
		position: i + 1,
	}))

	return (
		<main>
			<JsonLd data={buildWebSiteJsonLd()} />
			<JsonLd data={buildOrganizationJsonLd()} />
			{modelData.length > 0 && (
				<JsonLd
					data={buildItemListJsonLd(modelListItems, 'Tesla Model Lineup')}
				/>
			)}

			{/* Hero — dark */}
			<section className="bg-[#1D1D1F] px-4 pb-24 pt-36 text-center text-white sm:pb-28 sm:pt-40">
				<p className="text-[17px] font-normal text-[#86868B]">
					MyDreamTesla
				</p>
				<h1 className="mt-2 text-5xl font-bold leading-[1.05] tracking-[-3px] sm:text-[64px]">
					Find Your
					<br />
					Perfect Tesla.
				</h1>
				<p className="mx-auto mt-4 max-w-[500px] text-[21px] font-light leading-relaxed text-[#86868B]">
					Every model. Every year. Every spec.
					<br />
					Compared side by side.
				</p>
				<div className="mt-8 flex items-center justify-center gap-8">
					<Link
						href="/models"
						className="text-[17px] font-normal text-white transition-colors hover:text-[#D2D2D7]"
					>
						Browse models ›
					</Link>
					<Link
						href={getCompareUrl(POPULAR_COMPARISONS[0].slug)}
						className="text-[17px] font-normal text-[#2997FF] transition-colors hover:underline"
					>
						Compare now ›
					</Link>
				</div>
				{/* Hero image placeholder */}
				<div className="mx-auto mt-14 flex h-[400px] max-w-[800px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#2A2A2D] to-[#3A3A3D]">
					<span className="text-[120px] font-extrabold tracking-[-4px] text-white/[0.06]">
						TESLA
					</span>
				</div>
			</section>

			{/* Model Tiles — 2×2 grid */}
			<section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 p-3 sm:grid-cols-2">
				{modelData.map((item, idx) => {
					const isDark = idx % 2 === 1
					const v = item.vehicle
					return (
						<Link
							key={item.model.id}
							href={`/models/${item.model.slug}`}
							className={`flex min-h-[520px] flex-col items-center overflow-hidden rounded-[20px] px-10 pt-14 text-center ${
								isDark
									? 'bg-[#1D1D1F] text-white'
									: 'bg-[#F5F5F7] text-[#1D1D1F]'
							}`}
						>
							<p className="text-[14px] font-medium uppercase tracking-[0.5px] text-[#86868B]">
								{item.model.bodyType}
							</p>
							<h2 className="mt-1 text-[40px] font-bold tracking-[-1.5px]">
								{item.model.name}
							</h2>
							<p
								className={`mt-2 text-[17px] font-light ${
									isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'
								}`}
							>
								{item.model.tagline ?? 'Explore all trims.'}
							</p>

							{/* Quick specs */}
							{v && (
								<div className="mt-4 flex gap-8">
									{v.rangeEPA && (
										<div>
											<div
												className={`font-mono text-[16px] font-semibold ${
													isDark ? 'text-white' : 'text-[#1D1D1F]'
												}`}
											>
												{formatSpec(v.rangeEPA, 'mi')}
											</div>
											<div className="mt-0.5 text-[11px] text-[#86868B]">
												Range
											</div>
										</div>
									)}
									{v.acceleration060 && (
										<div>
											<div
												className={`font-mono text-[16px] font-semibold ${
													isDark ? 'text-white' : 'text-[#1D1D1F]'
												}`}
											>
												{formatAcceleration(v.acceleration060)}
											</div>
											<div className="mt-0.5 text-[11px] text-[#86868B]">
												0-60 mph
											</div>
										</div>
									)}
									{v.basePriceMSRP && (
										<div>
											<div
												className={`font-mono text-[16px] font-semibold ${
													isDark ? 'text-white' : 'text-[#1D1D1F]'
												}`}
											>
												{formatPrice(v.basePriceMSRP)}
											</div>
											<div className="mt-0.5 text-[11px] text-[#86868B]">
												From
											</div>
										</div>
									)}
								</div>
							)}

							{/* Tile links */}
							<div className="mt-4 flex gap-6">
								<span
									className={`text-[14px] ${
										isDark ? 'text-[#2997FF]' : 'text-[#1D1D1F]'
									}`}
								>
									Explore ›
								</span>
								<span
									className={`text-[14px] ${
										isDark ? 'text-[#2997FF]' : 'text-[#1D1D1F]'
									}`}
								>
									Compare trims ›
								</span>
							</div>

							{/* Image placeholder */}
							<div
								className={`mt-auto flex h-[240px] w-[400px] items-center justify-center rounded-t-xl ${
									isDark
										? 'bg-gradient-to-br from-[#2A2A2D] to-[#3A3A3D]'
										: 'bg-gradient-to-br from-[#E8E8ED] to-[#D2D2D7]'
								}`}
							>
								<span
									className={`text-[80px] font-extrabold tracking-[-3px] ${
										isDark ? 'text-white/[0.06]' : 'text-black/[0.06]'
									}`}
								>
									{item.model.name.replace('Model ', '')}
								</span>
							</div>
						</Link>
					)
				})}
			</section>

			{/* Compare Section */}
			<section className="px-4 py-24 text-center">
				<h2 className="text-[48px] font-bold tracking-[-2px]">
					Compare head to head.
				</h2>
				<p className="mt-2 text-[21px] font-light text-[#6E6E73]">
					The matchups people search for most.
				</p>
				<div className="mx-auto mt-12 grid max-w-[1024px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
					{POPULAR_COMPARISONS.map((comp) => (
						<Link
							key={comp.slug}
							href={getCompareUrl(comp.slug)}
							className="rounded-[20px] bg-[#F5F5F7] p-8 text-left transition-transform hover:scale-[1.02]"
						>
							<div className="flex items-center justify-center gap-3">
								<div className="flex h-[52px] w-[80px] items-center justify-center rounded-lg bg-[#E8E8ED]">
									<span className="text-[20px] font-extrabold text-[#C4C4C9]">
										{comp.shortLabel.split(' vs ')[0]}
									</span>
								</div>
								<span className="text-[11px] font-semibold tracking-[1px] text-[#86868B]">
									VS
								</span>
								<div className="flex h-[52px] w-[80px] items-center justify-center rounded-lg bg-[#E8E8ED]">
									<span className="text-[20px] font-extrabold text-[#C4C4C9]">
										{comp.shortLabel.split(' vs ')[1]}
									</span>
								</div>
							</div>
							<p className="mt-4 text-center text-[13px] font-semibold">
								{comp.label}
							</p>
							<p className="mt-5 text-center text-[14px] text-[#1D1D1F]">
								Full comparison ›
							</p>
						</Link>
					))}
				</div>
			</section>

			{/* Stats — dark */}
			<section className="bg-[#1D1D1F] px-4 py-24 text-center">
				<h2 className="text-[48px] font-bold tracking-[-2px] text-white">
					Tesla by the numbers.
				</h2>
				<p className="mt-2 text-[21px] font-light text-[#86868B]">
					Every specification, every trim, every year.
				</p>
				<div className="mx-auto mt-16 grid max-w-[900px] grid-cols-2 gap-0 sm:grid-cols-4">
					{[
						{ num: `${counts.modelCount}+`, label: 'Models' },
						{ num: `${counts.vehicleCount}+`, label: 'Trims' },
						{ num: '150+', label: 'Specs' },
						{ num: `${counts.yearCount}`, label: 'Model years' },
					].map((stat, i) => (
						<div
							key={stat.label}
							className={`px-6 py-8 ${
								i < 3
									? 'border-r border-white/[0.08] sm:border-r'
									: ''
							} ${i === 1 ? 'sm:border-r' : ''}`}
						>
							<div className="font-mono text-[56px] font-bold leading-none tracking-[-3px] text-white">
								{stat.num}
							</div>
							<div className="mt-2 text-[14px] text-[#86868B]">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="bg-[#F5F5F7] px-4 py-24 text-center">
				<h2 className="text-[48px] font-bold tracking-[-2px]">
					Ready to compare?
				</h2>
				<p className="mt-3 text-[21px] font-light text-[#6E6E73]">
					Find the Tesla that fits your life.
				</p>
				<Link
					href="/models"
					className="mt-7 inline-flex items-center rounded-full bg-[#1D1D1F] px-6 py-3 text-[15px] font-normal text-white transition-colors hover:bg-[#424245]"
				>
					Start comparing
				</Link>
			</section>
		</main>
	)
}
