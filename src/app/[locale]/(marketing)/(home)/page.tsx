import type { Metadata } from 'next';
import Image from 'next/image';
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
import { HeroContent, HeroItem, FadeInSection, AnimatedSpec } from '@/components/tesla/homepage-animations';

export const metadata: Metadata = {
  title: 'MyDreamTesla — Every Tesla. Every Year. Compared.',
  description:
    'The most comprehensive Tesla vehicle database. Compare specs, pricing, and performance across every model year and trim — all in one place.',
};

const TOP_COMPARISONS = POPULAR_COMPARISONS.slice(0, 6);

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

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

      {/* Hero — full-screen background image */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden text-center">
        <Image
          src="/images/landing.jpg"
          alt="Tesla on a forest road"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <HeroContent>
          <HeroItem>
            <h1 className="font-display text-[36px] font-bold leading-[0.95] tracking-[-3px] text-white sm:text-5xl md:text-[80px]">
              Find Your
              <br />
              Perfect Tesla.
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="mx-auto mt-6 max-w-[480px] text-lg font-light leading-relaxed text-white/60 sm:text-[20px]">
              Every model. Every year. Every spec.
              <br />
              Compared side by side.
            </p>
          </HeroItem>
          <HeroItem>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href="/models"
                className="w-full rounded-full bg-white px-8 py-3.5 text-center text-[15px] font-semibold text-black shadow-lg transition-colors duration-200 hover:bg-white/90 sm:w-auto"
              >
                Browse Models
              </Link>
              <Link
                href={getCompareUrl(POPULAR_COMPARISONS[0].slug)}
                className="w-full rounded-full border border-white/40 px-8 py-3.5 text-center text-[15px] font-medium text-white transition-all duration-200 hover:border-white/70 hover:bg-white/10 sm:w-auto"
              >
                Compare Now
              </Link>
            </div>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Model Tiles — 2×2 grid */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {modelData.map((item, index) => {
          const v = item.vehicle;
          return (
            <FadeInSection key={item.model.id} delay={index * 0.08}>
              <Link
                href={`/models/${item.model.slug}`}
                className="group flex min-h-[420px] flex-col items-center overflow-hidden rounded-lg bg-card px-5 pt-10 text-center transition-all duration-300 hover:bg-card-hover hover:shadow-lg sm:min-h-[520px] sm:px-10 sm:pt-14"
              >
                <p className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-muted-foreground">
                  {item.model.bodyType}
                </p>
                <h2 className="mt-2 font-display text-[36px] font-bold tracking-[-2px] text-foreground sm:text-[44px]">
                  {item.model.name}
                </h2>
                <p className="mt-2 text-[17px] font-light text-secondary-text">
                  {item.model.tagline ?? 'Explore all trims.'}
                </p>

                {/* Quick specs */}
                {v && (
                  <div className="mt-5 flex gap-10">
                    {v.rangeEPA && (
                      <div>
                        <AnimatedSpec
                          value={Number(v.rangeEPA)}
                          suffix=" mi"
                          className="font-mono text-[18px] font-semibold text-foreground"
                        />
                        <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                          Range
                        </div>
                      </div>
                    )}
                    {v.acceleration060 && (
                      <div>
                        <AnimatedSpec
                          value={parseFloat(v.acceleration060)}
                          suffix="s"
                          decimalPlaces={1}
                          className="font-mono text-[18px] font-semibold text-foreground"
                        />
                        <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                          0-60 mph
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5">
                  <span className="text-[14px] font-medium text-foreground transition-colors group-hover:text-brand">
                    Explore all trims →
                  </span>
                </div>

                {/* Model tile image */}
                <div className="mt-auto w-full max-w-[420px]">
                  <VehicleImage
                    src={getModelCardImage(item.model.slug)}
                    alt={`Tesla ${item.model.name}`}
                    width={800}
                    height={480}
                    className="h-auto w-full mix-blend-multiply rounded-t-lg object-contain dark:mix-blend-normal"
                    fallbackClassName="flex h-[240px] w-full items-center justify-center rounded-t-lg bg-gradient-to-br from-muted to-muted/70"
                    fallbackLabel={item.model.name.replace('Model ', '')}
                  />
                </div>
              </Link>
            </FadeInSection>
          );
        })}
      </section>

      {/* Compare Section — clean text-based cards */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <div className="text-center">
              <h2 className="font-display text-[36px] font-bold tracking-[-2px] text-foreground sm:text-[48px]">
                Head-to-head comparisons
              </h2>
              <p className="mt-3 text-[17px] font-light text-secondary-text">
                The matchups people search for most.
              </p>
            </div>
          </FadeInSection>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_COMPARISONS.map((comp, index) => (
              <FadeInSection key={comp.slug} delay={index * 0.06}>
                <Link
                  href={getCompareUrl(comp.slug)}
                  className="group rounded-lg border border-border px-6 py-6 transition-all duration-200 hover:border-border-muted hover:bg-card hover:shadow-md"
                >
                  <p className="text-[15px] font-semibold text-foreground">
                    {comp.label}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {comp.description}
                  </p>
                  <p className="mt-4 text-[13px] font-medium text-secondary-text transition-colors group-hover:text-brand">
                    Compare ›
                  </p>
                </Link>
              </FadeInSection>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/compare"
              className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all comparisons ›
            </Link>
          </div>
        </div>
      </section>

      {/* Latest from Blog */}
      {blogPosts.length > 0 && (
        <section className="px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <FadeInSection>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-[36px] font-bold tracking-[-2px] text-foreground sm:text-[48px]">
                    Latest from Our Blog
                  </h2>
                  <p className="mt-3 text-[17px] font-light text-secondary-text">
                    Guides, comparisons, and Tesla news.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="hidden text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                >
                  View All &rarr;
                </Link>
              </div>
            </FadeInSection>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <FadeInSection key={post.url} delay={index * 0.08}>
                  <Link
                    href={`/blog/${post.slugs}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg bg-card transition-all duration-300 hover:bg-card-hover hover:shadow-md"
                  >
                    {post.data.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={post.data.image}
                          alt={post.data.title}
                          width={600}
                          height={338}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-[17px] font-semibold leading-snug text-foreground line-clamp-2">
                        {post.data.title}
                      </h3>
                      {post.data.description && (
                        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-secondary-text">
                          {post.data.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <time
                          className="text-[12px] text-muted-foreground"
                          dateTime={post.data.date}
                        >
                          {formatDate(new Date(post.data.date))}
                        </time>
                        <span className="text-[13px] font-medium text-secondary-text transition-colors group-hover:text-brand">
                          Read More &rsaquo;
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/blog"
                className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View all posts &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
