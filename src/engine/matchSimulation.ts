import {
  TournamentTeam,
  TournamentMatch,
  MatchGame,
  MatchEvent,
  MatchEventType,
  PlayerGameStats,
  GameMVPDetails,
  Role,
  ROLES,
  ROLE_LABELS,
} from '../data/types';
import {
  getEffectivePlayerRating,
  updatePlayerFormAfterGame,
  calculateRoleScore,
} from './playerModel';
import { evaluateTacticalMatchup } from './tactics';

/**
 * Generates causally linked chronological match events for an individual game
 */
export function generateGameTimeline(
  gameNumber: number,
  team1: TournamentTeam,
  team2: TournamentTeam,
  winnerId: string,
  team1Kills: number,
  team2Kills: number,
  durationMinutes: number,
  durationSeconds: number
): MatchEvent[] {
  const events: MatchEvent[] = [];
  const isTeam1Winner = winnerId === team1.id;
  const winner = isTeam1Winner ? team1 : team2;
  const loser = isTeam1Winner ? team2 : team1;

  const totalSec = durationMinutes * 60 + durationSeconds;
  let currKills1 = 0;
  let currKills2 = 0;
  let goldDiff = 0; // positive = team1 lead

  const addEvent = (
    sec: number,
    type: MatchEventType,
    team: TournamentTeam,
    actorRole: Role,
    targetRole?: Role,
    title?: string,
    description?: string,
    goldDelta: number = 0,
    killDelta1: number = 0,
    killDelta2: number = 0,
    importance: 'normal' | 'high' | 'decisive' = 'normal'
  ) => {
    currKills1 += killDelta1;
    currKills2 += killDelta2;
    goldDiff += team.id === team1.id ? goldDelta : -goldDelta;

    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    const actor = team.players[actorRole].name;
    const target = targetRole
      ? (team.id === team1.id ? team2 : team1).players[targetRole].name
      : undefined;

    events.push({
      id: `evt_g${gameNumber}_${events.length + 1}`,
      gameNumber,
      timestamp: timeStr,
      seconds: sec,
      type,
      teamId: team.id,
      teamName: team.name,
      actorName: actor,
      actorRole,
      targetName: target,
      targetRole,
      title: title || `${team.name} tạo đột biến!`,
      description: description || `${actor} tạo dấu ấn chiến thuật trên bản đồ.`,
      goldDifference: goldDiff,
      killsScore: [currKills1, currKills2],
      importance,
    });
  };

  // 1. First Blood (2:00 - 3:45)
  const fbTime = Math.floor(120 + Math.random() * 95);
  const fbTeam = Math.random() < (isTeam1Winner ? 0.6 : 0.4) ? team1 : team2;
  const fbOther = fbTeam.id === team1.id ? team2 : team1;
  const fbKillerRole: Role = Math.random() < 0.5 ? 'Jungle' : Math.random() < 0.5 ? 'Mid' : 'DSL';
  const fbVictimRole: Role = Math.random() < 0.5 ? 'Mid' : 'DSL';

  addEvent(
    fbTime,
    'first_blood',
    fbTeam,
    fbKillerRole,
    fbVictimRole,
    'Chiến Công Đầu!',
    `${fbTeam.players[fbKillerRole].name} chớp thời cơ dồn sát thương chuẩn xác hạ gục ${fbOther.players[fbVictimRole].name}, đem về Chiến công đầu cho ${fbTeam.name}!`,
    800,
    fbTeam.id === team1.id ? 1 : 0,
    fbTeam.id === team2.id ? 1 : 0,
    'high'
  );

  // 2. First Dragon (4:00 - 5:30)
  const dragTime = Math.floor(240 + Math.random() * 80);
  const dragTeam = Math.random() < (isTeam1Winner ? 0.65 : 0.35) ? team1 : team2;
  addEvent(
    dragTime,
    'dragon',
    dragTeam,
    'Jungle',
    undefined,
    'Kiểm Soát Rồng Kraydus!',
    `${dragTeam.players.Jungle.name} cùng Trợ thủ ${dragTeam.players.Support.name} thiết lập thế trận bài bản, ăn thành công Rồng Ánh Sáng đầu trận.`,
    1200,
    0,
    0,
    'normal'
  );

  // 3. Early Tower (6:30 - 8:30)
  const towerTime = Math.floor(390 + Math.random() * 110);
  const towerTeam = Math.random() < (isTeam1Winner ? 0.7 : 0.3) ? team1 : team2;
  const towerRole: Role = Math.random() < 0.6 ? 'Farm' : 'DSL';
  addEvent(
    towerTime,
    'tower',
    towerTeam,
    towerRole,
    undefined,
    'Phá Hủy Trụ Đầu Tiên!',
    `${towerTeam.players[towerRole].name} cùng đồng đội đẩy lính thần tốc, san phẳng trụ đầu đường ngoài của đối phương.`,
    1000,
    0,
    0,
    'normal'
  );

  // 4. Mid-Game Skirmish or Solo Kill (8:45 - 11:30)
  const midFightTime = Math.floor(520 + Math.random() * 150);
  const midWinner = Math.random() < (isTeam1Winner ? 0.65 : 0.35) ? team1 : team2;
  const midLoser = midWinner.id === team1.id ? team2 : team1;
  addEvent(
    midFightTime,
    'teamfight',
    midWinner,
    'Mid',
    'Farm',
    'Giao Tranh Đường Giữa Thắng Lợi!',
    `Pha khép góc đỉnh cao từ ${midWinner.players.Support.name} mở đường cho ${midWinner.players.Mid.name} gây lượng sát thương khủng khiếp lên ${midLoser.players.Farm.name}.`,
    1500,
    midWinner.id === team1.id ? 2 : 0,
    midWinner.id === team2.id ? 2 : 0,
    'high'
  );

  // 5. Dark Slayer / Caesar (12:00 - 15:30)
  const slayerTime = Math.floor(720 + Math.random() * 190);
  const slayerTeam = Math.random() < (isTeam1Winner ? 0.75 : 0.25) ? team1 : team2;
  const isStolen = Math.random() < 0.15;
  addEvent(
    slayerTime,
    isStolen ? 'slayer_stolen' : 'dark_slayer',
    slayerTeam,
    'Jungle',
    undefined,
    isStolen ? 'CƯỚP CAESAR THẦN THÁNH!' : 'Bùa Lợi Dark Slayer!',
    isStolen
      ? `KHÔNG THỂ TIN ĐƯỢC! ${slayerTeam.players.Jungle.name} lao vào hang Trừng Trị chuẩn xác cướp bùa lợi Caesar ngay trước mắt đối phương!`
      : `${slayerTeam.players.Jungle.name} kết liễu Dark Slayer, giải phóng bùa lợi đẩy mạnh cả 3 đường!`,
    2000,
    isStolen ? 1 : 0,
    isStolen ? 0 : 0,
    'high'
  );

  // 6. Comeback fight or High Ground Defense (if long game > 16 min)
  if (totalSec > 960) {
    const defenseTime = Math.floor(slayerTime + 120 + Math.random() * 120);
    const defTeam = Math.random() < 0.5 ? loser : winner;
    addEvent(
      defenseTime,
      'defensive_hold',
      defTeam,
      'Farm',
      'Jungle',
      'Thủ Nhà Kiên Cường!',
      `${defTeam.players.Farm.name} bắn cháy máy giữ lại trụ nhà lính, bẻ gãy đợt tấn công tưởng chừng định đoạt trận đấu!`,
      800,
      defTeam.id === team1.id ? 2 : 0,
      defTeam.id === team2.id ? 2 : 0,
      'high'
    );
  }

  // 7. Decisive Late Caesar (if game > 18 min)
  if (totalSec > 1100) {
    const elderTime = totalSec - 100;
    addEvent(
      elderTime,
      'dark_slayer',
      winner,
      'Jungle',
      undefined,
      'Caesar Bạo Chúa Định Đoạt!',
      `${winner.players.Jungle.name} cùng ${winner.name} đập tan nỗ lực tranh chấp, hạ gục Caesar Bạo Chúa và mở toang cánh cửa chiến thắng.`,
      2500,
      winner.id === team1.id ? 1 : 0,
      winner.id === team2.id ? 1 : 0,
      'decisive'
    );
  }

  // 8. Decisive Final Push & Nexus (totalSec - 20s to end)
  const finalFightTime = totalSec - 25;
  const carryRole: Role = Math.random() < 0.5 ? 'Farm' : Math.random() < 0.5 ? 'Mid' : 'Jungle';
  addEvent(
    finalFightTime,
    'nexus',
    winner,
    carryRole,
    'Support',
    'QUÉT SẠCH & PHÁ HỦY NHÀ CHÍNH!',
    `${winner.players[carryRole].name} cùng toàn đội quét sạch đối thủ, tràn vào phá hủy Nhà Chính giành chiến thắng ván đấu!`,
    3000,
    isTeam1Winner ? Math.max(1, team1Kills - currKills1) : 0,
    !isTeam1Winner ? Math.max(1, team2Kills - currKills2) : 0,
    'decisive'
  );

  return events;
}

/**
 * Simulates an individual game between two tournament teams with realistic physics,
 * probabilistic outcomes, momentum, reverse sweep dynamics, full player stats, and MVP
 */
export function simulateRealisticGame(
  team1: TournamentTeam,
  team2: TournamentTeam,
  gameNumber: number,
  seriesScore1: number,
  seriesScore2: number,
  targetWins: number
): MatchGame {
  // 1. Base effective power
  const eff1 = team1.effectiveStrength || team1.powerRating;
  const eff2 = team2.effectiveStrength || team2.powerRating;
  let diff = eff1 - eff2;

  // 2. Tactical matchup modifier
  if (team1.tacticalIdentity && team2.tacticalIdentity) {
    const tacticalMatchup = evaluateTacticalMatchup(
      team1.tacticalIdentity,
      team2.tacticalIdentity
    );
    diff += tacticalMatchup.advantageScore;
  }

  // 3. Momentum & Reverse Sweep Logic
  // If team1 has a lead (e.g. 2-0 in Bo5, or 3-1 in Bo7):
  const lead1 = seriesScore1 - seriesScore2;
  if (lead1 >= 2) {
    // Team 1 has momentum (+0.8), BUT Team 2 has tactical desperation adaptation (+1.6)
    // giving trailing team an honest shot to trigger a thrilling reverse sweep!
    diff += -0.8;
  } else if (lead1 <= -2) {
    diff += +0.8;
  } else if (lead1 === 1) {
    diff += 0.4;
  } else if (lead1 === -1) {
    diff -= 0.4;
  }

  // 4. Decisive Game Pressure (Game 5 in Bo5, Game 7 in Bo7)
  const isMatchPointBoth =
    seriesScore1 === targetWins - 1 && seriesScore2 === targetWins - 1;
  if (isMatchPointBoth) {
    // In game 5/7, clutch ratings matter heavily
    const clutch1 = team1.playerProfiles
      ? Object.values(team1.playerProfiles).reduce((a, b) => a + b.attributes.clutch, 0) / 5
      : 85;
    const clutch2 = team2.playerProfiles
      ? Object.values(team2.playerProfiles).reduce((a, b) => a + b.attributes.clutch, 0) / 5
      : 85;
    diff += (clutch1 - clutch2) * 0.15;
  }

  // 5. Logistic Probability Calculation (Never 0% and never 100%)
  // A 5-point advantage yields ~68% win rate
  const p1 = 1 / (1 + Math.pow(10, -diff / 12));
  const roll = Math.random();
  const isTeam1Winner = roll < p1;
  const winner = isTeam1Winner ? team1 : team2;
  const loser = isTeam1Winner ? team2 : team1;

  // 6. Game Duration (12:00 to 24:30)
  const baseMinutes = isMatchPointBoth ? 17 : 14;
  const durationMinutes = Math.floor(baseMinutes + (Math.random() - 0.3) * 6);
  const durationSeconds = Math.floor(Math.random() * 60);
  const durationStr = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

  // 7. Team Kills
  const winnerKills = Math.floor(11 + Math.random() * 14);
  const loserKills = Math.floor(Math.max(2, winnerKills - (3 + Math.floor(Math.random() * 9))));
  const score: [number, number] = isTeam1Winner
    ? [winnerKills, loserKills]
    : [loserKills, winnerKills];

  // 8. Distribute Player Statistics
  const playerGameStats: Record<string, PlayerGameStats> = {};

  const distributeTeamStats = (
    team: TournamentTeam,
    totalKills: number,
    enemyKills: number,
    isWinnerTeam: boolean
  ) => {
    // Role kill weight distributions: Farm & Mid have most kills, Support has least
    const killWeights: Record<Role, number> = {
      Farm: 0.35,
      Mid: 0.3,
      Jungle: 0.22,
      DSL: 0.1,
      Support: 0.03,
    };
    const deathWeights: Record<Role, number> = {
      Support: 0.3,
      DSL: 0.25,
      Jungle: 0.2,
      Mid: 0.15,
      Farm: 0.1,
    };
    const assistWeights: Record<Role, number> = {
      Support: 0.85,
      Mid: 0.65,
      Jungle: 0.6,
      Farm: 0.45,
      DSL: 0.4,
    };

    ROLES.forEach(role => {
      const p = team.players[role];
      const prof = team.playerProfiles ? team.playerProfiles[role] : undefined;
      const k = Math.round(totalKills * killWeights[role] * (0.8 + Math.random() * 0.4));
      const d = Math.round(enemyKills * deathWeights[role] * (0.8 + Math.random() * 0.4));
      const a = Math.round(totalKills * assistWeights[role] * (0.8 + Math.random() * 0.4));

      const gold = Math.floor(
        (isWinnerTeam ? 10500 : 8500) +
          (role === 'Farm' || role === 'Mid' ? 2500 : role === 'Jungle' ? 1800 : 0) +
          (Math.random() - 0.5) * 1200
      );
      const damagePercent = Number(
        (
          (role === 'Farm' ? 32 : role === 'Mid' ? 28 : role === 'DSL' ? 18 : role === 'Jungle' ? 15 : 7) +
          (Math.random() - 0.5) * 6
        ).toFixed(1)
      );
      const kpPercent = Number(
        Math.min(100, Math.max(25, (((k + a) / Math.max(1, totalKills)) * 100))).toFixed(1)
      );

      // Performance Score (0 - 10 scale)
      // Rewards role execution: Support high KP, Jungle objectives, Farm damage, DSL dueling
      let scoreRating = isWinnerTeam ? 7.8 : 6.0;
      scoreRating += (k * 0.25) - (d * 0.3) + (a * 0.15);
      if (role === 'Support' && kpPercent >= 75) scoreRating += 1.2;
      if (role === 'Farm' && damagePercent >= 30) scoreRating += 1.0;
      if (prof && prof.currentForm === 'excellent') scoreRating += 0.5;
      scoreRating = Number(Math.min(10.0, Math.max(4.0, scoreRating)).toFixed(1));

      playerGameStats[p.name] = {
        playerId: prof?.playerId || `p_${p.name}`,
        playerName: p.name,
        role,
        teamId: team.id,
        kills: k,
        deaths: d,
        assists: a,
        gold,
        damagePercent,
        kpPercent,
        performanceScore: scoreRating,
      };

      // Update tournament stats and form on profiles if available
      if (prof) {
        prof.tournamentStats.gamesPlayed++;
        if (isWinnerTeam) prof.tournamentStats.gamesWon++;
        prof.tournamentStats.kills += k;
        prof.tournamentStats.deaths += d;
        prof.tournamentStats.assists += a;
        prof.tournamentStats.totalDamageShare += damagePercent;
        prof.tournamentStats.totalGold += gold;
        prof.tournamentStats.avgPerformanceScore = Number(
          (
            (prof.tournamentStats.avgPerformanceScore *
              (prof.tournamentStats.gamesPlayed - 1) +
              scoreRating) /
            prof.tournamentStats.gamesPlayed
          ).toFixed(2)
        );

        // Update form dynamically!
        prof.currentForm = updatePlayerFormAfterGame(prof.currentForm, scoreRating, isWinnerTeam);
      }
    });
  };

  distributeTeamStats(winner, winnerKills, loserKills, true);
  distributeTeamStats(loser, loserKills, winnerKills, false);

  // 9. Select Game MVP
  // Evaluates performance across all roles on winning team
  let bestScore = -1;
  let mvpRole: Role = 'Farm' as Role;
  let mvpPlayerName = winner.players.Farm.name;

  ROLES.forEach(r => {
    const stats = playerGameStats[winner.players[r].name];
    if (stats && stats.performanceScore > bestScore) {
      bestScore = stats.performanceScore;
      mvpRole = r;
      mvpPlayerName = winner.players[r].name;
    }
  });

  const mvpStats = playerGameStats[mvpPlayerName];
  const mvpProf = winner.playerProfiles ? winner.playerProfiles[mvpRole] : undefined;
  if (mvpProf) {
    mvpProf.tournamentStats.mvpCount++;
  }

  // Construct realistic reason for MVP
  let mvpReason = '';
  if (mvpRole === 'Support') {
    mvpReason = `Kiểm soát tầm nhìn hoàn hảo và tham gia ${mvpStats.kpPercent}% điểm hạ gục, mở giao tranh chuẩn xác định đoạt ván đấu.`;
  } else if (mvpRole === 'Jungle') {
    mvpReason = `Kiểm soát triệt để các bùa lợi Caesar và Rồng, tạo áp lực gank khủng khiếp đưa cả đội tới chiến thắng.`;
  } else if (mvpRole === 'Farm') {
    mvpReason = `Xả ${mvpStats.damagePercent}% tổng sát thương toàn đội, giữ vị trí xuất sắc và bắn phá tan nát đội hình đối phương.`;
  } else if (mvpRole === 'Mid') {
    mvpReason = `Đảo đường sắc bén, dồn sát thương bùng nổ hạ gục chủ lực đối phương trong các pha giao tranh then chốt.`;
  } else {
    mvpReason = `Áp đảo hoàn toàn đường Tà Thần, bắt lẻ hiểm hóc và chia cắt đội hình địch xuất sắc.`;
  }

  const mvpDetails: GameMVPDetails = {
    playerId: mvpProf?.playerId || `p_${mvpPlayerName}`,
    playerName: mvpPlayerName,
    role: mvpRole,
    kda: `${mvpStats.kills}/${mvpStats.deaths}/${mvpStats.assists}`,
    performanceScore: mvpStats.performanceScore,
    reason: mvpReason,
    portrait_url: winner.players[mvpRole].portrait_url,
  };

  // 10. Generate Chronological Event Timeline
  const timeline = generateGameTimeline(
    gameNumber,
    team1,
    team2,
    winner.id,
    score[0],
    score[1],
    durationMinutes,
    durationSeconds
  );

  return {
    gameNumber,
    winnerId: winner.id,
    winnerName: winner.name,
    duration: durationStr,
    mvp: mvpPlayerName,
    mvpDetails,
    score,
    timeline,
    playerGameStats,
    gameNarrative: `${winner.name} giành thắng lợi thuyết phục tại Ván ${gameNumber} sau ${durationStr} phút thi đấu kịch tính!`,
  };
}

/**
 * Simulates a full match series (Bo3, Bo5, or Bo7) game by game
 */
export function simulateFullMatchSeries(match: TournamentMatch): TournamentMatch {
  if (match.isComplete && match.games.length > 0) {
    return match; // Idempotent: Never re-randomize completed match!
  }

  const targetWins = match.format === 'Bo3' ? 2 : match.format === 'Bo5' ? 3 : 4;
  const games: MatchGame[] = [];
  let score1 = 0;
  let score2 = 0;
  let gameNum = 1;

  while (score1 < targetWins && score2 < targetWins) {
    const game = simulateRealisticGame(
      match.team1,
      match.team2,
      gameNum,
      score1,
      score2,
      targetWins
    );
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
