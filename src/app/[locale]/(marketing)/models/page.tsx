import type { Metadata } from 'next'
import { getAllModels } from '@/lib/db/queries'
import { ModelCard } from '@/components/tesla/model-card'

export const metadata: Metadata = {
  title: 'All Tesla Models | MyDreamTesla',
  description:
    'Browse every Tesla model ever made. Compare specs, pricing, and performance for Model 3, Model Y, Model S, Model X, Cybertruck, and more.',
}

export default async function ModelsPage() {
  const models = await getAllModels()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tesla Models
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore every Tesla vehicle. Compare specs across all model years and trims.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {models.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p>No models available yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
