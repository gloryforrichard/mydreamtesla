'use client';

import { useFooterLinks } from '@/config/footer-config';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type React from 'react';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const footerLinks = useFooterLinks();

  return (
    <footer className={cn('border-t border-line', className)}>
      <div className="mx-auto max-w-[1400px] px-8">
        {/* Top row: brand + columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-5 sm:gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <LocaleLink href="/" className="flex items-center gap-1">
              <span className="font-display text-[18px] font-bold tracking-[-0.5px] text-foreground">
                MyDreamTesla
              </span>
              <span className="text-ed-accent text-[22px] leading-none">.</span>
            </LocaleLink>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
              The most comprehensive Tesla comparison database. Every model,
              every year, every spec.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks?.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-ink-3">
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
                          className="text-[13px] text-ink-2 transition-colors hover:text-foreground"
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
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-8 py-6 sm:flex-row sm:gap-0">
          <span className="text-[12px] text-ink-3">
            &copy; {new Date().getFullYear()} MyDreamTesla. Not affiliated with
            Tesla, Inc.
          </span>
          <span className="text-[12px] text-ink-3">
            Data from Tesla.com and public records.
          </span>
        </div>
      </div>
    </footer>
  );
}
