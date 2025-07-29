// Main types export file for LTK Tournament

// Export all team-related types
export type {
  PlayerRole,
  PlayerRank,
  CoachRole,
  Player,
  Coach,
  Team,
  TeamsData,
  TournamentInfo,
  TeamRecord,
  TeamWithRecord,
  TeamCardProps,
  StandingsTableProps,
  StandingsEntry
} from './teams';

// Export all match-related types
export type {
  MatchStatus,
  Division,
  PlayoffRound,
  ChampionDraft,
  MatchResult,
  Match,
  MatchDay,
  PlayoffMatch,
  PlayoffDay,
  Playoffs,
  CurrentStandings,
  MatchesData,
  ScheduleSectionProps,
  MatchCardProps,
  StandingsProps,
  TeamStats,
  MatchHistory
} from './matches';

// Export all common types
export type {
  BaseProps,
  NavItem,
  NavigationProps,
  LayoutProps,
  SeoMeta,
  ApiResponse,
  ErrorState,
  LoadingState,
  ThemeColors,
  ComponentVariants,
  DateTimeFormat,
  TeamId,
  Optional,
  RequiredOnly,
  AnimationConfig,
  TransitionProps,
  Breakpoint,
  SocialLink,
  TournamentStats
} from './common';

// Export constants
export {
  TEAM_IDS,
  DIVISIONS,
  MATCH_STATUSES,
  BREAKPOINTS
} from './common';