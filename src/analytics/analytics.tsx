import { websiteConfig } from '@/config/website';
import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('./google-analytics'));
const UmamiAnalytics = dynamic(
  () =>
    import('./umami-analytics').then((mod) => ({
      default: mod.UmamiAnalytics,
    })),
);
const PlausibleAnalytics = dynamic(
  () =>
    import('./plausible-analytics').then((mod) => ({
      default: mod.PlausibleAnalytics,
    })),
);
const AhrefsAnalytics = dynamic(
  () =>
    import('./ahrefs-analytics').then((mod) => ({
      default: mod.AhrefsAnalytics,
    })),
);
const DataFastAnalytics = dynamic(() => import('./data-fast-analytics'));
const OpenPanelAnalytics = dynamic(() => import('./open-panel-analytics'));
const SelineAnalytics = dynamic(
  () =>
    import('./seline-analytics').then((mod) => ({
      default: mod.SelineAnalytics,
    })),
);
const ClarityAnalytics = dynamic(() => import('./clarity-analytics'));
const VercelAnalytics = dynamic(() =>
  import('@vercel/analytics/react').then((mod) => ({
    default: mod.Analytics,
  })),
);
const SpeedInsights = dynamic(() =>
  import('@vercel/speed-insights/next').then((mod) => ({
    default: mod.SpeedInsights,
  })),
);

/**
 * Analytics Components all in one
 *
 * 1. all the analytics components only work in production
 * 2. only work if the environment variable for the analytics is set
 * 3. all imports are dynamic to avoid loading unused analytics into the bundle
 *
 * docs:
 * https://mksaas.com/docs/analytics
 */
export function Analytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* google analytics */}
      <GoogleAnalytics />

      {/* umami analytics */}
      <UmamiAnalytics />

      {/* plausible analytics */}
      <PlausibleAnalytics />

      {/* ahrefs analytics */}
      <AhrefsAnalytics />

      {/* datafast analytics */}
      <DataFastAnalytics />

      {/* openpanel analytics */}
      <OpenPanelAnalytics />

      {/* seline analytics */}
      <SelineAnalytics />

      {/* clarity analytics */}
      <ClarityAnalytics />

      {/* vercel analytics */}
      {/* https://vercel.com/docs/analytics/quickstart */}
      {websiteConfig.analytics.enableVercelAnalytics && <VercelAnalytics />}

      {/* speed insights */}
      {/* https://vercel.com/docs/speed-insights/quickstart */}
      {websiteConfig.analytics.enableSpeedInsights && <SpeedInsights />}
    </>
  );
}
