import {
  TournamentTeam,
  TournamentMatch,
  FMVPAward,
  Role,
  ROLES,
  ROLE_LABELS,
} from '../data/types';

/**
 * Calculates the Tournament-Wide Finals Most Valuable Player (FMVP)
 * from the Champion team based on all matches throughout the tournament.
 */
export function calculateTournamentFMVP(
  champion: TournamentTeam,
  allMatches: TournamentMatch[]
): FMVPAward {
  // Candidate pool: 5 players from champion
  const candidates: Record<
    Role,
    {
      role: Role;
      name: string;
      portrait_url?: string;
      mvpCount: number;
      grandFinalMvps: number;
      totalKills: number;
      totalDeaths: number;
      totalAssists: number;
      totalGames: number;
      sumPerformanceScore: number;
      sumKpPercent: number;
      highlights: string[];
    }
  > = {} as any;

  ROLES.forEach(r => {
    candidates[r] = {
      role: r,
      name: champion.players[r].name,
      portrait_url: champion.players[r].portrait_url,
      mvpCount: 0,
      grandFinalMvps: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalGames: 0,
      sumPerformanceScore: 0,
      sumKpPercent: 0,
      highlights: [],
    };
  });

  // Traverse all matches where champion played
  allMatches.forEach(match => {
    if (!match.isComplete) return;
    const isChampTeam1 = match.team1.id === champion.id;
    const isChampTeam2 = match.team2.id === champion.id;
    if (!isChampTeam1 && !isChampTeam2) return;

    const isGrandFinal = match.stage === 'grand_final';

    match.games.forEach(game => {
      // Check MVP
      ROLES.forEach(r => {
        const c = candidates[r];
        if (game.mvp === c.name || game.mvpDetails?.playerName === c.name) {
          c.mvpCount++;
          if (isGrandFinal) {
            c.grandFinalMvps++;
            c.highlights.push(`Tỏa sáng rực rỡ với MVP tại Ván ${game.gameNumber} Chung Kết Tổng.`);
          } else if (match.stage === 'playoff_upper' || match.stage === 'playoff_lower') {
            c.highlights.push(`Giành MVP trận Playoffs then chốt (${match.roundName}).`);
          }
        }

        // Tally game stats if recorded
        if (game.playerGameStats && game.playerGameStats[c.name]) {
          const stats = game.playerGameStats[c.name];
          c.totalKills += stats.kills;
          c.totalDeaths += stats.deaths;
          c.totalAssists += stats.assists;
          c.sumPerformanceScore += stats.performanceScore;
          c.sumKpPercent += stats.kpPercent;
          c.totalGames++;
        }
      });
    });
  });

  // Calculate comprehensive FMVP score for each player
  let bestScore = -1;
  let fmvpRole: Role = 'Mid' as Role;

  ROLES.forEach(r => {
    const c = candidates[r];
    const games = Math.max(1, c.totalGames);
    const avgScore = c.sumPerformanceScore > 0 ? c.sumPerformanceScore / games : 7.5;
    const avgKp = c.sumKpPercent > 0 ? c.sumKpPercent / games : 60;
    const kdaRatio =
      c.totalDeaths > 0
        ? (c.totalKills + c.totalAssists) / c.totalDeaths
        : c.totalKills + c.totalAssists;

    // Role-equitable scoring:
    // Support and Jungle get higher weighting for KP and objective control
    // Farm gets weight for damage/kills; DSL gets weight for dueling/consistency
    let roleAdjustment = 0;
    if (r === 'Support') {
      roleAdjustment = (avgKp / 100) * 2.0; // Enormous reward for Support enabler
    } else if (r === 'Jungle') {
      roleAdjustment = (avgKp / 100) * 1.5;
    }

    // Weighted composite score:
    // - MVP Count: 3.0 pts per regular MVP, 5.0 pts per Grand Final MVP
    // - Average Game Performance: 0 - 10 scale weighted by 1.2
    // - KP %: 0.03 pts per %
    // - KDA: log scaled
    const compositeScore =
      (c.mvpCount - c.grandFinalMvps) * 3.0 +
      c.grandFinalMvps * 5.5 +
      avgScore * 1.5 +
      avgKp * 0.04 +
      Math.min(5, kdaRatio * 0.5) +
      roleAdjustment;

    if (compositeScore > bestScore) {
      bestScore = compositeScore;
      fmvpRole = r;
    }
  });

  const winner = candidates[fmvpRole];
  const games = Math.max(1, winner.totalGames);
  const avgPerformance = Number(
    (winner.sumPerformanceScore > 0 ? winner.sumPerformanceScore / games : 8.8).toFixed(1)
  );
  const avgKp = Number((winner.sumKpPercent > 0 ? winner.sumKpPercent / games : 74.5).toFixed(1));
  const kdaStr = `${winner.totalKills}/${winner.totalDeaths}/${winner.totalAssists}`;

  // Build comprehensive citation
  let citation = '';
  const roleNameVi = ROLE_LABELS[fmvpRole].vi;

  if (fmvpRole === 'Support') {
    citation = `Màn trình diễn mẫu mực của người Trợ thủ số một thế giới. ${winner.name} đã dẫn dắt lối chơi toàn đội với tỷ lệ tham gia hạ gục ${avgKp}%, ${winner.mvpCount} danh hiệu MVP và những pha mở giao tranh không một tì vết tại Chung Kết Tổng.`;
  } else if (fmvpRole === 'Jungle') {
    citation = `Thống trị tuyệt đối khu rừng xuyên suốt giải đấu. ${winner.name} thể hiện khả năng kiểm soát Rồng & Caesar đẳng cấp cao, đem về ${winner.mvpCount} lần MVP và là ngòi nổ quyết định đưa ${champion.name} lên đỉnh vinh quang.`;
  } else if (fmvpRole === 'Farm') {
    citation = `Họng pháo hạng nặng gánh vác trọn vẹn niềm tin của đội tuyển. Với KDA ${kdaStr} và ${winner.mvpCount} danh hiệu MVP, ${winner.name} đã bắn nát mọi hy vọng của đối thủ trong các ván đấu quyết định.`;
  } else if (fmvpRole === 'Mid') {
    citation = `Trái tim trong lối chơi của tân vương thế giới. ${winner.name} hoàn toàn làm chủ đường Giữa, tạo đột biến liên tục với ${winner.mvpCount} MVP và những pha xử lý đỉnh cao định đoạt cục diện trận chung kết.`;
  } else {
    citation = `Bức tường thép bất khả xâm phạm tại đường Tà Thần. ${winner.name} thi đấu vô cùng bản lĩnh, liên tục tạo áp lực đẩy lẻ và xuất sắc giành danh hiệu FMVP danh giá của giải đấu APL 2026.`;
  }

  // Ensure default highlights if short
  if (winner.highlights.length === 0) {
    winner.highlights.push(`Dẫn đầu toàn đội với ${winner.mvpCount} ván đấu đạt danh hiệu MVP.`);
    winner.highlights.push(`Tỷ lệ tham gia giao tranh trung bình đạt ${avgKp}%.`);
    winner.highlights.push(`Đóng vai trò then chốt trong chuỗi thắng đưa đội tới chức Vô địch.`);
  }

  return {
    playerId: `p_${winner.name}`,
    playerName: winner.name,
    teamId: champion.id,
    teamName: champion.name,
    role: fmvpRole,
    portrait_url: winner.portrait_url,
    mvpCount: Math.max(1, winner.mvpCount),
    totalGames: games,
    tournamentKDA: kdaStr,
    avgPerformanceScore: avgPerformance,
    kpPercent: avgKp,
    highlights: winner.highlights,
    citation,
  };
}
