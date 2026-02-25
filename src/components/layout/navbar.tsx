'use client';

import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { RegionToggle } from '@/components/layout/region-toggle';
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
        scroll
          ? scrolled
            ? 'border-b border-black/[0.06] bg-[rgba(251,251,253,0.72)] backdrop-blur-[20px] backdrop-saturate-[180%]'
            : 'bg-transparent'
          : 'border-b border-black/[0.06] bg-[rgba(251,251,253,0.72)] backdrop-blur-[20px] backdrop-saturate-[180%]'
      )}
    >
      <nav className="mx-auto hidden h-12 max-w-[1024px] items-center justify-between px-[22px] lg:flex">
        {/* Logo */}
        <LocaleLink href="/" className="flex items-center">
          <Image
            src="/navbar-logo.png"
            alt="MyDreamTesla"
            width={140}
            height={32}
            className="h-7 w-auto"
            style={{ mixBlendMode: 'multiply' }}
            priority
          />
        </LocaleLink>

        <div className="flex items-center gap-3">
          {/* Nav links */}
          <ul className="flex items-center gap-7">
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
                      'text-[12px] font-normal text-[#1D1D1F] transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    )}
                  >
                    {item.title}
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
          <RegionToggle />
        </div>
      </nav>

      {/* Mobile navbar */}
      <NavbarMobile className="lg:hidden" />
    </section>
  );
}
