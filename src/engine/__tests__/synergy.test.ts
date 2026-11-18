import { describe, it, expect } from 'vitest';
import { calculateSynergies } from '../synergy';
import { PlayerVersion, CoachVersion, Role } from '../../data/types';

describe('Hidden Synergy Engine', () => {
  it('activates player-player synergy for same team-season', () => {
    const p1: PlayerVersion = {
      player_id: 'P1',
      player_name: 'XB',
      nickname: 'XB',
      country: 'Vietnam',
      team_id: 'AIC2019_FL',
      tournament_id: 'AIC2019',
      team_name: 'Team Flash',
      role: 'Mid',
      source_url: '',
      verification_status: 'verified',
      year: 2019,
      rating: 95,
    };

    const p2: PlayerVersion = {
      player_id: 'P2',
      player_name: 'ADC',
      nickname: 'ADC',
      country: 'Vietnam',
      team_id: 'AIC2019_FL',
      tournament_id: 'AIC2019',
      team_name: 'Team Flash',
      role: 'Jungle',
      source_url: '',
      verification_status: 'verified',
      year: 2019,
      rating: 96,
    };

    const picks: Record<Role, PlayerVersion | null> = {
      DSL: null,
      Jungle: p2,
      Mid: p1,
      Farm: null,
      Support: null,
    };

    const { links, bonusPercent } = calculateSynergies(picks, null);
    expect(links).toHaveLength(1);
    expect(links[0].type).toBe('player_player');
    expect(bonusPercent).toBe(1.5);
  });

  it('does NOT activate synergy for different tournaments/teams', () => {
    const p1: PlayerVersion = {
      player_id: 'P1',
      player_name: 'XB',
      nickname: 'XB',
      country: 'Vietnam',
      team_id: 'AIC2019_FL',
      tournament_id: 'AIC2019',
      team_name: 'Team Flash',
      role: 'Mid',
      source_url: '',
      verification_status: 'verified',
      year: 2019,
      rating: 95,
    };

    const p2: PlayerVersion = {
      player_id: 'P2',
      player_name: 'Bâng',
      nickname: 'Bâng',
      country: 'Vietnam',
      team_id: 'APL2020_SGP',
      tournament_id: 'APL2020',
      team_name: 'Saigon Phantom',
      role: 'Jungle',
      source_url: '',
      verification_status: 'verified',
      year: 2020,
      rating: 94,
    };

    const picks: Record<Role, PlayerVersion | null> = {
      DSL: null,
      Jungle: p2,
      Mid: p1,
      Farm: null,
      Support: null,
    };

    const { links, bonusPercent } = calculateSynergies(picks, null);
    expect(links).toHaveLength(0);
    expect(bonusPercent).toBe(0);
  });

  it('caps synergy bonus at maximum 5.0%', () => {
    // 5 players and coach all from same team-season
    const makePlayer = (id: string, role: Role): PlayerVersion => ({
      player_id: id,
      player_name: `Player_${id}`,
      nickname: id,
      country: 'Vietnam',
      team_id: 'AIC2019_FL',
      tournament_id: 'AIC2019',
      team_name: 'Team Flash',
      role,
      source_url: '',
      verification_status: 'verified',
      year: 2019,
      rating: 92,
    });

    const coach: CoachVersion = {
      coach_id: 'COACH_1',
      coach_name: 'Harvin',
      team_id: 'AIC2019_FL',
      team_name: 'Team Flash',
      tournament_id: 'AIC2019',
      role: 'Head Coach',
      source_url: '',
      verification_status: 'verified',
      country: 'Vietnam',
      year: 2019,
      rating: 95,
    };

    const picks: Record<Role, PlayerVersion | null> = {
      DSL: makePlayer('1', 'DSL'),
      Jungle: makePlayer('2', 'Jungle'),
      Mid: makePlayer('3', 'Mid'),
      Farm: makePlayer('4', 'Farm'),
      Support: makePlayer('5', 'Support'),
    };

    const { bonusPercent } = calculateSynergies(picks, coach);
    expect(bonusPercent).toBe(5.0); // Capped at 5.0%
  });
});
