import {
  COMPARISON_SPEC_CONFIG,
  type Vehicle,
  formatPrice,
  formatSpec,
  getBestValueIndex,
} from '@/lib/vehicle-utils';

interface ComparisonTableProps {
  vehicles: Vehicle[];
}

interface SpecEntry {
  id: string;
  group: string;
  label: string;
  getRawValue: (v: Vehicle) => number | string | null | undefined;
  formatValue: (v: Vehicle) => string;
  higherIsBetter: boolean | null;
  isNumericString?: boolean;
}

function buildSpecEntries(): SpecEntry[] {
  return COMPARISON_SPEC_CONFIG.map((spec) => ({
    id: spec.key,
    group: spec.group,
    label: spec.label,
    higherIsBetter: spec.higherIsBetter ?? null,
    isNumericString: 'isNumericString' in spec ? spec.isNumericString : false,
    getRawValue: (v: Vehicle) => {
      const val = v[spec.key as keyof Vehicle];
      return val as number | string | null | undefined;
    },
    formatValue: (v: Vehicle) => {
      const val = v[spec.key as keyof Vehicle];
      if ('isCurrency' in spec && spec.isCurrency) {
        return formatPrice(val as number | null | undefined);
      }
      return formatSpec(
        val as number | string | null | undefined,
        spec.unit || undefined,
      );
    },
  }));
}

export function ComparisonTable({ vehicles }: ComparisonTableProps) {
  const specEntries = buildSpecEntries();

  const groups: Record<string, SpecEntry[]> = {};
  for (const spec of specEntries) {
    const existing = groups[spec.group] ?? [];
    existing.push(spec);
    groups[spec.group] = existing;
  }

  return (
    <article className="mx-auto max-w-[1400px] px-8">
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="min-w-[360px] sm:min-w-[480px]">
          {Object.entries(groups).map(([groupName, specs]) => (
            <section
              key={groupName}
              className="mb-8"
              aria-label={`${groupName} specifications`}
            >
              <h2 className="border-b border-line pb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-ink-3">
                {groupName}
              </h2>
              {specs.map((spec) => {
                const values = vehicles.map((v) => spec.getRawValue(v));

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
                    className="grid border-b border-line/50"
                    style={{
                      gridTemplateColumns: `clamp(90px, 22vw, 180px) repeat(${vehicles.length}, 1fr)`,
                    }}
                  >
                    <div className="flex items-center py-3 text-[12px] font-normal text-ink-2 sm:text-[13px]">
                      {spec.label}
                    </div>
                    {vehicles.map((v, i) => {
                      const isBest = bestIdx === i;
                      const displayValue = spec.formatValue(v);
                      const isTextVal = spec.higherIsBetter == null;

                      return (
                        <div
                          key={v.id}
                          className={`flex items-center justify-center gap-1 px-2 py-3 text-center text-[13px] sm:gap-1.5 sm:px-4 sm:text-[14px] ${
                            isTextVal ? 'font-medium' : 'font-mono font-semibold'
                          } ${isBest ? 'text-success' : 'text-foreground'}`}
                        >
                          {displayValue}
                          {isBest && (
                            <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
