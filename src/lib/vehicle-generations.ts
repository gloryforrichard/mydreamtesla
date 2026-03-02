import type { Vehicle } from '@/lib/vehicle-utils';

export interface GenerationDef {
  name: string;
  yearStart: number;
  yearEnd: number;
  description: string;
  image: string;
}

type GenerationConfig = Record<string, GenerationDef[]>;

/**
 * Generation config: ordered newest-first per model.
 * yearEnd uses 2099 as sentinel for "current / ongoing".
 */
const GENERATION_CONFIG: GenerationConfig = {
  'model-3': [
    {
      name: 'Highland',
      yearStart: 2024,
      yearEnd: 2099,
      description:
        'Slimmer, sharper headlights and a lower, more angular front fascia. Completely redesigned taillights and rear bumper with a cleaner, sharper rear look. Overall body surfacing looks more flat and crisp versus the rounder earlier cars.',
      image: '/images/vehicles/generations/model-3-highland.jpg',
    },
    {
      name: 'Refresh / Chrome Delete',
      yearStart: 2021,
      yearEnd: 2023,
      description:
        'Exterior trim (window surround, door handles, etc.) switched from chrome to black. Updated wheel designs with a more blacked-out, sporty look. Same overall front/rear silhouette as the earlier Model 3.',
      image: '/images/vehicles/generations/model-3-refresh.jpg',
    },
    {
      name: 'Original / Chrome Trim',
      yearStart: 2017,
      yearEnd: 2020,
      description:
        'Bright chrome window trim and chrome door handles. Rounder, softer front-end look with the classic Model 3 face. Thicker-looking taillights and a generally softer, less sharp appearance.',
      image: '/images/vehicles/generations/model-3-original.webp',
    },
  ],
  'model-y': [
    {
      name: 'Juniper',
      yearStart: 2025,
      yearEnd: 2099,
      description:
        'New front lighting signature with thin headlights and a more modern, horizontal look. Front bumper/fascia redesigned to look smoother and wider. Rear lighting design updated with a more distinctive appearance.',
      image: '/images/vehicles/generations/model-y-juniper.webp',
    },
    {
      name: 'Original',
      yearStart: 2020,
      yearEnd: 2024,
      description:
        'No new front lighting signature; front end looks more bulbous/rounded. Headlights look more traditional and less slit-like. Overall appearance closely matches the pre-Highland Model 3 design language.',
      image: '/images/vehicles/generations/model-y-original.webp',
    },
  ],
  'model-s': [
    {
      name: 'Refresh',
      yearStart: 2021,
      yearEnd: 2099,
      description:
        'Cleaner, more modern lighting and sharper bumper detailing. More blacked-out exterior trim look compared to earlier years. Wheels/diffuser details skew more performance-focused, especially Plaid.',
      image: '/images/vehicles/generations/model-s-refresh.png',
    },
    {
      name: 'Original',
      yearStart: 2012,
      yearEnd: 2020,
      description:
        'The classic Model S design spanning the original nose cone era through the mid-cycle facelift. Early models featured a distinct black nose cone panel, while 2016+ adopted a smoother, cleaner front end.',
      image: '/images/vehicles/generations/model-s-original.png',
    },
  ],
  'model-x': [
    {
      name: 'Refresh',
      yearStart: 2021,
      yearEnd: 2099,
      description:
        'More blacked-out trim overall with less chrome. Subtle front/rear bumper detailing changes. Newer wheel styles and updated interior with yoke steering.',
      image: '/images/vehicles/generations/model-x-original.png',
    },
    {
      name: 'Original',
      yearStart: 2015,
      yearEnd: 2020,
      description:
        'Iconic Falcon Wing doors with the original Model X design language. Exterior changes across these years were subtle — the silhouette, doors, and overall proportions remained largely the same.',
      image: '/images/vehicles/generations/model-x-original.png',
    },
  ],
  cybertruck: [
    {
      name: 'Production',
      yearStart: 2023,
      yearEnd: 2099,
      description:
        'Stainless-steel, sharp-edged body panels with the iconic wedge shape. Real-world details include large single wiper, full mirrors, and bulkier lower cladding. Looks slightly more filled out and production-ready vs the reveal prototype.',
      image: '/images/vehicles/generations/cybertruck-production.avif',
    },
  ],
};

export function getVehicleGeneration(
  modelSlug: string,
  year: number,
): GenerationDef | null {
  const generations = GENERATION_CONFIG[modelSlug];
  if (!generations) return null;
  return (
    generations.find((g) => year >= g.yearStart && year <= g.yearEnd) ?? null
  );
}

export function getGenerationsForModel(modelSlug: string): GenerationDef[] {
  return GENERATION_CONFIG[modelSlug] ?? [];
}

/**
 * Group vehicles by generation (newest generation first).
 * Within each generation, vehicles are sorted by year desc, then trimName asc.
 */
export function groupVehiclesByGeneration(
  vehicles: Vehicle[],
  modelSlug: string,
): { generation: GenerationDef; vehicles: Vehicle[] }[] {
  const generations = getGenerationsForModel(modelSlug);
  if (generations.length === 0) {
    // Fallback: treat all vehicles as a single "All Years" group
    return [
      {
        generation: {
          name: 'All Years',
          yearStart: 0,
          yearEnd: 2099,
          description: '',
          image: '',
        },
        vehicles: [...vehicles].sort(
          (a, b) => b.year - a.year || a.trimName.localeCompare(b.trimName),
        ),
      },
    ];
  }

  const grouped = new Map<GenerationDef, Vehicle[]>();
  for (const gen of generations) {
    grouped.set(gen, []);
  }

  for (const vehicle of vehicles) {
    const gen = getVehicleGeneration(modelSlug, vehicle.year);
    if (gen) {
      grouped.get(gen)!.push(vehicle);
    }
  }

  return generations
    .map((gen) => ({
      generation: gen,
      vehicles: grouped.get(gen)!.sort(
        (a, b) => b.year - a.year || a.trimName.localeCompare(b.trimName),
      ),
    }))
    .filter((g) => g.vehicles.length > 0);
}
