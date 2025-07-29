// Team and Player Types for LTK Tournament

export type PlayerRole = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support';
export type PlayerRank = 'エメラルド' | 'シルバー';
export type CoachRole = 'Head Coach' | 'Assistant Coach';

export interface Player {
  name: string;
  role: PlayerRole;
  rank: PlayerRank;
}

export interface Coach {
  name: string;
  role: CoachRole;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  core_players: Player[];
  next_players: Player[];
  coaches: Coach[];
}

export interface TeamsData {
  teams: Record<string, Team>;
  tournament_info: TournamentInfo;
}

export interface TournamentInfo {
  name: string;
  season: string;
  supported_by: string;
  host: string;
  start_date: string;
  end_date: string;
  regular_season: {
    start: string;
    end: string;
  };
  playoffs: {
    start: string;
    end: string;
  };
  format: {
    teams: number;
    players_per_team: number;
    total_players: number;
    divisions: {
      core: {
        description: string;
        rank_requirement: string;
        players_per_team: number;
      };
      next: {
        description: string;
        rank_requirement: string;
        players_per_team: number;
      };
    };
    coaches_per_team: number;
  };
  streaming: {
    main_channel: string;
    platforms: string[];
    commentators: Array<{
      name: string;
      role: string;
    }>;
  };
}

// Team standings and records
export interface TeamRecord {
  wins: number;
  losses: number;
  winRate: number;
  points?: number;
}

export interface TeamWithRecord extends Team {
  coreRecord: TeamRecord;
  nextRecord: TeamRecord;
  combinedRecord: TeamRecord;
}

// Component props types
export interface TeamCardProps {
  team: Team;
  coreRecord?: TeamRecord;
  nextRecord?: TeamRecord;
}

export interface StandingsTableProps {
  standings: StandingsEntry[];
  division: 'CORE' | 'NEXT';
}

export interface StandingsEntry {
  rank: number;
  team: string;
  wins: number;
  losses: number;
  winRate: number;
  points?: number;
}