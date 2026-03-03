'use client';

import { useRegion } from '@/contexts/region-context';
import type { Vehicle } from '@/lib/vehicle-utils';
import type { ReactNode } from 'react';
import { SpecTable } from './spec-table';

interface SpecTableRegionProps {
  vehicle: Vehicle;
  children: ReactNode;
}

export function SpecTableRegion({ vehicle, children }: SpecTableRegionProps) {
  const { region } = useRegion();

  if (region === 'US') {
    return <>{children}</>;
  }

  return <SpecTable vehicle={vehicle} region={region} />;
}
