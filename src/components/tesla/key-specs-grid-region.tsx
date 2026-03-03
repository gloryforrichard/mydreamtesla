'use client';

import { useRegion } from '@/contexts/region-context';
import type { Vehicle } from '@/lib/vehicle-utils';
import type { ReactNode } from 'react';
import { KeySpecsGrid } from './key-specs-grid';

interface KeySpecsGridRegionProps {
  vehicle: Vehicle;
  children: ReactNode;
}

export function KeySpecsGridRegion({
  vehicle,
  children,
}: KeySpecsGridRegionProps) {
  const { region } = useRegion();

  if (region === 'US') {
    return <>{children}</>;
  }

  return <KeySpecsGrid vehicle={vehicle} region={region} />;
}
