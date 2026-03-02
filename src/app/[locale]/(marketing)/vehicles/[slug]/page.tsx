import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getVehicleBySlug,
  getAllModels,
  getVehiclesForModel,
} from '@/lib/db/queries';
import { KeySpecsGrid } from '@/components/tesla/key-specs-grid';
import { SpecTable } from '@/components/tesla/spec-table';
import { ProsAndCons } from '@/components/tesla/pros-and-cons';
import { DataDisclaimer } from '@/components/tesla/data-disclaimer';
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav';
import { JsonLd } from '@/components/seo/json-ld';
import { buildCarJsonLd } from '@/lib/seo/structured-data';
import { formatPrice, generateCompareSlug } from '@/lib/vehicle-utils';
import { getOgImageUrl } from '@/lib/metadata';
import { generateAlternates } from '@/lib/hreflang';
import { RelatedContent } from '@/components/tesla/related-content';
import { VehicleImage } from '@/components/tesla/vehicle-image';
import { VehicleRegionNotice } from '@/components/tesla/vehicle-region-notice';
import { getVehicleGeneration } from '@/lib/vehicle-generations';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};

  const title =
    vehicle.seoTitle ?? `${vehicle.title} Specs & Review | MyDreamTesla`;
  const description =
    vehicle.seoDescription ??
    `Complete specifications for the ${vehicle.title}. Range: ${vehicle.rangeEPA ?? 'N/A'} mi, 0-60: ${vehicle.acceleration060 ?? 'N/A'}s.`;

  const ogImage = getOgImageUrl({
    title: vehicle.title,
    subtitle: `Range: ${vehicle.rangeEPA ?? 'N/A'} mi · 0-60: ${vehicle.acceleration060 ?? 'N/A'}s`,
    type: 'vehicle',
  });

  return {
    title,
    description,
    alternates: generateAlternates(`/vehicles/${slug}`),
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const allModels = await getAllModels();
  const model = allModels.find((m) => m.id === vehicle.modelId);
  const modelName = model?.name ?? 'Tesla';

  const siblings = model ? await getVehiclesForModel(model.id) : [];
  const otherTrims = siblings.filter((v) => v.id !== vehicle.id).slice(0, 4);

  const generation = model
    ? getVehicleGeneration(model.slug, vehicle.year)
    : null;
  const vehicleImage =
    generation?.image ?? `/images/vehicles/${vehicle.slug}.png`;

  const relatedItems = [
    ...otherTrims.map((other) => ({
      label: `${vehicle.title} vs ${other.title}`,
      href: `/compare/${generateCompareSlug([vehicle.slug, other.slug])}`,
    })),
    ...otherTrims.map((other) => ({
      label: `View ${other.title}`,
      href: `/vehicles/${other.slug}`,
    })),
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={buildCarJsonLd(vehicle, modelName)} />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Models', href: '/models' },
          ...(model
            ? [{ label: `Tesla ${model.name}`, href: `/models/${model.slug}` }]
            : []),
          { label: vehicle.title },
        ]}
      />

      {/* Hero */}
      <header className="mb-12 mt-4">
        <p className="text-[14px] font-medium uppercase tracking-[0.5px] text-[#999999]">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h1 className="mt-2 font-display text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-[#1A1A1A] sm:text-[48px]">
          {vehicle.title}
        </h1>
        {/* Price hidden for now */}
        <VehicleRegionNotice vehicle={vehicle} />
        <div className="mt-8 overflow-hidden rounded-sm bg-[#F5F2ED]">
          <VehicleImage
            src={vehicleImage}
            alt={vehicle.title}
            width={1000}
            height={500}
            className="h-auto w-full mix-blend-multiply object-contain p-6"
            fallbackClassName="flex h-[280px] w-full items-center justify-center"
            fallbackLabel={String(vehicle.year)}
            priority
          />
        </div>
      </header>

      {/* Key Specs */}
      <section className="mb-12">
        <h2 className="mb-6 text-[28px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Key Specifications
        </h2>
        <KeySpecsGrid vehicle={vehicle} />
      </section>

      {/* What's New */}
      {vehicle.keyChangesFromPriorYear && (
        <section className="mb-12">
          <h2 className="mb-4 text-[28px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
            What&apos;s New
          </h2>
          <div className="rounded-sm bg-[#F5F2ED] p-6">
            <p className="text-[15px] leading-relaxed text-[#1A1A1A]">
              {vehicle.keyChangesFromPriorYear}
            </p>
          </div>
        </section>
      )}

      {/* Full Specs */}
      <section className="mb-12">
        <h2 className="mb-6 text-[28px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Full Specifications
        </h2>
        <SpecTable vehicle={vehicle} />
      </section>

      {/* Pros & Cons */}
      {vehicle.prosAndCons && (
        <section className="mb-12">
          <h2 className="mb-6 text-[28px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
            Pros & Cons
          </h2>
          <ProsAndCons prosAndCons={vehicle.prosAndCons} />
        </section>
      )}

      <DataDisclaimer lastUpdated={vehicle.lastUpdated} />

      {relatedItems.length > 0 && (
        <RelatedContent
          title="Compare with other trims."
          subtitle={`See how the ${vehicle.title} stacks up.`}
          items={relatedItems}
        />
      )}
    </main>
  );
}
