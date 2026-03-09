'use client';

import { useEffect } from 'react';

export function ConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log(
      '%c⚡ MyDreamTesla',
      'font-size:24px;font-weight:bold;color:#B85A2E;'
    );
    console.log(
      '%cEvery Tesla. Every Year. Compared.',
      'font-size:13px;color:#808080;font-style:italic;'
    );
    console.log(
      '%cBuilt with Next.js, TypeScript, and a love for EVs.',
      'font-size:12px;color:#666;'
    );
    console.log(
      '%chttps://mydreamtesla.com',
      'font-size:12px;color:#4A90D9;text-decoration:underline;'
    );
  }, []);

  return null;
}
