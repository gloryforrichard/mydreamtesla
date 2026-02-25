'use client';

import { useRegion } from '@/contexts/region-context';
import { useLocalePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface RegionToggleProps {
  className?: string;
}

function isTeslaDataRoute(pathname: string) {
  return (
    pathname === '/models' ||
    pathname.startsWith('/models/') ||
    pathname === '/vehicles' ||
    pathname.startsWith('/vehicles/') ||
    pathname === '/compare' ||
    pathname.startsWith('/compare/')
  );
}

export function RegionToggle({ className }: RegionToggleProps) {
  const pathname = useLocalePathname();
  const { region, setRegion } = useRegion();

  if (!isTeslaDataRoute(pathname)) return null;

  return (
    <fieldset
      className={cn(
        'inline-flex items-center rounded-full border border-black/[0.08] bg-white/80 p-0.5',
        className
      )}
    >
      <legend className="sr-only">Region selector</legend>
      <button
        type="button"
        onClick={() => setRegion('US')}
        aria-pressed={region === 'US'}
        className={cn(
          'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
          region === 'US' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73]'
        )}
      >
        US
      </button>
      <button
        type="button"
        onClick={() => setRegion('CA')}
        aria-pressed={region === 'CA'}
        className={cn(
          'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
          region === 'CA' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73]'
        )}
      >
        CA
      </button>
    </fieldset>
  );
}
