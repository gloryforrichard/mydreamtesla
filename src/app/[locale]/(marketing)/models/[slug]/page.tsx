import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getModelBySlug, getVehiclesForModel } from '@/lib/db/queries'
import { VehicleCard } from '@/components/tesla/vehicle-card'
import Link from 'next/link'
import { ChevronRightIcon } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const model = await getModelBySlug(slug)
  if (!model) return {}

  return {
    title: model.seoTitle ?? `Tesla ${model.name} — All Years & Trims | MyDreamTesla`,
    description:
      model.seoDescription ??
      `Compare every Tesla ${model.name} trim and model year. View specs, pricing, range, and performance data.`,
  }
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params
  const model = await getModelBySlug(slug)

  if (!model) notFound()

  const vehicles = await getVehiclesForModel(model.id)

  // Group vehicles by year (immutable reduce)
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRightIcon className="size-3.5" />
        <Link href="/models" className="hover:text-foreground">Models</Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="text-foreground">Tesla {model.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {model.bodyType}
          {model.productionStart && ` · Since ${model.productionStart}`}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Tesla {model.name}
        </h1>
        {model.tagline && (
          <p className="mt-3 text-lg text-muted-foreground">{model.tagline}</p>
        )}
        {model.description && (
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {model.description}
          </p>
        )}
      </div>

      {/* Vehicles by Year */}
      {years.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">{year} Lineup</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehiclesByYear[year].map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      ))}

      {vehicles.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p>No vehicles available for this model yet. Coming soon.</p>
        </div>
      )}
    </div>
  )
}
