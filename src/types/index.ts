import type { ReactNode } from 'react';
import type { PricePlan } from '@/payment/types';
import type { CreditPackage } from '@/credits/types';

// ---------------------------------------------------------------------------
// Re-used primitive types
// ---------------------------------------------------------------------------

export type { PricePlan, CreditPackage };

// ---------------------------------------------------------------------------
// SiteConfig — used by src/config/site.ts
// ---------------------------------------------------------------------------

export type SiteConfig = {
  name: string;
  tagline?: string;
  description: string;
  keywords?: string[];
  author?: string;
  url?: string;
  logo: string;
  logoDark?: string;
  image?: string;
  mail?: string;
  links?: {
    twitter?: string;
    github?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
};

// ---------------------------------------------------------------------------
// MenuItem / NestedMenuItem — used across nav, sidebar, footer configs
// ---------------------------------------------------------------------------

export type MenuItem = {
  title: string;
  description?: string;
  icon?: ReactNode | string;
  href?: string;
  external?: boolean;
  authorizeOnly?: string[];
};

export type NestedMenuItem = MenuItem & {
  items?: MenuItem[];
};

// ---------------------------------------------------------------------------
// DashboardConfig — used by src/config/dashboard.ts
// ---------------------------------------------------------------------------

export type DashboardConfig = {
  menus: MenuItem[];
};

// ---------------------------------------------------------------------------
// FooterLinkGroup / FooterConfig — used by src/config/footer.ts
// ---------------------------------------------------------------------------

export type FooterLinkItem = {
  title: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  title: string;
  items: FooterLinkItem[];
};

export type FooterConfig = {
  links: FooterLinkGroup[];
};

// ---------------------------------------------------------------------------
// HeroConfig — used by src/config/hero.ts
// ---------------------------------------------------------------------------

export type HeroConfig = {
  title: {
    first: string;
    second?: string;
  };
  subtitle?: string;
  label?: {
    text: string;
    href?: string;
    icon?: string;
  };
};

// ---------------------------------------------------------------------------
// MarketingConfig — used by src/config/marketing.ts
// ---------------------------------------------------------------------------

export type MarketingConfig = {
  menus: MenuItem[];
};

// ---------------------------------------------------------------------------
// PriceConfig — used by src/config/price.ts (directory-style pricing plans)
// ---------------------------------------------------------------------------

export type PricePlanItem = {
  title: string;
  description?: string;
  benefits?: string[];
  limitations?: string[];
  price: number;
  priceSuffix?: string;
  stripePriceId?: string | null | undefined;
};

export type PriceConfig = {
  plans: PricePlanItem[];
};

// ---------------------------------------------------------------------------
// UserButtonConfig — used by src/config/user-button.ts
// ---------------------------------------------------------------------------

export type UserButtonConfig = {
  menus: MenuItem[];
};

// ---------------------------------------------------------------------------
// WebsiteConfig — used by src/config/website.tsx
// ---------------------------------------------------------------------------

export type WebsiteConfig = {
  ui: UiConfig;
  metadata: MetadataConfig;
  features: FeaturesConfig;
  routes: RoutesConfig;
  analytics: AnalyticsConfig;
  apikeys: ApiKeysConfig;
  auth: AuthConfig;
  i18n: I18nConfig;
  blog: BlogConfig;
  docs: DocsConfig;
  mail: MailConfig;
  newsletter: NewsletterConfig;
  storage: StorageConfig;
  payment: PaymentConfig;
  price: WebsitePriceConfig;
  credits: CreditsConfig;
};

export interface UiConfig {
  mode?: ModeConfig;
}

export interface ModeConfig {
  defaultMode?: 'light' | 'dark' | 'system';
  enableSwitch?: boolean;
}

export interface MetadataConfig {
  images?: ImagesConfig;
  social?: SocialConfig;
}

export interface ImagesConfig {
  ogImage?: string;
  logoLight?: string;
  logoDark?: string;
}

export interface SocialConfig {
  twitter?: string;
  github?: string;
  discord?: string;
  blueSky?: string;
  mastodon?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  telegram?: string;
}

export interface FeaturesConfig {
  enableCrispChat?: boolean;
  enableUpgradeCard?: boolean;
  enableUpdateAvatar?: boolean;
  enableAffonsoAffiliate?: boolean;
  enablePromotekitAffiliate?: boolean;
  enableDatafastRevenueTrack?: boolean;
  enableTurnstileCaptcha?: boolean;
}

export interface RoutesConfig {
  defaultLoginRedirect?: string;
}

export interface AnalyticsConfig {
  enableVercelAnalytics?: boolean;
  enableSpeedInsights?: boolean;
}

export interface ApiKeysConfig {
  enable: boolean;
}

export interface AuthConfig {
  enableGoogleLogin?: boolean;
  enableGithubLogin?: boolean;
  enableCredentialLogin?: boolean;
  enableDeleteUser?: boolean;
}

export interface I18nConfig {
  defaultLocale: string;
  locales: Record<
    string,
    {
      flag?: string;
      name: string;
      hreflang?: string;
    }
  >;
}

export interface BlogConfig {
  enable: boolean;
  paginationSize: number;
  relatedPostsSize: number;
}

export interface DocsConfig {
  enable: boolean;
}

export interface MailConfig {
  provider: 'resend';
  fromEmail?: string;
  supportEmail?: string;
}

export interface NewsletterConfig {
  enable: boolean;
  provider: 'resend' | 'beehiiv';
  autoSubscribeAfterSignUp?: boolean;
}

export interface StorageConfig {
  enable: boolean;
  provider: 's3';
}

export interface PaymentConfig {
  provider: 'stripe';
}

/**
 * Price config used inside WebsiteConfig (maps plan IDs to PricePlan objects)
 */
export interface WebsitePriceConfig {
  plans: Record<string, PricePlan>;
}

export interface CreditsConfig {
  enableCredits: boolean;
  enablePackagesForFreePlan: boolean;
  registerGiftCredits: {
    enable: boolean;
    amount: number;
    expireDays?: number;
  };
  packages: Record<string, CreditPackage>;
}

// ---------------------------------------------------------------------------
// BlogCategory — used by blog components
// ---------------------------------------------------------------------------

export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};
