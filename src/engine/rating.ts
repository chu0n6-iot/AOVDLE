import { PlayerVersion, CoachVersion, DreamTeam, Role, ROLES } from '../data/types';
import { calculateSynergies } from './synergy';

export interface StrengthBreakdown {
  playerAverage: number;
  coachBonus: number;
  synergyBonusPoints: number;
  synergyPercent: number;
  finalStrength: number;
}

export function calculateDreamTeamStrength(
  picks: Record<Role, PlayerVersion | null>,
  coach: CoachVersion | null
): StrengthBreakdown {
  const activeRoles = ROLES.filter(r => picks[r] !== null);
  if (activeRoles.length === 0) {
    return {
      playerAverage: 0,
      coachBonus: 0,
      synergyBonusPoints: 0,
      synergyPercent: 0,
      finalStrength: 0,
    };
  }

  const sumRatings = activeRoles.reduce((acc, r) => acc + (picks[r]?.rating || 0), 0);
  const playerAverage = Number((sumRatings / activeRoles.length).toFixed(1));

  // Coach tactical bonus: +1 to +5 points based on coach rating
  let coachBonus = 0;
  if (coach) {
    coachBonus = Number(((coach.rating - 75) * 0.2).toFixed(1)); // 85 rating -> +2.0
  }

  // Synergy bonus
  const { bonusPercent } = calculateSynergies(picks, coach);
  const basePower = playerAverage + coachBonus;
  const synergyBonusPoints = Number(((basePower * bonusPercent) / 100).toFixed(1));

  const finalStrength = Number((basePower + synergyBonusPoints).toFixed(1));

  return {
    playerAverage,
    coachBonus,
    synergyBonusPoints,
    synergyPercent: bonusPercent,
    finalStrength,
  };
}
