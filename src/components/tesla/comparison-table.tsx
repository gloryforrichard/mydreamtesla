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
    <article className="mx-auto max-w-[980px] px-5">
      {Object.entries(groups).map(([groupName, specs]) => (
        <section
          key={groupName}
          className="mb-8"
          aria-label={`${groupName} specifications`}
        >
          <h2 className="border-b border-border pb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
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
                className="grid border-b border-border/50"
                style={{
                  gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)`,
                }}
              >
                <div className="flex items-center py-3 text-[13px] font-normal text-secondary-text">
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
    </article>
  );
}
