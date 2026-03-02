export interface FAQItem {
  question: string;
  answer: string;
}

export const MODEL_FAQS: Record<string, FAQItem[]> = {
  'model-3': [
    {
      question: 'How far can a Tesla Model 3 go on a single charge?',
      answer:
        'The Tesla Model 3 range varies by trim: the Standard Range (RWD) gets approximately 272 miles, the Long Range (AWD) achieves up to 341 miles, and the Performance variant offers around 315 miles on a single charge (EPA estimated).',
    },
    {
      question:
        'Is the Tesla Model 3 eligible for the $7,500 federal tax credit?',
      answer:
        'Yes, the Tesla Model 3 is eligible for the full $7,500 federal EV tax credit in 2025, as long as you meet the income requirements and the vehicle is assembled in North America. Check our tax credit guide for full details.',
    },
    {
      question: "What's the difference between Tesla Model 3 and Model Y?",
      answer:
        'The Model Y is a crossover SUV based on the Model 3 platform. Key differences include: Model Y has more cargo space (76 cu ft vs 23 cu ft), higher ground clearance, a liftback design, and optional third-row seating. Model 3 is lower, sportier, and slightly more efficient.',
    },
    {
      question: 'How fast is the Tesla Model 3?',
      answer:
        'The Model 3 Performance can accelerate from 0-60 mph in just 2.9 seconds, making it one of the fastest sedans in its price range. The Long Range does it in 4.2 seconds, and the Standard Range in 5.8 seconds.',
    },
    {
      question: 'What is the Tesla Model 3 Highland refresh?',
      answer:
        'The Model 3 Highland (2024+) is a significant mid-cycle refresh featuring a redesigned front end, new headlights, improved interior with ambient lighting, a rear display for passengers, and enhanced noise insulation for a quieter cabin.',
    },
    {
      question: 'How much does the Tesla Model 3 weigh?',
      answer:
        'The Tesla Model 3 curb weight varies by trim: the Standard Range Plus (RWD) weighs approximately 3,862 lbs (1,752 kg), the Long Range AWD weighs about 4,048 lbs (1,836 kg), and the Performance AWD weighs roughly 4,065 lbs (1,844 kg). The dual-motor AWD variants are heavier due to the additional motor and larger battery pack.',
    },
    {
      question: 'How much horsepower does the Tesla Model 3 have?',
      answer:
        'The Tesla Model 3 horsepower depends on the trim: the Standard Range Plus produces approximately 283 hp, the Long Range AWD makes about 346 hp combined from its dual motors, and the Performance variant delivers approximately 510 hp. The 2024+ Highland refresh models maintained similar power figures with improved efficiency.',
    },
    {
      question: 'What is the Tesla Model 3 0-60 mph time?',
      answer:
        'The Tesla Model 3 0-60 mph times for 2025: Standard Range Plus does it in about 5.8 seconds, Long Range AWD in approximately 4.2 seconds, and the Performance in a blistering 2.9 seconds. These times are measured with 1-foot rollout subtracted, which is the industry-standard method.',
    },
  ],
  'model-y': [
    {
      question: 'Is the Tesla Model Y bigger than the Model 3?',
      answer:
        "Yes, the Model Y is significantly bigger than the Model 3. It offers about 76 cubic feet of total cargo space compared to the Model 3's 23 cubic feet, has more headroom and legroom in the rear seats, and sits higher off the ground as a crossover SUV.",
    },
    {
      question: 'Which Model Y trim is the best value?',
      answer:
        'The Model Y Long Range AWD is widely considered the best value. It offers the best range (up to 310+ miles), all-wheel drive capability, and a good balance of performance and efficiency, all at a moderate price premium over the Standard Range.',
    },
    {
      question: 'What changed in the 2025 Model Y Juniper refresh?',
      answer:
        'The 2025 Model Y Juniper refresh brought a redesigned front fascia with a sleeker light bar, updated interior with new ambient lighting, improved ride quality, enhanced sound insulation, and a revised rear design. Range and efficiency were also improved across all trims.',
    },
    {
      question: 'How much cargo space does the Model Y have?',
      answer:
        'The Tesla Model Y offers approximately 76 cubic feet of total cargo space with the rear seats folded down, and about 36 cubic feet behind the second row. This includes the front trunk (frunk) which adds roughly 4 cubic feet of additional storage.',
    },
    {
      question: 'Is the Tesla Model Y good for families?',
      answer:
        "The Model Y is Tesla's best-selling vehicle and an excellent family car. It offers spacious seating for 5 (or 7 with the optional third row), a large cargo area, easy child seat installation with LATCH anchors, and top safety ratings from NHTSA.",
    },
    {
      question: 'Does the Tesla Model Y come in 6 or 7 seats?',
      answer:
        "The standard Tesla Model Y seats 5 passengers. Tesla previously offered an optional third-row 7-seat configuration, though availability varies by market and model year. The 7-seat option adds two small seats in the cargo area, best suited for children. There is no 6-seat captain's chair configuration for the Model Y — that option is only available on the Model X.",
    },
    {
      question: 'What is the Tesla Model Y 0-60 mph time?',
      answer:
        'The 2025 Tesla Model Y 0-60 times vary by trim: Standard Range RWD does it in about 5.9 seconds, Long Range AWD in approximately 4.8 seconds, and the Performance AWD in roughly 3.5 seconds. The Juniper refresh improved these numbers slightly compared to the 2024 model year.',
    },
    {
      question: 'How much does the 2025 Tesla Model Y cost?',
      answer:
        'The 2025 Tesla Model Y Juniper starts at approximately $44,990 for the Standard Range RWD, $49,990 for the Long Range AWD, and $54,990 for the Performance AWD. After the $7,500 federal EV tax credit, the effective starting price drops to around $37,490. Prices may vary by configuration and region.',
    },
  ],
  'model-s': [
    {
      question: 'What is the Tesla Model S Plaid?',
      answer:
        "The Model S Plaid is Tesla's highest-performance sedan, featuring a tri-motor powertrain with over 1,000 horsepower. It can accelerate from 0-60 mph in under 2 seconds and has a top speed of 200 mph, making it one of the fastest production cars ever made.",
    },
    {
      question: 'How fast is the Model S Plaid 0-60?',
      answer:
        'The Tesla Model S Plaid can accelerate from 0-60 mph in approximately 1.99 seconds with rollout subtracted, making it the quickest accelerating production car available. This requires the optional Track Package for best results.',
    },
    {
      question: 'Is the Tesla Model S worth it over the Model 3?',
      answer:
        "The Model S offers premium features over the Model 3 including: a larger cabin, more range (up to 405 miles), faster acceleration, a yoke or round steering wheel option, rear-seat entertainment, and a more refined ride. Whether it's worth the $40,000+ price premium depends on your priorities.",
    },
    {
      question: 'What is the range of the Tesla Model S?',
      answer:
        'The Tesla Model S Long Range offers an EPA-estimated range of up to 405 miles on a single charge, while the Plaid variant achieves approximately 348 miles. These are among the longest ranges available in any electric vehicle.',
    },
  ],
  'model-x': [
    {
      question: 'How many seats does the Tesla Model X have?',
      answer:
        "The Tesla Model X comes standard with seating for 5 passengers and is available with optional 6-seat or 7-seat configurations. The 6-seat version features captain's chairs in the second row for easier third-row access.",
    },
    {
      question: 'Does the Tesla Model X still have falcon wing doors?',
      answer:
        'Yes, the Tesla Model X retains its signature falcon wing doors for the rear passengers. These upward-opening doors use sensors to detect obstacles and can open in tight spaces like parking garages with as little as 12 inches of clearance.',
    },
    {
      question: 'What is the towing capacity of the Tesla Model X?',
      answer:
        "The Tesla Model X has a maximum towing capacity of 5,000 pounds, making it suitable for towing small boats, trailers, and campers. This is the highest towing capacity among Tesla's SUV lineup.",
    },
    {
      question: 'How does the Model X compare to the Model Y?',
      answer:
        "The Model X is Tesla's premium SUV offering, while the Model Y is the more affordable option. The Model X offers more space, falcon wing doors, optional third-row seating, higher towing capacity (5,000 lbs vs 3,500 lbs), and faster acceleration. The Model Y is better value for money.",
    },
    {
      question: 'How much does the Tesla Model X cost in 2025?',
      answer:
        'The 2025 Tesla Model X starts at approximately $79,990 for the AWD variant and $94,990 for the Plaid. After factoring in optional configurations like 6-seat or 7-seat interiors, premium paint, and larger wheels, the price can exceed $110,000. The Model X does not qualify for the full federal EV tax credit due to its price exceeding the $80,000 SUV cap for the base AWD trim.',
    },
  ],
  cybertruck: [
    {
      question: 'What is the Cybertruck towing capacity?',
      answer:
        'The Tesla Cybertruck towing capacity varies by variant: the rear-wheel drive model can tow up to 7,500 lbs, the all-wheel drive up to 11,000 lbs, and the Cyberbeast up to 11,000 lbs. This makes it competitive with traditional pickup trucks.',
    },
    {
      question: 'When was the Tesla Cybertruck released?',
      answer:
        'The Tesla Cybertruck was first unveiled in November 2019 and began deliveries in late November 2023. The initial deliveries were of the Cyberbeast (tri-motor) and All-Wheel Drive variants, with the more affordable rear-wheel drive version following later.',
    },
    {
      question: 'How much does the Tesla Cybertruck cost?',
      answer:
        'As of 2025, the Tesla Cybertruck starts at approximately $59,990 for the rear-wheel drive model, around $79,990 for the All-Wheel Drive, and approximately $99,990 for the Cyberbeast variant. Prices may vary with options and configurations.',
    },
    {
      question: 'What is the Tesla Cybertruck range?',
      answer:
        'The Cybertruck range varies by variant: the RWD model offers approximately 250 miles, the AWD model achieves around 318 miles, and the Cyberbeast gets approximately 301 miles on a single charge (EPA estimated). A range extender accessory can add additional range.',
    },
    {
      question: 'Is the Tesla Cybertruck bulletproof?',
      answer:
        "The Cybertruck's stainless steel exoskeleton is highly durable and was demonstrated to withstand certain small-caliber rounds during the unveiling. However, it is not certified as bulletproof, and the windows are standard automotive glass (improved since the famous demo mishap).",
    },
  ],
};
