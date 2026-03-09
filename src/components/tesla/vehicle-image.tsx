'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VehicleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackLabel?: string;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export function VehicleImage({
  src,
  alt,
  width,
  height,
  fallbackLabel,
  className,
  fallbackClassName,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: VehicleImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={
          fallbackClassName ??
          'flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-[#E8E5DF] to-[#D6D3CD]'
        }
      >
        {fallbackLabel && (
          <span className="text-5xl font-bold tracking-tight text-black/[0.06]">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
