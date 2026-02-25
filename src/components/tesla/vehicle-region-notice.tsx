'use client';

import { useRegion } from '@/contexts/region-context';
import type { Vehicle } from '@/lib/vehicle-utils';

interface VehicleRegionNoticeProps {
  vehicle: Vehicle;
}

export function VehicleRegionNotice({ vehicle }: VehicleRegionNoticeProps) {
  const { region } = useRegion();

  if (region !== 'CA' || vehicle.caAvailable !== false) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-[#F5C46B] bg-[#FFF9EC] px-4 py-3 text-[14px] text-[#8A5A00]">
      This trim is not currently sold in Canada. Specs shown may reflect
      US-market data.
    </div>
  );
}
