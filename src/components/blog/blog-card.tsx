import { Skeleton } from '@/components/ui/skeleton';
import { LocaleLink } from '@/i18n/navigation';
import { formatDate } from '@/lib/formatter';
import { type BlogType, authorSource, categorySource } from '@/lib/source';
import Image from 'next/image';
import { PremiumBadge } from '../premium/premium-badge';
import BlogImage from './blog-image';

interface BlogCardProps {
  locale: string;
  post: BlogType;
}

export default function BlogCard({ locale, post }: BlogCardProps) {
  const { date, title, description, image, author, categories } = post.data;
  const publishDate = formatDate(new Date(date));
  const blogAuthor = authorSource.getPage([author], locale);
  const blogCategories = categorySource
    .getPages(locale)
    .filter((category) => categories.includes(category.slugs[0] ?? ''));

  return (
    <LocaleLink href={`/blog/${post.slugs}`} className="block h-full">
      <div className="group flex flex-col overflow-hidden rounded-2xl bg-[#F5F5F7] h-full transition-transform duration-300 hover:scale-[1.02]">
        {/* Image container */}
        <div className="overflow-hidden relative aspect-16/9 w-full rounded-t-2xl">
          <div className="relative w-full h-full">
            <BlogImage
              src={image}
              alt={title || 'image for blog post'}
              title={title || 'image for blog post'}
            />

            {/* Premium badge */}
            {post.data.premium && (
              <div className="absolute top-2 right-2 z-20">
                <PremiumBadge size="sm" />
              </div>
            )}

            {/* Categories */}
            {blogCategories && blogCategories.length > 0 && (
              <div className="absolute left-2 bottom-2 z-20">
                <div className="flex flex-wrap gap-1">
                  {blogCategories.map((category, index) => (
                    <span
                      key={`${category?.slugs[0]}-${index}`}
                      className="text-[11px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-full"
                    >
                      {category?.data.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Post info */}
        <div className="flex flex-col justify-between p-5 flex-1">
          <div>
            <h3 className="text-[17px] font-semibold leading-snug text-[#1D1D1F] line-clamp-2">
              {title}
            </h3>
            {description && (
              <p className="mt-2 line-clamp-2 text-[14px] text-[#6E6E73] leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Author and date */}
          <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 shrink-0">
                {blogAuthor?.data.avatar && (
                  <Image
                    src={blogAuthor?.data.avatar}
                    alt={`avatar for ${blogAuthor?.data.name}`}
                    className="rounded-full object-cover"
                    fill
                  />
                )}
              </div>
              <span className="truncate text-[12px] text-[#6E6E73]">
                {blogAuthor?.data.name}
              </span>
            </div>
            <time className="truncate text-[12px] text-[#86868B]" dateTime={date}>
              {publishDate}
            </time>
          </div>
        </div>
      </div>
    </LocaleLink>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden h-full">
      <div className="overflow-hidden relative aspect-16/9 w-full">
        <Skeleton className="h-full w-full rounded-b-none" />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
