import {
  ArrowRightIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LayoutListIcon,
  Loader2Icon,
  type LucideIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  TagsIcon,
  UploadIcon
} from "lucide-react";
import { GitHubIcon } from "../icons/github";
import { GoogleIcon } from "../icons/google";
import { ProductHuntIcon } from "../icons/product-hunt";
import { TwitterIcon } from "../icons/twitter";
import { YouTubeIcon } from "./youtube";

export type Icon = LucideIcon;

/**
 * 1. Lucide Icons
 * https://lucide.dev/icons/
 *
 * 2. Radix Icons
 * https://www.radix-ui.com/icons
 */
export const Icons = {
  spinner: Loader2Icon,

  // used by name
  arrowRight: ArrowRightIcon,
  search: SearchIcon,
  collection: LayoutListIcon,
  category: LayoutGridIcon,
  tag: TagsIcon,
  blog: FileTextIcon,
  pricing: CreditCardIcon,
  home: HomeIcon,
  dashboard: LayoutDashboardIcon,
  submit: UploadIcon,
  settings: SettingsIcon,
  studio: LayoutListIcon,
  email: MailIcon,

  github: GitHubIcon,
  google: GoogleIcon,
  twitter: TwitterIcon,
  youtube: YouTubeIcon,
  productHunt: ProductHuntIcon,
};
