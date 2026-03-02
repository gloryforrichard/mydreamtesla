import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { VehicleImage } from '@/components/tesla/vehicle-image';
import { getRepresentativeVehicles, getSiteCounts } from '@/lib/db/queries';
import { formatAcceleration, formatSpec } from '@/lib/vehicle-utils';
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
  const [modelData, counts] = await Promise.all([
    getRepresentativeVehicles(),
    getSiteCounts(),
  ]);

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
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden text-center">
        <Image
          src="/images/landing.jpg"
          alt="Tesla on a forest road"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 px-4 py-36 sm:py-40">
          <p className="text-[17px] font-normal text-white/60">MyDreamTesla</p>
          <h1 className="mt-2 font-display text-5xl font-bold leading-[1.05] tracking-[-3px] text-white sm:text-[64px]">
            Find Your
            <br />
            Perfect Tesla.
          </h1>
          <p className="mx-auto mt-4 max-w-[500px] text-[21px] font-light leading-relaxed text-white/70">
            Every model. Every year. Every spec.
            <br />
            Compared side by side.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/models"
              className="rounded-full bg-white px-7 py-3 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:bg-white/90"
            >
              Browse Models
            </Link>
            <Link
              href={getCompareUrl(POPULAR_COMPARISONS[0].slug)}
              className="rounded-full border border-white/60 px-7 py-3 text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Compare Now
            </Link>
          </div>
        </div>
      </section>

      {/* Model Tiles — 2×2 grid */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 p-3 sm:grid-cols-2">
        {modelData.map((item) => {
          const v = item.vehicle;
          return (
            <Link
              key={item.model.id}
              href={`/models/${item.model.slug}`}
              className="flex min-h-[520px] flex-col items-center overflow-hidden rounded-sm bg-[#F5F2ED] px-10 pt-14 text-center"
            >
              <p className="text-[14px] font-medium uppercase tracking-[0.5px] text-[#999999]">
                {item.model.bodyType}
              </p>
              <h2 className="mt-1 font-display text-[40px] font-bold tracking-[-1.5px] text-[#1A1A1A]">
                {item.model.name}
              </h2>
              <p className="mt-2 text-[17px] font-light text-[#777777]">
                {item.model.tagline ?? 'Explore all trims.'}
              </p>

              {/* Quick specs */}
              {v && (
                <div className="mt-4 flex gap-8">
                  {v.rangeEPA && (
                    <div>
                      <div className="font-mono text-[16px] font-semibold text-[#1A1A1A]">
                        {formatSpec(v.rangeEPA, 'mi')}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[#999999]">
                        Range
                      </div>
                    </div>
                  )}
                  {v.acceleration060 && (
                    <div>
                      <div className="font-mono text-[16px] font-semibold text-[#1A1A1A]">
                        {formatAcceleration(v.acceleration060)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[#999999]">
                        0-60 mph
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tile links */}
              <div className="mt-4 flex gap-6">
                <span className="text-[14px] text-[#1A1A1A]">Explore ›</span>
                <span className="text-[14px] text-[#1A1A1A]">
                  Compare trims ›
                </span>
              </div>

              {/* Model tile image */}
              <div className="mt-auto w-full max-w-[400px]">
                <VehicleImage
                  src={getModelCardImage(item.model.slug)}
                  alt={`Tesla ${item.model.name}`}
                  width={800}
                  height={480}
                  className="h-auto w-full mix-blend-multiply rounded-t-sm object-contain"
                  fallbackClassName="flex h-[240px] w-full items-center justify-center rounded-t-sm bg-gradient-to-br from-[#E8E5DF] to-[#D6D3CD]"
                  fallbackLabel={item.model.name.replace('Model ', '')}
                />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Compare Section — clean text-based cards */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-[36px] font-bold tracking-[-1.5px] text-[#1A1A1A] sm:text-[42px]">
              Head-to-head comparisons
            </h2>
            <p className="mt-2 text-[17px] font-light text-[#777777]">
              The matchups people search for most.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_COMPARISONS.map((comp) => (
              <Link
                key={comp.slug}
                href={getCompareUrl(comp.slug)}
                className="group rounded-sm border border-[#E5E2DC] px-6 py-5 transition-colors hover:border-[#CCCCCC] hover:bg-[#FDFCF9]"
              >
                <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#555555]">
                  {comp.label}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#999999]">
                  {comp.description}
                </p>
                <p className="mt-3 text-[13px] font-medium text-[#777777] group-hover:text-[#1A1A1A]">
                  Compare ›
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/compare"
              className="text-[14px] font-medium text-[#999999] transition-colors hover:text-[#1A1A1A]"
            >
              View all comparisons ›
            </Link>
          </div>
        </div>
      </section>

      {/* Latest from Blog */}
      {blogPosts.length > 0 && (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-[36px] font-bold tracking-[-1.5px] text-[#1A1A1A] sm:text-[42px]">
                  Latest from Our Blog
                </h2>
                <p className="mt-2 text-[17px] font-light text-[#777777]">
                  Guides, comparisons, and Tesla news.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden text-[14px] font-medium text-[#999999] transition-colors hover:text-[#1A1A1A] sm:block"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.url}
                  href={`/blog/${post.slugs}`}
                  className="group flex flex-col overflow-hidden rounded-sm bg-[#F5F2ED] transition-colors hover:bg-[#EDEAE4]"
                >
                  {post.data.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src={post.data.image}
                        alt={post.data.title}
                        width={600}
                        height={338}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[17px] font-semibold leading-snug text-[#1A1A1A] line-clamp-2">
                      {post.data.title}
                    </h3>
                    {post.data.description && (
                      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#777777]">
                        {post.data.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <time
                        className="text-[12px] text-[#999999]"
                        dateTime={post.data.date}
                      >
                        {formatDate(new Date(post.data.date))}
                      </time>
                      <span className="text-[13px] font-medium text-[#777777] group-hover:text-[#1A1A1A]">
                        Read More &rsaquo;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="text-[14px] font-medium text-[#999999] transition-colors hover:text-[#1A1A1A]"
              >
                View all posts &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats — compact inline strip */}
      <section className="border-y border-[#E5E2DC] bg-[#FDFCF9]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center divide-x divide-[#E5E2DC] px-4">
          {[
            { num: `${counts.modelCount}`, label: 'Models' },
            { num: `${counts.vehicleCount}+`, label: 'Trims' },
            { num: '150+', label: 'Data points' },
            { num: `${counts.yearCount}`, label: 'Model years' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-baseline gap-2 px-6 py-6 sm:px-8 sm:py-8"
            >
              <span className="font-display text-[28px] font-bold tracking-[-1px] text-[#1A1A1A] sm:text-[32px]">
                {stat.num}
              </span>
              <span className="text-[13px] text-[#999999]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — dark section */}
      <section className="bg-[#1A1A1A] px-4 py-20 text-center">
        <h2 className="font-display text-[36px] font-bold tracking-[-1.5px] text-white sm:text-[42px]">
          Ready to find yours?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[17px] font-light text-white/50">
          Browse every Tesla model, compare specs side by side, and find the one
          that fits your life.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/models"
            className="rounded-full bg-white px-7 py-3 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:bg-white/90"
          >
            Browse Models
          </Link>
          <Link
            href="/compare"
            className="rounded-full border border-white/30 px-7 py-3 text-[15px] font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
          >
            Compare ›
          </Link>
        </div>
      </section>
    </main>
  );
}
