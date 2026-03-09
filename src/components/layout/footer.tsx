'use client';

import { useFooterLinks } from '@/config/footer-config';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type React from 'react';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const footerLinks = useFooterLinks();

  return (
    <footer className={cn('border-t border-border', className)}>
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {footerLinks?.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[1.5px] text-foreground">
                {section.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.items?.map(
                  (item) =>
                    item.href && (
                      <li key={item.title}>
                        <LocaleLink
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-5">
          <span className="text-[12px] text-muted-foreground">
            &copy; {new Date().getFullYear()} MyDreamTesla. Not affiliated with
            Tesla, Inc.
          </span>
          <span className="text-[12px] text-muted-foreground">
            Data from Tesla.com and public records.
          </span>
        </div>
      </div>
    </footer>
  );
}
