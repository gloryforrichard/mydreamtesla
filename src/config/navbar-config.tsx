'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';
import { useTranslations } from 'next-intl';

/**
 * Get navbar config with translations
 *
 * NOTICE: used in client components only
 *
 * @returns The navbar config with translated titles and descriptions
 */
export function useNavbarLinks(): NestedMenuItem[] {
  const t = useTranslations('Marketing.navbar');

  return [
    {
      title: t('models.title'),
      href: Routes.Models,
      external: false,
    },
    {
      title: t('compare.title'),
      href: Routes.Compare,
      external: false,
    },
    {
      title: 'Journal',
      href: Routes.Blog,
      external: false,
    },
    {
      title: 'About',
      href: '/about',
      external: false,
    },
  ];
}
