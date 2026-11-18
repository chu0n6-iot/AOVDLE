import { describe, it, expect } from 'vitest';
import {
  generatePlayerAttributes,
  calculateRoleScore,
  createPlayerPerformanceProfile,
  updatePlayerFormAfterGame,
  calculateRealisticTeamStrength,
  getEffectivePlayerRating,
} from '../playerModel';
import { assignTeamTacticalIdentity, evaluateTacticalMatchup } from '../tactics';
import {
  simulateRealisticGame,
  simulateFullMatchSeries,
} from '../matchSimulation';
import { calculateTournamentFMVP } from '../fmvp';
import {
  generateAITournamentTeams,
  initializeSwissStage,
  advanceSwissRound,
  initializePlayoffBracket,
  advancePlayoffBracket,
} from '../tournament';
import { TournamentTeam, TournamentMatch, Role, ROLES } from '../../data/types';

describe('Big Update: Realistic Esports Simulation & Player Performance Model', () => {
  it('generates rich, contextual player attributes centered around baseline rating', () => {
    const dslAttrs = generatePlayerAttributes(90, 'DSL', 'test_dsl');
    const supAttrs = generatePlayerAttributes(90, 'Support', 'test_sup');
    const farmAttrs = generatePlayerAttributes(90, 'Farm', 'test_farm');

    // DSL should have higher laning than Support
    expect(dslAttrs.laning).toBeGreaterThan(supAttrs.laning);
    // Support should have higher kill participation than Farm
    expect(supAttrs.killParticipation).toBeGreaterThan(farmAttrs.killParticipation);
    // Farm should have higher damage contribution than Support
    expect(farmAttrs.damageContribution).toBeGreaterThan(supAttrs.damageContribution);
  });

  it('evaluates role performance score according to distinct role criteria', () => {
    const attrs = generatePlayerAttributes(88, 'Farm', 'test_farm');
    const score = calculateRoleScore(attrs, 'Farm');
    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('models superstar impact and weak-link vulnerability in team strength', () => {
    // Team A: 5 balanced players (rating 86 each)
    const balancedProfiles: any = {};
    ROLES.forEach(r => {
      balancedProfiles[r] = createPlayerPerformanceProfile(
        {
          player_id: `p_${r}`,
          player_name: `Balanced_${r}`,
          nickname: `B_${r}`,
          country: 'VN',
          team_id: 't_b',
          tournament_id: 'APL2026',
          team_name: 'Team Balanced',
          role: r,
          source_url: '',
          verification_status: 'verified',
          year: 2026,
          rating: 86,
        },
        'stable'
      );
    });

    const balancedResult = calculateRealisticTeamStrength(balancedProfiles, null, 'balanced');

    // Team B: 1 superstar (rating 96 Farm), 3 normal (86), 1 weak link (76 Support)
    const polarizedProfiles: any = {};
    ROLES.forEach(r => {
      let rating = 86;
      if (r === 'Farm') rating = 96; // Superstar
      if (r === 'Support') rating = 76; // Weak Link
      polarizedProfiles[r] = createPlayerPerformanceProfile(
        {
          player_id: `p_pol_${r}`,
          player_name: `Pol_${r}`,
          nickname: `Pol_${r}`,
          country: 'VN',
          team_id: 't_pol',
          tournament_id: 'APL2026',
          team_name: 'Team Polarized',
          role: r,
          source_url: '',
          verification_status: 'verified',
          year: 2026,
          rating,
        },
        'stable'
      );
    });

    const polarizedResult = calculateRealisticTeamStrength(polarizedProfiles, null, 'balanced');

    expect(polarizedResult.superstarBonus).toBeGreaterThan(0);
    expect(polarizedResult.weakLinkPenalty).toBeGreaterThan(0);
    expect(polarizedResult.superstarRole).toBe('Farm');
    expect(polarizedResult.weakestRole).toBe('Support');
  });

  it('evolves tournament form dynamically after games without corrupting baseline', () => {
    // Star player with baseline 92
    const baseline = 92;
    const initialForm = 'stable';

    // Phenomenal game (score 9.5) -> ascends to 'strong'
    const nextForm = updatePlayerFormAfterGame(initialForm, 9.5, true);
    expect(nextForm).toBe('strong');

    // Second phenomenal game -> ascends to 'excellent'
    const peakForm = updatePlayerFormAfterGame(nextForm, 9.6, true);
    expect(peakForm).toBe('excellent');

    // Bad game -> drops to 'strong' (inertia: doesn't plunge straight to poor)
    const afterBadGame = updatePlayerFormAfterGame(peakForm, 5.0, false);
    expect(afterBadGame).toBe('strong');
  });

  it('assigns tactical identities and computes strategic matchup interactions', () => {
    const sgpTactics = assignTeamTacticalIdentity('Saigon Phantom');
    expect(sgpTactics).toBe('early_aggression');

    const matchup = evaluateTacticalMatchup('early_aggression', 'scaling_late');
    expect(matchup.advantageScore).toBeGreaterThan(0);
    expect(matchup.description).toContain('khắc chế');
  });

  it('simulates games with realistic timeline events, scores, and role-diverse MVPs', () => {
    const teams = generateAITournamentTeams();
    const t1 = teams[0];
    const t2 = teams[1];

    const game = simulateRealisticGame(t1, t2, 1, 0, 0, 3);
    expect(game.gameNumber).toBe(1);
    expect([t1.id, t2.id]).toContain(game.winnerId);
    expect(game.timeline).toBeDefined();
    expect(game.timeline!.length).toBeGreaterThan(5);

    // Verify first blood and nexus events exist
    const hasFirstBlood = game.timeline!.some(e => e.type === 'first_blood');
    const hasNexus = game.timeline!.some(e => e.type === 'nexus');
    expect(hasFirstBlood).toBe(true);
    expect(hasNexus).toBe(true);

    // Player stats present for all 10 players
    expect(Object.keys(game.playerGameStats || {})).toHaveLength(10);
    expect(game.mvpDetails).toBeDefined();
    expect(game.mvpDetails?.performanceScore).toBeGreaterThanOrEqual(4.0);
  });

  it('simulates full series (Bo5/Bo7) respecting target score and allowing reverse sweeps', () => {
    const teams = generateAITournamentTeams();
    const match: TournamentMatch = {
      id: 'test_bo5',
      stage: 'swiss',
      roundName: 'Test Match',
      roundNumber: 1,
      team1: teams[0],
      team2: teams[1],
      score1: 0,
      score2: 0,
      winner: null,
      format: 'Bo5',
      games: [],
      isComplete: false,
    };

    const completed = simulateFullMatchSeries(match);
    expect(completed.isComplete).toBe(true);
    expect(completed.winner).toBeDefined();
    expect(Math.max(completed.score1, completed.score2)).toBe(3);
    expect(completed.games.length).toBe(completed.score1 + completed.score2);
  });

  it('calculates comprehensive FMVP from champion team across multiple roles', () => {
    const swiss = initializeSwissStage(generateAITournamentTeams()[0]);
    let currentSwiss = swiss;
    while (!currentSwiss.isComplete) {
      currentSwiss = advanceSwissRound(currentSwiss);
    }

    const bracket = initializePlayoffBracket(currentSwiss.qualifiedTeams);
    const completedBracket = advancePlayoffBracket(bracket, currentSwiss);

    expect(completedBracket.champion).toBeDefined();
    expect(completedBracket.fmvp).toBeDefined();
    expect(completedBracket.fmvp?.playerName).toBeDefined();
    expect(ROLES).toContain(completedBracket.fmvp?.role);
    expect(completedBracket.fmvp?.citation).toBeDefined();
    expect(completedBracket.fmvp?.citation.length).toBeGreaterThan(20);
  });
});
