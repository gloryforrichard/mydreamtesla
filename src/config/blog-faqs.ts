import type { FAQItem } from './model-faqs';

/**
 * Blog-level FAQs for high-impression articles that benefit from FAQ rich
 * results in search.
 */
export const BLOG_FAQS: Record<string, FAQItem[]> = {
  'ev-tax-credits-by-state-2025': [
    {
      question: 'Which Tesla models qualify for the federal EV tax credit?',
      answer:
        'In this guide, the Model 3 qualifies in most trims and the Model Y qualifies across all trims under the federal MSRP rules. The Model S exceeds the sedan cap, while Model X and some Cybertruck configurations require a trim-by-trim eligibility check.',
    },
    {
      question:
        'Can you stack state EV rebates with the federal $7,500 credit?',
      answer:
        'Yes, many state EV incentives can be stacked with the federal $7,500 credit, which is why total savings can exceed $10,000 in strong incentive states. Final eligibility depends on your income, vehicle MSRP, and the specific state or utility program.',
    },
    {
      question: 'Which states offer the biggest Tesla EV incentives?',
      answer:
        'This guide highlights California, Colorado, Oregon, Vermont, and Washington as some of the strongest states for Tesla buyers because they combine large rebates, tax credits, sales tax relief, or utility incentives on top of the federal credit.',
    },
  ],
  'model-3-long-range-vs-performance': [
    {
      question: 'Which Model 3 trim has more range: Long Range or Performance?',
      answer:
        'The Model 3 Long Range has the advantage on range, offering about 363 miles versus roughly 315 miles for the Performance trim. That makes the Long Range the better choice for buyers who care more about road-trip flexibility than maximum acceleration.',
    },
    {
      question: 'How much faster is the Tesla Model 3 Performance?',
      answer:
        'The Model 3 Performance reaches 0-60 mph in about 2.9 seconds, compared with roughly 4.2 seconds for the Long Range. The Performance also adds hardware such as upgraded brakes, lower suspension, and Track Mode.',
    },
    {
      question:
        'Is the Tesla Model 3 Performance worth it over the Long Range?',
      answer:
        'The Performance is worth it if you care most about acceleration, sharper handling, and Track Mode. For most daily drivers, the Long Range is the better value because it costs less, rides more comfortably, and goes farther on a charge.',
    },
  ],
  'tesla-home-charging-guide': [
    {
      question: 'Is Tesla Wall Connector better than a NEMA 14-50 outlet?',
      answer:
        'The Tesla Wall Connector is faster, cleaner, and better for households with multiple Teslas, but a NEMA 14-50 outlet is enough for most owners. If you want the best value, the NEMA 14-50 setup covers typical overnight charging needs at a lower installation cost.',
    },
    {
      question: 'How much does Tesla home charging setup cost?',
      answer:
        'A NEMA 14-50 outlet usually costs about $200-$800 to install, while a Tesla Wall Connector setup typically lands around $975-$2,475 including hardware and electrician labor. The final number depends on panel capacity, wire run distance, permits, and whether upgrades are needed.',
    },
    {
      question: 'Can you charge a Tesla from a normal household outlet?',
      answer:
        'Yes. Level 1 charging from a standard 120V outlet works with the Mobile Connector and adds roughly 3-5 miles of range per hour. It is best for light daily driving and owners who can charge overnight every day.',
    },
  ],
  'model-y-trim-comparison-2025': [
    {
      question: 'Which 2025 Model Y trim has the longest range?',
      answer:
        'The 2025 Model Y Long Range AWD offers the longest EPA-rated range in this comparison at about 325 miles. It is the trim most buyers should start with if road-trip range and all-weather usability matter most.',
    },
    {
      question: 'Is the Model Y Standard Range enough for daily driving?',
      answer:
        'Yes, the Standard Range is enough for most commuting and city driving, especially if you charge at home. The main trade-off shows up on longer trips, where the Long Range needs fewer charging stops and gives you a larger winter buffer.',
    },
    {
      question: 'Is the 2025 Model Y Performance worth it?',
      answer:
        'The Model Y Performance is worth the premium if you specifically want stronger acceleration, upgraded wheels, and a more aggressive driving experience. If your priority is value, the Long Range AWD is the better all-around choice.',
    },
  ],
};
