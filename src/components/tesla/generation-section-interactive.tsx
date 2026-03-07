'use client';

import { useMemo, useState } from 'react';
import type { GenerationDef } from '@/lib/vehicle-generations';
import type { Vehicle } from '@/lib/vehicle-utils';
import { cn } from '@/lib/utils';
import { GenerationSection, getTrimFamily } from './generation-section';
import type { ReactNode } from 'react';

const ALL_TRIMS = '__all__';

interface GenerationSectionInteractiveProps {
  generation: GenerationDef;
  vehicles: Vehicle[];
  modelName: string;
  children: ReactNode;
}

export function GenerationSectionInteractive({
  generation,
  vehicles,
  modelName,
  children,
}: GenerationSectionInteractiveProps) {
  const [activeTrim, setActiveTrim] = useState(ALL_TRIMS);

  // Build ordered list of unique trim families
  const trimFamilies = useMemo(() => {
    const seen = new Set<string>();
    const families: string[] = [];
    for (const v of vehicles) {
      const family = getTrimFamily(v.trimName);
      if (!seen.has(family)) {
        seen.add(family);
        families.push(family);
      }
    }
    return families;
  }, [vehicles]);

  // Reset filter if the active trim family no longer exists
  const validTrim =
    activeTrim === ALL_TRIMS || trimFamilies.includes(activeTrim);
  if (!validTrim && activeTrim !== ALL_TRIMS) {
    setActiveTrim(ALL_TRIMS);
  }

  const showFilter = trimFamilies.length > 1;
  const isDefault = activeTrim === ALL_TRIMS;

  return (
    <div>
      {/* Trim filter pills — only shown if >1 trim family */}
      {showFilter && (
        <div className="mb-4 flex flex-wrap gap-1.5" style={{ marginTop: -8 }}>
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

      {/* Show server-rendered content when all trims, otherwise re-render */}
      {isDefault ? (
        children
      ) : (
        <GenerationSection
          generation={generation}
          vehicles={vehicles}
          modelName={modelName}
          activeTrimFamily={activeTrim}
        />
      )}
    </div>
  );
}
