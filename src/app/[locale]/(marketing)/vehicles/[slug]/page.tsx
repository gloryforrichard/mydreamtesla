import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getVehicleBySlug } from '@/lib/db/queries'
import { KeySpecsGrid } from '@/components/tesla/key-specs-grid'
import { SpecTable } from '@/components/tesla/spec-table'
import { ProsAndCons } from '@/components/tesla/pros-and-cons'
import { DataDisclaimer } from '@/components/tesla/data-disclaimer'
import { formatPrice } from '@/lib/vehicle-utils'
import Link from 'next/link'
import { ChevronRightIcon } from 'lucide-react'

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

  return { title, description }
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRightIcon className="size-3.5" />
        <Link href="/models" className="hover:text-foreground">Models</Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="text-foreground">{vehicle.title}</span>
      </nav>

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

      {/* Data Disclaimer */}
      <DataDisclaimer lastUpdated={vehicle.lastUpdated} />
    </div>
  )
}
