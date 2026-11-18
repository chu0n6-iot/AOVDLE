import { TacticalIdentity, TACTICAL_CONFIG } from '../data/types';

/**
 * Known historical team tactical identities
 */
export const HISTORICAL_TEAM_TACTICS: Record<string, TacticalIdentity> = {
  'Saigon Phantom': 'early_aggression',
  'Team Flash': 'defensive_counter',
  'V Gaming': 'objective_control',
  'Bacon Time': 'objective_control',
  'Buriram United Esports': 'scaling_late',
  'Talon Esports': 'early_aggression',
  'Flash Wolves': 'split_pressure',
  'ONE Team': 'split_pressure',
  'BanMei Gaming': 'teamfight_oriented',
  'FULL SENSE': 'scaling_late',
  'eArena': 'early_aggression',
  'Deep Cross Gaming': 'early_aggression',
  'Bikertopia Esports': 'teamfight_oriented',
  'Hong Kong Attitude': 'defensive_counter',
  'Valencia CF Esports': 'objective_control',
  'Kagendra': 'early_aggression',
  'BOX Gaming': 'scaling_late',
  'Most Outstanding Player': 'teamfight_oriented',
};

/**
 * Assigns or predicts a tactical identity for a team
 */
export function assignTeamTacticalIdentity(teamName: string, seed: number = 0): TacticalIdentity {
  // Check known map
  for (const [knownName, tactics] of Object.entries(HISTORICAL_TEAM_TACTICS)) {
    if (teamName.toLowerCase().includes(knownName.toLowerCase())) {
      return tactics;
    }
  }

  const allTactics: TacticalIdentity[] = [
    'early_aggression',
    'objective_control',
    'teamfight_oriented',
    'scaling_late',
    'split_pressure',
    'defensive_counter',
    'balanced',
  ];

  return allTactics[Math.abs(seed) % allTactics.length];
}

export interface TacticalMatchupResult {
  advantageScore: number; // Positive = team1 advantage, Negative = team2 advantage
  description: string;
}

/**
 * Compares two team tactical identities and computes strategic matchup interactions
 */
export function evaluateTacticalMatchup(
  t1: TacticalIdentity,
  t2: TacticalIdentity
): TacticalMatchupResult {
  if (t1 === t2 || t1 === 'balanced' || t2 === 'balanced') {
    return {
      advantageScore: 0,
      description: 'Hai đội có lối chơi tương đối cân bằng về mặt chiến thuật.',
    };
  }

  const config1 = TACTICAL_CONFIG[t1];
  const config2 = TACTICAL_CONFIG[t2];

  if (config1.strengthsAgainst.includes(t2)) {
    return {
      advantageScore: 1.5,
      description: `Lối chơi "${config1.label}" của bên xanh khắc chế hiệu quả chiến thuật "${config2.label}".`,
    };
  }

  if (config1.weaknessesAgainst.includes(t2)) {
    return {
      advantageScore: -1.5,
      description: `Chiến thuật "${config2.label}" của bên đỏ tạo áp lực phản khắc lối chơi "${config1.label}".`,
    };
  }

  return {
    advantageScore: 0,
    description: 'Thế trận va chạm chiến thuật kịch tính giữa hai phong cách khác biệt.',
  };
}
