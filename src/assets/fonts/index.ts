import {
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
  Instrument_Serif,
} from 'next/font/google';

/**
 * Editorial magazine font stack
 *
 * - Inter: body text (400/500/600)
 * - Space Grotesk: display / headings (500/600/700)
 * - JetBrains Mono: data / labels / mono (400/500)
 * - Instrument Serif: serif accent for <em> (400 italic)
 */

// https://fonts.google.com/specimen/Inter
export const fontInter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

// https://fonts.google.com/specimen/Space+Grotesk
export const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
});

// https://fonts.google.com/specimen/JetBrains+Mono
export const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
});

// https://fonts.google.com/specimen/Instrument+Serif
export const fontInstrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
});
