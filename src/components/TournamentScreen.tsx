import React, { useState } from 'react';
import {
  TournamentTeam,
  TournamentMatch,
  SwissStageState,
  PlayoffBracket,
  Role,
  ROLES,
  ROLE_LABELS,
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
} from './icons';

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

  // User team
  const userTeam = swissState.teams.find(t => t.isPlayer);
  const userMatchInRound = swissState.currentMatches.find(
    m => m.team1.isPlayer || m.team2.isPlayer
  );

  // Handle advancing Swiss round
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
    const completed = advancePlayoffBracket(playoffBracket);
    onUpdatePlayoffBracket(completed);
    if (completed.champion) {
      onViewChampion(completed.champion);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header Tournament Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0D1923] p-6 rounded-3xl border border-[#C9A45C]/40 shadow-2xl mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#C9A45C] text-[#071018]">
              APL 2026
            </span>
            <span className="text-xs text-[#91A0AA] font-semibold">
              MAIN EVENT TOURNAMENT SIMULATION
            </span>
          </div>
          <h1 className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#F2F0E9] tracking-wider">
            GIẢI ĐẤU <span className="text-[#C9A45C]">VÔ ĐỊCH QUỐC TẾ</span>
          </h1>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-2 bg-[#071018] p-1.5 rounded-2xl border border-[#354653]/60">
          <button
            onClick={() => setActiveTab('swiss')}
            className={`px-4 py-2 rounded-xl font-['Barlow_Condensed'] font-bold text-sm tracking-wider transition-all ${
              activeTab === 'swiss'
                ? 'bg-[#C9A45C] text-[#071018] shadow-md'
                : 'text-[#91A0AA] hover:text-[#F2F0E9]'
            }`}
          >
            VÒNG THỤY SĨ (SWISS STAGE)
          </button>

          <button
            onClick={() => setActiveTab('playoffs')}
            disabled={!swissState.isComplete && !playoffBracket}
            className={`px-4 py-2 rounded-xl font-['Barlow_Condensed'] font-bold text-sm tracking-wider transition-all ${
              activeTab === 'playoffs'
                ? 'bg-[#C9A45C] text-[#071018] shadow-md'
                : !swissState.isComplete && !playoffBracket
                ? 'text-[#91A0AA]/30 cursor-not-allowed'
                : 'text-[#91A0AA] hover:text-[#F2F0E9]'
            }`}
          >
            PLAYOFFS (DOUBLE ELIM)
          </button>
        </div>
      </div>

      {/* SWISS STAGE VIEW */}
      {activeTab === 'swiss' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Standings Table (7 cols) */}
          <div className="lg:col-span-7 bg-[#0D1923] rounded-3xl p-6 border border-[#354653]/60 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#354653]/40 mb-4">
              <div>
                <h3 className="font-['Barlow_Condensed'] font-black text-xl text-[#F2F0E9] tracking-wider">
                  BẢNG XẾP HẠNG VÒNG THỤY SĨ ({swissState.round}/5)
                </h3>
                <p className="text-xs text-[#91A0AA]">
                  Thắng 3 trận đi tiếp vào Playoffs • Thua 3 trận bị loại
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-[#3EAD83]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3EAD83]" />
                  Đi tiếp
                </span>
                <span className="flex items-center gap-1 text-[#D45B58]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D45B58]" />
                  Bị loại
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#354653]/40 text-[11px] uppercase tracking-wider text-[#91A0AA]">
                    <th className="py-2.5 px-3">Hạng</th>
                    <th className="py-2.5 px-3">Đội Tuyển</th>
                    <th className="py-2.5 px-3 text-center">Thắng - Thua</th>
                    <th className="py-2.5 px-3 text-center">Hiệu Số</th>
                    <th className="py-2.5 px-3 text-right">Trạng Thái</th>
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
                          <td className="py-2.5 px-3 font-mono font-bold text-xs text-[#F2F0E9]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-['Barlow_Condensed'] font-bold text-base ${
                                  isUser ? 'text-[#C9A45C]' : 'text-[#F2F0E9]'
                                }`}
                              >
                                {team.name}
                              </span>
                              {isUser && (
                                <span className="text-[10px] bg-[#C9A45C] text-[#071018] font-bold px-1.5 py-0.2 rounded">
                                  BẠN
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-xs">
                            <span className="text-[#3EAD83]">{team.swissRecord.wins}</span>
                            <span className="text-[#91A0AA]/50 mx-1">-</span>
                            <span className="text-[#D45B58]">{team.swissRecord.losses}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-xs">
                            {team.swissRecord.matchDiff > 0
                              ? `+${team.swissRecord.matchDiff}`
                              : team.swissRecord.matchDiff}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {isQual && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3EAD83] px-2 py-0.5 rounded bg-[#3EAD83]/15">
                                <CheckCircle2 className="w-3 h-3" />
                                VÀO PLAYOFFS
                              </span>
                            )}
                            {isElim && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D45B58] px-2 py-0.5 rounded bg-[#D45B58]/15">
                                <XCircle className="w-3 h-3" />
                                BỊ LOẠI
                              </span>
                            )}
                            {!isQual && !isElim && (
                              <span className="text-[11px] text-[#91A0AA] px-2 py-0.5 rounded bg-[#142330]">
                                Đang thi đấu
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
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Match Center (Reference 4 Style) */}
            <div className="bg-[#0D1923] rounded-3xl p-6 border border-[#C9A45C]/40 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#354653]/40 mb-4">
                <span className="font-['Barlow_Condensed'] font-black text-lg text-[#F2F0E9] tracking-wider">
                  LỊCH THI ĐẤU VÒNG {swissState.round}
                </span>
                <span className="text-xs text-[#C9A45C] font-bold px-2 py-0.5 rounded bg-[#C9A45C]/20">
                  {swissState.currentMatches.length} TRẬN
                </span>
              </div>

              {/* Match List */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {swissState.currentMatches.map(match => {
                  const isUserMatch = match.team1.isPlayer || match.team2.isPlayer;

                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isUserMatch
                          ? 'bg-[#142330] border-[#C9A45C] ring-1 ring-[#C9A45C]/50'
                          : 'bg-[#142330]/60 border-[#354653]/60 hover:border-[#354653]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-[#91A0AA] mb-2">
                        <span>{match.roundName}</span>
                        <span className="font-mono font-bold text-[#C9A45C]">{match.format}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        {/* Team 1 */}
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <span
                            className={`font-['Barlow_Condensed'] font-bold text-base truncate ${
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

                        {/* Scores */}
                        <div className="px-3 py-1 rounded-lg bg-[#071018] font-mono font-black text-sm flex items-center gap-2 border border-[#354653]/50">
                          <span
                            className={
                              match.score1 > match.score2 ? 'text-[#3EAD83]' : 'text-[#F2F0E9]'
                            }
                          >
                            {match.score1}
                          </span>
                          <span className="text-[#91A0AA]/40">:</span>
                          <span
                            className={
                              match.score2 > match.score1 ? 'text-[#3EAD83]' : 'text-[#F2F0E9]'
                            }
                          >
                            {match.score2}
                          </span>
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 flex items-center justify-end gap-2 min-w-0 text-right">
                          <span
                            className={`font-['Barlow_Condensed'] font-bold text-base truncate ${
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

                      {match.isComplete && match.winner && (
                        <div className="mt-2 pt-2 border-t border-[#354653]/40 text-[11px] text-[#91A0AA] flex items-center justify-between">
                          <span>
                            Thắng:{' '}
                            <strong className="text-[#3EAD83]">{match.winner.name}</strong>
                          </span>
                          <span>{match.games.length} Ván đấu</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Simulation CTA */}
              <div className="mt-6">
                {!swissState.isComplete ? (
                  <button
                    onClick={handleAdvanceSwiss}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-lg tracking-wider uppercase shadow-xl hover:shadow-[#C9A45C]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>MÔ PHỎNG VÒNG {swissState.round}</span>
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
                    className="w-full py-4 rounded-2xl bg-[#3EAD83] text-[#071018] font-['Barlow_Condensed'] font-black text-lg tracking-wider uppercase shadow-xl hover:bg-[#3EAD83]/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>BƯỚC VÀO VÒNG PLAYOFFS</span>
                  </button>
                )}
              </div>
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
                8 đội mạnh nhất cạnh tranh chiếc cúp vô địch thế giới danh giá.
              </p>
            </div>

            {!playoffBracket.isComplete ? (
              <button
                onClick={handleAdvancePlayoff}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-base tracking-wider uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <FastForward className="w-5 h-5" />
                <span>MÔ PHỎNG TOÀN BỘ PLAYOFFS</span>
              </button>
            ) : (
              <button
                onClick={() => playoffBracket.champion && onViewChampion(playoffBracket.champion)}
                className="px-6 py-3 rounded-xl bg-[#3EAD83] text-[#071018] font-['Barlow_Condensed'] font-black text-base tracking-wider uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                <span>XEM MÀN HÌNH CHAMPION</span>
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
                    className="bg-[#142330] p-4 rounded-xl border border-[#354653]/60 shadow-md"
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
              <div className="mt-8 bg-gradient-to-r from-[#142330] via-[#1C3042] to-[#142330] p-6 rounded-2xl border-2 border-[#C9A45C] shadow-2xl text-center">
                <span className="text-xs font-black text-[#C9A45C] tracking-widest uppercase mb-1 block">
                  ★ TRẬN CHUNG KẾT TỔNG APL 2026 (Bo7) ★
                </span>
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
    </div>
  );
};
