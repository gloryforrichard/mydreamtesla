'use client';

import { useEffect, useRef } from 'react';

type AdFormat = 'leaderboard' | 'in-article' | 'rectangle';

const AD_SIZES: Record<AdFormat, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  'in-article': { width: 728, height: 90 },
  rectangle: { width: 336, height: 280 },
};

interface AdSensePlacementProps {
  format: AdFormat;
  slot: string;
  className?: string;
}

/**
 * Reusable AdSense ad unit wrapper
 * Falls back to a placeholder in development
 */
export function AdSensePlacement({
  format,
  slot,
  className = '',
}: AdSensePlacementProps) {
  const adRef = useRef<HTMLModElement>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const size = AD_SIZES[format];

  useEffect(() => {
    if (!publisherId || !adRef.current) return;
    try {
      // biome-ignore lint/suspicious/noExplicitAny: adsbygoogle is a global
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      // biome-ignore lint/suspicious/noExplicitAny: adsbygoogle push
      (window as any).adsbygoogle.push({});
    } catch {
      // Ad blocker or script not loaded
    }
  }, [publisherId]);

  // Development placeholder
  if (!publisherId) {
    return (
      <aside
        aria-label="Advertisement"
        className={`mx-auto flex items-center justify-center border border-dashed border-[#D2D2D7] text-[11px] text-[#D2D2D7] ${className}`}
        style={{ maxWidth: size.width, height: size.height }}
      >
        Ad — {format} {size.width}×{size.height}
      </aside>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto ${className}`}
      style={{ maxWidth: size.width }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: size.width, height: size.height }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
