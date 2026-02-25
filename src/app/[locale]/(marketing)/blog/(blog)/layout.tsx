import { BlogCategoryFilter } from '@/components/blog/blog-category-filter';
import Container from '@/components/layout/container';
import { categorySource } from '@/lib/source';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { PropsWithChildren } from 'react';

interface BlogListLayoutProps extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function BlogListLayout({
  children,
  params,
}: BlogListLayoutProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage');

  // Filter categories by locale
  const language = locale as string;
  const categoryList = categorySource.getPages(language).map((category) => ({
    slug: category.slugs[0],
    name: category.data.name,
    description: category.data.description || '',
  }));
  // console.log('categoryList', categoryList);

  return (
    <div className="mb-16">
      {/* Hero header */}
      <div className="bg-[#1D1D1F] py-16 text-center text-white">
        <div className="mx-auto max-w-[1024px] px-[22px]">
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-[-1.5px] sm:text-[48px]">
            {t('title')}
          </h1>
          <p className="mt-4 text-[21px] font-light text-white/70">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="mt-8">
        <BlogCategoryFilter categoryList={categoryList} />
      </div>

      <Container className="mt-8 px-4">{children}</Container>
    </div>
  );
}
