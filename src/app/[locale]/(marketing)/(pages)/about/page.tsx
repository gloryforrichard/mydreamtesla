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

export default function SupportPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#FDFCF9] py-20 text-center">
        <div className="mx-auto max-w-[1024px] px-[22px]">
          <div className="mb-4 flex items-center justify-center gap-2">
            <BatteryChargingIcon className="size-8 text-[#1A1A1A]" />
          </div>
          <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-[#1A1A1A] sm:text-[56px]">
            Buy me a battery
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[19px] font-light text-[#777777]">
            MyDreamTesla is a passion project built by a Tesla owner, for Tesla owners.
            No ads, no paywalls — just clean data.
          </p>
          <p className="mt-3 text-[15px] text-[#999999]">
            If this site saved you time comparing trims, consider buying me a kWh. ⚡
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-[1024px] px-4 py-16 sm:px-[22px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-sm p-6 transition-colors ${
                tier.highlight
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F5F2ED] text-[#1A1A1A]'
              }`}
            >
              {tier.highlight && (
                <span className="absolute right-4 top-4 rounded-sm bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Popular
                </span>
              )}
              <div className="text-3xl">{tier.emoji}</div>
              <div className="mt-4">
                <p
                  className={`text-[13px] font-medium uppercase tracking-wider ${
                    tier.highlight ? 'text-white/60' : 'text-[#999999]'
                  }`}
                >
                  {tier.name}
                </p>
                <p className="mt-1 font-display text-[36px] font-bold leading-none tracking-[-1px]">
                  {tier.amount}
                </p>
                <p
                  className={`mt-1 text-[15px] font-semibold ${
                    tier.highlight ? 'text-white/90' : 'text-[#1A1A1A]'
                  }`}
                >
                  {tier.tagline}
                </p>
              </div>
              <p
                className={`mt-3 flex-1 text-[13px] leading-relaxed ${
                  tier.highlight ? 'text-white/60' : 'text-[#777777]'
                }`}
              >
                {tier.description}
              </p>
              <button
                type="button"
                disabled
                className={`mt-6 w-full cursor-not-allowed rounded-sm py-2.5 text-[13px] font-semibold opacity-40 ${
                  tier.highlight
                    ? 'bg-white text-[#1A1A1A]'
                    : 'bg-[#1A1A1A] text-white'
                }`}
              >
                Coming soon
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-10 text-center text-[13px] text-[#999999]">
          Payment links coming soon. All funds go directly toward server hosting, data maintenance, and keeping this site ad-free.
        </p>
      </section>

      {/* About the project */}
      <section className="border-t border-[#E5E2DC] bg-[#F5F2ED] py-16">
        <div className="mx-auto max-w-[600px] px-4 text-center sm:px-[22px]">
          <ZapIcon className="mx-auto mb-4 size-6 text-[#999999]" />
          <h2 className="font-display text-[24px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
            What is MyDreamTesla?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#777777]">
            A free, comprehensive Tesla vehicle database covering every model, trim, and year since 2012.
            Compare specs, pricing, range, and performance data across the entire Tesla lineup — with full US and CA regional support.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#777777]">
            Built by a fellow Tesla owner who got tired of digging through spec sheets.
            No affiliate links. No sponsored content. Just the data you need.
          </p>
        </div>
      </section>
    </main>
  );
}
