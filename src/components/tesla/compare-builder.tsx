'use client';

import { useId, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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
  const [selectionA, setSelectionA] = useState<SelectionState>(EMPTY_SELECTION);
  const [selectionB, setSelectionB] = useState<SelectionState>(EMPTY_SELECTION);

  const yearOptions = Array.from(
    new Set(vehicles.map((v) => v.year))
  ).sort((a, b) => b - a);

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
      <div className="rounded-lg bg-background p-8 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VehicleSelector
            title="Vehicle 1"
            models={models}
            vehicles={vehicles}
            yearOptions={yearOptions}
            value={selectionA}
            onChange={setSelectionA}
            excludeSlug={selectionB.slug}
          />
          <VehicleSelector
            title="Vehicle 2"
            models={models}
            vehicles={vehicles}
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
          className="mt-6 w-full rounded-lg bg-foreground px-8 py-3.5 text-[15px] font-semibold text-background transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30"
        >
          Compare ›
        </button>
      </div>
    </div>
  );
}

interface VehicleSelectorProps {
  title: string;
  models: TeslaModel[];
  vehicles: Vehicle[];
  yearOptions: number[];
  value: SelectionState;
  onChange: (value: SelectionState) => void;
  excludeSlug: string;
}

function VehicleSelector({
  title,
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
            const trimCompare = a.trimName.localeCompare(b.trimName);
            if (trimCompare !== 0) return trimCompare;
            return a.driveType.localeCompare(b.driveType);
          });

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 block text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
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
            {`${vehicle.trimName} · ${vehicle.driveType}`}
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
        className="mb-1.5 block text-[11px] font-medium text-secondary-text"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
    </div>
  );
}
