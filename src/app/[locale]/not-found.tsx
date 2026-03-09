import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/**
 * Note that `app/[locale]/[...rest]/page.tsx`
 * is necessary for this page to render.
 *
 * https://next-intl.dev/docs/environments/error-files#not-foundjs
 * https://next-intl.dev/docs/environments/error-files#catching-non-localized-requests
 */
export default function NotFound() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <p className="font-mono text-[13px] font-medium uppercase tracking-[3px] text-brand">
        {t('subtitle')}
      </p>

      <h1 className="font-display text-[40px] font-bold tracking-[-2px] text-foreground sm:text-[56px]">
        {t('title')}
      </h1>

      <p className="max-w-md text-balance text-center text-[17px] font-light leading-relaxed text-secondary-text">
        {t('message')}
      </p>

      <div className="mt-4 h-px w-12 bg-brand/40" />

      <Button
        asChild
        size="lg"
        variant="default"
        className="mt-2 cursor-pointer rounded-full px-8"
      >
        <LocaleLink href="/">{t('backToHome')}</LocaleLink>
      </Button>
    </div>
  );
}
