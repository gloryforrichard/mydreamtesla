import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getVehicleBySlug, getAllModels, getVehiclesForModel } from '@/lib/db/queries'
import { KeySpecsGrid } from '@/components/tesla/key-specs-grid'
import { SpecTable } from '@/components/tesla/spec-table'
import { ProsAndCons } from '@/components/tesla/pros-and-cons'
import { DataDisclaimer } from '@/components/tesla/data-disclaimer'
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav'
import { JsonLd } from '@/components/seo/json-ld'
import { buildCarJsonLd } from '@/lib/seo/structured-data'
import { formatPrice, generateCompareSlug } from '@/lib/vehicle-utils'
import { getOgImageUrl } from '@/lib/metadata'
import { AdSensePlacement } from '@/components/ads/adsense-placement'
import { RelatedContent } from '@/components/tesla/related-content'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) return {}

  const title = vehicle.seoTitle ?? `${vehicle.title} Specs & Review | MyDreamTesla`
  const description =
    vehicle.seoDescription ??
    `Complete specifications for the ${vehicle.title}. Range: ${vehicle.rangeEPA ?? 'N/A'} mi, 0-60: ${vehicle.acceleration060 ?? 'N/A'}s, Price: ${formatPrice(vehicle.basePriceMSRP)}.`

  const ogImage = getOgImageUrl({
    title: vehicle.title,
    subtitle: `Range: ${vehicle.rangeEPA ?? 'N/A'} mi · ${formatPrice(vehicle.basePriceMSRP)}`,
    type: 'vehicle',
  })

  return {
    title,
    description,
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) notFound()

  // Resolve model + sibling vehicles
  const allModels = await getAllModels()
  const model = allModels.find((m) => m.id === vehicle.modelId)
  const modelName = model?.name ?? 'Tesla'

  const siblings = model ? await getVehiclesForModel(model.id) : []
  const otherTrims = siblings.filter((v) => v.id !== vehicle.id).slice(0, 4)

  // Build related items for internal linking
  const relatedItems = [
    ...otherTrims.map((other) => ({
      label: `${vehicle.title} vs ${other.title}`,
      href: `/compare/${generateCompareSlug([vehicle.slug, other.slug])}`,
    })),
    ...otherTrims.map((other) => ({
      label: `View ${other.title}`,
      href: `/vehicles/${other.slug}`,
    })),
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={buildCarJsonLd(vehicle, modelName)} />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Models', href: '/models' },
          ...(model ? [{ label: `Tesla ${model.name}`, href: `/models/${model.slug}` }] : []),
          { label: vehicle.title },
        ]}
      />

      {/* Hero */}
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {vehicle.title}
        </h1>
        <p className="mt-4 text-3xl font-bold text-blue-600">
          {formatPrice(vehicle.basePriceMSRP)}
        </p>
        {vehicle.federalTaxCredit && (
          <p className="mt-1 text-sm text-green-600">
            After ${vehicle.federalTaxCredit.toLocaleString()} federal tax credit:{' '}
            <span className="font-semibold">{formatPrice(vehicle.effectivePrice)}</span>
          </p>
        )}
      </div>

      {/* Key Specs */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Key Specifications</h2>
        <KeySpecsGrid vehicle={vehicle} />
      </section>

      {/* What's New */}
      {vehicle.keyChangesFromPriorYear && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">What&apos;s New</h2>
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6">
            <p className="text-sm leading-relaxed text-blue-900">
              {vehicle.keyChangesFromPriorYear}
            </p>
          </div>
        </section>
      )}

      {/* Full Specs */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Full Specifications</h2>
        <SpecTable vehicle={vehicle} />
      </section>

      {/* Pros & Cons */}
      {vehicle.prosAndCons && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Pros & Cons</h2>
          <ProsAndCons prosAndCons={vehicle.prosAndCons} />
        </section>
      )}

      {/* Ad placement */}
      <AdSensePlacement format="leaderboard" slot="vehicle-detail-1" className="my-8" />

      {/* Data Disclaimer */}
      <DataDisclaimer lastUpdated={vehicle.lastUpdated} />

      {/* Related: compare with other trims */}
      {relatedItems.length > 0 && (
        <RelatedContent
          title="Compare with other trims."
          subtitle={`See how the ${vehicle.title} stacks up.`}
          items={relatedItems}
        />
      )}
    </main>
  )
}
