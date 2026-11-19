import {
  Role,
  ROLES,
  PlayerVersion,
  CoachVersion,
  TeamSeason,
  DraftState,
} from '../data/types';
import { HISTORICAL_TEAMS, HISTORICAL_PLAYERS, HISTORICAL_COACHES } from '../data/historicalData';

export function initializeDraft(customSeed?: number): DraftState {
  const initialPicks: Record<Role, PlayerVersion | null> = {
    DSL: null,
    Jungle: null,
    Mid: null,
    Farm: null,
    Support: null,
  };

  const initialTeams = pickRandomTeams(3);

  return {
    picks: initialPicks,
    coach: null,
    rerollsLeft: 3,
    currentTeamChoices: initialTeams,
    selectedTeam: null,
    teamRoster: [],
    coachChoices: [],
    phase: 'team_draft',
    targetRole: 'DSL',
    history: ['Bắt đầu phiên Draft Dream Team!'],
  };
}

export function pickRandomTeams(count: number, excludeIds: string[] = []): TeamSeason[] {
  // Filter teams that actually have players in our dataset
  const teamsWithPlayers = HISTORICAL_TEAMS.filter(t => {
    if (excludeIds.includes(t.team_id)) return false;
    return HISTORICAL_PLAYERS.some(p => p.team_id === t.team_id);
  });

  const shuffled = [...teamsWithPlayers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function pickRandomCoaches(count: number): CoachVersion[] {
  const shuffled = [...HISTORICAL_COACHES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function selectTeam(state: DraftState, team: TeamSeason): DraftState {
  // Find all players belonging to this team_id
  const roster = HISTORICAL_PLAYERS.filter(p => p.team_id === team.team_id);

  return {
    ...state,
    selectedTeam: team,
    teamRoster: roster,
    phase: 'player_draft',
    history: [...state.history, `Đã chọn đội tuyển ${team.team_name} (${team.year})`],
  };
}

export function backToTeamDraft(state: DraftState): DraftState {
  return {
    ...state,
    selectedTeam: null,
    teamRoster: [],
    phase: 'team_draft',
  };
}

export function rerollDraftTeams(state: DraftState): DraftState {
  if (state.rerollsLeft <= 0) return state;

  const currentIds = state.currentTeamChoices.map(t => t.team_id);
  const newTeams = pickRandomTeams(3, currentIds);

  return {
    ...state,
    currentTeamChoices: newTeams,
    selectedTeam: null,
    teamRoster: [],
    phase: 'team_draft',
    rerollsLeft: state.rerollsLeft - 1,
    history: [...state.history, `Đã dùng 1 lượt Reroll (còn ${state.rerollsLeft - 1} lượt)`],
  };
}

export function getFirstUnfilledRole(picks: Record<Role, PlayerVersion | null>): Role | null {
  for (const role of ROLES) {
    if (!picks[role]) return role;
  }
  return null;
}

export function pickPlayer(
  state: DraftState,
  player: PlayerVersion,
  targetRole?: Role
): DraftState {
  // Prevent duplicate player_id
  const isDuplicate = Object.values(state.picks).some(
    p => p !== null && p.player_id === player.player_id
  );
  if (isDuplicate) {
    return state;
  }

  // A Player Version belongs to one historical role. Never reassign it to another lane.
  let assignedRole: Role | null = player.role;
  if (state.picks[assignedRole] !== null) {
    return state;
  }
  if (!assignedRole) return state;

  const newPicks = {
    ...state.picks,
    [assignedRole]: player,
  };

  const nextUnfilled = getFirstUnfilledRole(newPicks);

  if (!nextUnfilled) {
    // All 5 roles filled! Transition to Coach Draft
    const coachChoices = pickRandomCoaches(3);
    return {
      ...state,
      picks: newPicks,
      selectedTeam: null,
      teamRoster: [],
      coachChoices,
      phase: 'coach_draft',
      targetRole: null,
      history: [
        ...state.history,
        `Đã chọn ${player.player_name} cho vị trí ${assignedRole}. Hoàn thành 5 vị trí! Chuyển sang Coach Draft.`,
      ],
    };
  }

  // Generate 3 new teams for the next round
  const newTeams = pickRandomTeams(3);

  return {
    ...state,
    picks: newPicks,
    currentTeamChoices: newTeams,
    selectedTeam: null,
    teamRoster: [],
    phase: 'team_draft',
    targetRole: nextUnfilled,
    history: [
      ...state.history,
      `Đã chọn ${player.player_name} (${player.team_name} ${player.year}) cho vị trí ${assignedRole}`,
    ],
  };
}

export function pickCoach(state: DraftState, coach: CoachVersion): DraftState {
  return {
    ...state,
    coach,
    phase: 'complete',
    history: [
      ...state.history,
      `Đã chọn HLV trưởng ${coach.coach_name} (${coach.team_name} ${coach.year}). Đội hình Dream Team hoàn tất!`,
    ],
  };
}
