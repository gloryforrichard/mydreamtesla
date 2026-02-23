import {
	type Vehicle,
	COMPARISON_SPEC_CONFIG,
	formatPrice,
	formatSpec,
	getBestValueIndex,
} from '@/lib/vehicle-utils'

interface ComparisonTableProps {
	vehicles: Vehicle[]
}

/**
 * Apple-style side-by-side comparison table
 * Groups specs into sections with green dot for best values
 */
export function ComparisonTable({ vehicles }: ComparisonTableProps) {
	// Group specs by category
	const groups = COMPARISON_SPEC_CONFIG.reduce<
		Record<string, typeof COMPARISON_SPEC_CONFIG[number][]>
	>((acc, spec) => {
		const existing = acc[spec.group] ?? []
		return { ...acc, [spec.group]: [...existing, spec] }
	}, {})

	return (
		<article className="mx-auto max-w-[980px] px-5">
			{Object.entries(groups).map(([groupName, specs]) => (
				<section key={groupName} className="mb-8" aria-label={`${groupName} specifications`}>
					<h2 className="border-b border-[#D2D2D7] pb-2.5 text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">
						{groupName}
					</h2>
					{specs.map((spec) => {
						const values = vehicles.map((v) => {
							const raw = v[spec.key as keyof Vehicle]
							return raw
						})

						// Determine best value
						const numericValues = values.map((val) => {
							if (val == null) return null
							if (typeof val === 'number') return val
							if ('isNumericString' in spec && spec.isNumericString && typeof val === 'string') return Number.parseFloat(val)
							return null
						})

						const bestIdx =
							spec.higherIsBetter != null
								? getBestValueIndex(numericValues, spec.higherIsBetter)
								: -1

						return (
							<div
								key={spec.key}
								className="grid border-b border-black/[0.04]"
								style={{ gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)` }}
							>
								<div className="flex items-center py-3 text-[13px] font-normal text-[#6E6E73]">
									{spec.label}
								</div>
								{vehicles.map((v, i) => {
									const raw = v[spec.key as keyof Vehicle]
									const isBest = bestIdx === i

									let displayValue: string
									if ('isCurrency' in spec && spec.isCurrency) {
										displayValue = formatPrice(raw as number | null)
									} else if (spec.unit && raw != null) {
										displayValue = formatSpec(raw as number | string, spec.unit)
									} else {
										displayValue = raw != null ? String(raw) : 'N/A'
									}

									const isTextVal = spec.higherIsBetter == null

									return (
										<div
											key={v.id}
											className={`flex items-center justify-center gap-1.5 px-4 py-3 text-center text-[14px] font-semibold ${
												isBest ? 'text-[#2D8A39]' : 'text-[#1D1D1F]'
											} ${isTextVal ? 'font-medium' : ''}`}
											style={isTextVal ? { fontFamily: "'Inter', sans-serif" } : { fontFamily: "'JetBrains Mono', monospace" }}
										>
											{displayValue}
											{isBest && (
												<span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2D8A39]" />
											)}
										</div>
									)
								})}
							</div>
						)
					})}
				</section>
			))}
		</article>
	)
}
