import { websiteConfig } from '@/config/website';
import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { generateAlternates, getCurrentHreflang } from './hreflang';
import { getBaseUrl, getImageUrl, getUrlWithLocale } from './urls/urls';

const MAX_META_TITLE_LENGTH = 70;
const MAX_META_DESCRIPTION_LENGTH = 155;

export function trimSeoText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const boundary = normalized.lastIndexOf(' ', maxLength);
  const cutAt = boundary >= Math.floor(maxLength * 0.65) ? boundary : maxLength;

  return normalized
    .slice(0, cutAt)
    .replace(/[|,;:–—-]\s*$/u, '')
    .trim();
}

export function getBrandedTitle(title: string): string {
  const brandedTitle = `${title} | ${defaultMessages.Metadata.name}`;

  return brandedTitle.length <= MAX_META_TITLE_LENGTH
    ? brandedTitle
    : trimSeoText(title, MAX_META_TITLE_LENGTH);
}

/**
 * Build OG image URL using the /api/og route
 */
export function getOgImageUrl(params: {
  title: string;
  subtitle?: string;
  type?: 'vehicle' | 'model' | 'compare' | 'blog' | 'default';
}): string {
  const url = new URL('/api/og', getBaseUrl());
  url.searchParams.set('title', params.title);
  if (params.subtitle) url.searchParams.set('subtitle', params.subtitle);
  if (params.type) url.searchParams.set('type', params.type);
  return url.toString();
}

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
  title,
  description,
  image,
  noIndex = false,
  locale,
  pathname,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  locale?: Locale;
  pathname?: string;
} = {}): Metadata {
  title = trimSeoText(
    title || defaultMessages.Metadata.title,
    MAX_META_TITLE_LENGTH
  );
  description = trimSeoText(
    description || defaultMessages.Metadata.description,
    MAX_META_DESCRIPTION_LENGTH
  );
  image = image || websiteConfig.metadata.images?.ogImage;
  const ogImageUrl = getImageUrl(image || '');

  // Generate canonical URL from pathname and locale
  const canonicalUrl = pathname
    ? getUrlWithLocale(pathname, locale).replace(/\/$/, '')
    : undefined;

  // Generate hreflang alternates if pathname is provided and we have multiple locales
  const alternates =
    pathname && routing.locales.length > 1
      ? {
          canonical: canonicalUrl,
          ...generateAlternates(pathname),
        }
      : canonicalUrl
        ? { canonical: canonicalUrl }
        : undefined;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      locale: locale ? getCurrentHreflang(locale).replace('-', '_') : 'en_US',
      url: canonicalUrl,
      title,
      description,
      siteName: defaultMessages.Metadata.name,
      images: [ogImageUrl.toString()],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
      site: getBaseUrl(),
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-32x32.png',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL(getBaseUrl()),
    manifest: `${getBaseUrl()}/manifest.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
