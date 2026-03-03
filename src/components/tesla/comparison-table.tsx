import {
  type ComparisonSpecEntry,
  type Region,
  getRegionAwareComparisonSpecConfig,
} from '@/lib/vehicle-region';
import { type Vehicle, getBestValueIndex } from '@/lib/vehicle-utils';

interface ComparisonTableProps {
  vehicles: Vehicle[];
  region: Region;
}

/**
 * Editorial-style side-by-side comparison table
 * Groups specs into sections with green dot for best values
 */
export function ComparisonTable({ vehicles, region }: ComparisonTableProps) {
  const comparisonSpecConfig = getRegionAwareComparisonSpecConfig(region);

  // Group specs by category
  const groups: Record<string, ComparisonSpecEntry[]> = {};
  for (const spec of comparisonSpecConfig) {
    const existing = groups[spec.group] ?? [];
    existing.push(spec);
    groups[spec.group] = existing;
  }

  return (
    <article className="mx-auto max-w-[980px] px-5">
      {Object.entries(groups).map(([groupName, specs]) => (
        <section
          key={groupName}
          className="mb-8"
          aria-label={`${groupName} specifications`}
        >
          <h2 className="border-b border-[#E5E2DC] pb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-[#999999]">
            {groupName}
          </h2>
          {specs.map((spec) => {
            const values = vehicles.map((v) => spec.getRawValue(v));

            // Determine best value
            const numericValues = values.map((val) => {
              if (val == null) return null;
              if (typeof val === 'number') return val;
              if (spec.isNumericString && typeof val === 'string')
                return Number.parseFloat(val);
              return null;
            });

            const bestIdx =
              spec.higherIsBetter != null
                ? getBestValueIndex(numericValues, spec.higherIsBetter)
                : -1;

            return (
              <div
                key={spec.id}
                className="grid border-b border-[#E5E2DC]/50"
                style={{
                  gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)`,
                }}
              >
                <div className="flex items-center py-3 text-[13px] font-normal text-[#777777]">
                  {spec.label}
                </div>
                {vehicles.map((v, i) => {
                  const isBest = bestIdx === i;
                  const displayValue = spec.formatValue(v);
                  const isTextVal = spec.higherIsBetter == null;

                  return (
                    <div
                      key={v.id}
                      className={`flex items-center justify-center gap-1.5 px-4 py-3 text-center text-[14px] ${
                        isTextVal ? 'font-medium' : 'font-mono font-semibold'
                      } ${isBest ? 'text-[#2D8A39]' : 'text-[#1A1A1A]'}`}
                    >
                      {displayValue}
                      {isBest && (
                        <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2D8A39]" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      ))}
    </article>
  );
}
