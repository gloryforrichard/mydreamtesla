import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { BatteryChargingIcon, ZapIcon } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'Buy me a battery | MyDreamTesla',
    description:
      'Support MyDreamTesla — the most comprehensive Tesla vehicle database. Every dollar keeps the electrons flowing.',
    locale,
    pathname: '/about',
  });
}

const tiers = [
  {
    emoji: '⚡',
    name: '1 kWh',
    amount: '$5',
    tagline: 'Just enough juice',
    description: 'Cover a tiny slice of server costs for one day.',
    highlight: false,
  },
  {
    emoji: '🔋',
    name: 'Level 2 Top-up',
    amount: '$15',
    tagline: 'A proper charge',
    description: 'Keep the database running for a week.',
    highlight: false,
  },
  {
    emoji: '⚡⚡',
    name: 'Supercharge Session',
    amount: '$25',
    tagline: 'Full speed ahead',
    description: 'Power the site for a month of API calls and hosting.',
    highlight: true,
  },
  {
    emoji: '🚗',
    name: 'Battery Pack',
    amount: '$50',
    tagline: "You're a legend",
    description: "A major contribution that keeps this project alive and growing.",
    highlight: false,
  },
];

const stats = [
  { value: '5', label: 'Tesla Models' },
  { value: '50+', label: 'Trim Configurations' },
  { value: '2017–2025', label: 'Model Years Covered' },
  { value: '100%', label: 'Free & Ad-Free' },
];

export default function SupportPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="bg-paper py-20 text-center">
        <div className="mx-auto max-w-[1400px] px-8">
          <div className="mb-4 flex items-center justify-center gap-2">
            <BatteryChargingIcon className="size-8 text-foreground" />
          </div>
          <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-foreground sm:text-[56px]">
            Buy me a battery
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[19px] font-light text-ink-2">
            MyDreamTesla is a passion project built by a Tesla owner, for Tesla owners.
            No ads, no paywalls — just clean data.
          </p>
          <p className="mt-3 text-[15px] text-ink-3">
            If this site saved you time comparing trims, consider buying me a kWh. ⚡
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-line px-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <p className="font-display text-[28px] font-bold tracking-[-0.5px] text-foreground sm:text-[32px]">
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ink-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-[1400px] px-8 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-lg border border-line p-6 transition-colors ${
                tier.highlight
                  ? 'bg-foreground text-white'
                  : 'bg-paper text-foreground'
              }`}
            >
              {tier.highlight && (
                <span className="absolute right-4 top-4 rounded-lg bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                  Popular
                </span>
              )}
              <div className="text-3xl">{tier.emoji}</div>
              <div className="mt-4">
                <p
                  className={`font-mono text-[13px] font-medium uppercase tracking-wider ${
                    tier.highlight ? 'text-white/60' : 'text-ink-3'
                  }`}
                >
                  {tier.name}
                </p>
                <p className="mt-1 font-display text-[36px] font-bold leading-none tracking-[-1px]">
                  {tier.amount}
                </p>
                <p
                  className={`mt-1 text-[15px] font-semibold ${
                    tier.highlight ? 'text-white/90' : 'text-foreground'
                  }`}
                >
                  {tier.tagline}
                </p>
              </div>
              <p
                className={`mt-3 flex-1 text-[13px] leading-relaxed ${
                  tier.highlight ? 'text-white/60' : 'text-ink-2'
                }`}
              >
                {tier.description}
              </p>
              <button
                type="button"
                disabled
                className={`mt-6 w-full cursor-not-allowed rounded-lg py-2.5 text-[13px] font-semibold opacity-40 ${
                  tier.highlight
                    ? 'bg-white text-foreground'
                    : 'bg-foreground text-white'
                }`}
              >
                Coming soon
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-10 text-center text-[13px] text-ink-3">
          Payment links coming soon. All funds go directly toward server hosting, data maintenance, and keeping this site ad-free.
        </p>
      </section>

      {/* Why we exist */}
      <section className="border-y border-line bg-paper py-16">
        <div className="mx-auto max-w-[720px] px-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ed-accent">
            Our Story
          </p>
          <h2 className="mt-3 font-display text-[28px] font-bold tracking-[-0.5px] text-foreground sm:text-[32px]">
            Why we exist
          </h2>
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-2">
            <p>
              It started with a simple frustration: comparing Tesla trims shouldn't require
              opening fifteen browser tabs and cross-referencing spec sheets from three
              different sources.
            </p>
            <p>
              As a Tesla owner, I wanted a single place where every model, every trim,
              and every year was laid out side by side — clean, accurate, and free from
              the noise of affiliate links and sponsored recommendations.
            </p>
            <p>
              MyDreamTesla is that place. We obsess over the data so you don't have to.
              Every spec is verified, every comparison is honest, and the entire experience
              is designed to help you make the best decision — not to sell you something.
            </p>
          </div>
        </div>
      </section>

      {/* About the project */}
      <section className="border-t border-line bg-muted py-16">
        <div className="mx-auto max-w-[600px] px-8 text-center">
          <ZapIcon className="mx-auto mb-4 size-6 text-ink-3" />
          <h2 className="font-display text-[24px] font-bold tracking-[-0.5px] text-foreground">
            What is MyDreamTesla?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            A free, comprehensive Tesla vehicle database covering every model, trim, and year since 2012.
            Compare specs, pricing, range, and performance data across the entire Tesla lineup — with full US and CA regional support.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            Built by a fellow Tesla owner who got tired of digging through spec sheets.
            No affiliate links. No sponsored content. Just the data you need.
          </p>
        </div>
      </section>
    </main>
  );
}
