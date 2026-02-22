import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllModels } from '@/lib/db/queries'
import { ModelCard } from '@/components/tesla/model-card'
import { ArrowRightIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'MyDreamTesla — Every Tesla. Every Year. Compared.',
  description:
    'The most comprehensive Tesla vehicle database. Compare specs, pricing, and performance across every model year and trim — all in one place.',
}

export default async function HomePage() {
  const models = await getAllModels()

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Every Tesla.{' '}
          <span className="text-blue-600">Every Year.</span>{' '}
          Compared.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          The most comprehensive Tesla vehicle database. Compare specs, pricing,
          and performance across every model year and trim.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/models"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Browse Models
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      {/* Model Showcase */}
      {models.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Tesla Lineup
            </h2>
            <p className="mt-2 text-muted-foreground">
              Explore detailed specs for every Tesla model
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Find Your Perfect Tesla
          </h2>
          <p className="mt-3 text-muted-foreground">
            Compare specs side by side to make the best decision.
          </p>
          <Link
            href="/models"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start Comparing
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
