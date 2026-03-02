'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';

/**
 * Tesla-specific footer links (no translations needed for now)
 */
export function useFooterLinks(): NestedMenuItem[] {
  return [
    {
      title: 'Models',
      items: [
        { title: 'Model 3', href: '/models/model-3' },
        { title: 'Model Y', href: '/models/model-y' },
        { title: 'Model S', href: '/models/model-s' },
        { title: 'Model X', href: '/models/model-x' },
        { title: 'All Models', href: Routes.Models },
      ],
    },
    {
      title: 'Compare',
      items: [
        {
          title: 'Model 3 vs Y',
          href: '/compare/model-3-2025-long-range-awd-vs-model-3-2025-performance-awd',
        },
        { title: 'All Comparisons', href: Routes.Compare },
      ],
    },
    {
      title: 'Resources',
      items: [
        { title: 'Blog', href: Routes.Blog },
        {
          title: 'Tax Credit Guide',
          href: '/blog/tesla-federal-tax-credit-guide-2025',
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        { title: 'Privacy', href: Routes.PrivacyPolicy },
        { title: 'Terms', href: Routes.TermsOfService },
      ],
    },
  ];
}
