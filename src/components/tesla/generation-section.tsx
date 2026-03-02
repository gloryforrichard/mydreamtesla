'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRegion } from '@/contexts/region-context';
import type { GenerationDef } from '@/lib/vehicle-generations';
import {
  formatRegionSpecValue,
  getDisplayTrimName,
} from '@/lib/vehicle-region';
import { formatPrice } from '@/lib/vehicle-utils';
import type { Vehicle } from '@/lib/vehicle-utils';
import { cn } from '@/lib/utils';
import { VehicleImage } from './vehicle-image';
import { ChevronRight } from 'lucide-react';

const ALL_TRIMS = '__all__';

interface GenerationSectionProps {
  generation: GenerationDef;
  vehicles: Vehicle[];
  modelName: string;
}

function formatYearRange(yearStart: number, yearEnd: number): string {
  const endDisplay = yearEnd >= 2099 ? 'Present' : String(yearEnd);
  return `${yearStart}–${endDisplay}`;
}

/**
 * Map a trim name to a broader family so that year-over-year renames
 * (e.g. "Standard Range Plus" → "Rear-Wheel Drive") share one filter pill.
 */
function getTrimFamily(trimName: string): string {
  const lower = trimName.toLowerCase();

  // Performance tier
  if (
    lower === 'performance' ||
    lower === 'plaid' ||
    lower.startsWith('p8') ||
    lower.startsWith('p9') ||
    lower.startsWith('p10')
  )
    return 'Performance';

  // Long Range tier
  if (
    lower === 'long range' ||
    lower === 'long range plus' ||
    lower === '100d' ||
    lower === '90d' ||
    lower === '85d' ||
    lower === '85' ||
    lower === '70d'
  )
    return 'Long Range';

  // Standard / base tier
  if (
    lower === 'standard range' ||
    lower === 'standard range plus' ||
    lower === 'rear-wheel drive' ||
    lower === 'premium rwd' ||
    lower === '75d' ||
    lower === '60' ||
    lower === 'mid range'
  )
    return 'Standard';

  // AWD mid-tier (Model S/X "AWD", Model Y "AWD", "Premium AWD")
  if (lower === 'awd' || lower === 'premium awd') return 'AWD';

  return trimName;
}

export function GenerationSection({
  generation,
  vehicles,
  modelName,
}: GenerationSectionProps) {
  const { region } = useRegion();
  const isCA = region === 'CA';
  const [activeTrim, setActiveTrim] = useState(ALL_TRIMS);

  // Build ordered list of unique trim families present in this generation
  const trimFamilies = useMemo(() => {
    const seen = new Set<string>();
    const families: string[] = [];
    for (const v of vehicles) {
      const display = getDisplayTrimName(v, region);
      const family = getTrimFamily(display);
      if (!seen.has(family)) {
        seen.add(family);
        families.push(family);
      }
    }
    return families;
  }, [vehicles, region]);

  // Filter vehicles by selected trim family
  const filteredVehicles = useMemo(() => {
    if (activeTrim === ALL_TRIMS) return vehicles;
    return vehicles.filter((v) => {
      const display = getDisplayTrimName(v, region);
      return getTrimFamily(display) === activeTrim;
    });
  }, [vehicles, activeTrim, region]);

  // Reset filter if the active trim family no longer exists (e.g. region switch)
  const validTrim =
    activeTrim === ALL_TRIMS || trimFamilies.includes(activeTrim);
  if (!validTrim && activeTrim !== ALL_TRIMS) {
    // will settle on next render
    setActiveTrim(ALL_TRIMS);
  }

  const showFilter = trimFamilies.length > 1;

  return (
    <section className="mb-12">
      {/* Generation header */}
      <h2 className="mb-1 font-display text-[28px] font-bold tracking-[-0.5px] text-[#1A1A1A]">
        {generation.name}{' '}
        <span className="text-[22px] font-normal text-[#999999]">
          ({formatYearRange(generation.yearStart, generation.yearEnd)})
        </span>
      </h2>
      {generation.description && (
        <p className="mb-6 max-w-3xl text-[14px] leading-relaxed text-[#777777]">
          {generation.description}
        </p>
      )}

      {/* Left image + right table layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Image — stacks on top on mobile, left side on desktop */}
        <div className="flex-shrink-0 lg:sticky lg:top-24 lg:w-[40%] lg:self-start">
          <div className="overflow-hidden rounded-sm bg-[#F5F2ED]">
            <VehicleImage
              src={generation.image}
              alt={`Tesla ${modelName} ${generation.name}`}
              width={800}
              height={400}
              className="h-auto w-full object-contain p-6"
              fallbackClassName="flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-[#E8E5DF] to-[#D6D3CD]"
              fallbackLabel={modelName}
            />
          </div>
        </div>

        {/* Table */}
        <div className="min-w-0 flex-1">
          {/* Trim filter pills */}
          {showFilter && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTrim(ALL_TRIMS)}
                className={cn(
                  'rounded-full px-3 py-1 text-[12px] font-semibold transition-colors',
                  activeTrim === ALL_TRIMS
                    ? 'bg-[#1A1A1A] text-white'
                    : 'border border-black/[0.08] bg-white/80 text-[#999999] hover:text-[#555555]',
                )}
              >
                All
              </button>
              {trimFamilies.map((family) => (
                <button
                  key={family}
                  type="button"
                  onClick={() => setActiveTrim(family)}
                  className={cn(
                    'rounded-full px-3 py-1 text-[12px] font-semibold transition-colors',
                    activeTrim === family
                      ? 'bg-[#1A1A1A] text-white'
                      : 'border border-black/[0.08] bg-white/80 text-[#999999] hover:text-[#555555]',
                  )}
                >
                  {family}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E2DC] text-xs font-medium uppercase tracking-wider text-[#999999]">
                  <th className="py-3 pr-3 font-medium">Year</th>
                  <th className="px-3 py-3 font-medium">Trim</th>
                  <th className="hidden px-3 py-3 font-medium lg:table-cell">Drive</th>
                  <th className="px-3 py-3 font-medium">
                    {isCA ? 'Range (km)' : 'Range (mi)'}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {isCA ? '0-100' : '0-60'}
                  </th>
                  <th className="hidden px-3 py-3 font-medium lg:table-cell">HP</th>
                  {/* Price column hidden for now */}
                  <th className="w-8 py-3 pl-3">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="group border-b border-[#F0EDE8] transition-colors hover:bg-[#F9F7F4]"
                  >
                    <td className="py-3 pr-3 font-mono text-[13px] text-[#777777]">
                      {vehicle.year}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vehicles/${vehicle.slug}`}
                          className="font-medium text-[#1A1A1A] transition-colors hover:text-[#555555]"
                        >
                          {getDisplayTrimName(vehicle, region)}
                        </Link>
                        {vehicle.isCurrentModel && (
                          <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2E7D32]">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 text-[13px] text-[#777777] lg:table-cell">
                      {vehicle.driveType || 'N/A'}
                    </td>
                    <td className="px-3 py-3 font-mono text-[13px] text-[#1A1A1A]">
                      {formatRegionSpecValue(vehicle, 'rangeEPA', region)}
                    </td>
                    <td className="px-3 py-3 font-mono text-[13px] text-[#1A1A1A]">
                      {formatRegionSpecValue(vehicle, 'acceleration', region)}
                    </td>
                    <td className="hidden px-3 py-3 font-mono text-[13px] text-[#1A1A1A] lg:table-cell">
                      {formatRegionSpecValue(vehicle, 'horsepower', region)}
                    </td>
                    {/* Price cell hidden for now */}
                    <td className="py-3 pl-3">
                      <Link
                        href={`/vehicles/${vehicle.slug}`}
                        className="inline-flex items-center text-[#CCCCCC] transition-colors group-hover:text-[#999999]"
                        aria-label={`View ${vehicle.title} details`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
