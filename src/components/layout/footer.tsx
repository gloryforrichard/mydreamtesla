'use client';

import { useFooterLinks } from '@/config/footer-config';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type React from 'react';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const footerLinks = useFooterLinks();

  return (
    <footer className={cn('border-t border-[#D2D2D7]', className)}>
      <div className="mx-auto max-w-[1024px] px-[22px]">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {footerLinks?.map((section) => (
            <div key={section.title}>
              <h4 className="text-[12px] font-semibold text-[#1D1D1F]">
                {section.title}
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {section.items?.map(
                  (item) =>
                    item.href && (
                      <li key={item.title}>
                        <LocaleLink
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] hover:underline"
                        >
                          {item.title}
                        </LocaleLink>
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#D2D2D7]">
        <div className="mx-auto flex max-w-[1024px] items-center justify-between px-[22px] py-4">
          <span className="text-[12px] text-[#86868B]">
            &copy; {new Date().getFullYear()} MyDreamTesla. Not affiliated with Tesla, Inc.
          </span>
          <span className="text-[12px] text-[#86868B]">
            Data from Tesla.com and public records.
          </span>
        </div>
      </div>
    </footer>
  );
}
