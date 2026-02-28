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
        <ol className="flex items-center gap-1.5 text-[#999999]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-[#CCCCCC]"
                  >
                    ›
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={isLast ? 'text-[#777777]' : ''}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[#1A1A1A] hover:underline"
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
