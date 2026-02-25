import { formatPrice, formatSpec, type Vehicle } from './vehicle-utils';
import {
  cuFtToL,
  inchesToMm,
  lbsToKg,
  miToKm,
  mphToKmh,
  whPerMiToWhPerKm,
} from './unit-utils';

export type Region = 'US' | 'CA';

type ComparisonRawValue = number | string | null | undefined;

export type ComparisonSpecEntry = {
  id: string;
  group: string;
  label: string;
  higherIsBetter: boolean | null;
  isNumericString?: boolean;
  getRawValue: (vehicle: Vehicle) => ComparisonRawValue;
  formatValue: (vehicle: Vehicle) => string;
};

type RegionSpecKey =
  | 'rangeEPA'
  | 'acceleration'
  | 'topSpeed'
  | 'horsepower'
  | 'superchargerRateMax'
  | 'length'
  | 'width'
  | 'height'
  | 'wheelbase'
  | 'groundClearance'
  | 'curbWeight'
  | 'cargoVolume'
  | 'frunkVolume'
  | 'towingCapacity'
  | 'energyConsumption'
  | 'basePriceMSRP'
  | 'destinationFee'
  | 'effectivePrice'
  | 'federalTaxCredit';

type RegionSpecMeta = {
  label: string;
  value: number | string | null;
  unit?: string;
};

function parseNumeric(
  value: number | string | null | undefined
): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumericLike(
  value: number | string | null | undefined,
  unit?: string
): string {
  if (value == null) return 'N/A';
  if (unit) return formatSpec(value, unit);
  return String(value);
}

function formatMoney(value: number | null | undefined): string {
  return formatPrice(value);
}

export function isVehicleAvailableInRegion(vehicle: Vehicle, region: Region) {
  if (region === 'US') return true;
  return vehicle.caAvailable !== false;
}

export function getDisplayTrimName(vehicle: Vehicle, region: Region) {
  if (region === 'CA' && vehicle.caTrimName) return vehicle.caTrimName;
  return vehicle.trimName;
}

export function getDisplayTitle(vehicle: Vehicle, region: Region) {
  const displayTrim = getDisplayTrimName(vehicle, region);
  if (displayTrim === vehicle.trimName) return vehicle.title;
  if (vehicle.title.includes(vehicle.trimName)) {
    return vehicle.title.replace(vehicle.trimName, displayTrim);
  }
  return `${vehicle.year} Tesla ${displayTrim}`;
}

export function getRegionSpecMeta(
  vehicle: Vehicle,
  key: RegionSpecKey,
  region: Region
): RegionSpecMeta {
  const isCA = region === 'CA';

  switch (key) {
    case 'rangeEPA': {
      if (isCA) {
        const km =
          vehicle.caRangeEPAkm ??
          (vehicle.rangeEPA != null ? miToKm(vehicle.rangeEPA) : null);
        return { label: 'EPA Range', value: km, unit: 'km' };
      }
      return { label: 'EPA Range', value: vehicle.rangeEPA, unit: 'mi' };
    }
    case 'acceleration': {
      if (isCA) {
        return {
          label: '0-100 km/h',
          value: vehicle.caAcceleration0100,
          unit: 's',
        };
      }
      return { label: '0-60 mph', value: vehicle.acceleration060, unit: 's' };
    }
    case 'topSpeed': {
      if (isCA) {
        const kmh =
          vehicle.caTopSpeedKmh ??
          (vehicle.topSpeed != null ? mphToKmh(vehicle.topSpeed) : null);
        return { label: 'Top Speed', value: kmh, unit: 'km/h' };
      }
      return { label: 'Top Speed', value: vehicle.topSpeed, unit: 'mph' };
    }
    case 'horsepower': {
      const hp = isCA
        ? (vehicle.caHorsepower ?? vehicle.horsepower)
        : vehicle.horsepower;
      return { label: 'Horsepower', value: hp, unit: 'hp' };
    }
    case 'superchargerRateMax': {
      const kw = isCA
        ? (vehicle.caSuperchargerRateMax ?? vehicle.superchargerRateMax)
        : vehicle.superchargerRateMax;
      return { label: 'Supercharger Max', value: kw, unit: 'kW' };
    }
    case 'length':
    case 'width':
    case 'height':
    case 'wheelbase':
    case 'groundClearance': {
      const raw = parseNumeric(vehicle[key]);
      if (isCA) {
        return {
          label:
            key === 'groundClearance'
              ? 'Ground Clearance'
              : key === 'wheelbase'
                ? 'Wheelbase'
                : key[0].toUpperCase() + key.slice(1),
          value: raw != null ? inchesToMm(raw) : null,
          unit: 'mm',
        };
      }
      return {
        label:
          key === 'groundClearance'
            ? 'Ground Clearance'
            : key === 'wheelbase'
              ? 'Wheelbase'
              : key[0].toUpperCase() + key.slice(1),
        value: vehicle[key],
        unit: 'in',
      };
    }
    case 'curbWeight':
    case 'towingCapacity': {
      const raw = vehicle[key];
      if (isCA) {
        return {
          label: key === 'curbWeight' ? 'Curb Weight' : 'Towing Capacity',
          value: raw != null ? lbsToKg(raw) : null,
          unit: 'kg',
        };
      }
      return {
        label: key === 'curbWeight' ? 'Curb Weight' : 'Towing Capacity',
        value: raw,
        unit: 'lbs',
      };
    }
    case 'cargoVolume':
    case 'frunkVolume': {
      const raw = parseNumeric(vehicle[key]);
      if (isCA) {
        return {
          label: key === 'cargoVolume' ? 'Cargo Volume' : 'Frunk Volume',
          value: raw != null ? cuFtToL(raw) : null,
          unit: 'L',
        };
      }
      return {
        label: key === 'cargoVolume' ? 'Cargo Volume' : 'Frunk Volume',
        value: vehicle[key],
        unit: 'cu ft',
      };
    }
    case 'energyConsumption': {
      if (isCA) {
        return {
          label: 'Energy Consumption',
          value:
            vehicle.energyConsumption != null
              ? whPerMiToWhPerKm(vehicle.energyConsumption)
              : null,
          unit: 'Wh/km',
        };
      }
      return {
        label: 'Energy Consumption',
        value: vehicle.energyConsumption,
        unit: 'Wh/mi',
      };
    }
    case 'basePriceMSRP':
      return {
        label: isCA ? 'Base MSRP (USD)' : 'Base MSRP',
        value: vehicle.basePriceMSRP,
      };
    case 'destinationFee':
      return {
        label: isCA ? 'Destination Fee (USD)' : 'Destination Fee',
        value: vehicle.destinationFee,
      };
    case 'effectivePrice':
      return {
        label: isCA ? 'Effective Price (USD)' : 'Effective Price',
        value: vehicle.effectivePrice,
      };
    case 'federalTaxCredit':
      return { label: 'Federal Tax Credit', value: vehicle.federalTaxCredit };
    default:
      return { label: String(key), value: null };
  }
}

export function formatRegionSpecValue(
  vehicle: Vehicle,
  key: RegionSpecKey,
  region: Region
) {
  const meta = getRegionSpecMeta(vehicle, key, region);

  if (
    key === 'basePriceMSRP' ||
    key === 'destinationFee' ||
    key === 'effectivePrice' ||
    key === 'federalTaxCredit'
  ) {
    return formatMoney(meta.value as number | null | undefined);
  }

  return formatNumericLike(meta.value, meta.unit);
}

export function getRegionAwareComparisonSpecConfig(
  region: Region
): ComparisonSpecEntry[] {
  const isCA = region === 'CA';

  return [
    {
      id: 'acceleration',
      group: 'Performance',
      label: isCA ? '0–100 km/h' : '0–60 mph',
      higherIsBetter: false,
      isNumericString: true,
      getRawValue: (v) => (isCA ? v.caAcceleration0100 : v.acceleration060),
      formatValue: (v) =>
        formatNumericLike(isCA ? v.caAcceleration0100 : v.acceleration060, 's'),
    },
    {
      id: 'topSpeed',
      group: 'Performance',
      label: 'Top Speed',
      higherIsBetter: true,
      getRawValue: (v) =>
        isCA
          ? (v.caTopSpeedKmh ??
            (v.topSpeed != null ? mphToKmh(v.topSpeed) : null))
          : v.topSpeed,
      formatValue: (v) => formatRegionSpecValue(v, 'topSpeed', region),
    },
    {
      id: 'horsepower',
      group: 'Performance',
      label: 'Horsepower',
      higherIsBetter: true,
      getRawValue: (v) =>
        isCA ? (v.caHorsepower ?? v.horsepower) : v.horsepower,
      formatValue: (v) => formatRegionSpecValue(v, 'horsepower', region),
    },
    {
      id: 'torque',
      group: 'Performance',
      label: 'Torque',
      higherIsBetter: true,
      getRawValue: (v) => v.torque,
      formatValue: (v) => formatSpec(v.torque, 'lb-ft'),
    },
    {
      id: 'quarterMile',
      group: 'Performance',
      label: 'Quarter Mile',
      higherIsBetter: false,
      isNumericString: true,
      getRawValue: (v) => v.quarterMile,
      formatValue: (v) => (v.quarterMile ? `${v.quarterMile}s` : 'N/A'),
    },
    {
      id: 'driveType',
      group: 'Performance',
      label: 'Drive Type',
      higherIsBetter: null,
      getRawValue: (v) => v.driveType,
      formatValue: (v) => v.driveType || 'N/A',
    },
    {
      id: 'rangeEPA',
      group: 'Battery & Charging',
      label: 'EPA Range',
      higherIsBetter: true,
      getRawValue: (v) =>
        isCA
          ? (v.caRangeEPAkm ?? (v.rangeEPA != null ? miToKm(v.rangeEPA) : null))
          : v.rangeEPA,
      formatValue: (v) => formatRegionSpecValue(v, 'rangeEPA', region),
    },
    {
      id: 'batteryCapacity',
      group: 'Battery & Charging',
      label: 'Battery',
      higherIsBetter: true,
      isNumericString: true,
      getRawValue: (v) => v.batteryCapacity,
      formatValue: (v) =>
        v.batteryCapacity ? `${v.batteryCapacity} kWh` : 'N/A',
    },
    {
      id: 'superchargerRateMax',
      group: 'Battery & Charging',
      label: 'Supercharger Max',
      higherIsBetter: true,
      getRawValue: (v) =>
        isCA
          ? (v.caSuperchargerRateMax ?? v.superchargerRateMax)
          : v.superchargerRateMax,
      formatValue: (v) =>
        formatRegionSpecValue(v, 'superchargerRateMax', region),
    },
    {
      id: 'chargingTime1050',
      group: 'Battery & Charging',
      label: '10→50% Time',
      higherIsBetter: null,
      getRawValue: (v) => v.chargingTime1050,
      formatValue: (v) => v.chargingTime1050 ?? 'N/A',
    },
    {
      id: 'length',
      group: 'Dimensions & Weight',
      label: 'Length',
      higherIsBetter: null,
      isNumericString: true,
      getRawValue: (v) =>
        isCA
          ? (() => {
              const raw = parseNumeric(v.length);
              return raw != null ? inchesToMm(raw) : null;
            })()
          : v.length,
      formatValue: (v) => formatRegionSpecValue(v, 'length', region),
    },
    {
      id: 'width',
      group: 'Dimensions & Weight',
      label: 'Width',
      higherIsBetter: null,
      isNumericString: true,
      getRawValue: (v) =>
        isCA
          ? (() => {
              const raw = parseNumeric(v.width);
              return raw != null ? inchesToMm(raw) : null;
            })()
          : v.width,
      formatValue: (v) => formatRegionSpecValue(v, 'width', region),
    },
    {
      id: 'height',
      group: 'Dimensions & Weight',
      label: 'Height',
      higherIsBetter: null,
      isNumericString: true,
      getRawValue: (v) =>
        isCA
          ? (() => {
              const raw = parseNumeric(v.height);
              return raw != null ? inchesToMm(raw) : null;
            })()
          : v.height,
      formatValue: (v) => formatRegionSpecValue(v, 'height', region),
    },
    {
      id: 'curbWeight',
      group: 'Dimensions & Weight',
      label: 'Curb Weight',
      higherIsBetter: false,
      getRawValue: (v) =>
        isCA
          ? v.curbWeight != null
            ? lbsToKg(v.curbWeight)
            : null
          : v.curbWeight,
      formatValue: (v) => formatRegionSpecValue(v, 'curbWeight', region),
    },
    {
      id: 'cargoVolume',
      group: 'Dimensions & Weight',
      label: 'Cargo Volume',
      higherIsBetter: true,
      getRawValue: (v) =>
        isCA
          ? (() => {
              const raw = parseNumeric(v.cargoVolume);
              return raw != null ? cuFtToL(raw) : null;
            })()
          : v.cargoVolume,
      formatValue: (v) => formatRegionSpecValue(v, 'cargoVolume', region),
    },
    {
      id: 'seatingCapacity',
      group: 'Dimensions & Weight',
      label: 'Seating',
      higherIsBetter: true,
      getRawValue: (v) => v.seatingCapacity,
      formatValue: (v) => formatSpec(v.seatingCapacity),
    },
    {
      id: 'basePriceMSRP',
      group: 'Pricing',
      label: isCA ? 'Base MSRP (USD)' : 'Base MSRP',
      higherIsBetter: false,
      getRawValue: (v) => v.basePriceMSRP,
      formatValue: (v) => formatPrice(v.basePriceMSRP),
    },
    {
      id: 'federalTaxCredit',
      group: 'Pricing',
      label: 'Tax Credit',
      higherIsBetter: true,
      getRawValue: (v) => v.federalTaxCredit,
      formatValue: (v) => formatPrice(v.federalTaxCredit),
    },
    {
      id: 'effectivePrice',
      group: 'Pricing',
      label: isCA ? 'Effective Price (USD)' : 'Effective Price',
      higherIsBetter: false,
      getRawValue: (v) => v.effectivePrice,
      formatValue: (v) => formatPrice(v.effectivePrice),
    },
    {
      id: 'mpge',
      group: 'Efficiency',
      label: 'MPGe',
      higherIsBetter: true,
      getRawValue: (v) => v.mpge,
      formatValue: (v) => formatSpec(v.mpge),
    },
    {
      id: 'energyConsumption',
      group: 'Efficiency',
      label: isCA ? 'Energy Use (Wh/km)' : 'Energy Use',
      higherIsBetter: false,
      getRawValue: (v) =>
        isCA
          ? v.energyConsumption != null
            ? whPerMiToWhPerKm(v.energyConsumption)
            : null
          : v.energyConsumption,
      formatValue: (v) => formatRegionSpecValue(v, 'energyConsumption', region),
    },
  ];
}
