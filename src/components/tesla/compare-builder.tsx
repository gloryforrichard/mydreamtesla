'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useRegion } from '@/contexts/region-context';
import {
  getDisplayTrimName,
  isVehicleAvailableInRegion,
  type Region,
} from '@/lib/vehicle-region';
import { generateCompareSlug } from '@/lib/vehicle-utils';
import type { Vehicle, TeslaModel } from '@/lib/vehicle-utils';

interface CompareBuilderProps {
  models: TeslaModel[];
  vehicles: Vehicle[];
}

type SelectionState = {
  year: string;
  modelId: string;
  slug: string;
};

const EMPTY_SELECTION: SelectionState = {
  year: '',
  modelId: '',
  slug: '',
};

export function CompareBuilder({ models, vehicles }: CompareBuilderProps) {
  const router = useRouter();
  const { region } = useRegion();
  const [selectionA, setSelectionA] = useState<SelectionState>(EMPTY_SELECTION);
  const [selectionB, setSelectionB] = useState<SelectionState>(EMPTY_SELECTION);

  const availableVehicles = vehicles.filter((v) =>
    isVehicleAvailableInRegion(v, region)
  );

  const yearOptions = Array.from(
    new Set(availableVehicles.map((v) => v.year))
  ).sort((a, b) => b - a);

  useEffect(() => {
    setSelectionA((prev) => sanitizeSelection(prev, availableVehicles));
    setSelectionB((prev) => sanitizeSelection(prev, availableVehicles));
  }, [region, vehicles]);

  const canCompare =
    selectionA.slug !== '' &&
    selectionB.slug !== '' &&
    selectionA.slug !== selectionB.slug;

  function handleCompare() {
    if (!canCompare) return;
    router.push(
      `/compare/${generateCompareSlug([selectionA.slug, selectionB.slug])}`
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[20px] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VehicleSelector
            title="Vehicle 1"
            region={region}
            models={models}
            vehicles={availableVehicles}
            yearOptions={yearOptions}
            value={selectionA}
            onChange={setSelectionA}
            excludeSlug={selectionB.slug}
          />
          <VehicleSelector
            title="Vehicle 2"
            region={region}
            models={models}
            vehicles={availableVehicles}
            yearOptions={yearOptions}
            value={selectionB}
            onChange={setSelectionB}
            excludeSlug={selectionA.slug}
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
  );
}

function sanitizeSelection(
  selection: SelectionState,
  vehicles: Vehicle[]
): SelectionState {
  if (!selection.year) return EMPTY_SELECTION;

  const year = Number(selection.year);
  if (Number.isNaN(year) || !vehicles.some((v) => v.year === year)) {
    return EMPTY_SELECTION;
  }

  if (!selection.modelId) {
    return {
      year: selection.year,
      modelId: '',
      slug: '',
    };
  }

  const modelId = Number(selection.modelId);
  if (
    Number.isNaN(modelId) ||
    !vehicles.some((v) => v.year === year && v.modelId === modelId)
  ) {
    return {
      year: selection.year,
      modelId: '',
      slug: '',
    };
  }

  if (!selection.slug) {
    return {
      year: selection.year,
      modelId: selection.modelId,
      slug: '',
    };
  }

  const slugExists = vehicles.some(
    (v) => v.slug === selection.slug && v.year === year && v.modelId === modelId
  );

  if (!slugExists) {
    return {
      year: selection.year,
      modelId: selection.modelId,
      slug: '',
    };
  }

  return selection;
}

interface VehicleSelectorProps {
  title: string;
  region: Region;
  models: TeslaModel[];
  vehicles: Vehicle[];
  yearOptions: number[];
  value: SelectionState;
  onChange: (value: SelectionState) => void;
  excludeSlug: string;
}

function VehicleSelector({
  title,
  region,
  models,
  vehicles,
  yearOptions,
  value,
  onChange,
  excludeSlug,
}: VehicleSelectorProps) {
  const selectedYear = value.year ? Number(value.year) : null;
  const selectedModelId = value.modelId ? Number(value.modelId) : null;

  const modelOptions =
    selectedYear == null
      ? []
      : models.filter((model) =>
          vehicles.some(
            (v) => v.year === selectedYear && v.modelId === model.id
          )
        );

  const trimOptions =
    selectedYear == null || selectedModelId == null
      ? []
      : vehicles
          .filter(
            (v) => v.year === selectedYear && v.modelId === selectedModelId
          )
          .sort((a, b) => {
            const trimCompare = getDisplayTrimName(a, region).localeCompare(
              getDisplayTrimName(b, region)
            );
            if (trimCompare !== 0) return trimCompare;
            return a.driveType.localeCompare(b.driveType);
          });

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 block text-[11px] font-semibold uppercase tracking-[1px] text-[#86868B]">
        {title}
      </legend>

      <SelectField
        label="Year"
        value={value.year}
        onChange={(nextYear) =>
          onChange({
            year: nextYear,
            modelId: '',
            slug: '',
          })
        }
      >
        <option value="">Select year</option>
        {yearOptions.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Model"
        value={value.modelId}
        disabled={!value.year}
        onChange={(nextModelId) =>
          onChange({
            year: value.year,
            modelId: nextModelId,
            slug: '',
          })
        }
      >
        <option value="">Select model</option>
        {modelOptions.map((model) => (
          <option key={model.id} value={String(model.id)}>
            {model.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Trim"
        value={value.slug}
        disabled={!value.year || !value.modelId}
        onChange={(nextSlug) =>
          onChange({
            year: value.year,
            modelId: value.modelId,
            slug: nextSlug,
          })
        }
      >
        <option value="">Select trim</option>
        {trimOptions.map((vehicle) => (
          <option
            key={vehicle.slug}
            value={vehicle.slug}
            disabled={vehicle.slug === excludeSlug}
          >
            {`${getDisplayTrimName(vehicle, region)} · ${vehicle.driveType}`}
          </option>
        ))}
      </SelectField>
    </fieldset>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}

function SelectField({
  label,
  value,
  disabled = false,
  onChange,
  children,
}: SelectFieldProps) {
  const selectId = useId();

  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-[11px] font-medium text-[#6E6E73]"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-[#D2D2D7] bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-colors focus:border-[#1D1D1F] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
    </div>
  );
}
