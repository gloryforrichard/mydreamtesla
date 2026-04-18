import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVehiclesBySlugList, getAllModels } from '@/lib/db/queries';
import { parseCompareSlug, formatPrice } from '@/lib/vehicle-utils';
import { ComparePageContent } from '@/components/tesla/compare-page-content';
import { BreadcrumbNav } from '@/components/seo/breadcrumb-nav';
import { JsonLd } from '@/components/seo/json-ld';
import { buildItemListJsonLd } from '@/lib/seo/structured-data';
import { getBaseUrl } from '@/lib/urls/urls';
import { getOgImageUrl } from '@/lib/metadata';
import { generateAlternates } from '@/lib/hreflang';
import { POPULAR_COMPARISONS } from '@/config/comparisons';
import { websiteConfig } from '@/config/website';
import Link from 'next/link';

export async function generateStaticParams() {
  const locales = Object.keys(websiteConfig.i18n.locales);
  return POPULAR_COMPARISONS.flatMap((c) =>
    locales.map((locale) => ({ locale, slug: c.slug }))
  );
}

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicleSlugs = parseCompareSlug(slug);
  const vehicles = await getVehiclesBySlugList(vehicleSlugs);

  if (vehicles.length < 2) return {};

  const names = vehicles.map((v) => v.title).join(' vs ');
  const ogImage = getOgImageUrl({
    title: names,
    subtitle: 'Side-by-Side Comparison',
    type: 'compare',
  });
  const shortNames = vehicles
    .map((v) => v.title.replace(/^\d{4}\s+Tesla\s+/, ''))
    .join(' vs ');
  const [a, b] = vehicles;
  return {
    title: `${shortNames}: Range, Price & Speed Compared [2025]`,
    description: `${a.title} vs ${b.title} — which is better? Compare range (${a.rangeEPA ?? 'N/A'} vs ${b.rangeEPA ?? 'N/A'} mi), 0-60 (${a.acceleration060 ?? 'N/A'}s vs ${b.acceleration060 ?? 'N/A'}s), and price (${formatPrice(a.basePriceMSRP)} vs ${formatPrice(b.basePriceMSRP)}). Make the right choice.`,
    alternates: generateAlternates(`/compare/${slug}`),
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const vehicleSlugs = parseCompareSlug(slug);
  const vehicles = await getVehiclesBySlugList(vehicleSlugs);

  if (vehicles.length < 2) notFound();

  const baseUrl = getBaseUrl();
  const allModels = await getAllModels();

  const names = vehicles.map((v) => v.title).join(' vs ');

  const listItems = vehicles.map((v, i) => ({
    name: v.title,
    url: `${baseUrl}/vehicles/${v.slug}`,
    position: i + 1,
  }));

  return (
    <main>
      <JsonLd data={buildItemListJsonLd(listItems, names)} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-8 pt-16">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Compare', href: '/compare' },
            { label: names },
          ]}
        />
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-[1400px] px-8 pb-12 text-center">
        <h1 className="font-display text-[26px] font-bold leading-[1.08] tracking-[-2px] text-foreground sm:text-[36px] md:text-[48px]">
          {vehicles.map((v, i) => (
            <span key={v.id}>
              {v.title}
              {i < vehicles.length - 1 && <br />}
              {i < vehicles.length - 1 && (
                <span className="text-ink-3">vs </span>
              )}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-3 max-w-[560px] text-[17px] font-light leading-[1.4] text-ink-2 sm:text-[19px]">
          Side-by-side specs, pricing, and range compared — find the Tesla that
          fits your life.
        </p>
      </header>

      <ComparePageContent vehicles={vehicles} models={allModels} />

      {/* Related comparisons (internal linking for SEO) */}
      <section
        className="mx-auto max-w-[1400px] px-8 py-20"
        aria-label="Related comparisons"
      >
        <h2 className="font-display text-[28px] font-bold tracking-[-1.5px] text-foreground sm:text-[32px]">
          More comparisons.
        </h2>
        <p className="mt-2 text-[17px] font-light text-ink-2">
          Explore other head-to-head matchups across the Tesla lineup.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vehicles.map((v) => (
            <Link
              key={v.id}
              href={`/vehicles/${v.slug}`}
              className="flex items-center justify-between rounded-lg bg-paper px-5 py-4 text-[14px] font-medium transition-colors hover:bg-muted sm:px-6 sm:py-5"
            >
              <span>View {v.title} details</span>
              <span className="text-ink-3">›</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
