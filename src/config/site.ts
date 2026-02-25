import type { SiteConfig } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: 'MyDreamTesla',
  tagline: 'Every Tesla. Every Year. Compared.',
  description:
    'The most comprehensive Tesla vehicle database. Compare specs, pricing, and performance across every model year and trim.',
  keywords: [
    'Tesla',
    'Tesla comparison',
    'Tesla specs',
    'Model 3',
    'Model Y',
    'Model S',
    'Model X',
    'Cybertruck',
    'Tesla vehicles',
    'EV comparison',
  ],
  author: 'MyDreamTesla',
  url: SITE_URL,
  logo: '/logo.png',
  // set the logoDark if you have put the logo-dark.png in the public folder
  // logoDark: "/logo-dark.png",
  // please increase the version number when you update the image
  image: `${SITE_URL}/og.png?v=1`,
  mail: 'support@mydreamtesla.com',
  links: {
    // leave it blank if you don't want to show the link (don't delete)
    twitter: '',
    github: '',
    youtube: '',
  },
};
