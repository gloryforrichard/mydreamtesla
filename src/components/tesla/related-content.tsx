import Link from 'next/link';

interface RelatedItem {
  label: string;
  href: string;
}

interface RelatedContentProps {
  title?: string;
  subtitle?: string;
  items: RelatedItem[];
}

/**
 * Generic "Related Content" internal linking block
 * Used on vehicle detail, model detail, comparison, and blog pages
 */
export function RelatedContent({
  title = 'Related.',
  subtitle = 'Explore more from the Tesla lineup.',
  items,
}: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-16" aria-label="Related content">
      <h2 className="text-[32px] font-bold tracking-[-1.5px] text-[#1D1D1F]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[17px] font-light text-[#6E6E73]">{subtitle}</p>
      )}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl bg-[#F5F5F7] px-6 py-5 text-[14px] font-medium text-[#1D1D1F] transition-colors hover:bg-[#EBEBED]"
          >
            <span>{item.label}</span>
            <span className="text-[#86868B]">›</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
