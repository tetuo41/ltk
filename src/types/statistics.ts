// Type definitions for statistics and detailed match data

export interface PlayerSeasonStats {
  player: string;
  team: string;
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  division: "CORE" | "NEXT";
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  average_kda: number;
  total_damage: number;
  damage_per_game: number;
  total_gold: number;
  gold_per_game: number;
  champion_pool: ChampionPlayData[];
  performance_trend: PerformanceDataPoint[];
}

export interface ChampionPlayData {
  champion: string;
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  average_kda: number;
  average_damage: number;
  pick_priority: number; // How often this champion is picked by the player
}

export interface PerformanceDataPoint {
  match_date: string;
  opponent: string;
  division: "CORE" | "NEXT";
  champion: string;
  result: "Win" | "Loss";
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  damage: number;
  gold: number;
  performance_score: number; // Calculated composite score
}

export interface TeamPerformanceMetrics {
  team: string;
  division: "CORE" | "NEXT";
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
  roster_stability: number; // Percentage of games with same 5 players
  role_performance: RolePerformanceData[];
  head_to_head: HeadToHeadRecord[];
}

export interface RolePerformanceData {
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  primary_player: string;
  games_played: number;
  average_kda: number;
  champion_diversity: number; // Number of unique champions played
  most_played_champion: string;
  performance_rating: number; // 1-10 scale
}

export interface HeadToHeadRecord {
  opponent: string;
  division: "CORE" | "NEXT";
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  last_match_result: "Win" | "Loss";
  last_match_date: string;
}

export interface ChampionAnalytics {
  champion: string;
  total_games: number;
  total_picks: number;
  total_bans: number;
  pick_rate: number;
  ban_rate: number;
  pick_ban_presence: number; // (picks + bans) / total games
  wins: number;
  losses: number;
  win_rate: number;
  role_distribution: ChampionRoleData[];
  average_performance: ChampionPerformanceStats;
  trend_data: ChampionTrendPoint[];
}

export interface ChampionRoleData {
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  games_played: number;
  win_rate: number;
  primary_players: string[]; // Players who commonly play this champion in this role
}

export interface ChampionPerformanceStats {
  average_kda: number;
  average_damage: number;
  average_gold: number;
  damage_share: number; // Percentage of team's total damage
  gold_share: number; // Percentage of team's total gold
}

export interface ChampionTrendPoint {
  date: string;
  pick_rate: number;
  ban_rate: number;
  win_rate: number;
  games_played: number;
}

export interface MatchInsights {
  match_id: string;
  date: string;
  teams: [string, string];
  division: "CORE" | "NEXT";
  duration: string;
  winner: string;
  game_flow: GameFlowAnalysis;
  draft_analysis: DraftAnalysis;
  key_moments: KeyMoment[];
  player_of_the_match: PlayerOfTheMatch;
}

export interface GameFlowAnalysis {
  early_game_leader: string; // Team that had early advantage
  mid_game_power_spike: string; // Team that dominated mid game
  late_game_control: string; // Team that controlled late game
  comeback_factor: number; // How much the losing team came back (0-1 scale)
  snowball_factor: number; // How well the winning team maintained their lead (0-1 scale)
}

export interface DraftAnalysis {
  draft_advantage: string; // Which team had better draft
  power_picks: string[]; // Champions that performed exceptionally well
  counter_picks: CounterPickData[];
  ban_effectiveness: BanEffectiveness[];
  composition_synergy: CompositionSynergy;
}

export interface CounterPickData {
  champion: string;
  countered_champion: string;
  effectiveness: number; // 1-10 scale
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
}

export interface BanEffectiveness {
  banned_champion: string;
  target_player?: string; // If it was a targeted ban
  effectiveness: number; // 1-10 scale based on how much it impacted the game
}

export interface CompositionSynergy {
  team: string;
  composition_type: "Engage" | "Poke" | "Split Push" | "Team Fight" | "Early Game" | "Late Game" | "Balanced";
  synergy_rating: number; // 1-10 scale
  key_synergies: string[]; // Description of key champion synergies
}

export interface KeyMoment {
  timestamp: string; // Time in match (e.g., "15:32")
  type: "First Blood" | "Team Fight" | "Objective" | "Solo Kill" | "Baron" | "Dragon" | "Tower" | "Game Ending";
  description: string;
  impact_rating: number; // 1-10 scale of how impactful this moment was
  players_involved: string[];
}

export interface PlayerOfTheMatch {
  player: string;
  team: string;
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  champion: string;
  performance_score: number; // Calculated composite score
  key_stats: {
    kills: number;
    deaths: number;
    assists: number;
    kda: number;
    damage: number;
    damage_share: number;
    gold: number;
  };
  highlight_moments: string[]; // Key plays or moments
}

export interface DetailedMatchStats {
  last_updated: string;
  season_overview: {
    total_matches: number;
    completed_matches: number;
    total_players: number;
    unique_champions_played: number;
    unique_champions_banned: number;
  };
  matches: MatchInsights[];
  player_statistics: PlayerSeasonStats[];
  team_performance: TeamPerformanceMetrics[];
  champion_analytics: ChampionAnalytics[];
  meta_analysis: MetaAnalysis;
}

export interface MetaAnalysis {
  most_picked_champions: ChampionMetaData[];
  most_banned_champions: ChampionMetaData[];
  highest_winrate_champions: ChampionMetaData[];
  role_meta: RoleMetaData[];
  patch_impact: PatchImpactData[];
}

export interface ChampionMetaData {
  champion: string;
  value: number; // Pick rate, ban rate, or win rate
  games: number;
  trend: "rising" | "stable" | "falling";
}

export interface RoleMetaData {
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  most_played_champions: string[];
  highest_impact_players: string[];
  average_kda: number;
  role_influence: number; // 1-10 scale of how impactful this role is in current meta
}

export interface PatchImpactData {
  patch_version?: string;
  date_range: {
    start: string;
    end: string;
  };
  champion_changes: {
    buffed: string[];
    nerfed: string[];
    reworked: string[];
  };
  meta_shifts: string[]; // Description of how the meta changed
}

// Props for statistics page components
export interface StatisticsPageProps {
  detailedStats: DetailedMatchStats;
}

export interface PlayerStatsTableProps {
  players: PlayerSeasonStats[];
  division?: "CORE" | "NEXT";
  sortBy?: keyof PlayerSeasonStats;
  limit?: number;
}

export interface TeamPerformanceChartProps {
  teams: TeamPerformanceMetrics[];
  division?: "CORE" | "NEXT";
  metric?: "win_rate" | "kda" | "damage" | "gold";
}

export interface ChampionAnalyticsProps {
  champions: ChampionAnalytics[];
  view?: "picks" | "bans" | "winrate" | "meta";
  role?: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  limit?: number;
}