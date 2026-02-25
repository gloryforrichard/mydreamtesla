export const Routes = {
  Root: '/',
  home: '/',
  Login: '/auth/login',
  login: '/auth/login',
  Register: '/auth/register',
  register: '/auth/register',
  ForgotPassword: '/auth/forgot-password',
  ResetPassword: '/auth/reset-password',
  AuthError: '/auth/error',
  Dashboard: '/dashboard',
  dashboard: '/dashboard',
  Payment: '/payment',
  SettingsProfile: '/settings/profile',
  SettingsBilling: '/settings/billing',
  SettingsCredits: '/settings/credits',
  SettingsApiKeys: '/settings/apikeys',
  SettingsNotifications: '/settings/notifications',
  SettingsSecurity: '/settings/security',
  settings: '/settings/profile',
  billing: '/settings/billing',
  credits: '/settings/credits',
  apikeys: '/settings/apikeys',
  AdminUsers: '/admin/users',
  Pricing: '/pricing',
  pricing: '/pricing',
  Models: '/models',
  Compare: '/compare',
  Vehicles: '/vehicles',
  Blog: '/blog',
  blog: '/blog',
  Docs: '/docs',
  docs: '/docs',
  About: '/about',
  about: '/about',
  Contact: '/contact',
  contact: '/contact',
  Changelog: '/changelog',
  changelog: '/changelog',
  Roadmap: '/roadmap',
  roadmap: '/roadmap',
  Waitlist: '/waitlist',
  Features: '/features',
  FAQ: '/faq',
  CookiePolicy: '/cookie',
  PrivacyPolicy: '/privacy',
  TermsOfService: '/terms',
} as const;

export const DEFAULT_LOGIN_REDIRECT = Routes.Dashboard;

export const protectedRoutes = [
  '/dashboard',
  '/settings.*',
  '/admin.*',
  '/payment.*',
];

export const routesNotAllowedByLoggedInUsers = [
  '/auth/login',
  '/auth/register',
];

export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/error',
];

export const apiAuthPrefix = '/api/auth';

export const publicRoutes = [
  '/',
  '/pricing',
  '/blog.*',
  '/docs.*',
  '/about',
  '/contact',
  '/changelog',
  '/roadmap',
  '/cookie',
  '/privacy',
  '/terms',
  '/models.*',
  '/compare.*',
  '/vehicles.*',
];
