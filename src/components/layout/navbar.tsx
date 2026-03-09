'use client';

import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { useNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
          ? 'border-b border-border bg-background/80 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-background/60 backdrop-blur-md'
      )}
    >
      <nav className="mx-auto hidden h-14 max-w-[1120px] items-center justify-between px-6 lg:flex">
        {/* Logo */}
        <LocaleLink href="/" className="flex items-center">
          <Image
            src="/navbar-logo.png"
            alt="MyDreamTesla"
            width={200}
            height={52}
            className="h-8 w-auto"
            priority
          />
        </LocaleLink>

        <div className="flex items-center gap-3">
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
                      'text-[13px] font-medium transition-all duration-200',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile navbar */}
      <NavbarMobile className="lg:hidden" />
    </section>
  );
}
