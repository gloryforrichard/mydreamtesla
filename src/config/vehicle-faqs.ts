import type { FAQItem } from './model-faqs';

/**
 * Vehicle-level FAQs — targeted at GSC high-impression search queries.
 * Keyed by vehicle slug.
 */
export const VEHICLE_FAQS: Record<string, FAQItem[]> = {
  'model-3-2023-standard-range-plus-rwd': [
    {
      question:
        'What are the full specifications of the 2023 Tesla Model 3 Standard Range Plus?',
      answer:
        'The 2023 Tesla Model 3 Standard Range Plus RWD features a 272-mile EPA range, 6.1-second 0-60 mph time, 140 mph top speed, 283 horsepower, 307 lb-ft torque, and a 50 kWh battery. It weighs 3,862 lbs (1,752 kg), measures 184.8″ L × 72.8″ W × 56.8″ H, and has a 113.2″ wheelbase with 5.5″ ground clearance.',
    },
    {
      question: 'What is the EPA range of the 2023 Tesla Model 3 Standard Range RWD?',
      answer:
        'The 2023 Tesla Model 3 Standard Range Plus RWD has an EPA-estimated range of 272 miles on a single charge. This is achieved with its efficient single-motor RWD drivetrain and a ~50 kWh LFP battery pack, delivering 141 MPGe combined.',
    },
    {
      question: 'How much does the 2023 Tesla Model 3 Standard Range Plus cost?',
      answer:
        'The 2023 Tesla Model 3 Standard Range Plus RWD has an MSRP of $40,240 plus a $1,390 destination fee. With the full $7,500 federal EV tax credit (restored by the IRA), the effective price drops to approximately $32,740 — the lowest effective price in Model 3 history at that time.',
    },
    {
      question: 'How much does the 2023 Tesla Model 3 Standard Range Plus weigh?',
      answer:
        'The 2023 Tesla Model 3 Standard Range Plus RWD has a curb weight of 3,862 lbs (1,752 kg). This is the lightest Model 3 variant due to its single rear motor and smaller LFP battery pack. By comparison, the Long Range AWD weighs about 4,048 lbs and the Performance about 4,065 lbs.',
    },
  ],
  'model-y-2023-standard-range-rwd': [
    {
      question: 'How much horsepower does the 2023 Tesla Model Y Standard Range have?',
      answer:
        'The 2023 Tesla Model Y Standard Range RWD produces approximately 283 horsepower and 310 lb-ft of torque from its single rear motor. This enables a 0-60 mph time of 5.0 seconds and a top speed of 135 mph.',
    },
    {
      question: 'What are the specs of the 2023 Tesla Model Y Standard Range RWD?',
      answer:
        'The 2023 Model Y Standard Range RWD offers a 260-mile EPA range, 5.0s 0-60, 283 hp, 310 lb-ft torque, and 135 mph top speed. It has 76 cu ft of cargo space, weighs 4,100 lbs, and measures 187.0″ L × 75.6″ W × 63.9″ H with 6.6″ ground clearance. MSRP was $43,990.',
    },
    {
      question: 'How much does the 2023 Tesla Model Y Standard Range weigh?',
      answer:
        'The 2023 Tesla Model Y Standard Range RWD has a curb weight of 4,100 lbs. Despite being heavier than the Model 3, it delivers a competitive 260-mile EPA range and 5.0s 0-60 mph time thanks to its efficient single-motor RWD drivetrain.',
    },
    {
      question: 'Is the 2023 Tesla Model Y Standard Range a good value?',
      answer:
        'Yes. At $43,990 MSRP ($36,490 after the $7,500 federal tax credit), the 2023 Model Y Standard Range was one of the best EV SUV values available. It offered 260 miles of range, 76 cu ft of cargo space, and Tesla\'s Supercharger network access at a significantly lower price than the Long Range AWD.',
    },
  ],
  'model-s-2024-plaid': [
    {
      question: 'How fast is the 2024 Tesla Model S Plaid 0-60?',
      answer:
        'The 2024 Tesla Model S Plaid accelerates from 0-60 mph in just 1.99 seconds (with rollout subtracted), making it one of the quickest production cars ever sold. It also runs the quarter mile in 9.23 seconds and reaches a top speed of 200 mph.',
    },
    {
      question: 'What is the range and price of the 2024 Tesla Model S Plaid?',
      answer:
        'The 2024 Model S Plaid offers an EPA-estimated 348 miles of range and starts at $89,990 — a $15,000 price reduction from the 2023 model. It features a 100 kWh battery, 250 kW Supercharger support, and HW4 Autopilot hardware as standard.',
    },
    {
      question: 'How much horsepower does the 2024 Tesla Model S Plaid have?',
      answer:
        'The 2024 Tesla Model S Plaid produces 1,020 horsepower and 1,050 lb-ft of torque from its tri-motor AWD powertrain (one front, two rear motors). This makes it the most powerful production sedan ever manufactured, with a 1.99s 0-60 time and 9.23s quarter mile.',
    },
  ],
};
