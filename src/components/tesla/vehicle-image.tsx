'use client'

import Image from 'next/image'
import { useState } from 'react'

interface VehicleImageProps {
  src: string
  alt: string
  width: number
  height: number
  fallbackLabel?: string
  className?: string
  fallbackClassName?: string
  priority?: boolean
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
}: VehicleImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={
          fallbackClassName ??
          'flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-[#E8E8ED] to-[#D2D2D7]'
        }
      >
        {fallbackLabel && (
          <span className="text-5xl font-bold tracking-tight text-black/[0.06]">
            {fallbackLabel}
          </span>
        )}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  )
}
