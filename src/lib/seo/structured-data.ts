import { siteConfig } from '@/config/site';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Vehicle, TeslaModel } from '@/lib/vehicle-utils';

/**
 * schema.org/WebSite — for homepage
 */
export function buildWebSiteJsonLd() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: baseUrl,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/models?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * schema.org/Organization — for homepage
 */
export function buildOrganizationJsonLd() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.links?.twitter,
      siteConfig.links?.github,
      siteConfig.links?.youtube,
    ].filter(Boolean),
  };
}

/**
 * schema.org/Car — for vehicle detail pages
 */
export function buildCarJsonLd(vehicle: Vehicle, modelName: string) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: vehicle.title,
    url: `${baseUrl}/vehicles/${vehicle.slug}`,
    manufacturer: {
      '@type': 'Organization',
      name: 'Tesla, Inc.',
      url: 'https://www.tesla.com',
    },
    model: modelName,
    vehicleModelDate: String(vehicle.year),
    driveWheelConfiguration: vehicle.driveType,
    ...(vehicle.basePriceMSRP && {
      offers: {
        '@type': 'Offer',
        price: vehicle.basePriceMSRP,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(vehicle.horsepower && {
      vehicleEngine: {
        '@type': 'EngineSpecification',
        enginePower: {
          '@type': 'QuantitativeValue',
          value: vehicle.horsepower,
          unitCode: 'BHP',
        },
        ...(vehicle.torque && {
          torque: {
            '@type': 'QuantitativeValue',
            value: vehicle.torque,
            unitText: 'lb-ft',
          },
        }),
        fuelType: 'Electric',
      },
    }),
    ...(vehicle.seatingCapacity && {
      seatingCapacity: vehicle.seatingCapacity,
    }),
    ...(vehicle.cargoVolume && {
      cargoVolume: {
        '@type': 'QuantitativeValue',
        value: vehicle.cargoVolume,
        unitText: 'cu ft',
      },
    }),
    fuelType: 'Electric',
    ...(vehicle.rangeEPA && {
      fuelEfficiency: {
        '@type': 'QuantitativeValue',
        value: vehicle.rangeEPA,
        unitText: 'mi EPA range',
      },
    }),
  };
}

/**
 * schema.org/ItemList — for comparison and listing pages
 */
export function buildItemListJsonLd(
  items: Array<{ name: string; url: string; position: number }>,
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * schema.org/BreadcrumbList — for breadcrumb nav
 */
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; href?: string }>
) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href && { item: `${baseUrl}${item.href}` }),
    })),
  };
}

/**
 * schema.org/FAQPage — for FAQ sections
 */
export function buildFAQPageJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * schema.org/BlogPosting — for blog posts
 */
export function buildBlogPostingJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${baseUrl}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    ...(post.image && {
      image: post.image.startsWith('http')
        ? post.image
        : `${baseUrl}${post.image}`,
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };
}
