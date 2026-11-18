import {
  TournamentTeam,
  TournamentMatch,
  MatchGame,
  SwissStageState,
  PlayoffBracket,
  Role,
  ROLES,
  DreamTeam,
} from '../data/types';
import { HISTORICAL_TEAMS, HISTORICAL_PLAYERS, HISTORICAL_COACHES } from '../data/historicalData';

// Generates 15 authentic AI opponent teams from our real historical dataset
export function generateAITournamentTeams(): TournamentTeam[] {
  // Candidate team names from international history
  const candidateNames = [
    'Bacon Time',
    'Buriram United Esports',
    'Flash Wolves',
    'Talon Esports',
    'Saigon Phantom',
    'Team Flash',
    'ONE Team',
    'BanMei Gaming',
    'FULL SENSE',
    'eArena',
    'Deep Cross Gaming',
    'Bikertopia Esports',
    'V Gaming',
    'Hong Kong Attitude',
    'Kagendra',
    'Valencia CF Esports',
    'BOX Gaming',
    'Most Outstanding Player',
  ];

  const aiTeams: TournamentTeam[] = [];
  const usedTeamNames = new Set<string>();

  for (const name of candidateNames) {
    if (aiTeams.length >= 15) break;

    // Find teams matching this name in historical dataset
    const matchedTeams = HISTORICAL_TEAMS.filter(t =>
      t.team_name.toLowerCase().includes(name.toLowerCase())
    );
    if (matchedTeams.length === 0) continue;

    // Pick the most recent edition
    const selectedTeamSeason = matchedTeams[matchedTeams.length - 1];
    if (usedTeamNames.has(selectedTeamSeason.team_name)) continue;
    usedTeamNames.add(selectedTeamSeason.team_name);

    // Find its players
    const teamPlayers = HISTORICAL_PLAYERS.filter(p => p.team_id === selectedTeamSeason.team_id);
    const teamCoach = HISTORICAL_COACHES.find(c => c.team_id === selectedTeamSeason.team_id) || {
      coach_name: 'Coach ' + selectedTeamSeason.team_name.slice(0, 4),
      rating: 84,
    };

    const rosterObj: Record<Role, { name: string; rating: number; country?: string }> = {
      DSL: { name: 'Player Top', rating: 82 },
      Jungle: { name: 'Player Jungle', rating: 84 },
      Mid: { name: 'Player Mid', rating: 85 },
      Farm: { name: 'Player Farm', rating: 83 },
      Support: { name: 'Player Support', rating: 81 },
    };

    ROLES.forEach(role => {
      const p = teamPlayers.find(tp => tp.role === role);
      if (p) {
        rosterObj[role] = { name: p.player_name, rating: p.rating, country: p.country };
      }
    });

    const avgRating = Number(
      (
        ROLES.reduce((acc, r) => acc + rosterObj[r].rating, 0) / 5 +
        (teamCoach.rating - 75) * 0.15
      ).toFixed(1)
    );

    const tag = selectedTeamSeason.team_name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);

    aiTeams.push({
      id: `ai_${selectedTeamSeason.team_id}`,
      name: selectedTeamSeason.team_name,
      tag: tag || 'AOV',
      team_id: selectedTeamSeason.team_id,
      isPlayer: false,
      powerRating: avgRating,
      players: rosterObj,
      coach: { name: teamCoach.coach_name, rating: teamCoach.rating },
      swissRecord: { wins: 0, losses: 0, matchDiff: 0, opponents: [] },
      status: 'active',
      seed: aiTeams.length + 2,
    });
  }

  return aiTeams;
}

export function convertDreamTeamToTournamentTeam(dreamTeam: DreamTeam): TournamentTeam {
  const rosterObj: Record<Role, { name: string; rating: number; country?: string }> = {
    DSL: { name: dreamTeam.DSL?.player_name || 'DSL Player', rating: dreamTeam.DSL?.rating || 80 },
    Jungle: { name: dreamTeam.Jungle?.player_name || 'Jungle Player', rating: dreamTeam.Jungle?.rating || 80 },
    Mid: { name: dreamTeam.Mid?.player_name || 'Mid Player', rating: dreamTeam.Mid?.rating || 80 },
    Farm: { name: dreamTeam.Farm?.player_name || 'Farm Player', rating: dreamTeam.Farm?.rating || 80 },
    Support: { name: dreamTeam.Support?.player_name || 'Support Player', rating: dreamTeam.Support?.rating || 80 },
  };

  return {
    id: 'user_dream_team',
    name: 'MY DREAM TEAM',
    tag: 'DREAM',
    team_id: 'dream_team',
    isPlayer: true,
    powerRating: dreamTeam.finalStrength || 88.5,
    players: rosterObj,
    coach: {
      name: dreamTeam.coach?.coach_name || 'Tactician',
      rating: dreamTeam.coach?.rating || 85,
    },
    swissRecord: { wins: 0, losses: 0, matchDiff: 0, opponents: [] },
    status: 'active',
    seed: 1,
  };
}

/**
 * Simulate an individual game between two teams using their power ratings
 */
export function simulateSingleGame(
  team1: TournamentTeam,
  team2: TournamentTeam,
  gameNumber: number
): MatchGame {
  const diff = team1.powerRating - team2.powerRating;
  // Win probability for team1: logistic function around 50%
  const p1 = 1 / (1 + Math.exp(-diff / 3.5));
  const roll = Math.random();
  const winner = roll < p1 ? team1 : team2;

  // Pick MVP from winner's roster
  const roles: Role[] = ROLES;
  const mvpRole = roles[Math.floor(Math.random() * roles.length)];
  const mvp = winner.players[mvpRole].name;

  const minutes = Math.floor(12 + Math.random() * 11);
  const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');

  return {
    gameNumber,
    winnerId: winner.id,
    duration: `${minutes}:${seconds}`,
    mvp,
  };
}

/**
 * Simulate a complete match series (Bo3, Bo5, or Bo7)
 */
export function simulateMatchSeries(match: TournamentMatch): TournamentMatch {
  const games: MatchGame[] = [];
  let score1 = 0;
  let score2 = 0;
  const targetWins = match.format === 'Bo3' ? 2 : match.format === 'Bo5' ? 3 : 4;

  let gameNum = 1;
  while (score1 < targetWins && score2 < targetWins) {
    const game = simulateSingleGame(match.team1, match.team2, gameNum);
    games.push(game);
    if (game.winnerId === match.team1.id) {
      score1++;
    } else {
      score2++;
    }
    gameNum++;
  }

  const winner = score1 > score2 ? match.team1 : match.team2;

  return {
    ...match,
    score1,
    score2,
    winner,
    games,
    isComplete: true,
  };
}

/**
 * Initializes Swiss Stage (Round 1)
 */
export function initializeSwissStage(userTeam: TournamentTeam): SwissStageState {
  const aiTeams = generateAITournamentTeams();
  const all16Teams = [userTeam, ...aiTeams];

  // Seed pairings for Round 1: Seed 1 vs Seed 9, Seed 2 vs Seed 10, etc.
  const round1Matches: TournamentMatch[] = [];
  for (let i = 0; i < 8; i++) {
    const t1 = all16Teams[i];
    const t2 = all16Teams[i + 8];
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
  // Only active teams participate
  const activeTeams = teams.filter(t => t.status === 'active');
  const matches: TournamentMatch[] = [];

  // Group teams by record (wins - losses)
  const groups: Record<string, TournamentTeam[]> = {};
  activeTeams.forEach(team => {
    const key = `${team.swissRecord.wins}-${team.swissRecord.losses}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(team);
  });

  let matchIndex = 1;
  Object.entries(groups).forEach(([record, groupTeams]) => {
    // Shuffle within score group
    const pool = [...groupTeams].sort(() => 0.5 - Math.random());
    while (pool.length >= 2) {
      const t1 = pool.shift()!;
      // Find opponent not yet played in this tournament
      let opponentIdx = pool.findIndex(t => !t1.swissRecord.opponents.includes(t.id));
      if (opponentIdx === -1) opponentIdx = 0; // fallback if rematch unavoidable
      const t2 = pool.splice(opponentIdx, 1)[0];

      // Format: Bo5 if decisive (2-0, 2-1, 0-2, 1-2), else Bo3
      const isDecisive = t1.swissRecord.wins === 2 || t1.swissRecord.losses === 2;
      const format = isDecisive ? 'Bo5' : 'Bo3';

      matches.push({
        id: `swiss_r${roundNumber}_m${matchIndex++}`,
        stage: 'swiss',
        roundName: `Swiss Vòng ${roundNumber} (${record})`,
        roundNumber,
        team1: t1,
        team2: t2,
        score1: 0,
        score2: 0,
        winner: null,
        format,
        games: [],
        isComplete: false,
      });
    }
  });

  return matches;
}

/**
 * Advances Swiss Stage by simulating current round matches and updating records
 */
export function advanceSwissRound(state: SwissStageState): SwissStageState {
  // 1. Simulate all matches in current round
  const completedMatches = state.currentMatches.map(m =>
    m.isComplete ? m : simulateMatchSeries(m)
  );

  // 2. Update team records
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

  // Check if Swiss is done (8 qualified)
  if (qualified.length >= 8 || state.round >= 5) {
    return {
      ...state,
      teams: updatedTeams,
      currentMatches: completedMatches,
      historyMatches: allHistory,
      isComplete: true,
      qualifiedTeams: qualified,
      eliminatedTeams: eliminated,
    };
  }

  // Next round pairing
  const nextRoundNumber = state.round + 1;
  const nextMatches = pairSwissRound(updatedTeams, nextRoundNumber);

  return {
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
  // Sort qualified teams by wins desc, then matchDiff desc
  const sorted = [...qualifiedTeams].sort((a, b) => {
    if (b.swissRecord.wins !== a.swissRecord.wins) return b.swissRecord.wins - a.swissRecord.wins;
    return b.swissRecord.matchDiff - a.swissRecord.matchDiff;
  });

  // Top 8 teams
  const t = sorted.slice(0, 8);

  // Upper Round 1 matches (Bo5)
  // Seed 1 vs Seed 8, Seed 4 vs Seed 5, Seed 2 vs Seed 7, Seed 3 vs Seed 6
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
    isComplete: false,
  };
}

/**
 * Simulates entire Playoff bracket step-by-step or all at once
 */
export function advancePlayoffBracket(bracket: PlayoffBracket): PlayoffBracket {
  // Step 1: Upper Round 1
  const ubR1Done = bracket.upperRound1.map(m => (m.isComplete ? m : simulateMatchSeries(m)));

  // Losers drop to Lower Round 1, Winners advance to Upper Semifinal/Final
  const ubW1 = ubR1Done[0].winner!;
  const ubL1 = ubR1Done[0].winner!.id === ubR1Done[0].team1.id ? ubR1Done[0].team2 : ubR1Done[0].team1;

  const ubW2 = ubR1Done[1].winner!;
  const ubL2 = ubR1Done[1].winner!.id === ubR1Done[1].team1.id ? ubR1Done[1].team2 : ubR1Done[1].team1;

  const ubW3 = ubR1Done[2].winner!;
  const ubL3 = ubR1Done[2].winner!.id === ubR1Done[2].team1.id ? ubR1Done[2].team2 : ubR1Done[2].team1;

  const ubW4 = ubR1Done[3].winner!;
  const ubL4 = ubR1Done[3].winner!.id === ubR1Done[3].team1.id ? ubR1Done[3].team2 : ubR1Done[3].team1;

  // Upper Final (Bo7 between Winners)
  // UB Semi 1: ubW1 vs ubW2
  const ubSemi1 = simulateMatchSeries({
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
  const ubSemi2 = simulateMatchSeries({
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
  const upperFinal = simulateMatchSeries({
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
  const lbR1M1 = simulateMatchSeries({
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

  const lbR1M2 = simulateMatchSeries({
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

  const lbR2M1 = simulateMatchSeries({
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

  const lbR2M2 = simulateMatchSeries({
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
  const lbSemi = simulateMatchSeries({
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
  const upperFinalLoser = upperFinal.winner!.id === upperFinal.team1.id ? upperFinal.team2 : upperFinal.team1;
  const lowerFinal = simulateMatchSeries({
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
  const grandFinal = simulateMatchSeries({
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
  const runnerUp = grandFinal.winner!.id === grandFinal.team1.id ? grandFinal.team2 : grandFinal.team1;

  return {
    upperRound1: ubR1Done,
    upperFinal,
    lowerRound1: [lbR1M1, lbR1M2],
    lowerRound2: [lbR2M1, lbR2M2, lbSemi],
    lowerFinal,
    grandFinal,
    champion,
    runnerUp,
    isComplete: true,
  };
}
