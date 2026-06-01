import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { VehicleImage } from '@/components/tesla/vehicle-image';
import { getRepresentativeVehicles } from '@/lib/db/queries';
import { POPULAR_COMPARISONS, getCompareUrl } from '@/config/comparisons';
import { JsonLd } from '@/components/seo/json-ld';
import {
  buildWebSiteJsonLd,
  buildOrganizationJsonLd,
  buildItemListJsonLd,
} from '@/lib/seo/structured-data';
import { getBaseUrl } from '@/lib/urls/urls';
import { getModelCardImage } from '@/lib/vehicle-images';
import { blogSource } from '@/lib/source';
import { formatDate } from '@/lib/formatter';
import Image from 'next/image';
import { FadeInSection } from '@/components/tesla/homepage-animations';
import { constructMetadata } from '@/lib/metadata';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'Compare Every Tesla Model & Trim (2017–2025) — Specs, Range, Price',
    description:
      'Compare Tesla specs, range, 0-60 times, and pricing across every model, trim, and year: Model 3, Y, S, X, and Cybertruck. Updated for 2025.',
    locale: locale as Locale,
    pathname: '/',
  });
}

const TOP_COMPARISONS = POPULAR_COMPARISONS.slice(0, 6);

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const modelData = await getRepresentativeVehicles();

  // Get latest blog posts
  const blogPosts = blogSource
    .getPages(locale)
    .filter((post) => post.data.published)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    )
    .slice(0, 3);

  const baseUrl = getBaseUrl();
  const modelListItems = modelData.map((m, i) => ({
    name: `Tesla ${m.model.name}`,
    url: `${baseUrl}/models/${m.model.slug}`,
    position: i + 1,
  }));

  return (
    <main>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      {modelData.length > 0 && (
        <JsonLd
          data={buildItemListJsonLd(modelListItems, 'Tesla Model Lineup')}
        />
      )}

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-28 sm:px-8 sm:pt-40">
        <FadeInSection>
          <div className="max-w-4xl">
            <p className="mb-6 font-mono text-[13px] font-medium uppercase tracking-[1.5px] text-ed-accent">
              Every model · Every year · Every spec
            </p>
            <h1 className="font-display text-[44px] font-bold leading-[1.05] tracking-[-2px] text-foreground sm:text-[64px] md:text-[80px]">
              Find the Tesla you&rsquo;ll{' '}
              <span className="text-ed-accent">actually</span> love.
            </h1>
            <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink-2 sm:text-[21px]">
              Compare range, performance, and price side by side — so you can
              make the right call with confidence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/models"
                className="rounded-xl bg-foreground px-8 py-4 text-center text-[16px] font-semibold text-background transition-opacity hover:opacity-90"
              >
                Browse all models
              </Link>
              <Link
                href={getCompareUrl(POPULAR_COMPARISONS[0].slug)}
                className="rounded-xl border border-line px-8 py-4 text-center text-[16px] font-medium text-foreground transition-colors hover:bg-card"
              >
                Compare now
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ─── Model Lineup ─── */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28 sm:px-8">
        <FadeInSection>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-mono text-[13px] font-medium uppercase tracking-[1.5px] text-ink-3">
                The Lineup
              </p>
              <h2 className="mt-3 font-display text-[34px] font-bold tracking-[-1.5px] text-foreground sm:text-[44px]">
                Every Tesla, at a glance
              </h2>
            </div>
            <Link
              href="/models"
              className="hidden text-[16px] font-medium text-ed-accent transition-opacity hover:opacity-70 sm:block"
            >
              View all &rarr;
            </Link>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modelData.map((item, index) => {
            const v = item.vehicle;
            return (
              <FadeInSection key={item.model.id} delay={index * 0.06}>
                <Link
                  href={`/models/${item.model.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto w-full max-w-[260px]">
                    <VehicleImage
                      src={getModelCardImage(item.model.slug)}
                      alt={`Tesla ${item.model.name}`}
                      width={420}
                      height={252}
                      className="h-auto w-full object-contain"
                      fallbackClassName="flex h-[140px] w-full items-center justify-center rounded bg-muted"
                      fallbackLabel={item.model.name.replace('Model ', '')}
                    />
                  </div>

                  <div className="mt-6 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[24px] font-bold tracking-[-0.5px] text-foreground">
                      {item.model.name}
                    </h3>
                    <span className="text-[14px] text-ink-3">
                      {item.model.bodyType}
                    </span>
                  </div>

                  {v && (
                    <div className="mt-5 flex gap-10 border-t border-line pt-5">
                      {v.rangeKm && (
                        <div>
                          <p className="font-mono text-[26px] font-semibold leading-none text-foreground">
                            {v.rangeKm}
                            <span className="ml-1 text-[14px] font-normal text-ink-3">
                              km
                            </span>
                          </p>
                          <p className="mt-2 text-[13px] text-ink-3">Range</p>
                        </div>
                      )}
                      {v.acceleration060 && (
                        <div>
                          <p className="font-mono text-[26px] font-semibold leading-none text-foreground">
                            {v.acceleration060}
                            <span className="ml-1 text-[14px] font-normal text-ink-3">
                              s
                            </span>
                          </p>
                          <p className="mt-2 text-[13px] text-ink-3">0–60 mph</p>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="mt-6 text-[15px] font-medium text-ed-accent">
                    Explore {item.model.name} &rsaquo;
                  </span>
                </Link>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      {/* ─── Compare CTA ─── */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28 sm:px-8">
        <FadeInSection>
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-20 text-center sm:px-16 sm:py-24">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[1.5px] text-background/50">
              Side by Side
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-[32px] font-bold leading-tight tracking-[-1px] text-background sm:text-[44px]">
              Not sure which trim is right?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-background/60 sm:text-[18px]">
              Specs, range, price — compared side by side. Find the differences
              that matter to you.
            </p>
            <div className="mt-10">
              <Link
                href="/compare"
                className="inline-block rounded-xl bg-background px-8 py-4 text-[16px] font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                Start comparing
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ─── Featured Comparisons ─── */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28 sm:px-8">
        <FadeInSection>
          <div className="mb-12">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[1.5px] text-ink-3">
              Popular Matchups
            </p>
            <h2 className="mt-3 font-display text-[34px] font-bold tracking-[-1.5px] text-foreground sm:text-[44px]">
              Head-to-head comparisons
            </h2>
          </div>
        </FadeInSection>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_COMPARISONS.map((comp, index) => (
            <FadeInSection key={comp.slug} delay={index * 0.06}>
              <Link
                href={getCompareUrl(comp.slug)}
                className="group flex h-full flex-col rounded-2xl border border-line bg-card px-7 py-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-[18px] font-semibold text-foreground">
                  {comp.label}
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">
                  {comp.description}
                </p>
                <p className="mt-5 text-[15px] font-medium text-ed-accent">
                  Compare &rsaquo;
                </p>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ─── Blog Preview ─── */}
      {blogPosts.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-6 pb-28 sm:px-8">
          <FadeInSection>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="font-mono text-[13px] font-medium uppercase tracking-[1.5px] text-ink-3">
                  From the Journal
                </p>
                <h2 className="mt-3 font-display text-[34px] font-bold tracking-[-1.5px] text-foreground sm:text-[44px]">
                  Latest reads
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden text-[16px] font-medium text-ed-accent transition-opacity hover:opacity-70 sm:block"
              >
                View all &rarr;
              </Link>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <FadeInSection key={post.url} delay={index * 0.08}>
                <Link
                  href={`/blog/${post.slugs}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {post.data.image && (
                    <div className="aspect-[3/2] w-full overflow-hidden">
                      <Image
                        src={post.data.image}
                        alt={post.data.title}
                        width={600}
                        height={400}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <time
                      className="font-mono text-[12px] uppercase tracking-wide text-ink-3"
                      dateTime={post.data.date}
                    >
                      {formatDate(new Date(post.data.date))}
                    </time>
                    <h3 className="mt-3 text-[20px] font-semibold leading-snug text-foreground line-clamp-2">
                      {post.data.title}
                    </h3>
                    {post.data.description && (
                      <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink-2">
                        {post.data.description}
                      </p>
                    )}
                    <span className="mt-auto pt-5 text-[15px] font-medium text-ed-accent">
                      Read article &rsaquo;
                    </span>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
