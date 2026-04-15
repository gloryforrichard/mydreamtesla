'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { AnglePhoto, VehicleAngle } from '@/lib/vehicle-angles';
import { DEFAULT_ANGLE } from '@/lib/vehicle-angles';

interface VehicleAngleViewerProps {
  photos: AnglePhoto[];
  alt: string;
}

export function VehicleAngleViewer({ photos, alt }: VehicleAngleViewerProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      photos.findIndex((p) => p.angle === DEFAULT_ANGLE),
      0,
    ),
  );

  const activePhoto = photos[activeIndex];

  const prev = () =>
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % photos.length);

  return (
    <div className="overflow-hidden rounded-sm bg-card">
      <div className="relative flex items-center">
        {/* Left arrow */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background sm:left-4 sm:h-11 sm:w-11"
          aria-label="Previous angle"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Image */}
        <Image
          key={activePhoto.angle}
          src={activePhoto.src}
          alt={`${alt} — ${activePhoto.label}`}
          width={1000}
          height={500}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="h-auto w-full animate-fade-in mix-blend-multiply object-contain p-6 dark:mix-blend-normal"
          priority={activePhoto.angle === DEFAULT_ANGLE}
        />

        {/* Right arrow */}
        <button
          type="button"
          onClick={next}
          className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background sm:right-4 sm:h-11 sm:w-11"
          aria-label="Next angle"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
