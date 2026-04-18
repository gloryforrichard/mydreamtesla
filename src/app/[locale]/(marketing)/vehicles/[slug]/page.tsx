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
  const batteryCapacity =
    vehicle.batteryCapacity != null
      ? `${Number(vehicle.batteryCapacity).toLocaleString('en-US', {
          maximumFractionDigits: 1,
        })} kWh battery`
      : null;
  const specHighlights = [
    range && `${range} mi range`,
    vehicle.acceleration060 && `${vehicle.acceleration060}s 0-60`,
    price && `${price} MSRP`,
  ].filter(Boolean);
  const detailHighlights = [
    vehicle.horsepower && `${vehicle.horsepower} hp`,
    batteryCapacity,
  ].filter(Boolean);
  const title =
    vehicle.seoTitle ??
    `${vehicle.year} ${vehicle.title} Specs, Range & Price | MDT`;
  const description =
    vehicle.seoDescription ??
    [
      `${vehicle.year} ${vehicle.title} specs${
        specHighlights.length > 0 ? `: ${specHighlights.join(', ')}` : '.'
      }`,
      detailHighlights.length > 0 ? `${detailHighlights.join(', ')}.` : null,
      'See charging, dimensions, cargo, FAQs, and related trim comparisons on MyDreamTesla.',
    ]
      .filter(Boolean)
      .join(' ');

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
  const anglePhotos = model ? getAnglePhotos(model.slug, vehicle.year) : null;

  // Related blog articles for this model
  const blogSlugs = model ? (MODEL_BLOG_LINKS[model.slug] ?? []) : [];
  const allBlogPages = blogSource.getPages('en');
  const relatedArticles = blogSlugs
    .map((slug) => allBlogPages.find((p) => p.slugs[0] === slug))
    .filter((p): p is NonNullable<typeof p> => !!p?.data.published)
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
    <main className="mx-auto max-w-[1400px] px-8 py-12">
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

      {/* Hero — 2-column layout */}
      <header className="mb-16 mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* Left: Image */}
        <div>
          {anglePhotos ? (
            <VehicleAngleViewer photos={anglePhotos} alt={vehicle.title} />
          ) : (
            <div className="overflow-hidden rounded-lg bg-paper">
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
        </div>

        {/* Right: Title + Key specs metadata */}
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
            {vehicle.year} · {vehicle.driveType}
          </p>
          <h1 className="mt-3 font-display text-[36px] font-bold leading-[1.05] tracking-[-1.5px] text-foreground sm:text-[44px] md:text-[52px]">
            {vehicle.title}
          </h1>

          {/* Stats row — large font-display numbers */}
          <div className="mt-8 flex flex-wrap gap-8">
            {vehicle.rangeEPA && (
              <div>
                <p className="font-display text-[40px] font-bold leading-none tracking-[-1px] text-foreground sm:text-[48px]">
                  {vehicle.rangeEPA}
                  <span className="ml-1 text-[18px] font-medium text-ink-3 sm:text-[20px]">mi</span>
                </p>
                <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
                  EPA Range
                </p>
              </div>
            )}
            {vehicle.acceleration060 && (
              <div>
                <p className="font-display text-[40px] font-bold leading-none tracking-[-1px] text-foreground sm:text-[48px]">
                  {vehicle.acceleration060}
                  <span className="ml-1 text-[18px] font-medium text-ink-3 sm:text-[20px]">s</span>
                </p>
                <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
                  0-60 mph
                </p>
              </div>
            )}
            {vehicle.basePriceMSRP && (
              <div>
                <p className="font-display text-[40px] font-bold leading-none tracking-[-1px] text-foreground sm:text-[48px]">
                  ${Number(vehicle.basePriceMSRP).toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
                  Starting MSRP
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Key Specs */}
      <section className="mb-14">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
          Overview
        </p>
        <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.5px] text-foreground sm:text-[30px]">
          Key Specifications
        </h2>
        <div className="mt-6">
          <KeySpecsGrid vehicle={vehicle} />
        </div>
      </section>

      {/* What's New */}
      {vehicle.keyChangesFromPriorYear && (
        <section className="mb-14">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
            Updates
          </p>
          <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.5px] text-foreground sm:text-[30px]">
            What&apos;s New
          </h2>
          <div className="mt-4 rounded-lg border border-line bg-paper p-6">
            <p className="text-[15px] leading-relaxed text-foreground">
              {vehicle.keyChangesFromPriorYear}
            </p>
          </div>
        </section>
      )}

      {/* Full Specs */}
      <section className="mb-14">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
          Details
        </p>
        <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.5px] text-foreground sm:text-[30px]">
          Full Specifications
        </h2>
        <div className="mt-6">
          <SpecTable vehicle={vehicle} />
        </div>
      </section>

      {/* Pros & Cons */}
      {vehicle.prosAndCons && (
        <section className="mb-14">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
            Analysis
          </p>
          <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.5px] text-foreground sm:text-[30px]">
            Pros & Cons
          </h2>
          <div className="mt-6">
            <ProsAndCons prosAndCons={vehicle.prosAndCons} />
          </div>
        </section>
      )}

      <DataDisclaimer lastUpdated={vehicle.lastUpdated} />

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="mb-14">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
            Questions
          </p>
          <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.5px] text-foreground sm:text-[30px]">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-line bg-paper"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-[15px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-ink-3 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-2">
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
