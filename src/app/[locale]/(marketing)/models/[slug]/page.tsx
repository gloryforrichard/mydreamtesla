import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getModelBySlug, getVehiclesForModel } from '@/lib/db/queries'
import { VehicleCard } from '@/components/tesla/vehicle-card'
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav'
import { JsonLd } from '@/components/seo/json-ld'
import { buildItemListJsonLd } from '@/lib/seo/structured-data'
import { getBaseUrl } from '@/lib/urls/urls'
import { getOgImageUrl } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const model = await getModelBySlug(slug)
  if (!model) return {}

  const title = model.seoTitle ?? `Tesla ${model.name} — All Years & Trims | MyDreamTesla`
  const description =
    model.seoDescription ??
    `Compare every Tesla ${model.name} trim and model year. View specs, pricing, range, and performance data.`

  const ogImage = getOgImageUrl({
    title: `Tesla ${model.name}`,
    subtitle: model.tagline ?? 'All years and trims compared',
    type: 'model',
  })

  return {
    title,
    description,
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params
  const model = await getModelBySlug(slug)

  if (!model) notFound()

  const vehicles = await getVehiclesForModel(model.id)
  const baseUrl = getBaseUrl()

  const vehiclesByYear = vehicles.reduce<Record<number, typeof vehicles>>(
    (acc, v) => {
      const yearVehicles = acc[v.year] ?? []
      return { ...acc, [v.year]: [...yearVehicles, v] }
    },
    {},
  )

  const years = Object.keys(vehiclesByYear)
    .map(Number)
    .sort((a, b) => b - a)

  const vehicleListItems = vehicles.map((v, i) => ({
    name: v.title,
    url: `${baseUrl}/vehicles/${v.slug}`,
    position: i + 1,
  }))

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {vehicles.length > 0 && (
        <JsonLd data={buildItemListJsonLd(vehicleListItems, `Tesla ${model.name} Vehicles`)} />
      )}
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Models', href: '/models' },
          { label: `Tesla ${model.name}` },
        ]}
      />

      {/* Hero */}
      <header className="mb-12 mt-4">
        <p className="text-[14px] font-medium uppercase tracking-[0.5px] text-[#86868B]">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h1 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-[#1D1D1F] sm:text-[48px]">
          Tesla {model.name}
        </h1>
        {model.tagline && (
          <p className="mt-3 text-[21px] font-light text-[#6E6E73]">{model.tagline}</p>
        )}
        {model.description && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#6E6E73]">
            {model.description}
          </p>
        )}
      </header>

      {/* Vehicles by Year */}
      {years.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="mb-6 text-[28px] font-bold tracking-[-0.5px] text-[#1D1D1F]">
            {year} Lineup
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehiclesByYear[year].map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      ))}

      {vehicles.length === 0 && (
        <div className="py-20 text-center text-[#86868B]">
          <p>No vehicles available for this model yet. Coming soon.</p>
        </div>
      )}
    </main>
  )
}
