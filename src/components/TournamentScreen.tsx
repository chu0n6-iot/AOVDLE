import React, { useState } from 'react';
import {
  TournamentTeam,
  TournamentMatch,
  SwissStageState,
  PlayoffBracket,
  Role,
  ROLES,
  ROLE_LABELS,
  FORM_CONFIG,
  TACTICAL_CONFIG,
} from '../data/types';
import {
  advanceSwissRound,
  initializePlayoffBracket,
  advancePlayoffBracket,
} from '../engine/tournament';
import {
  Trophy,
  Shield,
  Play,
  FastForward,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  Flame,
  Zap,
} from './icons';
import { MatchCenterModal } from './MatchCenterModal';

interface TournamentScreenProps {
  swissState: SwissStageState;
  onUpdateSwissState: (state: SwissStageState) => void;
  playoffBracket: PlayoffBracket | null;
  onUpdatePlayoffBracket: (bracket: PlayoffBracket) => void;
  onViewChampion: (champion: TournamentTeam) => void;
}

export const TournamentScreen: React.FC<TournamentScreenProps> = ({
  swissState,
  onUpdateSwissState,
  playoffBracket,
  onUpdatePlayoffBracket,
  onViewChampion,
}) => {
  const [activeTab, setActiveTab] = useState<'swiss' | 'playoffs'>('swiss');
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // User team
  const userTeam = swissState.teams.find(t => t.isPlayer);
  const userMatchInRound = swissState.currentMatches.find(
    m => m.team1.isPlayer || m.team2.isPlayer
  );

  // Open match modal
  const handleOpenMatch = (match: TournamentMatch) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  // Callback when a match finishes in the modal
  const handleCompleteMatch = (updatedMatch: TournamentMatch) => {
    // If in Swiss stage
    const matchIdx = swissState.currentMatches.findIndex(m => m.id === updatedMatch.id);
    if (matchIdx !== -1) {
      const updatedMatches = [...swissState.currentMatches];
      updatedMatches[matchIdx] = updatedMatch;
      onUpdateSwissState({
        ...swissState,
        currentMatches: updatedMatches,
      });
    }

    // If in Playoffs
    if (playoffBracket) {
      // Check upper round 1
      const ubIdx = playoffBracket.upperRound1.findIndex(m => m.id === updatedMatch.id);
      if (ubIdx !== -1) {
        const newUB = [...playoffBracket.upperRound1];
        newUB[ubIdx] = updatedMatch;
        onUpdatePlayoffBracket({
          ...playoffBracket,
          upperRound1: newUB,
        });
      }
    }
  };

  // Handle advancing Swiss round (simulates remaining and moves to next round)
  const handleAdvanceSwiss = () => {
    const nextState = advanceSwissRound(swissState);
    onUpdateSwissState(nextState);

    // If Swiss is complete, initialize Playoffs
    if (nextState.isComplete && !playoffBracket) {
      const bracket = initializePlayoffBracket(nextState.qualifiedTeams);
      onUpdatePlayoffBracket(bracket);
      setActiveTab('playoffs');
    }
  };

  // Handle advancing Playoff
  const handleAdvancePlayoff = () => {
    if (!playoffBracket) return;
    const completed = advancePlayoffBracket(playoffBracket, swissState);
    onUpdatePlayoffBracket(completed);
    if (completed.champion) {
      onViewChampion(completed.champion);
    }
  };

  // Check how many matches completed in current swiss round
  const currentCompletedCount = swissState.currentMatches.filter(m => m.isComplete).length;
  const isAllCurrentMatchesComplete =
    currentCompletedCount === swissState.currentMatches.length &&
    swissState.currentMatches.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 animate-fade-in flex flex-col h-full min-h-0">
      {/* Header Tournament Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 bg-[#0D1923] p-3 sm:p-4 rounded-2xl border border-[#C9A45C]/40 shadow-xl mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#C9A45C] text-[#071018]">
              APL 2026
            </span>
            <span className="text-[10px] sm:text-xs text-[#91A0AA] font-semibold">
              MAIN EVENT TOURNAMENT SIMULATION
            </span>
          </div>
          <h1 className="font-['Barlow_Condensed'] font-black text-2xl sm:text-3xl text-[#F2F0E9] tracking-wider leading-tight">
            GIẢI ĐẤU <span className="text-[#C9A45C]">VÔ ĐỊCH QUỐC TẾ</span>
          </h1>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5 bg-[#071018] p-1 rounded-xl border border-[#354653]/60 shrink-0">
          <button
            onClick={() => setActiveTab('swiss')}
            className={`px-3 py-1.5 rounded-lg font-['Barlow_Condensed'] font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer ${
              activeTab === 'swiss'
                ? 'bg-[#C9A45C] text-[#071018] shadow-md'
                : 'text-[#91A0AA] hover:text-[#F2F0E9]'
            }`}
          >
            VÒNG THỤY SĨ (SWISS)
          </button>

          <button
            onClick={() => setActiveTab('playoffs')}
            disabled={!swissState.isComplete && !playoffBracket}
            className={`px-3 py-1.5 rounded-lg font-['Barlow_Condensed'] font-bold text-xs sm:text-sm tracking-wider transition-all ${
              activeTab === 'playoffs'
                ? 'bg-[#C9A45C] text-[#071018] shadow-md cursor-pointer'
                : !swissState.isComplete && !playoffBracket
                ? 'text-[#91A0AA]/30 cursor-not-allowed'
                : 'text-[#91A0AA] hover:text-[#F2F0E9] cursor-pointer'
            }`}
          >
            PLAYOFFS (DOUBLE ELIM)
          </button>
        </div>
      </div>

      {/* SWISS STAGE VIEW */}
      {activeTab === 'swiss' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left: Standings Table (7 cols) */}
          <div className="lg:col-span-7 bg-[#0D1923] rounded-2xl p-3 sm:p-4 border border-[#354653]/60 shadow-lg flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#354653]/40 mb-2 shrink-0">
              <div>
                <h3 className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#F2F0E9] tracking-wider leading-none">
                  BẢNG XẾP HẠNG VÒNG THỤY SĨ ({swissState.round}/5)
                </h3>
                <p className="text-[10px] text-[#91A0AA] mt-0.5">
                  Thắng 3 trận đi tiếp • Thua 3 trận bị loại
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-[#3EAD83]">
                  <span className="w-2 h-2 rounded-full bg-[#3EAD83]" />
                  Đi tiếp
                </span>
                <span className="flex items-center gap-1 text-[#D45B58]">
                  <span className="w-2 h-2 rounded-full bg-[#D45B58]" />
                  Bị loại
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto max-h-[min(54vh,420px)]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#0D1923] z-10">
                  <tr className="border-b border-[#354653]/40 text-[10px] uppercase tracking-wider text-[#91A0AA]">
                    <th className="py-1.5 px-2">#</th>
                    <th className="py-1.5 px-2">Đội Tuyển</th>
                    <th className="py-1.5 px-2 text-center">T - T</th>
                    <th className="py-1.5 px-2 text-center">Hiệu Số</th>
                    <th className="py-1.5 px-2 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#354653]/30">
                  {swissState.teams
                    .sort((a, b) => {
                      if (b.swissRecord.wins !== a.swissRecord.wins)
                        return b.swissRecord.wins - a.swissRecord.wins;
                      if (a.swissRecord.losses !== b.swissRecord.losses)
                        return a.swissRecord.losses - b.swissRecord.losses;
                      return b.swissRecord.matchDiff - a.swissRecord.matchDiff;
                    })
                    .map((team, idx) => {
                      const isUser = team.isPlayer;
                      const isQual = team.status === 'qualified';
                      const isElim = team.status === 'eliminated';

                      return (
                        <tr
                          key={team.id}
                          className={`transition-colors ${
                            isUser
                              ? 'bg-[#C9A45C]/15 font-semibold text-[#F2F0E9]'
                              : 'hover:bg-[#142330]/50 text-[#91A0AA]'
                          }`}
                        >
                          <td className="py-1.5 px-2 font-mono font-bold text-xs text-[#F2F0E9]">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-['Barlow_Condensed'] font-bold text-sm ${
                                  isUser ? 'text-[#C9A45C]' : 'text-[#F2F0E9]'
                                }`}
                              >
                                {team.name}
                              </span>
                              {isUser && (
                                <span className="text-[9px] bg-[#C9A45C] text-[#071018] font-bold px-1 rounded">
                                  BẠN
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-1.5 px-2 text-center font-mono font-bold text-xs">
                            <span className="text-[#3EAD83]">{team.swissRecord.wins}</span>
                            <span className="text-[#91A0AA]/50 mx-0.5">-</span>
                            <span className="text-[#D45B58]">{team.swissRecord.losses}</span>
                          </td>
                          <td className="py-1.5 px-2 text-center font-mono text-xs">
                            {team.swissRecord.matchDiff > 0
                              ? `+${team.swissRecord.matchDiff}`
                              : team.swissRecord.matchDiff}
                          </td>
                          <td className="py-1.5 px-2 text-right">
                            {isQual && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3EAD83] px-1.5 py-0.2 rounded bg-[#3EAD83]/15">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                PLAYOFFS
                              </span>
                            )}
                            {isElim && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D45B58] px-1.5 py-0.2 rounded bg-[#D45B58]/15">
                                <XCircle className="w-2.5 h-2.5" />
                                LOẠI
                              </span>
                            )}
                            {!isQual && !isElim && (
                              <span className="text-[10px] text-[#91A0AA] px-1.5 py-0.2 rounded bg-[#142330]">
                                Thi đấu
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Current Round Matches & Simulation Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#0D1923] rounded-2xl p-3 sm:p-4 border border-[#C9A45C]/40 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#354653]/40 mb-2 shrink-0">
              <div>
                <span className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#F2F0E9] tracking-wider block leading-none">
                  LỊCH ĐẤU VÒNG {swissState.round}
                </span>
                <span className="text-[10px] text-[#91A0AA]">
                  Click trận để xem trực tiếp
                </span>
              </div>
              <span className="text-[10px] text-[#C9A45C] font-bold px-1.5 py-0.5 rounded bg-[#C9A45C]/20 shrink-0">
                {currentCompletedCount}/{swissState.currentMatches.length} XONG
              </span>
            </div>

            {/* Match List */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 max-h-[min(48vh,380px)]">
              {swissState.currentMatches.map(match => {
                const isUserMatch = match.team1.isPlayer || match.team2.isPlayer;

                return (
                  <div
                    key={match.id}
                    onClick={() => handleOpenMatch(match)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                      isUserMatch
                        ? 'bg-[#142330] border-[#C9A45C] ring-1 ring-[#C9A45C]/40'
                        : 'bg-[#142330]/60 border-[#354653]/60 hover:border-[#C9A45C]/60 hover:bg-[#142330]'
                    }`}
                  >
                    {isUserMatch && (
                      <div className="absolute -top-2 left-3 bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-sm">
                        TRẬN CỦA BẠN
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-[#91A0AA] mb-1">
                      <span>{match.roundName}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#C9A45C]">{match.format}</span>
                        {match.isComplete ? (
                          <span className="text-[9px] text-[#3EAD83] bg-[#3EAD83]/15 px-1 rounded font-bold">
                            Đã xong
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#61DAFB] bg-[#61DAFB]/15 px-1 rounded font-bold flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5" />
                            Xem
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 truncate">
                        <span
                          className={`font-['Barlow_Condensed'] font-bold text-sm truncate block ${
                            match.winner?.id === match.team1.id
                              ? 'text-[#3EAD83]'
                              : match.team1.isPlayer
                              ? 'text-[#C9A45C]'
                              : 'text-[#F2F0E9]'
                          }`}
                        >
                          {match.team1.name}
                        </span>
                      </div>

                      <div className="px-2 py-0.5 rounded-md bg-[#071018] font-mono font-black text-xs flex items-center gap-1 border border-[#354653]/50">
                        <span className={match.score1 > match.score2 ? 'text-[#3EAD83]' : 'text-[#F2F0E9]'}>
                          {match.score1}
                        </span>
                        <span className="text-[#91A0AA]/40">:</span>
                        <span className={match.score2 > match.score1 ? 'text-[#3EAD83]' : 'text-[#F2F0E9]'}>
                          {match.score2}
                        </span>
                      </div>

                      <div className="flex-1 text-right truncate">
                        <span
                          className={`font-['Barlow_Condensed'] font-bold text-sm truncate block ${
                            match.winner?.id === match.team2.id
                              ? 'text-[#3EAD83]'
                              : match.team2.isPlayer
                              ? 'text-[#C9A45C]'
                              : 'text-[#F2F0E9]'
                          }`}
                        >
                          {match.team2.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulation CTA */}
            <div className="mt-2 pt-2 border-t border-[#354653]/40 shrink-0">
              {!swissState.isComplete ? (
                <button
                  onClick={handleAdvanceSwiss}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-sm sm:text-base tracking-wider uppercase shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {isAllCurrentMatchesComplete
                      ? `BƯỚC SANG VÒNG THỤY SĨ ${swissState.round + 1}`
                      : `MÔ PHỎNG CÁC TRẬN CÒN LẠI (VÒNG ${swissState.round})`}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!playoffBracket) {
                      const bracket = initializePlayoffBracket(swissState.qualifiedTeams);
                      onUpdatePlayoffBracket(bracket);
                    }
                    setActiveTab('playoffs');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#3EAD83] text-[#071018] font-['Barlow_Condensed'] font-black text-sm sm:text-base tracking-wider uppercase shadow-md hover:bg-[#3EAD83]/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>BƯỚC VÀO VÒNG PLAYOFFS</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLAYOFFS VIEW */}
      {activeTab === 'playoffs' && playoffBracket && (
        <div className="bg-[#0D1923] rounded-3xl p-6 lg:p-8 border border-[#C9A45C]/40 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#354653]/60 mb-8">
            <div>
              <h2 className="font-['Barlow_Condensed'] font-black text-3xl text-[#F2F0E9] tracking-wider">
                NHÁNH ĐẤU DOUBLE ELIMINATION (APL 2026)
              </h2>
              <p className="text-xs text-[#91A0AA]">
                8 đội mạnh nhất cạnh tranh chiếc cúp vô địch thế giới. Click vào trận để xem chi tiết!
              </p>
            </div>

            {!playoffBracket.isComplete ? (
              <button
                onClick={handleAdvancePlayoff}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-base tracking-wider uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FastForward className="w-5 h-5" />
                <span>MÔ PHỎNG TOÀN BỘ PLAYOFFS</span>
              </button>
            ) : (
              <button
                onClick={() => playoffBracket.champion && onViewChampion(playoffBracket.champion)}
                className="px-6 py-3 rounded-xl bg-[#3EAD83] text-[#071018] font-['Barlow_Condensed'] font-black text-base tracking-wider uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                <span>XEM MÀN HÌNH CHAMPION & FMVP</span>
              </button>
            )}
          </div>

          {/* Bracket Tree */}
          <div className="space-y-8">
            {/* Upper Bracket Round 1 */}
            <div>
              <h3 className="font-['Barlow_Condensed'] font-bold text-lg text-[#C9A45C] tracking-wide mb-3">
                TỨ KẾT NHÁNH THẮNG (UPPER BRACKET QUARTERFINALS — Bo5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {playoffBracket.upperRound1.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleOpenMatch(m)}
                    className="bg-[#142330] p-4 rounded-xl border border-[#354653]/60 hover:border-[#C9A45C] transition-all cursor-pointer shadow-md"
                  >
                    <div className="text-[10px] text-[#91A0AA] mb-2 flex justify-between">
                      <span>{m.roundName.split('(')[0]}</span>
                      <span className="font-bold text-[#C9A45C]">{m.format}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`flex items-center justify-between text-xs font-semibold ${
                          m.winner?.id === m.team1.id ? 'text-[#3EAD83]' : 'text-[#F2F0E9]'
                        }`}
                      >
                        <span className="truncate">{m.team1.name}</span>
                        <span className="font-mono font-bold ml-2">{m.score1}</span>
                      </div>
                      <div
                        className={`flex items-center justify-between text-xs font-semibold ${
                          m.winner?.id === m.team2.id ? 'text-[#3EAD83]' : 'text-[#F2F0E9]'
                        }`}
                      >
                        <span className="truncate">{m.team2.name}</span>
                        <span className="font-mono font-bold ml-2">{m.score2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Final Card */}
            {playoffBracket.grandFinal && (
              <div
                onClick={() => handleOpenMatch(playoffBracket.grandFinal!)}
                className="mt-8 bg-gradient-to-r from-[#142330] via-[#1C3042] to-[#142330] p-6 rounded-2xl border-2 border-[#C9A45C] shadow-2xl text-center cursor-pointer hover:scale-[1.01] transition-all"
              >
                <span className="text-xs font-black text-[#C9A45C] tracking-widest uppercase mb-1 block">
                  ★ TRẬN CHUNG KẾT TỔNG APL 2026 (Bo7) ★
                </span>
                <p className="text-xs text-[#91A0AA] mb-4">Click để xem chi tiết từng ván đấu và MVP</p>

                <div className="flex items-center justify-center gap-6 my-4">
                  <div className="text-right">
                    <p className="font-['Barlow_Condensed'] font-black text-2xl text-[#F2F0E9]">
                      {playoffBracket.grandFinal.team1.name}
                    </p>
                    <p className="text-xs text-[#91A0AA]">Upper Finalist</p>
                  </div>

                  <div className="px-5 py-2 rounded-xl bg-[#071018] border border-[#C9A45C] font-mono font-black text-2xl text-[#C9A45C]">
                    {playoffBracket.grandFinal.score1} : {playoffBracket.grandFinal.score2}
                  </div>

                  <div className="text-left">
                    <p className="font-['Barlow_Condensed'] font-black text-2xl text-[#F2F0E9]">
                      {playoffBracket.grandFinal.team2.name}
                    </p>
                    <p className="text-xs text-[#91A0AA]">Lower Finalist</p>
                  </div>
                </div>

                {playoffBracket.champion && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A45C]/20 border border-[#C9A45C] text-[#C9A45C] font-bold text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>NHÀ VÔ ĐỊCH: {playoffBracket.champion.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Match Center Modal */}
      {selectedMatch && (
        <MatchCenterModal
          isOpen={isModalOpen}
          match={selectedMatch}
          onClose={() => setIsModalOpen(false)}
          onCompleteMatch={handleCompleteMatch}
        />
      )}
    </div>
  );
};
