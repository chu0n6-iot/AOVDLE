import {
  TournamentTeam,
  TournamentMatch,
  MatchGame,
  SwissStageState,
  PlayoffBracket,
  Role,
  ROLES,
  DreamTeam,
  PlayerPerformanceProfile,
  PlayerVersion,
} from '../data/types';
import { HISTORICAL_PLAYERS, HISTORICAL_COACHES } from '../data/historicalData';
import {
  createPlayerPerformanceProfile,
  calculateRealisticTeamStrength,
} from './playerModel';
import { assignTeamTacticalIdentity } from './tactics';
import { simulateRealisticGame, simulateFullMatchSeries } from './matchSimulation';
import { calculateTournamentFMVP } from './fmvp';

/**
 * Generates 15 authentic AI opponent teams from our real historical dataset
 * equipped with full realistic player performance profiles, authentic tactical identities,
 * and calculated team strength models.
 */
export function generateAITournamentTeams(): TournamentTeam[] {
  const aiTeams: TournamentTeam[] = [];
  const generatedSignatures = new Set<string>();
  const shuffle = <T,>(items: T[]): T[] => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  for (let teamIndex = 0; teamIndex < 15; teamIndex++) {
    let selectedPlayers: Partial<Record<Role, PlayerVersion>> = {};
    let signature = '';

    for (let attempt = 0; attempt < 100; attempt++) {
      const usedSourceTeams = new Set<string>();
      const candidatePlayers: Partial<Record<Role, PlayerVersion>> = {};

      for (const role of ROLES) {
        const roleCandidates = shuffle(HISTORICAL_PLAYERS.filter(p => p.role === role));
        const player =
          roleCandidates.find(candidate => !usedSourceTeams.has(candidate.team_id)) ||
          roleCandidates[0];
        if (player) {
          candidatePlayers[role] = player;
          usedSourceTeams.add(player.team_id);
        }
      }

      const candidateSignature = ROLES.map(role => candidatePlayers[role]?.player_id || '').join('|');
      if (ROLES.every(role => candidatePlayers[role]) && !generatedSignatures.has(candidateSignature)) {
        selectedPlayers = candidatePlayers;
        signature = candidateSignature;
        break;
      }
    }

    if (!signature) {
      throw new Error('Unable to generate a unique historical Dream Team opponent.');
    }

    generatedSignatures.add(signature);
    const teamName = `AI Dream Team ${String(teamIndex + 1).padStart(2, '0')}`;
    const teamCoach = shuffle(HISTORICAL_COACHES)[0] || {
      coach_name: `Coach ${teamIndex + 1}`,
      rating: 84,
      team_id: `ai_coach_${teamIndex + 1}`,
      team_name: teamName,
      coach_id: `coach_ai_${teamIndex + 1}`,
      tournament_id: 'ai_dream_team',
      role: 'Head Coach',
      source_url: '',
      verification_status: 'verified' as const,
      country: 'International',
      year: 2026,
    };

    const rosterObj = {} as Record<
      Role,
      { name: string; rating: number; country?: string; portrait_url?: string }
    >;

    const playerProfiles = {} as Record<Role, PlayerPerformanceProfile>;

    ROLES.forEach(role => {
      const player = selectedPlayers[role]!;
      rosterObj[role] = {
        name: player.player_name,
        rating: player.rating,
        country: player.country,
        portrait_url: player.portrait_url,
      };
      playerProfiles[role] = createPlayerPerformanceProfile(player, 'stable');
    });

    const tacticalIdentity = assignTeamTacticalIdentity(teamName, teamIndex + 1);

    const teamStrengthCalc = calculateRealisticTeamStrength(
      playerProfiles,
      teamCoach as any,
      tacticalIdentity
    );

    const tag = teamName
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);

    aiTeams.push({
      id: `ai_dream_team_${teamIndex + 1}`,
      name: teamName,
      tag: tag || 'AOV',
      team_id: `ai_dream_team_${teamIndex + 1}`,
      isPlayer: false,
      powerRating: teamStrengthCalc.finalStrength,
      effectiveStrength: teamStrengthCalc.finalStrength,
      tacticalIdentity,
      superstarRole: teamStrengthCalc.superstarRole,
      weakestRole: teamStrengthCalc.weakestRole,
      players: rosterObj,
      playerProfiles,
      coach: {
        name: teamCoach.coach_name,
        rating: teamCoach.rating,
        country: teamCoach.country,
      },
      swissRecord: { wins: 0, losses: 0, matchDiff: 0, opponents: [] },
      status: 'active',
      seed: aiTeams.length + 2,
    });
  }

  return aiTeams;
}

export function convertDreamTeamToTournamentTeam(dreamTeam: DreamTeam): TournamentTeam {
  const rosterObj: Record<Role, { name: string; rating: number; country?: string; portrait_url?: string }> = {
    DSL: {
      name: dreamTeam.DSL?.player_name || 'DSL Player',
      rating: dreamTeam.DSL?.rating || 80,
      portrait_url: dreamTeam.DSL?.portrait_url,
    },
    Jungle: {
      name: dreamTeam.Jungle?.player_name || 'Jungle Player',
      rating: dreamTeam.Jungle?.rating || 80,
      portrait_url: dreamTeam.Jungle?.portrait_url,
    },
    Mid: {
      name: dreamTeam.Mid?.player_name || 'Mid Player',
      rating: dreamTeam.Mid?.rating || 80,
      portrait_url: dreamTeam.Mid?.portrait_url,
    },
    Farm: {
      name: dreamTeam.Farm?.player_name || 'Farm Player',
      rating: dreamTeam.Farm?.rating || 80,
      portrait_url: dreamTeam.Farm?.portrait_url,
    },
    Support: {
      name: dreamTeam.Support?.player_name || 'Support Player',
      rating: dreamTeam.Support?.rating || 80,
      portrait_url: dreamTeam.Support?.portrait_url,
    },
  };

  const playerProfiles: Record<Role, PlayerPerformanceProfile> = {} as any;
  ROLES.forEach(r => {
    const pv = dreamTeam[r];
    if (pv) {
      playerProfiles[r] = createPlayerPerformanceProfile(pv, 'strong');
    } else {
      const dummyP: PlayerVersion = {
        player_id: `dt_${r}`,
        player_name: rosterObj[r].name,
        nickname: rosterObj[r].name,
        country: 'Vietnam',
        team_id: 'dream_team',
        tournament_id: 'APL2026',
        team_name: 'MY DREAM TEAM',
        role: r,
        source_url: '',
        verification_status: 'verified',
        year: 2026,
        rating: rosterObj[r].rating,
      };
      playerProfiles[r] = createPlayerPerformanceProfile(dummyP, 'stable');
    }
  });

  const tacticalIdentity = 'balanced';
  const teamStrengthCalc = calculateRealisticTeamStrength(
    playerProfiles,
    dreamTeam.coach,
    tacticalIdentity
  );

  return {
    id: 'user_dream_team',
    name: 'MY DREAM TEAM',
    tag: 'DREAM',
    team_id: 'dream_team',
    isPlayer: true,
    powerRating: teamStrengthCalc.finalStrength || dreamTeam.finalStrength || 88.5,
    effectiveStrength: teamStrengthCalc.finalStrength || dreamTeam.finalStrength || 88.5,
    tacticalIdentity,
    superstarRole: teamStrengthCalc.superstarRole,
    weakestRole: teamStrengthCalc.weakestRole,
    players: rosterObj,
    playerProfiles,
    coach: {
      name: dreamTeam.coach?.coach_name || 'Tactician',
      rating: dreamTeam.coach?.rating || 85,
      country: dreamTeam.coach?.country,
    },
    swissRecord: { wins: 0, losses: 0, matchDiff: 0, opponents: [] },
    status: 'active',
    seed: 1,
  };
}

/**
 * Backward compatible simulateSingleGame
 */
export function simulateSingleGame(
  team1: TournamentTeam,
  team2: TournamentTeam,
  gameNumber: number
): MatchGame {
  return simulateRealisticGame(team1, team2, gameNumber, 0, 0, 2);
}

/**
 * Backward compatible simulateMatchSeries
 */
export function simulateMatchSeries(match: TournamentMatch): TournamentMatch {
  return simulateFullMatchSeries(match);
}

/**
 * Initializes Swiss Stage (Round 1)
 */
export function initializeSwissStage(userTeam: TournamentTeam): SwissStageState {
  const aiTeams = generateAITournamentTeams();
  const all16Teams = [userTeam, ...aiTeams].slice(0, 16);
  const tournamentSeed = Date.now() % 2147483647;
  let seed = tournamentSeed;
  const random = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  const shuffled = [...all16Teams].sort((a, b) => random() - random());

  const round1Matches: TournamentMatch[] = [];
  for (let i = 0; i < 8; i++) {
    const t1 = shuffled[i * 2];
    const t2 = shuffled[i * 2 + 1];
    round1Matches.push({
      id: `swiss_r1_m${i + 1}`,
      stage: 'swiss',
      roundName: 'Swiss Vòng 1',
      roundNumber: 1,
      team1: t1,
      team2: t2,
      score1: 0,
      score2: 0,
      winner: null,
      format: 'Bo3',
      games: [],
      isComplete: false,
    });
  }

  return {
    tournamentSeed,
    round: 1,
    teams: all16Teams,
    currentMatches: round1Matches,
    historyMatches: [],
    isComplete: false,
    qualifiedTeams: [],
    eliminatedTeams: [],
  };
}

/**
 * Pairs teams for subsequent Swiss rounds (2 to 5)
 */
export function pairSwissRound(teams: TournamentTeam[], roundNumber: number): TournamentMatch[] {
  const activeTeams = teams.filter(t => t.status === 'active');
  const matches: TournamentMatch[] = [];

  const groups: Record<string, TournamentTeam[]> = {};
  activeTeams.forEach(team => {
    const key = `${team.swissRecord.wins}-${team.swissRecord.losses}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(team);
  });

  let matchIndex = 1;
  let shuffleSeed = roundNumber * 104729 + activeTeams.reduce((sum, team) => sum + team.seed, 0);
  const seededRandom = () => {
    shuffleSeed = (shuffleSeed * 48271) % 2147483647;
    return shuffleSeed / 2147483647;
  };
  const unmatched: TournamentTeam[] = [];
  Object.entries(groups).forEach(([, groupTeams]) => unmatched.push(...groupTeams));

  while (unmatched.length >= 2) {
    let team1Index = -1;
    let team2Index = -1;

    // First priority: same record and never met.
    for (let i = 0; i < unmatched.length && team1Index === -1; i++) {
      const candidate = unmatched[i];
      const opponentIndex = unmatched.findIndex((team, index) =>
        index !== i &&
        team.swissRecord.wins === candidate.swissRecord.wins &&
        team.swissRecord.losses === candidate.swissRecord.losses &&
        !candidate.swissRecord.opponents.includes(team.id)
      );
      if (opponentIndex !== -1) {
        team1Index = i;
        team2Index = opponentIndex;
      }
    }

    // Second priority: any record, but never met.
    if (team1Index === -1) {
      for (let i = 0; i < unmatched.length && team1Index === -1; i++) {
        const candidate = unmatched[i];
        const opponentIndex = unmatched.findIndex((team, index) =>
          index !== i && !candidate.swissRecord.opponents.includes(team.id)
        );
        if (opponentIndex !== -1) {
          team1Index = i;
          team2Index = opponentIndex;
        }
      }
    }

    if (team1Index === -1) break;

    const t1 = unmatched.splice(team1Index, 1)[0];
    if (team2Index > team1Index) team2Index--;
    const t2 = unmatched.splice(team2Index, 1)[0];

    const isDecisive =
      t1.swissRecord.wins >= 2 ||
      t1.swissRecord.losses >= 2 ||
      t2.swissRecord.wins >= 2 ||
      t2.swissRecord.losses >= 2;
    const format = isDecisive ? 'Bo5' : 'Bo3';

    matches.push({
        id: `swiss_r${roundNumber}_m${matchIndex++}`,
        stage: 'swiss',
        roundName: `SWISS ROUND ${roundNumber}`,
        roundNumber,
        team1: t1,
        team2: t2,
        score1: 0,
        score2: 0,
        winner: null,
        format,
        games: [],
        isComplete: false,
        seed: shuffleSeed,
    });
  }

  return matches;
}

/**
 * Simulates a single match within the current Swiss stage
 */
export function simulateSingleSwissMatch(
  state: SwissStageState,
  matchId: string
): SwissStageState {
  const matchIndex = state.currentMatches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return state;

  const match = state.currentMatches[matchIndex];
  if (match.isComplete) return state;

  const completed = simulateFullMatchSeries(match);
  const updatedCurrentMatches = [...state.currentMatches];
  updatedCurrentMatches[matchIndex] = completed;

  return {
    ...state,
    currentMatches: updatedCurrentMatches,
  };
}

/**
 * Advances Swiss Stage by simulating any unsimulated current round matches and updating records
 */
export function advanceSwissRound(state: SwissStageState): SwissStageState {
  // Simulate remaining uncompleted matches
  const completedMatches = state.currentMatches.map(m =>
    m.isComplete ? m : simulateFullMatchSeries(m)
  );

  // Update team records
  const updatedTeams = state.teams.map(team => {
    const match = completedMatches.find(m => m.team1.id === team.id || m.team2.id === team.id);
    if (!match || !match.winner) return team;

    const isWinner = match.winner.id === team.id;
    const opponent = match.team1.id === team.id ? match.team2 : match.team1;
    const teamScore = match.team1.id === team.id ? match.score1 : match.score2;
    const oppScore = match.team1.id === team.id ? match.score2 : match.score1;

    const newWins = team.swissRecord.wins + (isWinner ? 1 : 0);
    const newLosses = team.swissRecord.losses + (!isWinner ? 1 : 0);
    const newDiff = team.swissRecord.matchDiff + (teamScore - oppScore);
    const newOpponents = [...team.swissRecord.opponents, opponent.id];

    let newStatus = team.status;
    if (newWins >= 3) newStatus = 'qualified';
    else if (newLosses >= 3) newStatus = 'eliminated';

    return {
      ...team,
      swissRecord: {
        wins: newWins,
        losses: newLosses,
        matchDiff: newDiff,
        opponents: newOpponents,
      },
      status: newStatus,
    };
  });

  const qualified = updatedTeams.filter(t => t.status === 'qualified');
  const eliminated = updatedTeams.filter(t => t.status === 'eliminated');
  const allHistory = [...state.historyMatches, ...completedMatches];

  // Check if Swiss is done (8 qualified or reached round 5)
  if (qualified.length >= 8 || state.round >= 5) {
    let finalQualified = [...qualified];
    if (finalQualified.length < 8) {
      const bestRemaining = updatedTeams
        .filter(t => !finalQualified.some(q => q.id === t.id))
        .sort((a, b) => {
          if (b.swissRecord.wins !== a.swissRecord.wins)
            return b.swissRecord.wins - a.swissRecord.wins;
          return b.swissRecord.matchDiff - a.swissRecord.matchDiff;
        });
      finalQualified = [...finalQualified, ...bestRemaining.slice(0, 8 - finalQualified.length)];
    }

    return {
      ...state,
      teams: updatedTeams,
      currentMatches: completedMatches,
      historyMatches: allHistory,
      isComplete: true,
      qualifiedTeams: finalQualified,
      eliminatedTeams: eliminated,
    };
  }

  const nextRoundNumber = state.round + 1;
  const nextMatches = pairSwissRound(updatedTeams, nextRoundNumber);

  return {
    tournamentSeed: state.tournamentSeed,
    round: nextRoundNumber,
    teams: updatedTeams,
    currentMatches: nextMatches,
    historyMatches: allHistory,
    isComplete: false,
    qualifiedTeams: qualified,
    eliminatedTeams: eliminated,
  };
}

/**
 * Initializes Double Elimination Playoff Bracket with the 8 qualified teams
 */
export function initializePlayoffBracket(qualifiedTeams: TournamentTeam[]): PlayoffBracket {
  const sorted = [...qualifiedTeams].sort((a, b) => {
    if (b.swissRecord.wins !== a.swissRecord.wins) return b.swissRecord.wins - a.swissRecord.wins;
    return b.swissRecord.matchDiff - a.swissRecord.matchDiff;
  });

  // Ensure exactly 8 teams
  while (sorted.length < 8) {
    const idx = sorted.length + 1;
    sorted.push({
      id: `fallback_po_t${idx}`,
      name: `Playoff Team ${idx}`,
      tag: `P${idx}`,
      team_id: `po_${idx}`,
      isPlayer: false,
      powerRating: 85,
      effectiveStrength: 85,
      players: {
        DSL: { name: `Top ${idx}`, rating: 85 },
        Jungle: { name: `Jungle ${idx}`, rating: 85 },
        Mid: { name: `Mid ${idx}`, rating: 85 },
        Farm: { name: `Farm ${idx}`, rating: 85 },
        Support: { name: `Support ${idx}`, rating: 85 },
      },
      coach: { name: `Coach ${idx}`, rating: 85 },
      swissRecord: { wins: 3, losses: 2, matchDiff: 0, opponents: [] },
      status: 'qualified',
      seed: idx,
    });
  }

  const t = sorted.slice(0, 8);

  const upperRound1: TournamentMatch[] = [
    {
      id: 'po_ub_r1_m1',
      stage: 'playoff_upper',
      roundName: 'Tứ Kết Nhánh Thắng (UB QF 1)',
      roundNumber: 1,
      team1: t[0],
      team2: t[7],
      score1: 0,
      score2: 0,
      winner: null,
      format: 'Bo5',
      games: [],
      isComplete: false,
    },
    {
      id: 'po_ub_r1_m2',
      stage: 'playoff_upper',
      roundName: 'Tứ Kết Nhánh Thắng (UB QF 2)',
      roundNumber: 1,
      team1: t[3],
      team2: t[4],
      score1: 0,
      score2: 0,
      winner: null,
      format: 'Bo5',
      games: [],
      isComplete: false,
    },
    {
      id: 'po_ub_r1_m3',
      stage: 'playoff_upper',
      roundName: 'Tứ Kết Nhánh Thắng (UB QF 3)',
      roundNumber: 1,
      team1: t[1],
      team2: t[6],
      score1: 0,
      score2: 0,
      winner: null,
      format: 'Bo5',
      games: [],
      isComplete: false,
    },
    {
      id: 'po_ub_r1_m4',
      stage: 'playoff_upper',
      roundName: 'Tứ Kết Nhánh Thắng (UB QF 4)',
      roundNumber: 1,
      team1: t[2],
      team2: t[5],
      score1: 0,
      score2: 0,
      winner: null,
      format: 'Bo5',
      games: [],
      isComplete: false,
    },
  ];

  return {
    upperRound1,
    upperFinal: null,
    lowerRound1: [],
    lowerRound2: [],
    lowerFinal: null,
    grandFinal: null,
    champion: null,
    runnerUp: null,
    fmvp: null,
    isComplete: false,
  };
}

/**
 * Helper to collect all matches from Swiss and Playoffs for tournament-wide evaluation
 */
export function getAllTournamentMatches(
  swissState: SwissStageState,
  playoffBracket: PlayoffBracket | null
): TournamentMatch[] {
  const matches = [...swissState.historyMatches, ...swissState.currentMatches];

  if (playoffBracket) {
    matches.push(...playoffBracket.upperRound1);
    if (playoffBracket.upperFinal) matches.push(playoffBracket.upperFinal);
    matches.push(...playoffBracket.lowerRound1);
    matches.push(...playoffBracket.lowerRound2);
    if (playoffBracket.lowerFinal) matches.push(playoffBracket.lowerFinal);
    if (playoffBracket.grandFinal) matches.push(playoffBracket.grandFinal);
  }

  return matches;
}

/**
 * Simulates playoff bracket completely to the end, calculating FMVP once Grand Final finishes
 */
export function advancePlayoffBracket(
  bracket: PlayoffBracket,
  swissState?: SwissStageState
): PlayoffBracket {
  // Step 1: Upper Round 1
  const ubR1Done = bracket.upperRound1.map(m => (m.isComplete ? m : simulateFullMatchSeries(m)));

  const ubW1 = ubR1Done[0].winner!;
  const ubL1 = ubR1Done[0].winner!.id === ubR1Done[0].team1.id ? ubR1Done[0].team2 : ubR1Done[0].team1;

  const ubW2 = ubR1Done[1].winner!;
  const ubL2 = ubR1Done[1].winner!.id === ubR1Done[1].team1.id ? ubR1Done[1].team2 : ubR1Done[1].team1;

  const ubW3 = ubR1Done[2].winner!;
  const ubL3 = ubR1Done[2].winner!.id === ubR1Done[2].team1.id ? ubR1Done[2].team2 : ubR1Done[2].team1;

  const ubW4 = ubR1Done[3].winner!;
  const ubL4 = ubR1Done[3].winner!.id === ubR1Done[3].team1.id ? ubR1Done[3].team2 : ubR1Done[3].team1;

  // UB Semi 1: ubW1 vs ubW2
  const ubSemi1 = simulateFullMatchSeries({
    id: 'po_ub_semi1',
    stage: 'playoff_upper',
    roundName: 'Bán Kết Nhánh Thắng 1',
    roundNumber: 2,
    team1: ubW1,
    team2: ubW2,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  // UB Semi 2: ubW3 vs ubW4
  const ubSemi2 = simulateFullMatchSeries({
    id: 'po_ub_semi2',
    stage: 'playoff_upper',
    roundName: 'Bán Kết Nhánh Thắng 2',
    roundNumber: 2,
    team1: ubW3,
    team2: ubW4,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  // Upper Final: Semi1 Winner vs Semi2 Winner
  const upperFinal = simulateFullMatchSeries({
    id: 'po_ub_final',
    stage: 'playoff_upper',
    roundName: 'Chung Kết Nhánh Thắng (Upper Final)',
    roundNumber: 3,
    team1: ubSemi1.winner!,
    team2: ubSemi2.winner!,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  // Lower Bracket Round 1 (Bo5)
  const lbR1M1 = simulateFullMatchSeries({
    id: 'po_lb_r1_m1',
    stage: 'playoff_lower',
    roundName: 'Nhánh Thua Vòng 1 (Trận 1)',
    roundNumber: 1,
    team1: ubL1,
    team2: ubL2,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo5',
    games: [],
    isComplete: false,
  });

  const lbR1M2 = simulateFullMatchSeries({
    id: 'po_lb_r1_m2',
    stage: 'playoff_lower',
    roundName: 'Nhánh Thua Vòng 1 (Trận 2)',
    roundNumber: 1,
    team1: ubL3,
    team2: ubL4,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo5',
    games: [],
    isComplete: false,
  });

  // Lower Bracket Round 2: LB R1 winners vs UB Semi losers (Bo7)
  const ubSemi1Loser = ubSemi1.winner!.id === ubSemi1.team1.id ? ubSemi1.team2 : ubSemi1.team1;
  const ubSemi2Loser = ubSemi2.winner!.id === ubSemi2.team1.id ? ubSemi2.team2 : ubSemi2.team1;

  const lbR2M1 = simulateFullMatchSeries({
    id: 'po_lb_r2_m1',
    stage: 'playoff_lower',
    roundName: 'Tứ Kết Nhánh Thua 1',
    roundNumber: 2,
    team1: lbR1M1.winner!,
    team2: ubSemi1Loser,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  const lbR2M2 = simulateFullMatchSeries({
    id: 'po_lb_r2_m2',
    stage: 'playoff_lower',
    roundName: 'Tứ Kết Nhánh Thua 2',
    roundNumber: 2,
    team1: lbR1M2.winner!,
    team2: ubSemi2Loser,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  // Lower Semifinal: lbR2M1 winner vs lbR2M2 winner
  const lbSemi = simulateFullMatchSeries({
    id: 'po_lb_semi',
    stage: 'playoff_lower',
    roundName: 'Bán Kết Nhánh Thua',
    roundNumber: 3,
    team1: lbR2M1.winner!,
    team2: lbR2M2.winner!,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  // Lower Final: lbSemi winner vs upperFinal loser (Bo7)
  const upperFinalLoser =
    upperFinal.winner!.id === upperFinal.team1.id ? upperFinal.team2 : upperFinal.team1;
  const lowerFinal = simulateFullMatchSeries({
    id: 'po_lb_final',
    stage: 'playoff_lower',
    roundName: 'Chung Kết Nhánh Thua (Lower Final)',
    roundNumber: 4,
    team1: lbSemi.winner!,
    team2: upperFinalLoser,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  // Grand Final (Bo7): Upper Final Winner vs Lower Final Winner!
  const grandFinal = simulateFullMatchSeries({
    id: 'po_grand_final',
    stage: 'grand_final',
    roundName: 'CHUNG KẾT TỔNG (GRAND FINAL - APL 2026)',
    roundNumber: 5,
    team1: upperFinal.winner!,
    team2: lowerFinal.winner!,
    score1: 0,
    score2: 0,
    winner: null,
    format: 'Bo7',
    games: [],
    isComplete: false,
  });

  const champion = grandFinal.winner!;
  const runnerUp =
    grandFinal.winner!.id === grandFinal.team1.id ? grandFinal.team2 : grandFinal.team1;

  const playoffMatches = [
    ...ubR1Done,
    ubSemi1,
    ubSemi2,
    upperFinal,
    lbR1M1,
    lbR1M2,
    lbR2M1,
    lbR2M2,
    lbSemi,
    lowerFinal,
    grandFinal,
  ];

  // Calculate FMVP across all matches in tournament
  const allMatches = swissState
    ? [...swissState.historyMatches, ...swissState.currentMatches, ...playoffMatches]
    : playoffMatches;

  const fmvp = calculateTournamentFMVP(champion, allMatches);

  return {
    upperRound1: ubR1Done,
    upperFinal,
    lowerRound1: [lbR1M1, lbR1M2],
    lowerRound2: [lbR2M1, lbR2M2, lbSemi],
    lowerFinal,
    grandFinal,
    champion,
    runnerUp,
    fmvp,
    isComplete: true,
  };
}
