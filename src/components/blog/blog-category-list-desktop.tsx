'use client';

import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { BlogCategory } from '@/types';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export type BlogCategoryListDesktopProps = {
  categoryList: BlogCategory[];
};

export function BlogCategoryListDesktop({
  categoryList,
}: BlogCategoryListDesktopProps) {
  const { slug } = useParams() as { slug?: string };
  const t = useTranslations('BlogPage');

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center rounded-full border border-black/[0.08] bg-white/80 p-0.5 gap-0.5">
        <LocaleLink
          href="/blog"
          className={cn(
            'rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors',
            !slug
              ? 'bg-[#1A1A1A] text-white'
              : 'text-[#999999] hover:text-[#1A1A1A]'
          )}
        >
          {t('all')}
        </LocaleLink>
        {categoryList.map((category) => (
          <LocaleLink
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            className={cn(
              'rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors',
              slug === category.slug
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#999999] hover:text-[#1A1A1A]'
            )}
          >
            {category.name}
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}
