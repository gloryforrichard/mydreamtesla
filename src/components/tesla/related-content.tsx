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
      <h2 className="font-display text-[32px] font-bold tracking-[-1.5px] text-[#1A1A1A]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[17px] font-light text-[#777777]">{subtitle}</p>
      )}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-sm bg-[#F5F2ED] px-6 py-5 text-[14px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#EDEAE4]"
          >
            <span>{item.label}</span>
            <span className="text-[#999999]">›</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
