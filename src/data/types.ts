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
  effectiveStrength?: number;
  tacticalIdentity?: TacticalIdentity;
  superstarRole?: Role;
  weakestRole?: Role;
  logo_url?: string;
  players: Record<Role, { name: string; rating: number; country?: string; portrait_url?: string }>;
  playerProfiles?: Record<Role, PlayerPerformanceProfile>;
  coach: { name: string; rating: number; country?: string; portrait_url?: string };
  swissRecord: {
    wins: number;
    losses: number;
    matchDiff: number;
    opponents: string[];
  };
  status: 'active' | 'qualified' | 'eliminated';
  seed: number;
}

export type TournamentForm = 'excellent' | 'strong' | 'stable' | 'inconsistent' | 'poor';

export const FORM_CONFIG: Record<
  TournamentForm,
  {
    label: string;
    multiplier: number;
    badgeBg: string;
    badgeText: string;
    description: string;
  }
> = {
  excellent: {
    label: 'Xuất Sắc',
    multiplier: 1.05,
    badgeBg: 'bg-[#3EAD83]/20 border-[#3EAD83]/60',
    badgeText: 'text-[#3EAD83]',
    description: 'Phong độ đỉnh cao, tự tin ra đòn và xử lý tình huống mẫu mực',
  },
  strong: {
    label: 'Thăng Hoa',
    multiplier: 1.025,
    badgeBg: 'bg-[#61DAFB]/20 border-[#61DAFB]/60',
    badgeText: 'text-[#61DAFB]',
    description: 'Cảm giác trận đấu tốt, duy trì đóng góp lớn cho toàn đội',
  },
  stable: {
    label: 'Ổn Định',
    multiplier: 1.0,
    badgeBg: 'bg-[#F2F0E9]/10 border-[#F2F0E9]/30',
    badgeText: 'text-[#F2F0E9]',
    description: 'Thi đấu đúng năng lực, hoàn thành chuẩn chỉ nhiệm vụ vị trí',
  },
  inconsistent: {
    label: 'Thất Thường',
    multiplier: 0.975,
    badgeBg: 'bg-[#C9A45C]/20 border-[#C9A45C]/60',
    badgeText: 'text-[#C9A45C]',
    description: 'Phong độ trồi sụt, thỉnh thoảng mắc lỗi di chuyển hoặc timing',
  },
  poor: {
    label: 'Sa Sút',
    multiplier: 0.95,
    badgeBg: 'bg-[#D45B58]/20 border-[#D45B58]/60',
    badgeText: 'text-[#D45B58]',
    description: 'Gặp áp lực tâm lý, dễ bị khai thác trong giai đoạn then chốt',
  },
};

export interface PlayerAttributes {
  mechanical: number; // 0 - 100: Kỹ năng cá nhân & thao tác tay
  laning: number; // 0 - 100: Khả năng đi đường & giữ lính
  farming: number; // 0 - 100: Tối ưu kinh tế & lượng vàng
  killParticipation: number; // 0 - 100: Tỷ lệ tham gia hạ gục
  damageContribution: number; // 0 - 100: Đóng góp sát thương
  survivalPositioning: number; // 0 - 100: Giữ vị trí & hạn chế nằm xuống
  objectiveControl: number; // 0 - 100: Kiểm soát Rồng, Caesar & tầm nhìn
  teamfight: number; // 0 - 100: Phối hợp & tỏa sáng trong giao tranh tổng
  consistency: number; // 0 - 100: Độ ổn định qua từng ván đấu
  clutch: number; // 0 - 100: Bản lĩnh xử lý tại thời khắc quyết định
  roleProficiency: number; // 0 - 100: Độ am hiểu sâu về chất tướng & meta vai trò
  decisionMaking: number; // 0 - 100: Khả năng đọc bản đồ & ra quyết định macro
}

export interface PlayerTournamentStats {
  gamesPlayed: number;
  gamesWon: number;
  kills: number;
  deaths: number;
  assists: number;
  mvpCount: number;
  totalDamageShare: number; // sum of damage %
  totalGold: number;
  avgPerformanceScore: number;
}

export interface PlayerPerformanceProfile {
  playerId: string;
  playerName: string;
  role: Role;
  country?: string;
  portrait_url?: string;
  baselineRating: number;
  currentForm: TournamentForm;
  formScore: number; // 0.90 to 1.10
  attributes: PlayerAttributes;
  tournamentStats: PlayerTournamentStats;
}

export type TacticalIdentity =
  | 'early_aggression'
  | 'objective_control'
  | 'teamfight_oriented'
  | 'scaling_late'
  | 'split_pressure'
  | 'defensive_counter'
  | 'balanced';

export const TACTICAL_CONFIG: Record<
  TacticalIdentity,
  {
    label: string;
    enLabel: string;
    description: string;
    tempo: 'early' | 'mid' | 'late' | 'flexible';
    strengthsAgainst: TacticalIdentity[];
    weaknessesAgainst: TacticalIdentity[];
  }
> = {
  early_aggression: {
    label: 'Tấn Công Phủ Đầu',
    enLabel: 'Early Aggression',
    description: 'Chủ động xâm lăng rừng, tạo sức ép mạng sớm để lăn cầu tuyết',
    tempo: 'early',
    strengthsAgainst: ['scaling_late', 'split_pressure'],
    weaknessesAgainst: ['defensive_counter', 'objective_control'],
  },
  objective_control: {
    label: 'Kiểm Soát Mục Tiêu',
    enLabel: 'Objective Control',
    description: 'Thiết lập tầm nhìn chuẩn chỉ, ưu tiên Rồng Kraydus và Caesar Bạo Chúa',
    tempo: 'mid',
    strengthsAgainst: ['early_aggression', 'split_pressure'],
    weaknessesAgainst: ['teamfight_oriented'],
  },
  teamfight_oriented: {
    label: 'Giao Tranh Tổng 5v5',
    enLabel: 'Teamfight Oriented',
    description: 'Phối hợp chiêu cuối diện rộng bùng nổ, quét sạch đối thủ khi tụ quân',
    tempo: 'mid',
    strengthsAgainst: ['objective_control', 'defensive_counter'],
    weaknessesAgainst: ['split_pressure'],
  },
  scaling_late: {
    label: 'Tăng Tiến Cuối Trận',
    enLabel: 'Late Game Scaling',
    description: 'Phòng thủ kiên nhẫn, dồn tài nguyên bảo bọc Xạ thủ đạt ngưỡng trang bị',
    tempo: 'late',
    strengthsAgainst: ['defensive_counter', 'balanced'],
    weaknessesAgainst: ['early_aggression'],
  },
  split_pressure: {
    label: 'Đẩy Lẻ Độc Đạo',
    enLabel: 'Split Push Pressure',
    description: 'Khai thác tối đa áp lực đường đơn 1-3-1, buộc đối thủ phải phân tán đội hình',
    tempo: 'mid',
    strengthsAgainst: ['teamfight_oriented', 'scaling_late'],
    weaknessesAgainst: ['early_aggression', 'objective_control'],
  },
  defensive_counter: {
    label: 'Phản Đòn Phòng Ngự',
    enLabel: 'Defensive Counter',
    description: 'Dụ đối phương dâng cao rồi phản công chớp nhoáng với thế trận chắc chắn',
    tempo: 'mid',
    strengthsAgainst: ['early_aggression'],
    weaknessesAgainst: ['scaling_late', 'teamfight_oriented'],
  },
  balanced: {
    label: 'Toàn Diện Linh Hoạt',
    enLabel: 'Flexible Balanced',
    description: 'Thích ứng thông minh theo diễn biến trận đấu và chất tướng đối thủ',
    tempo: 'flexible',
    strengthsAgainst: [],
    weaknessesAgainst: [],
  },
};

export type MatchEventType =
  | 'first_blood'
  | 'solo_kill'
  | 'gank_success'
  | 'gank_fail'
  | 'tower'
  | 'dragon'
  | 'dark_slayer'
  | 'slayer_stolen'
  | 'teamfight'
  | 'catch_out'
  | 'comeback_fight'
  | 'defensive_hold'
  | 'inhibitor'
  | 'nexus';

export interface MatchEvent {
  id: string;
  gameNumber: number;
  timestamp: string; // e.g., "03:15"
  seconds: number;
  type: MatchEventType;
  teamId: string;
  teamName: string;
  actorName: string;
  actorRole: Role;
  targetName?: string;
  targetRole?: Role;
  title: string;
  description: string;
  goldDifference: number; // positive = team1 lead, negative = team2 lead
  killsScore: [number, number]; // [team1Kills, team2Kills]
  importance: 'normal' | 'high' | 'decisive';
}

export interface PlayerGameStats {
  playerId: string;
  playerName: string;
  role: Role;
  teamId: string;
  kills: number;
  deaths: number;
  assists: number;
  gold: number;
  damagePercent: number;
  kpPercent: number;
  performanceScore: number; // 0 - 10.0
}

export interface GameMVPDetails {
  playerId: string;
  playerName: string;
  role: Role;
  kda: string;
  performanceScore: number;
  reason: string;
  portrait_url?: string;
}

export interface MatchGame {
  gameNumber: number;
  winnerId: string;
  winnerName?: string;
  duration: string;
  mvp: string; // Player name for backwards compatibility
  mvpDetails?: GameMVPDetails;
  score?: [number, number]; // [team1Kills, team2Kills]
  timeline?: MatchEvent[];
  playerGameStats?: Record<string, PlayerGameStats>;
  gameNarrative?: string;
}

export interface FMVPAward {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  role: Role;
  portrait_url?: string;
  mvpCount: number;
  totalGames: number;
  tournamentKDA: string;
  avgPerformanceScore: number;
  kpPercent: number;
  highlights: string[];
  citation: string;
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
  fmvp?: FMVPAward | null;
  isComplete: boolean;
}
