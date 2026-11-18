import { PlayerVersion, CoachVersion, SynergyLink, Role } from '../data/types';

/**
 * Hidden Synergy Engine
 * Strict rule validation per RULES.md:
 * - Player–Player: must share the exact same team_id AND tournament_id
 * - Player–Coach: must share the exact same team_id AND tournament_id, role must be Head Coach
 * - Bonus capped at +5.0%
 */

export function calculateSynergies(
  picks: Record<Role, PlayerVersion | null>,
  coach: CoachVersion | null
): { links: SynergyLink[]; bonusPercent: number } {
  const links: SynergyLink[] = [];
  const roles: Role[] = ['DSL', 'Jungle', 'Mid', 'Farm', 'Support'];
  const activePlayers: { role: Role; player: PlayerVersion }[] = [];

  roles.forEach(role => {
    const p = picks[role];
    if (p) activePlayers.push({ role, player: p });
  });

  // 1. Player - Player Synergies
  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = i + 1; j < activePlayers.length; j++) {
      const p1 = activePlayers[i].player;
      const p2 = activePlayers[j].player;

      // Strict check: must share exact team_id and tournament_id
      if (p1.team_id === p2.team_id && p1.tournament_id === p2.tournament_id) {
        links.push({
          id: `syn_pp_${p1.player_id}_${p2.player_id}`,
          type: 'player_player',
          sourceId: p1.player_id,
          sourceName: p1.player_name,
          targetId: p2.player_id,
          targetName: p2.player_name,
          team_id: p1.team_id,
          team_name: p1.team_name,
          tournament_id: p1.tournament_id,
          year: p1.year,
          title: `Đồng Đội Cùng Thời (${p1.team_name} ${p1.year})`,
          description: `${p1.player_name} và ${p2.player_name} từng kề vai sát cánh trong màu áo ${p1.team_name} tại ${p1.tournament_id}.`,
          bonusPercent: 1.5,
        });
      }
    }
  }

  // 2. Player - Coach Synergies
  if (coach) {
    activePlayers.forEach(({ player }) => {
      if (player.team_id === coach.team_id && player.tournament_id === coach.tournament_id) {
        links.push({
          id: `syn_pc_${player.player_id}_${coach.coach_id}`,
          type: 'player_coach',
          sourceId: player.player_id,
          sourceName: player.player_name,
          targetId: coach.coach_id,
          targetName: coach.coach_name,
          team_id: player.team_id,
          team_name: player.team_name,
          tournament_id: player.tournament_id,
          year: player.year,
          title: `Thầy Trò Đồng Lòng (${coach.coach_name} × ${player.team_name})`,
          description: `${player.player_name} từng được dẫn dắt trực tiếp bởi HLV trưởng ${coach.coach_name} tại kỳ giải ${player.tournament_id}.`,
          bonusPercent: 2.0,
        });
      }
    });
  }

  // Cap total bonus at 5.0%
  const rawBonus = links.reduce((acc, curr) => acc + curr.bonusPercent, 0);
  const bonusPercent = Math.min(5.0, Number(rawBonus.toFixed(1)));

  return { links, bonusPercent };
}
