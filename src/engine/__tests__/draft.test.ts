import { describe, it, expect } from 'vitest';
import {
  initializeDraft,
  pickRandomTeams,
  selectTeam,
  pickPlayer,
  rerollDraftTeams,
  pickCoach,
} from '../draft';
import { PlayerVersion, CoachVersion } from '../../data/types';

describe('Draft Engine', () => {
  it('initializes draft with 3 teams, 3 rerolls, and DSL target', () => {
    const draft = initializeDraft();
    expect(draft.phase).toBe('team_draft');
    expect(draft.rerollsLeft).toBe(3);
    expect(draft.currentTeamChoices).toHaveLength(3);
    expect(draft.picks.DSL).toBeNull();
  });

  it('selects a team and shows roster', () => {
    const draft = initializeDraft();
    const team = draft.currentTeamChoices[0];
    const updated = selectTeam(draft, team);
    expect(updated.phase).toBe('player_draft');
    expect(updated.selectedTeam?.team_id).toBe(team.team_id);
  });

  it('reroll decreases rerollsLeft by 1 and changes teams', () => {
    const draft = initializeDraft();
    const rerolled = rerollDraftTeams(draft);
    expect(rerolled.rerollsLeft).toBe(2);
    expect(rerolled.currentTeamChoices).toHaveLength(3);
  });

  it('prevents reroll when rerollsLeft is 0', () => {
    let draft = initializeDraft();
    draft = rerollDraftTeams(draft);
    draft = rerollDraftTeams(draft);
    draft = rerollDraftTeams(draft);
    expect(draft.rerollsLeft).toBe(0);

    const attempted = rerollDraftTeams(draft);
    expect(attempted.rerollsLeft).toBe(0);
  });

  it('prevents selecting duplicate player_id', () => {
    let draft = initializeDraft();
    const dummyPlayer: PlayerVersion = {
      player_id: 'PLAYER_TEST_1',
      player_name: 'TestPlayer',
      nickname: 'TestPlayer',
      country: 'Vietnam',
      team_id: 'TEAM_TEST',
      tournament_id: 'APL2026',
      team_name: 'Test Team',
      role: 'DSL',
      source_url: '',
      verification_status: 'verified',
      year: 2026,
      rating: 88,
    };

    draft = pickPlayer(draft, dummyPlayer, 'DSL');
    expect(draft.picks.DSL?.player_id).toBe('PLAYER_TEST_1');

    // Attempt to pick again
    const dupDraft = pickPlayer(draft, dummyPlayer, 'Jungle');
    expect(dupDraft.picks.Jungle).toBeNull();
  });

  it('advances to coach draft once 5 positions are filled', () => {
    let draft = initializeDraft();
    const roles: ('DSL' | 'Jungle' | 'Mid' | 'Farm' | 'Support')[] = [
      'DSL',
      'Jungle',
      'Mid',
      'Farm',
      'Support',
    ];

    roles.forEach((r, idx) => {
      const p: PlayerVersion = {
        player_id: `PLAYER_UNIQUE_${idx}`,
        player_name: `Player_${r}`,
        nickname: `Player_${r}`,
        country: 'Vietnam',
        team_id: 'TEAM_TEST',
        tournament_id: 'APL2026',
        team_name: 'Test Team',
        role: r,
        source_url: '',
        verification_status: 'verified',
        year: 2026,
        rating: 85,
      };
      draft = pickPlayer(draft, p, r);
    });

    expect(draft.phase).toBe('coach_draft');
    expect(draft.coachChoices.length).toBeGreaterThan(0);
  });
});
