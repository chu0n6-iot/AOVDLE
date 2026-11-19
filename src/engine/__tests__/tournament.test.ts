import { describe, it, expect } from 'vitest';
import {
  generateAITournamentTeams,
  initializeSwissStage,
  advanceSwissRound,
  initializePlayoffBracket,
  advancePlayoffBracket,
} from '../tournament';
import { TournamentTeam } from '../../data/types';

describe('Tournament Simulation Engine', () => {
  const dummyUserTeam: TournamentTeam = {
    id: 'user_team',
    name: 'MY TEST TEAM',
    tag: 'TEST',
    team_id: 'dream_team',
    isPlayer: true,
    powerRating: 92.5,
    players: {
      DSL: { name: 'P1', rating: 92 },
      Jungle: { name: 'P2', rating: 94 },
      Mid: { name: 'P3', rating: 95 },
      Farm: { name: 'P4', rating: 91 },
      Support: { name: 'P5', rating: 89 },
    },
    coach: { name: 'Coach T', rating: 90 },
    swissRecord: { wins: 0, losses: 0, matchDiff: 0, opponents: [] },
    status: 'active',
    seed: 1,
  };

  it('generates 15 AI opponents with valid rosters and ratings', () => {
    const aiTeams = generateAITournamentTeams();
    expect(aiTeams).toHaveLength(15);
    aiTeams.forEach(t => {
      expect(t.powerRating).toBeGreaterThanOrEqual(75);
      expect(t.players.DSL.name).toBeDefined();
      expect(t.players.Jungle.name).toBeDefined();
      expect(t.players.Mid.name).toBeDefined();
      expect(t.players.Farm.name).toBeDefined();
      expect(t.players.Support.name).toBeDefined();
    });
  });

  it('initializes Swiss Stage with 16 teams and 8 matches in Round 1', () => {
    const swiss = initializeSwissStage(dummyUserTeam);
    expect(swiss.teams).toHaveLength(16);
    expect(swiss.currentMatches).toHaveLength(8);
    expect(swiss.round).toBe(1);
    expect(swiss.isComplete).toBe(false);
  });

  it('simulates through Swiss stage and qualifies 8 teams', () => {
    let swiss = initializeSwissStage(dummyUserTeam);

    // Simulate Swiss rounds until completion
    let maxRounds = 7;
    while (!swiss.isComplete && maxRounds > 0) {
      swiss = advanceSwissRound(swiss);
      maxRounds--;
    }

    expect(swiss.isComplete).toBe(true);
    expect(swiss.qualifiedTeams.length).toBeGreaterThanOrEqual(8);
  });

  it('simulates Double Elimination playoffs to crown a Champion', () => {
    const swiss = initializeSwissStage(dummyUserTeam);
    let currentSwiss = swiss;
    while (!currentSwiss.isComplete) {
      currentSwiss = advanceSwissRound(currentSwiss);
    }

    const bracket = initializePlayoffBracket(currentSwiss.qualifiedTeams);
    expect(bracket.upperRound1).toHaveLength(4);

    const completedBracket = advancePlayoffBracket(bracket);
    expect(completedBracket.isComplete).toBe(true);
    expect(completedBracket.champion).toBeDefined();
    expect(completedBracket.grandFinal?.winner).toBeDefined();
  });

  it('avoids Swiss rematches and completes 100 tournaments with logical champions', () => {
    const champions = new Set<string>();

    for (let run = 0; run < 100; run++) {
      const seenPairs = new Set<string>();
      let swiss = initializeSwissStage({
        ...dummyUserTeam,
        powerRating: 88 + (run % 7),
        effectiveStrength: 88 + (run % 7),
      });

      for (let round = 0; round < 5 && !swiss.isComplete; round++) {
        const previousMatches = [...swiss.currentMatches];
        previousMatches.forEach(match => {
          const pair = [match.team1.id, match.team2.id].sort().join('|');
          expect(seenPairs.has(pair)).toBe(false);
          seenPairs.add(pair);
        });
        swiss = advanceSwissRound(swiss);
      }

      expect(swiss.qualifiedTeams).toHaveLength(8);
      const bracket = advancePlayoffBracket(initializePlayoffBracket(swiss.qualifiedTeams), swiss);
      expect(bracket.isComplete).toBe(true);
      expect(bracket.grandFinal?.winner?.id).toBe(bracket.champion?.id);
      champions.add(bracket.champion?.id || 'unknown');
    }

    expect(champions.size).toBeGreaterThan(1);
  }, 15000);
});
