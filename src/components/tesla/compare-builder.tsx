'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateCompareSlug } from '@/lib/vehicle-utils'
import type { Vehicle, TeslaModel } from '@/lib/vehicle-utils'

interface CompareBuilderProps {
	models: TeslaModel[]
	vehicles: Vehicle[]
}

export function CompareBuilder({ models, vehicles }: CompareBuilderProps) {
	const router = useRouter()
	const [slugA, setSlugA] = useState('')
	const [slugB, setSlugB] = useState('')

	const canCompare = slugA !== '' && slugB !== '' && slugA !== slugB

	function handleCompare() {
		if (!canCompare) return
		router.push(`/compare/${generateCompareSlug([slugA, slugB])}`)
	}

	const vehiclesByModel = models.map((model) => ({
		model,
		vehicles: vehicles.filter((v) => v.modelId === model.id),
	}))

	return (
		<div className="mx-auto max-w-2xl">
			<div className="rounded-[20px] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<VehicleSelect
						label="Vehicle 1"
						value={slugA}
						onChange={setSlugA}
						excludeSlug={slugB}
						vehiclesByModel={vehiclesByModel}
					/>
					<VehicleSelect
						label="Vehicle 2"
						value={slugB}
						onChange={setSlugB}
						excludeSlug={slugA}
						vehiclesByModel={vehiclesByModel}
					/>
				</div>
				<button
					type="button"
					onClick={handleCompare}
					disabled={!canCompare}
					className="mt-6 w-full rounded-full bg-[#1D1D1F] px-8 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
				>
					Compare ›
				</button>
			</div>
		</div>
	)
}

interface VehicleSelectProps {
	label: string
	value: string
	onChange: (slug: string) => void
	excludeSlug: string
	vehiclesByModel: Array<{
		model: TeslaModel
		vehicles: Vehicle[]
	}>
}

function VehicleSelect({
	label,
	value,
	onChange,
	excludeSlug,
	vehiclesByModel,
}: VehicleSelectProps) {
	return (
		<div>
			<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">
				{label}
			</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full appearance-none rounded-xl border border-[#D2D2D7] bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-colors focus:border-[#1D1D1F]"
			>
				<option value="">Select a vehicle</option>
				{vehiclesByModel.map(({ model, vehicles }) =>
					vehicles.length > 0 ? (
						<optgroup key={model.id} label={model.name}>
							{vehicles.map((v) => (
								<option
									key={v.slug}
									value={v.slug}
									disabled={v.slug === excludeSlug}
								>
									{v.year} {v.trimName}
								</option>
							))}
						</optgroup>
					) : null,
				)}
			</select>
		</div>
	)
}
