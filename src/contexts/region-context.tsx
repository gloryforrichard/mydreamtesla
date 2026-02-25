'use client';

import type { Region } from '@/lib/vehicle-region';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const REGION_STORAGE_KEY = 'tesla-region';

interface RegionContextValue {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>('US');

  useEffect(() => {
    const stored = window.localStorage.getItem(REGION_STORAGE_KEY);
    if (stored === 'US' || stored === 'CA') {
      setRegionState(stored);
    }
  }, []);

  const setRegion = (nextRegion: Region) => {
    setRegionState(nextRegion);
    window.localStorage.setItem(REGION_STORAGE_KEY, nextRegion);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}

export type { Region };
