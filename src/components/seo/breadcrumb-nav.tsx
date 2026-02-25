import Link from 'next/link';
import { JsonLd } from './json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/structured-data';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

/**
 * SEO-optimized breadcrumb with schema.org BreadcrumbList JSON-LD
 * Renders semantic <nav> with <ol> and injects structured data
 */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const jsonLdItems = items.map((item) => ({
    name: item.label,
    href: item.href,
  }));

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(jsonLdItems)} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex items-center gap-1.5 text-[var(--gray-mid,#86868B)]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-[var(--gray-light,#D2D2D7)]"
                  >
                    ›
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={isLast ? 'text-[var(--gray-dark,#6E6E73)]' : ''}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[var(--black,#1D1D1F)] hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
