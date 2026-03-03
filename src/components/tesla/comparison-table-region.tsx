'use client';

import { useRegion } from '@/contexts/region-context';
import type { Vehicle } from '@/lib/vehicle-utils';
import type { ReactNode } from 'react';
import { ComparisonTable } from './comparison-table';

interface ComparisonTableRegionProps {
  vehicles: Vehicle[];
  children: ReactNode;
}

export function ComparisonTableRegion({
  vehicles,
  children,
}: ComparisonTableRegionProps) {
  const { region } = useRegion();

  if (region === 'US') {
    return <>{children}</>;
  }

  return <ComparisonTable vehicles={vehicles} region={region} />;
}
