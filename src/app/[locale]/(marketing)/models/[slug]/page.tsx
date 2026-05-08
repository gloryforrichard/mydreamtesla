import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import {
  getModelBySlug,
  getVehiclesForModel,
  getAllModelSlugs,
} from '@/lib/db/queries';
import { ModelVehiclesByGeneration } from '@/components/tesla/model-vehicles-by-generation';
import { ModelVehiclesByGenerationInteractive } from '@/components/tesla/model-vehicles-by-generation-interactive';
import { VehicleImage } from '@/components/tesla/vehicle-image';
import { JsonLd } from '@/components/seo/json-ld';
import {
  buildItemListJsonLd,
  buildBreadcrumbJsonLd,
  buildFAQPageJsonLd,
} from '@/lib/seo/structured-data';
import { getBaseUrl } from '@/lib/urls/urls';
import { constructMetadata, getOgImageUrl } from '@/lib/metadata';
import { getModelDetailImage } from '@/lib/vehicle-images';
import { MODEL_FAQS } from '@/config/model-faqs';
import { websiteConfig } from '@/config/website';
import Link from 'next/link';

export async function generateStaticParams() {
  const models = await getAllModelSlugs();
  const locales = Object.keys(websiteConfig.i18n.locales);
  return models.flatMap((m) =>
    locales.map((locale) => ({ locale, slug: m.slug }))
  );
}

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const MODEL_META_OVERRIDES: Record<
  string,
  { seoTitle?: string; seoDescription?: string }
> = {
  'model-s': {
    seoDescription:
      'Tesla Model S AWD and Plaid specs, pricing, range, and performance.',
  },
  'model-x': {
    seoDescription:
      'Tesla Model X AWD and Plaid specs, pricing, range, towing, and seating.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const model = await getModelBySlug(slug);
  if (!model) return {};

  const vehicles = await getVehiclesForModel(model.id);
  const years = [...new Set(vehicles.map((v) => v.year))];
  const startYear =
    years.length > 0 ? Math.min(...years) : (model.productionStart ?? 2017);
  const endYear = years.length > 0 ? Math.max(...years) : 2025;
  const trimCount = new Set(vehicles.map((v) => v.trimName)).size;
  const ranges = vehicles
    .map((v) => v.rangeEPA)
    .filter((r): r is number => r != null);
  const minRange = ranges.length > 0 ? Math.min(...ranges) : null;
  const maxRange = ranges.length > 0 ? Math.max(...ranges) : null;

  const modelMeta = MODEL_META_OVERRIDES[slug];
  const title =
    modelMeta?.seoTitle ??
    model.seoTitle ??
    `Tesla ${model.name} Specs by Year (${startYear}–${endYear}) — Compare All Trims`;
  const rangeText =
    minRange && maxRange ? ` Range from ${minRange} to ${maxRange} mi.` : '';
  const description =
    modelMeta?.seoDescription ??
    model.seoDescription ??
    `Every Tesla ${model.name} from ${startYear} to ${endYear} compared — ${trimCount} trims, ${years.length} model years.${rangeText} Find your perfect ${model.name}.`;

  const ogImage = getOgImageUrl({
    title: `Tesla ${model.name}`,
    subtitle: model.tagline ?? 'All years and trims compared',
    type: 'model',
  });

  return constructMetadata({
    title,
    description,
    image: ogImage,
    locale: locale as Locale,
    pathname: `/models/${slug}`,
  });
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) notFound();

  const vehicles = await getVehiclesForModel(model.id);
  const baseUrl = getBaseUrl();

  const vehicleListItems = vehicles.map((v, i) => ({
    name: v.title,
    url: `${baseUrl}/vehicles/${v.slug}`,
    position: i + 1,
  }));

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Models', href: '/models' },
    { name: `Tesla ${model.name}` },
  ];

  const faqs = MODEL_FAQS[model.slug];

  return (
    <>
      {vehicles.length > 0 && (
        <JsonLd
          data={buildItemListJsonLd(
            vehicleListItems,
            `Tesla ${model.name} Vehicles`
          )}
        />
      )}
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      {faqs && faqs.length > 0 && <JsonLd data={buildFAQPageJsonLd(faqs)} />}

      {/* Hero — warm white, consistent with homepage */}
      <section className="bg-background pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex items-center gap-1.5 text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-border-muted">
                  ›
                </span>
                <Link
                  href="/models"
                  className="transition-colors hover:text-foreground"
                >
                  Models
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-border-muted">
                  ›
                </span>
                <span className="text-secondary-text">Tesla {model.name}</span>
              </li>
            </ol>
          </nav>

          {/* Title */}
          <p className="text-[13px] font-medium uppercase tracking-[0.5px] text-muted-foreground">
            {model.bodyType}
            {model.productionStart && ` · Since ${model.productionStart}`}
          </p>
          <h1 className="mt-2 font-display text-[32px] font-bold leading-[1.05] tracking-[-1.5px] text-foreground sm:text-[48px] md:text-[56px]">
            Tesla {model.name}
          </h1>
          {model.tagline && (
            <p className="mt-3 text-lg font-light text-secondary-text sm:text-[21px]">
              {model.tagline}
            </p>
          )}
          {model.description && (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {model.description}
            </p>
          )}

          {/* Vehicle image */}
          <div className="mt-10 overflow-hidden rounded-sm bg-card">
            <VehicleImage
              src={getModelDetailImage(model.slug)}
              alt={`Tesla ${model.name}`}
              width={1200}
              height={600}
              className="h-auto w-full object-contain p-8"
              fallbackClassName="flex h-[280px] w-full items-center justify-center"
              fallbackLabel={model.name}
              priority
            />
          </div>
        </div>
      </section>

      {/* Trim listings — light background */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ModelVehiclesByGenerationInteractive
          vehicles={vehicles}
          modelSlug={model.slug}
          modelName={model.name}
        >
          <ModelVehiclesByGeneration
            vehicles={vehicles}
            modelSlug={model.slug}
            modelName={model.name}
          />
        </ModelVehiclesByGenerationInteractive>

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[24px] font-bold tracking-[-0.5px] text-foreground mb-6 sm:text-[28px]">
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
      </main>
    </>
  );
}
