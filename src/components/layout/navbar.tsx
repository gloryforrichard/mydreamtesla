'use client';

import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { useNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface NavBarProps {
  scroll?: boolean;
}

export function Navbar({ scroll }: NavBarProps) {
  const scrolled = useScroll(50);
  const menuLinks = useNavbarLinks();
  const localePathname = useLocalePathname();

  return (
    <section
      className={cn(
        'sticky inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-paper/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto hidden h-16 max-w-[1400px] items-center justify-between px-8 lg:flex">
        {/* Logo — text-based with accent dot */}
        <LocaleLink href="/" className="flex items-center gap-1">
          <span className="font-display text-[20px] font-bold tracking-[-0.5px] text-foreground">
            MyDreamTesla
          </span>
          <span className="text-ed-accent text-[24px] leading-none">.</span>
        </LocaleLink>

        <div className="flex items-center gap-10">
          {/* Nav links */}
          <ul className="flex items-center gap-8">
            {menuLinks?.map((item) => {
              const isActive = item.href
                ? item.href === '/'
                  ? localePathname === '/'
                  : localePathname.startsWith(item.href)
                : false;

              return (
                <li key={item.href}>
                  <LocaleLink
                    href={item.href || '#'}
                    className={cn(
                      'text-[14px] font-medium tracking-[-0.01em] transition-colors duration-200',
                      isActive
                        ? 'text-foreground'
                        : 'text-ink-2 hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </LocaleLink>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <LocaleLink
            href="/compare"
            className="rounded-lg bg-foreground px-5 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-90"
          >
            Compare Now
          </LocaleLink>
        </div>
      </nav>

      {/* Mobile navbar */}
      <NavbarMobile className="lg:hidden" />
    </section>
  );
}
