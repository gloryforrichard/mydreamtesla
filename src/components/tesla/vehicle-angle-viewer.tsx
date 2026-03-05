'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AnglePhoto, VehicleAngle } from '@/lib/vehicle-angles';
import { DEFAULT_ANGLE } from '@/lib/vehicle-angles';

interface VehicleAngleViewerProps {
  photos: AnglePhoto[];
  alt: string;
}

export function VehicleAngleViewer({ photos, alt }: VehicleAngleViewerProps) {
  const [activeAngle, setActiveAngle] = useState<VehicleAngle>(DEFAULT_ANGLE);
  const [failedAngles, setFailedAngles] = useState<Set<VehicleAngle>>(
    new Set(),
  );

  const activePhoto = photos.find((p) => p.angle === activeAngle) ?? photos[0];

  return (
    <div className="overflow-hidden rounded-sm bg-[#F5F2ED]">
      {/* Main image */}
      <div className="relative">
        <Image
          key={activeAngle}
          src={activePhoto.src}
          alt={`${alt} — ${activePhoto.label}`}
          width={1000}
          height={500}
          className="h-auto w-full animate-fade-in mix-blend-multiply object-contain p-6"
          priority={activeAngle === DEFAULT_ANGLE}
          onError={() =>
            setFailedAngles((prev) => new Set(prev).add(activeAngle))
          }
        />
      </div>

      {/* Angle selector */}
      <div className="flex items-center justify-center gap-2 border-t border-black/5 px-4 py-3">
        {photos.map((photo) => {
          const failed = failedAngles.has(photo.angle);
          const isActive = photo.angle === activeAngle;
          return (
            <button
              key={photo.angle}
              type="button"
              onClick={() => setActiveAngle(photo.angle)}
              disabled={failed}
              className={cn(
                'rounded-sm px-3 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#777777] hover:bg-black/5 hover:text-[#1A1A1A]',
                failed && 'cursor-not-allowed opacity-40',
              )}
            >
              {photo.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
