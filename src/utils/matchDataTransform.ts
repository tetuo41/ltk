// Utility functions for transforming match results data
import type { MatchesData } from '@/types/matches';

// Team name mapping between different data sources
export const TEAM_NAME_MAPPING = {
  "Precision Diadem": "precision_diadem",
  "Domination Crown": "domination_crown", 
  "Sorcery Tiara": "sorcery_tiara",
  "Resolve Regalia": "resolve_regalia"
} as const;

// Reverse mapping for display purposes
export const TEAM_DISPLAY_MAPPING: Record<string, string> = {
  "precision_diadem": "Precision Diadem",
  "domination_crown": "Domination Crown",
  "sorcery_tiara": "Sorcery Tiara", 
  "resolve_regalia": "Resolve Regalia"
};

export interface MatchResultEntry {
  date: string;
  match_format: string;
  team: string;
  opponent: string;
  division: "CORE" | "NEXT";
  side: "BLUE" | "RED";
  result: "Win" | "Loss";
  match_time: string;
  banned: string;
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  player: string;
  status: "選手" | "代打";
  champion: string;
  kill: number;
  death: number;
  assist: number;
  kda: number;
  damage: number;
  gold: number;
}

export interface MatchLineupData {
  team1Players: MatchResultEntry[];
  team2Players: MatchResultEntry[];
}

export interface PlayerMatchStats {
  player: string;
  role: "TOP" | "JG" | "MID" | "ADC" | "SUP";
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  damage: number;
  gold: number;
  banned_champion?: string | undefined;
  side: "BLUE" | "RED";
  status: "選手" | "代打";
}

export interface TeamMatchStats {
  team_name: string;
  side: "BLUE" | "RED";
  result: "Win" | "Loss";
  total_kills: number;
  total_deaths: number;
  total_damage: number;
  total_gold: number;
  match_duration: string;
  players: PlayerMatchStats[];
}

export interface EnhancedMatchData {
  match_id: string;
  date: string;
  division: "CORE" | "NEXT";
  team1: string;
  team2: string;
  match_format: string;
  duration: string;
  team1_stats: TeamMatchStats;
  team2_stats: TeamMatchStats;
  winner: string;
  mvp_candidate?: string | undefined;
}

/**
 * Convert date format from "2025/06/18" to "2025-06-18"
 */
export function convertDateFormat(dateStr: string): string {
  return dateStr.replace(/\//g, '-');
}

/**
 * Convert team name from display format to internal format
 */
export function convertTeamName(displayName: string): string {
  return TEAM_NAME_MAPPING[displayName as keyof typeof TEAM_NAME_MAPPING] || displayName.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Group match result entries by match (same date, teams, division)
 */
export function groupMatchEntries(entries: MatchResultEntry[]): Map<string, MatchResultEntry[]> {
  const groupedMatches = new Map<string, MatchResultEntry[]>();
  
  entries.forEach(entry => {
    const key = `${entry.date}_${entry.team}_${entry.opponent}_${entry.division}`;
    
    if (!groupedMatches.has(key)) {
      groupedMatches.set(key, []);
    }
    groupedMatches.get(key)!.push(entry);
  });
  
  return groupedMatches;
}

/**
 * Transform grouped match entries into enhanced match data
 */
export function transformToEnhancedMatch(
  matchKey: string, 
  entries: MatchResultEntry[]
): EnhancedMatchData | null {
  if (entries.length === 0) return null;
  
  const firstEntry = entries[0];
  const [date, team1Name, team2Name, division] = matchKey.split('_');
  
  // Separate entries by team
  const team1Entries = entries.filter(e => e.team === team1Name);
  const team2Entries = entries.filter(e => e.opponent === team1Name && e.team === team2Name);
  
  if (team1Entries.length === 0 && team2Entries.length === 0) {
    // Try alternative matching - sometimes data might have different team/opponent arrangement
    const allTeams = new Set([...entries.map(e => e.team), ...entries.map(e => e.opponent)]);
    if (allTeams.size === 2) {
      const [actualTeam1, actualTeam2] = Array.from(allTeams);
      const actualTeam1Entries = entries.filter(e => e.team === actualTeam1);
      const actualTeam2Entries = entries.filter(e => e.team === actualTeam2);
      
      if (actualTeam1Entries.length > 0 && actualTeam2Entries.length > 0) {
        return buildEnhancedMatch(matchKey, date!, actualTeam1, actualTeam2, division as "CORE" | "NEXT", actualTeam1Entries, actualTeam2Entries, firstEntry);
      }
    }
    return null;
  }
  
  if (team1Entries.length === 0 || team2Entries.length === 0) return null;
  
  return buildEnhancedMatch(matchKey, date!, team1Name, team2Name, division as "CORE" | "NEXT", team1Entries, team2Entries, firstEntry);
}

/**
 * Helper function to build enhanced match data
 */
function buildEnhancedMatch(
  matchKey: string,
  date: string, 
  team1Name: string,
  team2Name: string,
  division: "CORE" | "NEXT",
  team1Entries: MatchResultEntry[],
  team2Entries: MatchResultEntry[],
  firstEntry: MatchResultEntry
): EnhancedMatchData {
  // Create team statistics
  const team1Stats: TeamMatchStats = createTeamStats(team1Name, team1Entries);
  const team2Stats: TeamMatchStats = createTeamStats(team2Name, team2Entries);
  
  // Determine winner
  const winner = team1Stats.result === "Win" ? convertTeamName(team1Name) : convertTeamName(team2Name);
  
  return {
    match_id: `enhanced_${matchKey}`,
    date: convertDateFormat(date),
    division,
    team1: convertTeamName(team1Name),
    team2: convertTeamName(team2Name),
    match_format: firstEntry.match_format,
    duration: firstEntry.match_time,
    team1_stats: team1Stats,
    team2_stats: team2Stats,
    winner,
    mvp_candidate: findMVPCandidate([...team1Entries, ...team2Entries]) || undefined
  };
}

/**
 * Create team statistics from match entries
 */
function createTeamStats(teamName: string, entries: MatchResultEntry[]): TeamMatchStats {
  if (entries.length === 0) {
    throw new Error('Cannot create team stats from empty entries array');
  }
  
  const players: PlayerMatchStats[] = entries.map(entry => ({
    player: entry.player,
    role: entry.role,
    champion: entry.champion,
    kills: entry.kill,
    deaths: entry.death,
    assists: entry.assist,
    kda: entry.kda,
    damage: entry.damage,
    gold: entry.gold,
    banned_champion: entry.banned || undefined,
    side: entry.side,
    status: entry.status
  }));
  
  const totalKills = players.reduce((sum, p) => sum + p.kills, 0);
  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
  const totalDamage = players.reduce((sum, p) => sum + p.damage, 0);
  const totalGold = players.reduce((sum, p) => sum + p.gold, 0);
  
  return {
    team_name: teamName,
    side: entries[0].side,
    result: entries[0].result,
    total_kills: totalKills,
    total_deaths: totalDeaths,
    total_damage: totalDamage,
    total_gold: totalGold,
    match_duration: entries[0].match_time,
    players
  };
}

/**
 * Find MVP candidate based on KDA and damage
 */
function findMVPCandidate(entries: MatchResultEntry[]): string | undefined {
  if (entries.length === 0) return undefined;
  
  const winningEntries = entries.filter(e => e.result === "Win");
  if (winningEntries.length === 0) return undefined;
  
  // Find player with highest KDA * damage score
  const mvp = winningEntries.reduce((best, current) => {
    const currentScore = current.kda * (current.damage / 1000);
    const bestScore = best.kda * (best.damage / 1000);
    return currentScore > bestScore ? current : best;
  });
  
  return mvp.player;
}

/**
 * Correlate enhanced match data with existing tournament matches
 */
export function correlateWithTournamentData(
  enhancedMatches: EnhancedMatchData[],
  tournamentData: MatchesData
): MatchesData {
  const updatedSchedule = tournamentData.schedule.map(matchDay => {
    const updatedMatches = matchDay.matches.map(match => {
      // Find corresponding enhanced match by date and teams
      const enhancedMatch = enhancedMatches.find(em => 
        em.date === matchDay.date &&
        em.division === match.division &&
        ((em.team1 === match.team1 && em.team2 === match.team2) ||
         (em.team1 === match.team2 && em.team2 === match.team1))
      );
      
      if (enhancedMatch) {
        return {
          ...match,
          result: match.result ? {
            ...match.result,
            duration: enhancedMatch.duration,
            team1_stats: enhancedMatch.team1_stats,
            team2_stats: enhancedMatch.team2_stats,
            mvp_candidate: enhancedMatch.mvp_candidate
          } : null
        };
      }
      
      return match;
    });
    
    return {
      ...matchDay,
      matches: updatedMatches
    };
  });
  
  return {
    ...tournamentData,
    schedule: updatedSchedule
  };
}

/**
 * Get match lineup data for a specific match
 */
export function getMatchLineup(
  matchResults: MatchResultEntry[], 
  matchDate: string, 
  team1Key: string, 
  team2Key: string, 
  division: "CORE" | "NEXT"
): MatchLineupData | null {
  // Convert team keys to display names for matching
  const team1DisplayName = TEAM_DISPLAY_MAPPING[team1Key] || team1Key;
  const team2DisplayName = TEAM_DISPLAY_MAPPING[team2Key] || team2Key;
  
  // Normalize date format for matching (convert YYYY-MM-DD to YYYY/MM/DD)
  const normalizedDate = matchDate.replace(/-/g, '/');
  
  // Find all entries for this specific match
  const matchEntries = matchResults.filter(entry => {
    const entryDate = entry.date;
    const entryDivision = entry.division;
    
    return entryDate === normalizedDate && 
           entryDivision === division &&
           ((entry.team === team1DisplayName && entry.opponent === team2DisplayName) ||
            (entry.team === team2DisplayName && entry.opponent === team1DisplayName));
  });
  
  if (matchEntries.length === 0) {
    return null;
  }
  
  // Separate players by team
  const team1Players = matchEntries.filter(entry => entry.team === team1DisplayName);
  const team2Players = matchEntries.filter(entry => entry.team === team2DisplayName);
  
  // Ensure we have players for both teams
  if (team1Players.length === 0 || team2Players.length === 0) {
    return null;
  }
  
  return {
    team1Players,
    team2Players
  };
}

/**
 * Check if lineup data is available for a match
 */
export function hasMatchLineup(
  matchResults: MatchResultEntry[], 
  matchDate: string, 
  team1Key: string, 
  team2Key: string, 
  division: "CORE" | "NEXT"
): boolean {
  const lineup = getMatchLineup(matchResults, matchDate, team1Key, team2Key, division);
  return lineup !== null && lineup.team1Players.length > 0 && lineup.team2Players.length > 0;
}