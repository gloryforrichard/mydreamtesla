import {
  Manrope,
  Noto_Serif,
  Space_Grotesk,
  Space_Mono,
} from 'next/font/google';

/**
 * Design 4 — Editorial font stack
 *
 * - Manrope: body text (400/500/600)
 * - Space Grotesk: display / headings (500/600/700)
 * - Space Mono: data / labels / mono (400)
 * - Noto Serif: blog serif fallback (400)
 */

// https://fonts.google.com/specimen/Manrope
export const fontManrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600'],
});

// https://fonts.google.com/specimen/Space+Grotesk
export const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
});

// https://fonts.google.com/specimen/Space+Mono
export const fontSpaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400'],
});

// https://fonts.google.com/noto/specimen/Noto+Serif
export const fontNotoSerif = Noto_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
  weight: ['400'],
});
