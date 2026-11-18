import {
  Role,
  ROLES,
  PlayerVersion,
  PlayerAttributes,
  PlayerPerformanceProfile,
  TournamentForm,
  FORM_CONFIG,
  CoachVersion,
  TacticalIdentity,
} from '../data/types';
import { calculateSynergies } from './synergy';

/**
 * Generates calibrated historical attributes for a player based on baseline rating and role
 */
export function generatePlayerAttributes(
  baselineRating: number,
  role: Role,
  seedStr: string = ''
): PlayerAttributes {
  // Hash seed for deterministic yet unique player attribute variations
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const pseudoRand = (offset: number) => {
    const val = Math.sin(hash + offset) * 10000;
    return val - Math.floor(val); // 0 to 1
  };

  const base = Math.min(99, Math.max(70, baselineRating));

  // Role biases
  const rBias: Record<Role, Partial<Record<keyof PlayerAttributes, number>>> = {
    DSL: {
      laning: +3,
      mechanical: +2,
      survivalPositioning: +1,
      farming: -1,
      killParticipation: -2,
    },
    Jungle: {
      objectiveControl: +4,
      decisionMaking: +3,
      mechanical: +2,
      farming: +1,
      laning: -4,
    },
    Mid: {
      teamfight: +3,
      damageContribution: +3,
      mechanical: +2,
      decisionMaking: +1,
      survivalPositioning: -1,
    },
    Farm: {
      damageContribution: +4,
      farming: +4,
      survivalPositioning: +2,
      clutch: +2,
      laning: +1,
      objectiveControl: -2,
    },
    Support: {
      killParticipation: +5,
      objectiveControl: +3,
      decisionMaking: +4,
      teamfight: +3,
      farming: -8,
      damageContribution: -7,
    },
  };

  const getAttr = (key: keyof PlayerAttributes, offset: number): number => {
    const roleAdjustment = rBias[role][key] || 0;
    const variation = (pseudoRand(offset) - 0.5) * 6; // +/- 3 points variation
    const val = Math.round(base + roleAdjustment + variation);
    return Math.min(99, Math.max(65, val));
  };

  return {
    mechanical: getAttr('mechanical', 1),
    laning: getAttr('laning', 2),
    farming: getAttr('farming', 3),
    killParticipation: getAttr('killParticipation', 4),
    damageContribution: getAttr('damageContribution', 5),
    survivalPositioning: getAttr('survivalPositioning', 6),
    objectiveControl: getAttr('objectiveControl', 7),
    teamfight: getAttr('teamfight', 8),
    consistency: getAttr('consistency', 9),
    clutch: getAttr('clutch', 10),
    roleProficiency: getAttr('roleProficiency', 11),
    decisionMaking: getAttr('decisionMaking', 12),
  };
}

/**
 * Evaluates role-specific performance score from attributes
 */
export function calculateRoleScore(attributes: PlayerAttributes, role: Role): number {
  switch (role) {
    case 'DSL':
      return (
        attributes.laning * 0.25 +
        attributes.teamfight * 0.2 +
        attributes.mechanical * 0.2 +
        attributes.survivalPositioning * 0.15 +
        attributes.clutch * 0.1 +
        attributes.consistency * 0.1
      );
    case 'Jungle':
      return (
        attributes.objectiveControl * 0.3 +
        attributes.decisionMaking * 0.2 +
        attributes.mechanical * 0.2 +
        attributes.killParticipation * 0.15 +
        attributes.consistency * 0.15
      );
    case 'Mid':
      return (
        attributes.damageContribution * 0.25 +
        attributes.teamfight * 0.25 +
        attributes.laning * 0.2 +
        attributes.decisionMaking * 0.15 +
        attributes.mechanical * 0.15
      );
    case 'Farm':
      return (
        attributes.damageContribution * 0.35 +
        attributes.farming * 0.25 +
        attributes.survivalPositioning * 0.2 +
        attributes.clutch * 0.1 +
        attributes.mechanical * 0.1
      );
    case 'Support':
      return (
        attributes.killParticipation * 0.3 +
        attributes.objectiveControl * 0.25 +
        attributes.decisionMaking * 0.25 +
        attributes.teamfight * 0.2
      );
  }
}

/**
 * Creates an initial PlayerPerformanceProfile
 */
export function createPlayerPerformanceProfile(
  player: PlayerVersion,
  initialForm: TournamentForm = 'stable'
): PlayerPerformanceProfile {
  const attributes = generatePlayerAttributes(
    player.rating,
    player.role,
    `${player.player_id}_${player.player_name}`
  );

  return {
    playerId: player.player_id,
    playerName: player.player_name,
    role: player.role,
    country: player.country,
    portrait_url: player.portrait_url,
    baselineRating: player.rating,
    currentForm: initialForm,
    formScore: FORM_CONFIG[initialForm].multiplier,
    attributes,
    tournamentStats: {
      gamesPlayed: 0,
      gamesWon: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      mvpCount: 0,
      totalDamageShare: 0,
      totalGold: 0,
      avgPerformanceScore: player.rating / 10,
    },
  };
}

/**
 * Evaluates the effective rating of a player taking into account
 * role proficiency, attributes, baseline, and tournament form
 */
export function getEffectivePlayerRating(profile: PlayerPerformanceProfile): number {
  const roleScore = calculateRoleScore(profile.attributes, profile.role);
  const compositeBase = roleScore * 0.7 + profile.baselineRating * 0.3;
  const formMultiplier = FORM_CONFIG[profile.currentForm].multiplier;
  return Number((compositeBase * formMultiplier).toFixed(2));
}

/**
 * Updates player tournament form after a game
 */
export function updatePlayerFormAfterGame(
  currentForm: TournamentForm,
  gamePerformanceScore: number, // 0 to 10 scale (7.5 is average)
  isGameWinner: boolean
): TournamentForm {
  // Momentum score calculation
  const winBonus = isGameWinner ? 0.3 : -0.2;
  const adjustedScore = gamePerformanceScore + winBonus;

  if (adjustedScore >= 9.0) {
    if (currentForm === 'strong' || currentForm === 'excellent') return 'excellent';
    if (currentForm === 'stable') return 'strong';
    if (currentForm === 'inconsistent') return 'stable';
    return 'inconsistent';
  } else if (adjustedScore >= 8.0) {
    if (currentForm === 'excellent') return 'excellent';
    if (currentForm === 'stable' || currentForm === 'strong') return 'strong';
    if (currentForm === 'inconsistent') return 'stable';
    return 'inconsistent';
  } else if (adjustedScore >= 6.8) {
    // Normal / stable performance
    if (currentForm === 'excellent') return 'strong';
    if (currentForm === 'poor') return 'inconsistent';
    return currentForm;
  } else if (adjustedScore >= 5.5) {
    // Underperforming
    if (currentForm === 'excellent') return 'strong';
    if (currentForm === 'strong') return 'stable';
    if (currentForm === 'stable') return 'inconsistent';
    return 'poor';
  } else {
    // Very poor game
    if (currentForm === 'excellent') return 'strong';
    if (currentForm === 'strong') return 'inconsistent';
    if (currentForm === 'stable') return 'inconsistent';
    return 'poor';
  }
}

export interface RealisticTeamStrengthResult {
  baseRating: number;
  effectiveRatings: Record<Role, number>;
  superstarBonus: number;
  superstarRole: Role;
  weakLinkPenalty: number;
  weakestRole: Role;
  coachBonus: number;
  synergyBonus: number;
  tacticalBonus: number;
  finalStrength: number;
}

/**
 * Realistic Contextual Team Strength Model
 * Accounts for superstar impact, weak-link vulnerabilities, role balance,
 * coach contribution, and team synergy.
 */
export function calculateRealisticTeamStrength(
  profiles: Record<Role, PlayerPerformanceProfile>,
  coach: CoachVersion | null,
  tacticalIdentity?: TacticalIdentity
): RealisticTeamStrengthResult {
  const roles = ROLES;
  const effectiveRatings: Record<Role, number> = {} as any;
  let sumEffective = 0;

  roles.forEach(role => {
    const prof = profiles[role];
    const eff = getEffectivePlayerRating(prof);
    effectiveRatings[role] = eff;
    sumEffective += eff;
  });

  const baseRating = Number((sumEffective / roles.length).toFixed(2));

  // Identify Superstar and Weak Link
  let maxRating = -1;
  let superstarRole: Role = 'Mid' as Role;
  let minRating = 999;
  let weakestRole: Role = 'Support' as Role;

  roles.forEach(role => {
    const r = effectiveRatings[role];
    if (r > maxRating) {
      maxRating = r;
      superstarRole = role;
    }
    if (r < minRating) {
      minRating = r;
      weakestRole = role;
    }
  });

  // 1. Superstar Impact:
  // An elite player >= 2.0 pts above average elevates team carry potential
  let superstarBonus = 0;
  const starDiff = maxRating - baseRating;
  if (starDiff >= 2.0) {
    superstarBonus = Number((Math.min(3.5, (starDiff - 1.5) * 0.75)).toFixed(2));
    // If the superstar is Farm or Jungle, having a good Support increases enabling
    if (superstarRole === 'Farm' || superstarRole === 'Jungle') {
      const supProf = profiles.Support;
      if (supProf && supProf.attributes.survivalPositioning >= 85) {
        superstarBonus += 0.4;
      }
    }
  }

  // 2. Weak-Link Vulnerability:
  // If the lowest rated player is >= 3.0 pts below average, opponents can punish
  let weakLinkPenalty = 0;
  const weakDiff = baseRating - minRating;
  if (weakDiff >= 3.0) {
    weakLinkPenalty = Number((Math.min(3.0, (weakDiff - 2.5) * 0.65)).toFixed(2));
  }

  // 3. Coach Tactical Bonus:
  let coachBonus = 0;
  if (coach) {
    coachBonus = Number(((coach.rating - 75) * 0.18).toFixed(2)); // e.g. 85 -> +1.8
  }

  // 4. Synergy Bonus:
  // Create mock picks for synergy engine
  const mockPicks: any = {};
  roles.forEach(r => {
    mockPicks[r] = {
      player_id: profiles[r].playerId,
      player_name: profiles[r].playerName,
      role: r,
      rating: profiles[r].baselineRating,
    };
  });
  const { bonusPercent } = calculateSynergies(mockPicks, coach);
  const synergyBonus = Number(((baseRating * bonusPercent) / 100).toFixed(2));

  // 5. Tactical Identity subtle bonus
  const tacticalBonus = tacticalIdentity && tacticalIdentity !== 'balanced' ? 0.3 : 0;

  const finalStrength = Number(
    (
      baseRating +
      superstarBonus -
      weakLinkPenalty +
      coachBonus +
      synergyBonus +
      tacticalBonus
    ).toFixed(2)
  );

  return {
    baseRating,
    effectiveRatings,
    superstarBonus,
    superstarRole,
    weakLinkPenalty,
    weakestRole,
    coachBonus,
    synergyBonus,
    tacticalBonus,
    finalStrength,
  };
}
