import type { Metadata } from 'next';
import Link from 'next/link';
import { blogSource } from '@/lib/source';
import { VehicleImage } from '@/components/tesla/vehicle-image';
import { getRepresentativeVehicles, getSiteCounts } from '@/lib/db/queries';
import {
  formatPrice,
  formatAcceleration,
  formatSpec,
} from '@/lib/vehicle-utils';
import { POPULAR_COMPARISONS, getCompareUrl } from '@/config/comparisons';
import { JsonLd } from '@/components/seo/json-ld';
import {
  buildWebSiteJsonLd,
  buildOrganizationJsonLd,
  buildItemListJsonLd,
} from '@/lib/seo/structured-data';
import { getBaseUrl } from '@/lib/urls/urls';

export const metadata: Metadata = {
  title: 'MyDreamTesla — Every Tesla. Every Year. Compared.',
  description:
    'The most comprehensive Tesla vehicle database. Compare specs, pricing, and performance across every model year and trim — all in one place.',
};

export default async function HomePage() {
  const [modelData, counts] = await Promise.all([
    getRepresentativeVehicles(),
    getSiteCounts(),
  ]);

  const latestPosts = blogSource
    .getPages('en')
    .filter((p) => p.data.published)
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

      {/* Hero — warm white */}
      <section className="bg-[#FDFCF9] px-4 pb-24 pt-36 text-center sm:pb-28 sm:pt-40">
        <p className="text-[17px] font-normal text-[#999999]">MyDreamTesla</p>
        <h1 className="mt-2 font-display text-5xl font-bold leading-[1.05] tracking-[-3px] text-[#1A1A1A] sm:text-[64px]">
          Find Your
          <br />
          Perfect Tesla.
        </h1>
        <p className="mx-auto mt-4 max-w-[500px] text-[21px] font-light leading-relaxed text-[#999999]">
          Every model. Every year. Every spec.
          <br />
          Compared side by side.
        </p>
        <div className="mt-8 flex items-center justify-center gap-8">
          <Link
            href="/models"
            className="text-[17px] font-normal text-[#1A1A1A] underline underline-offset-4 transition-colors hover:text-[#777777]"
          >
            Browse models ›
          </Link>
          <Link
            href={getCompareUrl(POPULAR_COMPARISONS[0].slug)}
            className="text-[17px] font-normal text-[#1A1A1A] underline underline-offset-4 transition-colors hover:text-[#777777]"
          >
            Compare now ›
          </Link>
        </div>
        {/* Hero image */}
        <div className="mx-auto mt-14 max-w-[800px]">
          <VehicleImage
            src="/images/vehicles/hero-lineup.png"
            alt="Tesla Model 3, Model Y, Model S, Model X lineup"
            width={1600}
            height={800}
            className="h-auto w-full rounded-sm"
            fallbackClassName="flex h-[400px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-[#E8E5DF] to-[#D6D3CD]"
            fallbackLabel="TESLA"
            priority
          />
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
                  {v.basePriceMSRP && (
                    <div>
                      <div className="font-mono text-[16px] font-semibold text-[#1A1A1A]">
                        {formatPrice(v.basePriceMSRP)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[#999999]">
                        From
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
                  src={`/images/vehicles/${item.model.slug}-tile.png`}
                  alt={`Tesla ${item.model.name}`}
                  width={800}
                  height={480}
                  className="h-auto w-full rounded-t-sm object-contain"
                  fallbackClassName="flex h-[240px] w-full items-center justify-center rounded-t-sm bg-gradient-to-br from-[#E8E5DF] to-[#D6D3CD]"
                  fallbackLabel={item.model.name.replace('Model ', '')}
                />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Compare Section */}
      <section className="px-4 py-24 text-center">
        <h2 className="font-display text-[48px] font-bold tracking-[-2px] text-[#1A1A1A]">
          Compare head to head.
        </h2>
        <p className="mt-2 text-[21px] font-light text-[#777777]">
          The matchups people search for most.
        </p>
        <div className="mx-auto mt-12 grid max-w-[1024px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_COMPARISONS.map((comp) => (
            <Link
              key={comp.slug}
              href={getCompareUrl(comp.slug)}
              className="rounded-sm bg-[#F5F2ED] p-8 text-left transition-colors hover:bg-[#EDEAE4]"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-[52px] w-[80px] items-center justify-center rounded-sm bg-[#E5E2DC]">
                  <span className="text-[20px] font-extrabold text-[#CCCCCC]">
                    {comp.shortLabel.split(' vs ')[0]}
                  </span>
                </div>
                <span className="text-[11px] font-semibold tracking-[1px] text-[#999999]">
                  VS
                </span>
                <div className="flex h-[52px] w-[80px] items-center justify-center rounded-sm bg-[#E5E2DC]">
                  <span className="text-[20px] font-extrabold text-[#CCCCCC]">
                    {comp.shortLabel.split(' vs ')[1]}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-center text-[13px] font-semibold text-[#1A1A1A]">
                {comp.label}
              </p>
              <p className="mt-5 text-center text-[14px] text-[#1A1A1A]">
                Full comparison ›
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats — warm card */}
      <section className="bg-[#F5F2ED] px-4 py-24 text-center">
        <h2 className="font-display text-[48px] font-bold tracking-[-2px] text-[#1A1A1A]">
          Tesla by the numbers.
        </h2>
        <p className="mt-2 text-[21px] font-light text-[#777777]">
          Every specification, every trim, every year.
        </p>
        <div className="mx-auto mt-16 grid max-w-[900px] grid-cols-2 gap-0 sm:grid-cols-4">
          {[
            { num: `${counts.modelCount}+`, label: 'Models' },
            { num: `${counts.vehicleCount}+`, label: 'Trims' },
            { num: '150+', label: 'Specs' },
            { num: `${counts.yearCount}`, label: 'Model years' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-8 ${
                i < 3 ? 'border-r border-[#E5E2DC] sm:border-r' : ''
              } ${i === 1 ? 'sm:border-r' : ''}`}
            >
              <div className="font-display text-[56px] font-bold leading-none tracking-[-3px] text-[#1A1A1A]">
                {stat.num}
              </div>
              <div className="mt-2 text-[14px] text-[#999999]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest from the Blog */}
      {latestPosts.length > 0 && (
        <section className="px-4 py-24 text-center">
          <h2 className="font-display text-[48px] font-bold tracking-[-2px] text-[#1A1A1A]">
            Latest insights.
          </h2>
          <p className="mt-2 text-[21px] font-light text-[#777777]">
            Guides, comparisons, and news for Tesla buyers.
          </p>
          <div className="mx-auto mt-12 grid max-w-[1024px] grid-cols-1 gap-6 px-4 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slugs.join('/')}
                href={`/blog/${post.slugs.join('/')}`}
                className="group overflow-hidden rounded-sm bg-[#F5F2ED] p-0 text-left transition-colors hover:bg-[#EDEAE4]"
              >
                {post.data.image && (
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#E8E5DF] to-[#D6D3CD]" />
                )}
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
                    {post.data.categories?.[0] ?? 'Article'}
                  </p>
                  <h3 className="mt-2 text-[17px] font-semibold leading-snug text-[#1A1A1A] line-clamp-2">
                    {post.data.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-[#777777] line-clamp-2">
                    {post.data.description}
                  </p>
                  <p className="mt-4 text-[14px] text-[#1A1A1A]">
                    Read more ›
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="mt-10 inline-flex text-[17px] font-normal text-[#1A1A1A] transition-colors hover:text-[#777777]"
          >
            View all articles ›
          </Link>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#F5F2ED] px-4 py-24 text-center">
        <h2 className="font-display text-[48px] font-bold tracking-[-2px] text-[#1A1A1A]">
          Ready to compare?
        </h2>
        <p className="mt-3 text-[21px] font-light text-[#777777]">
          Find the Tesla that fits your life.
        </p>
        <Link
          href="/models"
          className="mt-7 inline-flex items-center rounded-sm bg-[#1A1A1A] px-6 py-3 text-[15px] font-normal text-white transition-colors hover:bg-[#333333]"
        >
          Start comparing
        </Link>
      </section>
    </main>
  );
}
