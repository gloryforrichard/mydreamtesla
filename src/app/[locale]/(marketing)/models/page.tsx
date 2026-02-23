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
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-[#1D1D1F] sm:text-[48px]">
          Tesla Models
        </h1>
        <p className="mt-4 text-[21px] font-light text-[#6E6E73]">
          Explore every Tesla vehicle. Compare specs across all model years and trims.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {models.length === 0 && (
        <div className="py-20 text-center text-[#86868B]">
          <p>No models available yet. Check back soon.</p>
        </div>
      )}
    </main>
  )
}
