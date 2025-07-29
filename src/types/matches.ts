// Match and Tournament Schedule Types

export type MatchStatus = 'scheduled' | 'completed' | 'live' | 'cancelled';
export type Division = 'CORE' | 'NEXT';
export type PlayoffRound = '準決勝' | '3位決定戦' | '決勝';

export interface ChampionDraft {
  bans: {
    team1: string[];  // Champion names that team1 banned
    team2: string[];  // Champion names that team2 banned
  };
  picks: {
    team1: string[];  // Champion names that team1 picked (in pick order)
    team2: string[];  // Champion names that team2 picked (in pick order)
  };
  draft_order?: string[];  // Complete draft sequence for advanced display
}

export interface MatchResult {
  winner: string;
  score: string;
  duration?: string;
  mvp?: string;
  draft?: ChampionDraft;  // Ban/pick information
}

export interface Match {
  id: string;
  division: Division;
  team1: string;
  team2: string;
  status: MatchStatus;
  result?: MatchResult | null;
  start_time?: string;
  stream_url?: string;
}

export interface MatchDay {
  date: string;
  day: string;
  time: string;
  round: number;
  description: string;
  matches: Match[];
}

export interface PlayoffMatch {
  id: string;
  round: PlayoffRound;
  team1: string;
  team2: string;
  status: MatchStatus;
  result?: MatchResult | null;
  start_time?: string;
}

export interface PlayoffDay {
  date: string;
  day: string;
  description: string;
  matches: PlayoffMatch[];
}

export interface Playoffs {
  format: string;
  location: string;
  schedule: PlayoffDay[];
}

export interface CurrentStandings {
  core: StandingsEntry[];
  next: StandingsEntry[];
}

export interface StandingsEntry {
  rank: number;
  team: string;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
}

export interface MatchesData {
  schedule: MatchDay[];
  playoffs: Playoffs;
  current_standings: CurrentStandings;
}

// Component props types
export interface ScheduleSectionProps {
  schedule: MatchDay[];
  playoffs: Playoffs;
}

export interface MatchCardProps {
  match: Match | PlayoffMatch;
  showResult?: boolean;
}

export interface StandingsProps {
  standings: CurrentStandings;
}

// Utility types for match calculations
export interface TeamStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  recentForm: ('W' | 'L')[];
}

export interface MatchHistory {
  teamId: string;
  matches: Array<{
    matchId: string;
    opponent: string;
    result: 'W' | 'L';
    division: Division;
    date: string;
  }>;
}