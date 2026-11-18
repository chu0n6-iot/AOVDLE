export type Role = 'DSL' | 'Jungle' | 'Mid' | 'Farm' | 'Support';

export const ROLES: Role[] = ['DSL', 'Jungle', 'Mid', 'Farm', 'Support'];

export const ROLE_LABELS: Record<Role, { vi: string; en: string; lane: string; icon: string }> = {
  DSL: { vi: 'Đường Tà Thần', en: 'Dark Slayer Lane', lane: 'Top / Caesar Lane', icon: '/assets/placeholders/role-dsl.svg' },
  Jungle: { vi: 'Đi Rừng', en: 'Jungle', lane: 'Jungle', icon: '/assets/placeholders/role-jungle.svg' },
  Mid: { vi: 'Đường Giữa', en: 'Mid Lane', lane: 'Mid Lane', icon: '/assets/placeholders/role-mid.svg' },
  Farm: { vi: 'Đường Rồng', en: 'Abyssal Dragon Lane', lane: 'Bot / Farm Lane', icon: '/assets/placeholders/role-farm.svg' },
  Support: { vi: 'Trợ Thủ', en: 'Support', lane: 'Support / Roam', icon: '/assets/placeholders/role-support.svg' },
};

export type VerificationStatus = 'verified' | 'partial' | 'unverified';

export interface Tournament {
  tournament_id: string;
  tournament_name: string;
  year: number;
  event_series: string;
  game_title: string;
  region_scope: string;
  edition_status: string;
  start_date: string;
  end_date: string;
  liquipedia_url: string;
  verification_status: VerificationStatus;
  notes?: string;
}

export interface TeamSeason {
  team_id: string;
  tournament_id: string;
  team_name: string;
  region: string;
  country: string;
  source_url: string;
  verification_status: VerificationStatus;
  year: number;
  logo_url?: string;
}

export interface PlayerVersion {
  player_id: string;
  player_name: string;
  nickname: string;
  country: string;
  team_id: string;
  tournament_id: string;
  team_name: string;
  role: Role;
  source_url: string;
  verification_status: VerificationStatus;
  year: number;
  rating: number; // 75 - 98
  portrait_url?: string;
}

export interface CoachVersion {
  coach_id: string;
  coach_name: string;
  team_id: string;
  team_name: string;
  tournament_id: string;
  role: string; // 'Head Coach'
  source_url: string;
  verification_status: VerificationStatus;
  country: string;
  year: number;
  rating: number; // 75 - 96
  portrait_url?: string;
}

export interface RosterMember {
  roster_id: string;
  tournament_id: string;
  team_id: string;
  team_name: string;
  player_id: string;
  player_name: string;
  role: Role;
  registration_status: string;
  played_status: string;
  source_url: string;
  verification_status: VerificationStatus;
}

export interface SynergyLink {
  id: string;
  type: 'player_player' | 'player_coach';
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  team_id: string;
  team_name: string;
  tournament_id: string;
  year: number;
  title: string;
  description: string;
  bonusPercent: number; // e.g., 2.5% per link, up to 5% max cap
}

export interface DreamTeam {
  DSL: PlayerVersion | null;
  Jungle: PlayerVersion | null;
  Mid: PlayerVersion | null;
  Farm: PlayerVersion | null;
  Support: PlayerVersion | null;
  coach: CoachVersion | null;
  synergies: SynergyLink[];
  totalRating: number;
  synergyBonus: number;
  finalStrength: number;
}

export interface DraftState {
  picks: Record<Role, PlayerVersion | null>;
  coach: CoachVersion | null;
  rerollsLeft: number;
  currentTeamChoices: TeamSeason[];
  selectedTeam: TeamSeason | null;
  teamRoster: PlayerVersion[];
  coachChoices: CoachVersion[];
  phase: 'team_draft' | 'player_draft' | 'coach_draft' | 'complete';
  targetRole: Role | null;
  history: string[];
}

export interface TournamentTeam {
  id: string;
  name: string;
  tag: string;
  team_id: string;
  isPlayer: boolean;
  powerRating: number;
  players: Record<Role, { name: string; rating: number; country?: string }>;
  coach: { name: string; rating: number };
  swissRecord: {
    wins: number;
    losses: number;
    matchDiff: number;
    opponents: string[];
  };
  status: 'active' | 'qualified' | 'eliminated';
  seed: number;
}

export interface MatchGame {
  gameNumber: number;
  winnerId: string;
  duration: string;
  mvp: string;
}

export interface TournamentMatch {
  id: string;
  stage: 'swiss' | 'playoff_upper' | 'playoff_lower' | 'grand_final';
  roundName: string;
  roundNumber: number;
  team1: TournamentTeam;
  team2: TournamentTeam;
  score1: number;
  score2: number;
  winner: TournamentTeam | null;
  format: 'Bo3' | 'Bo5' | 'Bo7';
  games: MatchGame[];
  isComplete: boolean;
}

export interface SwissStageState {
  round: number; // 1 to 5
  teams: TournamentTeam[];
  currentMatches: TournamentMatch[];
  historyMatches: TournamentMatch[];
  isComplete: boolean;
  qualifiedTeams: TournamentTeam[];
  eliminatedTeams: TournamentTeam[];
}

export interface PlayoffBracket {
  upperRound1: TournamentMatch[];
  upperFinal: TournamentMatch | null;
  lowerRound1: TournamentMatch[];
  lowerRound2: TournamentMatch[];
  lowerFinal: TournamentMatch | null;
  grandFinal: TournamentMatch | null;
  champion: TournamentTeam | null;
  runnerUp: TournamentTeam | null;
  isComplete: boolean;
}
