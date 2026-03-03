'use client';

import { useRegion } from '@/contexts/region-context';
import type { TeslaModel, Vehicle } from '@/lib/vehicle-utils';
import type { ReactNode } from 'react';
import { ComparePageContent } from './compare-page-content';

interface ComparePageRegionProps {
  vehicles: Vehicle[];
  models: TeslaModel[];
  children: ReactNode;
}

export function ComparePageRegion({
  vehicles,
  models,
  children,
}: ComparePageRegionProps) {
  const { region } = useRegion();

  if (region === 'US') {
    return <>{children}</>;
  }

  return (
    <ComparePageContent vehicles={vehicles} models={models} region={region} />
  );
}
