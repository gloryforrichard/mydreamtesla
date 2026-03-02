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
  'model-s': [
    {
      name: 'Refresh (Plaid)',
      yearStart: 2021,
      yearEnd: 2099,
      description:
        'All-new interior with yoke steering, 17" horizontal touchscreen, rear passenger display, 22-speaker audio system, and tri-motor Plaid powertrain.',
      image: '/images/vehicles/generations/model-s-refresh.png',
    },
    {
      name: 'Facelift',
      yearStart: 2017,
      yearEnd: 2020,
      description:
        'Nosecone removed with redesigned front fascia. 2019 update brought revised headlights and refreshed rear end.',
      image: '/images/vehicles/generations/model-s-facelift.png',
    },
    {
      name: 'Original',
      yearStart: 2012,
      yearEnd: 2016,
      description:
        'Iconic nosecone design, started as RWD with later addition of AWD and Ludicrous Mode.',
      image: '/images/vehicles/generations/model-s-original.png',
    },
  ],
  'model-x': [
    {
      name: 'Refresh (Plaid)',
      yearStart: 2021,
      yearEnd: 2099,
      description:
        'All-new interior with yoke steering, horizontal touchscreen, rear passenger display, 22-speaker audio system, and tri-motor Plaid powertrain.',
      image: '/images/vehicles/generations/model-x-refresh.png',
    },
    {
      name: 'Original',
      yearStart: 2016,
      yearEnd: 2020,
      description:
        'Falcon Wing doors, portrait-oriented touchscreen, traditional steering wheel.',
      image: '/images/vehicles/generations/model-x-original.png',
    },
  ],
  'model-3': [
    {
      name: 'Highland',
      yearStart: 2024,
      yearEnd: 2099,
      description:
        'Complete exterior redesign with new front and rear fascia, full-width light bar, ventilated seats, and rear passenger display.',
      image: '/images/vehicles/generations/model-3-highland.png',
    },
    {
      name: 'Original',
      yearStart: 2017,
      yearEnd: 2023,
      description:
        'Original design with minimalist interior centered around a 15" touchscreen. Minor interior refresh in 2022.',
      image: '/images/vehicles/generations/model-3-original.png',
    },
  ],
  'model-y': [
    {
      name: 'Juniper',
      yearStart: 2025,
      yearEnd: 2099,
      description:
        'Complete exterior redesign with new front and rear fascia, full-width light bar, ventilated seats, and rear passenger display.',
      image: '/images/vehicles/generations/model-y-juniper.png',
    },
    {
      name: 'Original',
      yearStart: 2020,
      yearEnd: 2024,
      description: 'Original design based on Model 3 platform.',
      image: '/images/vehicles/generations/model-y-original.png',
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
