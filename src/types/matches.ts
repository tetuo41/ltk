// Match and Tournament Schedule Types

export type MatchStatus = 'scheduled' | 'completed' | 'live' | 'cancelled';
export type Division = 'CORE' | 'NEXT';
export type PlayoffRound = '準決勝' | '3位決定戦' | '決勝';
export type PlayerRole = 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP';
export type KeyMomentType = 'Team Fight' | 'Baron' | 'Dragon' | 'Turret' | 'Objective';
export type CompositionType = 'Team Fight' | 'Pick' | 'Split Push' | 'Poke' | 'Scaling';

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

// Enhanced Match Statistics Types
export interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  damage: number;
  damage_share: number;
  gold: number;
}

export interface PlayerOfTheMatch {
  player: string;
  team: string;
  role: PlayerRole;
  champion: string;
  performance_score: number;
  key_stats: PlayerStats;
  highlight_moments: string[];
}

export interface GameFlow {
  early_game_leader: string;
  mid_game_power_spike: string;
  late_game_control: string;
  comeback_factor: number;
  snowball_factor: number;
}

export interface CompositionSynergy {
  team: string;
  composition_type: CompositionType;
  synergy_rating: number;
  key_synergies: string[];
}

export interface DraftAnalysis {
  draft_advantage: string;
  power_picks: string[];
  counter_picks: string[];
  ban_effectiveness: string[];
  composition_synergy: CompositionSynergy;
}

export interface KeyMoment {
  timestamp: string;
  type: KeyMomentType;
  description: string;
  impact_rating: number;
  players_involved: string[];
}

export interface RolePerformance {
  role: PlayerRole;
  primary_player: string;
  games_played: number;
  average_kda: number;
  champion_diversity: number;
  most_played_champion: string;
  performance_rating: number;
}

export interface HeadToHead {
  opponent: string;
  division: Division;
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  last_match_result: string;
  last_match_date: string;
}

export interface TeamPerformance {
  team: string;
  division: Division;
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  average_match_duration: string;
  total_kills: number;
  total_deaths: number;
  kill_death_ratio: number;
  average_damage_per_game: number;
  average_gold_per_game: number;
  roster_stability: number;
  role_performance: RolePerformance[];
  head_to_head: HeadToHead[];
}

export interface EnhancedMatchStats {
  duration: string;
  game_flow: GameFlow;
  draft_analysis: DraftAnalysis;
  key_moments: KeyMoment[];
  player_of_the_match: PlayerOfTheMatch;
}

export interface MatchResult {
  winner: string;
  score: string;
  duration?: string;
  mvp?: string;
  draft?: ChampionDraft;  // Ban/pick information
  enhanced_stats?: EnhancedMatchStats;  // Detailed match statistics
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
  season_overview?: {
    total_matches: number;
    completed_matches: number;
    total_players: number;
    unique_champions_played: number;
    unique_champions_banned: number;
  };
  team_performance?: TeamPerformance[];
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