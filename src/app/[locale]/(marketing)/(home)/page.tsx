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

      {/* ─── Hero — Editorial serif headline ─── */}
      <section className="mx-auto max-w-[1400px] px-8 pb-20 pt-24 sm:pt-32">
        <FadeInSection>
          <div className="max-w-3xl">
            <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-[-2px] text-foreground sm:text-[56px] md:text-[72px]">
              Find the Tesla you&rsquo;ll{' '}
              <em className="font-serif text-ed-accent">actually</em> love.
            </h1>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-ink-2">
              Every model. Every year. Every spec. Compared side by side so you
              can make the right call.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/models"
                className="rounded-lg bg-foreground px-7 py-3 text-center text-[15px] font-semibold text-background transition-opacity hover:opacity-90"
              >
                Browse Models
              </Link>
              <Link
                href={getCompareUrl(POPULAR_COMPARISONS[0].slug)}
                className="rounded-lg border border-line px-7 py-3 text-center text-[15px] font-medium text-foreground transition-colors hover:bg-card"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ─── Model Lineup — 5-column grid ─── */}
      <section className="mx-auto max-w-[1400px] px-8 pb-24">
        <FadeInSection>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
                The Lineup
              </p>
              <h2 className="mt-2 font-display text-[32px] font-bold tracking-[-1.5px] text-foreground sm:text-[40px]">
                Every Tesla, at a glance
              </h2>
            </div>
            <Link
              href="/models"
              className="hidden text-[14px] font-medium text-ed-accent transition-opacity hover:opacity-70 sm:block"
            >
              View all &rarr;
            </Link>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {modelData.map((item, index) => {
            const v = item.vehicle;
            return (
              <FadeInSection key={item.model.id} delay={index * 0.06}>
                <Link
                  href={`/models/${item.model.slug}`}
                  className="group flex flex-col items-center overflow-hidden rounded-lg border border-line bg-paper p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-ink-3/30 hover:shadow-md"
                >
                  <div className="w-full max-w-[180px]">
                    <VehicleImage
                      src={getModelCardImage(item.model.slug)}
                      alt={`Tesla ${item.model.name}`}
                      width={360}
                      height={216}
                      className="h-auto w-full mix-blend-multiply object-contain dark:mix-blend-normal"
                      fallbackClassName="flex h-[100px] w-full items-center justify-center rounded bg-muted"
                      fallbackLabel={item.model.name.replace('Model ', '')}
                    />
                  </div>
                  <h3 className="mt-4 font-display text-[18px] font-bold tracking-[-0.5px] text-foreground sm:text-[20px]">
                    {item.model.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-ink-3">
                    {item.model.bodyType}
                  </p>

                  {v && (
                    <div className="mt-3 flex gap-4 text-[13px]">
                      {v.rangeEPA && (
                        <span className="font-mono text-foreground">
                          {v.rangeEPA} mi
                        </span>
                      )}
                      {v.acceleration060 && (
                        <span className="font-mono text-foreground">
                          {v.acceleration060}s
                        </span>
                      )}
                    </div>
                  )}

                  <span className="mt-3 text-[12px] font-medium text-ed-accent">
                    Explore &rsaquo;
                  </span>
                </Link>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      {/* ─── Compare CTA — dark banner ─── */}
      <section className="mx-auto max-w-[1400px] px-8 pb-24">
        <FadeInSection>
          <div className="relative overflow-hidden rounded-xl bg-foreground px-8 py-16 text-center sm:px-16 sm:py-20">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-background/50">
              Side by Side
            </p>
            <h2 className="mx-auto mt-3 max-w-xl font-display text-[28px] font-bold leading-tight tracking-[-1px] text-background sm:text-[36px]">
              Not sure which trim is right?{' '}
              <em className="font-serif text-ed-accent">Compare them.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-background/60">
              Specs, range, price — side by side. Find the differences that
              matter to you.
            </p>
            <div className="mt-8">
              <Link
                href="/compare"
                className="inline-block rounded-lg bg-background px-7 py-3 text-[15px] font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                Start Comparing
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ─── Featured Comparisons — editorial list ─── */}
      <section className="mx-auto max-w-[1400px] px-8 pb-24">
        <FadeInSection>
          <div className="mb-10">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
              Popular Matchups
            </p>
            <h2 className="mt-2 font-display text-[32px] font-bold tracking-[-1.5px] text-foreground sm:text-[40px]">
              Head-to-head comparisons
            </h2>
          </div>
        </FadeInSection>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_COMPARISONS.map((comp, index) => (
            <FadeInSection key={comp.slug} delay={index * 0.06}>
              <Link
                href={getCompareUrl(comp.slug)}
                className="group rounded-lg border border-line bg-paper px-6 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-3/30 hover:shadow-md"
              >
                <p className="text-[15px] font-semibold text-foreground">
                  {comp.label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
                  {comp.description}
                </p>
                <p className="mt-4 text-[13px] font-medium text-ed-accent">
                  Compare &rsaquo;
                </p>
              </Link>
            </FadeInSection>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/compare"
            className="text-[14px] font-medium text-ed-accent/70 transition-colors hover:text-ed-accent"
          >
            View all comparisons &rarr;
          </Link>
        </div>
      </section>

      {/* ─── Blog Preview — 3-column cards ─── */}
      {blogPosts.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-8 pb-24">
          <FadeInSection>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
                  From the Journal
                </p>
                <h2 className="mt-2 font-display text-[32px] font-bold tracking-[-1.5px] text-foreground sm:text-[40px]">
                  Latest reads
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden text-[14px] font-medium text-ed-accent/70 transition-colors hover:text-ed-accent sm:block"
              >
                View all &rarr;
              </Link>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <FadeInSection key={post.url} delay={index * 0.08}>
                <Link
                  href={`/blog/${post.slugs}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
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
                  <div className="flex flex-1 flex-col p-6">
                    <time
                      className="font-mono text-[11px] uppercase tracking-wide text-ink-3"
                      dateTime={post.data.date}
                    >
                      {formatDate(new Date(post.data.date))}
                    </time>
                    <h3 className="mt-2 text-[17px] font-semibold leading-snug text-foreground line-clamp-2">
                      {post.data.title}
                    </h3>
                    {post.data.description && (
                      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-2">
                        {post.data.description}
                      </p>
                    )}
                    <span className="mt-auto pt-4 text-[13px] font-medium text-ed-accent">
                      Read &rsaquo;
                    </span>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/blog"
              className="text-[14px] font-medium text-ed-accent/70 transition-colors hover:text-ed-accent"
            >
              View all posts &rarr;
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
