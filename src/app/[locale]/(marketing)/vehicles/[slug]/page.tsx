import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getVehicleBySlug,
  getAllModels,
  getVehiclesForModel,
  getAllVehicleSlugs,
} from '@/lib/db/queries';
import { KeySpecsGrid } from '@/components/tesla/key-specs-grid';
import { SpecTable } from '@/components/tesla/spec-table';
import { ProsAndCons } from '@/components/tesla/pros-and-cons';
import { DataDisclaimer } from '@/components/tesla/data-disclaimer';
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav';
import { JsonLd } from '@/components/seo/json-ld';
import {
  buildCarJsonLd,
  buildVehicleReviewJsonLd,
} from '@/lib/seo/structured-data';
import { formatPrice, generateCompareSlug } from '@/lib/vehicle-utils';
import { getOgImageUrl } from '@/lib/metadata';
import { generateAlternates } from '@/lib/hreflang';
import { websiteConfig } from '@/config/website';
import { RelatedContent } from '@/components/tesla/related-content';
import { VehicleImage } from '@/components/tesla/vehicle-image';
import { VehicleAngleViewer } from '@/components/tesla/vehicle-angle-viewer';
import { getVehicleGeneration } from '@/lib/vehicle-generations';
import { getAnglePhotos } from '@/lib/vehicle-angles';
import { VEHICLE_FAQS } from '@/config/vehicle-faqs';
import { buildFAQPageJsonLd } from '@/lib/seo/structured-data';
import { MODEL_BLOG_LINKS } from '@/config/vehicle-blog-links';
import { blogSource } from '@/lib/source';

export async function generateStaticParams() {
  const vehicles = await getAllVehicleSlugs();
  const locales = Object.keys(websiteConfig.i18n.locales);
  return vehicles.flatMap((v) =>
    locales.map((locale) => ({ locale, slug: v.slug }))
  );
}

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};

  const range = vehicle.rangeEPA;
  const price = vehicle.basePriceMSRP
    ? `$${Number(vehicle.basePriceMSRP).toLocaleString()}`
    : null;
  const specs = [range && `${range}mi`, price].filter(Boolean).join(', ');
  const title =
    vehicle.seoTitle ??
    `${vehicle.title}${specs ? ` — ${specs}` : ''} | MDT`;
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  const description =
    vehicle.seoDescription ??
    `${vehicle.title}: ${range ?? 'N/A'} mi range, ${vehicle.acceleration060 ?? 'N/A'}s 0-60, ${price ?? 'N/A'} MSRP. Full specs + pros/cons + how it compares to other trims. Updated ${month} 2025.`;

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
  const anglePhotos = model
    ? getAnglePhotos(model.slug, vehicle.year)
    : null;

  // Related blog articles for this model
  const blogSlugs = model ? (MODEL_BLOG_LINKS[model.slug] ?? []) : [];
  const allBlogPages = blogSource.getPages('en');
  const relatedArticles = blogSlugs
    .map((slug) => allBlogPages.find((p) => p.slugs[0] === slug))
    .filter((p): p is NonNullable<typeof p> => p != null && p.data.published)
    .map((p) => ({
      label: p.data.title,
      href: `/blog/${p.slugs.join('/')}`,
    }));

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

  const faqs = VEHICLE_FAQS[vehicle.slug];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={buildCarJsonLd(vehicle, modelName)} />
      <JsonLd data={buildVehicleReviewJsonLd(vehicle)} />
      {faqs && faqs.length > 0 && <JsonLd data={buildFAQPageJsonLd(faqs)} />}
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
        <p className="text-[14px] font-medium uppercase tracking-[0.5px] text-muted-foreground">
          {vehicle.year} · {vehicle.driveType}
        </p>
        <h1 className="mt-2 font-display text-[32px] font-bold leading-[1.05] tracking-[-1.5px] text-foreground sm:text-[40px] md:text-[48px]">
          {vehicle.title}
        </h1>
        <p className="mt-3 font-mono text-[15px] tracking-tight text-secondary-text sm:text-[17px]">
          {[
            vehicle.rangeEPA && `${vehicle.rangeEPA} mi`,
            vehicle.acceleration060 && `${vehicle.acceleration060}s`,
            vehicle.basePriceMSRP &&
              `From $${Number(vehicle.basePriceMSRP).toLocaleString()}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {anglePhotos ? (
          <div className="mt-8">
            <VehicleAngleViewer photos={anglePhotos} alt={vehicle.title} />
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-sm bg-card">
            <VehicleImage
              src={vehicleImage}
              alt={vehicle.title}
              width={1000}
              height={500}
              className="h-auto w-full mix-blend-multiply object-contain p-6 dark:mix-blend-normal"
              fallbackClassName="flex h-[280px] w-full items-center justify-center"
              fallbackLabel={String(vehicle.year)}
              priority
            />
          </div>
        )}
      </header>

      {/* Key Specs */}
      <section className="mb-12">
        <h2 className="mb-6 text-[24px] font-bold tracking-[-0.5px] text-foreground sm:text-[28px]">
          Key Specifications
        </h2>
        <KeySpecsGrid vehicle={vehicle} />
      </section>

      {/* What's New */}
      {vehicle.keyChangesFromPriorYear && (
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold tracking-[-0.5px] text-foreground sm:text-[28px]">
            What&apos;s New
          </h2>
          <div className="rounded-sm bg-card p-6">
            <p className="text-[15px] leading-relaxed text-foreground">
              {vehicle.keyChangesFromPriorYear}
            </p>
          </div>
        </section>
      )}

      {/* Full Specs */}
      <section className="mb-12">
        <h2 className="mb-6 text-[24px] font-bold tracking-[-0.5px] text-foreground sm:text-[28px]">
          Full Specifications
        </h2>
        <SpecTable vehicle={vehicle} />
      </section>

      {/* Pros & Cons */}
      {vehicle.prosAndCons && (
        <section className="mb-12">
          <h2 className="mb-6 text-[24px] font-bold tracking-[-0.5px] text-foreground sm:text-[28px]">
            Pros & Cons
          </h2>
          <ProsAndCons prosAndCons={vehicle.prosAndCons} />
        </section>
      )}

      <DataDisclaimer lastUpdated={vehicle.lastUpdated} />

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-[24px] font-bold tracking-[-0.5px] text-foreground sm:text-[28px]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-sm border border-border"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-[15px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[15px] leading-relaxed text-secondary-text">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {relatedItems.length > 0 && (
        <RelatedContent
          title="Compare with other trims."
          subtitle={`See how the ${vehicle.title} stacks up.`}
          items={relatedItems}
        />
      )}

      {relatedArticles.length > 0 && (
        <RelatedContent
          title="Related Articles"
          subtitle={`Guides and comparisons for the Tesla ${modelName}.`}
          items={relatedArticles}
        />
      )}
    </main>
  );
}
