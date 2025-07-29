// Common types and utilities for LTK Tournament

export interface BaseProps {
  className?: string;
  id?: string;
}

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface NavigationProps extends BaseProps {
  items: NavItem[];
  currentPath?: string;
}

// Layout types
export interface LayoutProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Error handling
export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

// Theme and styling
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

export interface ComponentVariants {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

// Date and time utilities
export interface DateTimeFormat {
  date: string;
  time: string;
  datetime: string;
  relative: string;
}

// Tournament specific enums
export const TEAM_IDS = {
  PRECISION_DIADEM: 'precision_diadem',
  DOMINATION_CROWN: 'domination_crown',
  SORCERY_TIARA: 'sorcery_tiara',
  RESOLVE_REGALIA: 'resolve_regalia'
} as const;

export type TeamId = typeof TEAM_IDS[keyof typeof TEAM_IDS];

export const DIVISIONS = {
  CORE: 'CORE',
  NEXT: 'NEXT'
} as const;

export const MATCH_STATUSES = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredOnly<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

// Animation and transition types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface TransitionProps {
  enter?: AnimationConfig;
  exit?: AnimationConfig;
  initial?: boolean;
}

// Responsive breakpoints
export const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Social media links
export interface SocialLink {
  platform: 'twitch' | 'youtube' | 'twitter' | 'discord';
  url: string;
  label: string;
}

// Tournament statistics
export interface TournamentStats {
  totalMatches: number;
  completedMatches: number;
  upcomingMatches: number;
  totalTeams: number;
  totalPlayers: number;
  averageMatchDuration?: number;
}