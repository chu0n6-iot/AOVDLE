import React, { useState, useEffect, useRef } from 'react';
import {
  TournamentMatch,
  MatchGame,
  MatchEvent,
  Role,
  ROLES,
  ROLE_LABELS,
  FORM_CONFIG,
  TACTICAL_CONFIG,
} from '../data/types';
import { simulateFullMatchSeries } from '../engine/matchSimulation';
import {
  Trophy,
  Shield,
  Play,
  Pause,
  FastForward,
  CheckCircle2,
  XCircle,
  Zap,
  Flame,
  Swords,
  Eye,
} from './icons';
import { getAssetUrl } from '../utils/assets';

interface MatchCenterModalProps {
  match: TournamentMatch;
  isOpen: boolean;
  onClose: () => void;
  onCompleteMatch: (updatedMatch: TournamentMatch) => void;
}

export const MatchCenterModal: React.FC<MatchCenterModalProps> = ({
  match,
  isOpen,
  onClose,
  onCompleteMatch,
}) => {
  const [viewState, setViewState] = useState<'preview' | 'live' | 'recap'>(
    match.isComplete ? 'recap' : 'preview'
  );
  const [activeMatch, setActiveMatch] = useState<TournamentMatch>(match);
  const [activeGameIndex, setActiveGameIndex] = useState<number>(0);

  // Live Watch Simulation State
  const [visibleEventCount, setVisibleEventCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'scoreboard'>('timeline');

  // Sync when prop match changes
  useEffect(() => {
    setActiveMatch(match);
    setViewState(match.isComplete ? 'recap' : 'preview');
    setActiveGameIndex(0);
    setVisibleEventCount(match.isComplete ? 999 : 0);
  }, [match]);

  // Simulation runner
  const handleStartWatch = () => {
    let simulated = activeMatch;
    if (!activeMatch.isComplete || activeMatch.games.length === 0) {
      simulated = simulateFullMatchSeries(activeMatch);
      setActiveMatch(simulated);
      onCompleteMatch(simulated);
    }
    setViewState('live');
    setActiveGameIndex(0);
    setVisibleEventCount(1);
    setIsPlaying(true);
  };

  const handleFastSimulate = () => {
    const simulated = simulateFullMatchSeries(activeMatch);
    setActiveMatch(simulated);
    onCompleteMatch(simulated);
    setViewState('recap');
    setVisibleEventCount(999);
  };

  const currentGame: MatchGame | undefined = activeMatch.games[activeGameIndex];
  const timeline: MatchEvent[] = currentGame?.timeline || [];

  // Progressive live event playback loop
  useEffect(() => {
    if (viewState !== 'live' || !isPlaying || !currentGame) return;

    if (visibleEventCount >= timeline.length) {
      return; // current game timeline finished
    }

    const intervalTime = Math.max(200, Math.floor(1200 / playbackSpeed));
    const timer = setTimeout(() => {
      setVisibleEventCount(prev => Math.min(timeline.length, prev + 1));
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [viewState, isPlaying, visibleEventCount, timeline.length, playbackSpeed, currentGame]);

  if (!isOpen) return null;

  const team1 = activeMatch.team1;
  const team2 = activeMatch.team2;
  const t1Tactics = team1.tacticalIdentity ? TACTICAL_CONFIG[team1.tacticalIdentity] : null;
  const t2Tactics = team2.tacticalIdentity ? TACTICAL_CONFIG[team2.tacticalIdentity] : null;

  const currentEvent =
    timeline.length > 0
      ? timeline[Math.min(timeline.length - 1, Math.max(0, visibleEventCount - 1))]
      : null;

  const isCurrentGameFinished = currentGame && visibleEventCount >= timeline.length;
  const isSeriesFinished = activeMatch.isComplete;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0D1923] border border-[#C9A45C]/50 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#071018] px-6 py-4 border-b border-[#354653]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-xs font-black bg-[#C9A45C] text-[#071018] tracking-wider uppercase">
              {activeMatch.format}
            </span>
            <span className="font-['Barlow_Condensed'] font-bold text-lg text-[#F2F0E9] tracking-wide">
              {activeMatch.roundName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {viewState === 'live' && (
              <button
                onClick={() => {
                  setVisibleEventCount(timeline.length);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-[#142330] hover:bg-[#1C3042] text-[#C9A45C] font-semibold transition-all border border-[#C9A45C]/30 flex items-center gap-1.5 cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Xem kết quả ván</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#142330] hover:bg-[#1C3042] text-[#91A0AA] hover:text-[#F2F0E9] flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STAGE 1: PRE-MATCH PREVIEW */}
          {viewState === 'preview' && (
            <div className="space-y-6">
              {/* Matchup Banner */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-gradient-to-r from-[#142330] via-[#071018] to-[#142330] p-6 rounded-2xl border border-[#354653]/70">
                {/* Team 1 Info */}
                <div className="md:col-span-5 text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-['Barlow_Condensed'] font-black text-2xl lg:text-3xl text-[#F2F0E9]">
                      {team1.name}
                    </span>
                    {team1.isPlayer && (
                      <span className="text-[10px] bg-[#C9A45C] text-[#071018] font-black px-1.5 py-0.5 rounded">
                        BẠN
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[#91A0AA]">HLV: {team1.coach.name}</span>
                  </div>
                  {t1Tactics && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071018] border border-[#354653]/60 text-xs text-[#61DAFB]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{t1Tactics.label}</span>
                    </div>
                  )}
                </div>

                {/* VS Badge */}
                <div className="md:col-span-1 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-[#071018] border-2 border-[#C9A45C] flex items-center justify-center font-['Barlow_Condensed'] font-black text-lg text-[#C9A45C] mx-auto shadow-lg shadow-[#C9A45C]/20">
                    VS
                  </div>
                </div>

                {/* Team 2 Info */}
                <div className="md:col-span-5 text-right space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    {team2.isPlayer && (
                      <span className="text-[10px] bg-[#C9A45C] text-[#071018] font-black px-1.5 py-0.5 rounded">
                        BẠN
                      </span>
                    )}
                    <span className="font-['Barlow_Condensed'] font-black text-2xl lg:text-3xl text-[#F2F0E9]">
                      {team2.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                    <span className="text-[#91A0AA]">HLV: {team2.coach.name}</span>
                    <span className="text-[#91A0AA]">·</span>
                  </div>
                  {t2Tactics && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071018] border border-[#354653]/60 text-xs text-[#61DAFB]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{t2Tactics.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Roster & Form Head-to-Head Comparison */}
              <div className="bg-[#142330]/70 rounded-2xl p-5 border border-[#354653]/60">
                <h4 className="font-['Barlow_Condensed'] font-bold text-base text-[#C9A45C] tracking-wider uppercase mb-4 text-center">
                  ĐỐI ĐẦU TỪNG VỊ TRÍ & PHONG ĐỘ GIẢI ĐẤU
                </h4>

                <div className="space-y-3">
                  {ROLES.map(role => {
                    const p1 = team1.players[role];
                    const p2 = team2.players[role];
                    const prof1 = team1.playerProfiles ? team1.playerProfiles[role] : null;
                    const prof2 = team2.playerProfiles ? team2.playerProfiles[role] : null;
                    const form1 = prof1 ? FORM_CONFIG[prof1.currentForm] : FORM_CONFIG.stable;
                    const form2 = prof2 ? FORM_CONFIG[prof2.currentForm] : FORM_CONFIG.stable;
                    const label = ROLE_LABELS[role];

                    return (
                      <div
                        key={role}
                        className="grid grid-cols-11 items-center gap-2 py-2 px-3 rounded-xl bg-[#071018]/60 border border-[#354653]/40 text-xs"
                      >
                        {/* Player 1 */}
                        <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#142330] border border-[#354653] p-1 shrink-0 flex items-center justify-center">
                            <img src={getAssetUrl(label.icon)} alt={role} className="w-full h-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-['Barlow_Condensed'] font-bold text-sm text-[#F2F0E9] truncate">
                              {p1.name}
                            </p>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${form1.badgeBg} ${form1.badgeText}`}
                            >
                              {form1.label}
                            </span>
                          </div>
                        </div>

                        {/* Role Center */}
                        <div className="col-span-1 text-center font-['Barlow_Condensed'] font-bold text-[#91A0AA] text-xs">
                          {role}
                        </div>

                        {/* Player 2 */}
                        <div className="col-span-5 flex items-center justify-end gap-2.5 min-w-0 text-right">
                          <div className="min-w-0 flex-1">
                            <p className="font-['Barlow_Condensed'] font-bold text-sm text-[#F2F0E9] truncate">
                              {p2.name}
                            </p>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${form2.badgeBg} ${form2.badgeText}`}
                            >
                              {form2.label}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-[#142330] border border-[#354653] p-1 shrink-0 flex items-center justify-center">
                            <img src={getAssetUrl(label.icon)} alt={role} className="w-full h-full" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleStartWatch}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-lg tracking-wider uppercase shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-5 h-5" />
                  <span>XEM TRỰC TIẾP TRẬN ĐẤU (WATCH MATCH)</span>
                </button>

                <button
                  onClick={handleFastSimulate}
                  className="py-4 px-6 rounded-2xl bg-[#142330] hover:bg-[#1C3042] text-[#F2F0E9] font-['Barlow_Condensed'] font-bold text-base tracking-wider uppercase border border-[#354653] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FastForward className="w-5 h-5 text-[#C9A45C]" />
                  <span>MÔ PHỎNG NHANH</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: LIVE / WATCH MATCH MODE */}
          {viewState === 'live' && currentGame && (
            <div className="space-y-6">
              {/* Game Tabs & Series Scoreboard */}
              <div className="bg-[#142330] p-4 rounded-2xl border border-[#354653]/60 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Games Selector */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  {activeMatch.games.map((g, idx) => (
                    <button
                      key={g.gameNumber}
                      onClick={() => {
                        setActiveGameIndex(idx);
                        setVisibleEventCount(activeMatch.isComplete ? 999 : 1);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-['Barlow_Condensed'] font-bold text-sm tracking-wider transition-all cursor-pointer ${
                        activeGameIndex === idx
                          ? 'bg-[#C9A45C] text-[#071018]'
                          : 'bg-[#071018] text-[#91A0AA] hover:text-[#F2F0E9]'
                      }`}
                    >
                      VÁN {g.gameNumber}
                    </button>
                  ))}
                </div>

                {/* Scoreboard */}
                <div className="flex items-center gap-6 text-center">
                  <span className="font-['Barlow_Condensed'] font-bold text-lg text-[#F2F0E9]">
                    {team1.name}
                  </span>
                  <div className="px-4 py-1.5 rounded-xl bg-[#071018] border border-[#C9A45C] font-mono font-black text-2xl text-[#C9A45C]">
                    {activeMatch.score1} : {activeMatch.score2}
                  </div>
                  <span className="font-['Barlow_Condensed'] font-bold text-lg text-[#F2F0E9]">
                    {team2.name}
                  </span>
                </div>

                {/* Speed & Play Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-[#071018] border border-[#354653] text-[#F2F0E9] hover:text-[#C9A45C] transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  {[1, 2, 5].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-[#C9A45C] text-[#071018]'
                          : 'bg-[#071018] text-[#91A0AA] hover:text-[#F2F0E9]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Gold Difference & Kill Score Bar */}
              <div className="bg-[#071018] p-4 rounded-2xl border border-[#354653]/50">
                <div className="flex items-center justify-between text-xs text-[#91A0AA] mb-2 font-mono">
                  <span>
                    Hạ gục: <strong className="text-[#3EAD83]">{currentEvent?.killsScore[0] || 0}</strong>
                  </span>
                  <span className="text-[#C9A45C] font-bold">
                    ⏱ {currentEvent?.timestamp || '00:00'} / {currentGame.duration}
                  </span>
                  <span>
                    Hạ gục: <strong className="text-[#3EAD83]">{currentEvent?.killsScore[1] || 0}</strong>
                  </span>
                </div>

                {/* Dynamic Gold Lead Bar */}
                <div className="w-full h-3 rounded-full bg-[#142330] overflow-hidden flex border border-[#354653]/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#61DAFB] to-[#3EAD83] transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        85,
                        Math.max(15, 50 + (currentEvent?.goldDifference || 0) / 100)
                      )}%`,
                    }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-[#D45B58] to-[#E5C778] transition-all duration-300 flex-1"
                  />
                </div>
              </div>

              {/* Switcher: Timeline vs Scoreboard */}
              <div className="flex items-center gap-3 border-b border-[#354653]/40 pb-2">
                <button
                  onClick={() => setActiveSubTab('timeline')}
                  className={`text-sm font-['Barlow_Condensed'] font-bold tracking-wider px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSubTab === 'timeline'
                      ? 'bg-[#C9A45C]/20 text-[#C9A45C]'
                      : 'text-[#91A0AA] hover:text-[#F2F0E9]'
                  }`}
                >
                  DIỄN BIẾN TRẬN ĐẤU (TIMELINE)
                </button>
                <button
                  onClick={() => setActiveSubTab('scoreboard')}
                  className={`text-sm font-['Barlow_Condensed'] font-bold tracking-wider px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSubTab === 'scoreboard'
                      ? 'bg-[#C9A45C]/20 text-[#C9A45C]'
                      : 'text-[#91A0AA] hover:text-[#F2F0E9]'
                  }`}
                >
                  BẢNG THỐNG KÊ (SCOREBOARD)
                </button>
              </div>

              {/* SUBTAB 1: TIMELINE */}
              {activeSubTab === 'timeline' && (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                  {timeline.slice(0, visibleEventCount).map((evt, idx) => {
                    const isDecisive = evt.importance === 'decisive';
                    const isHigh = evt.importance === 'high';

                    return (
                      <div
                        key={evt.id}
                        className={`p-3.5 rounded-xl border transition-all animate-fade-in flex items-start gap-3 ${
                          isDecisive
                            ? 'bg-[#C9A45C]/15 border-[#C9A45C] ring-1 ring-[#C9A45C]/50'
                            : isHigh
                            ? 'bg-[#142330] border-[#61DAFB]/40'
                            : 'bg-[#142330]/60 border-[#354653]/40'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-[#C9A45C] bg-[#071018] px-2 py-0.5 rounded border border-[#354653] shrink-0 mt-0.5">
                          {evt.timestamp}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-bold ${
                                evt.teamId === team1.id ? 'text-[#61DAFB]' : 'text-[#E5C778]'
                              }`}
                            >
                              [{evt.teamName}]
                            </span>
                            <span className="font-['Barlow_Condensed'] font-bold text-sm text-[#F2F0E9]">
                              {evt.title}
                            </span>
                          </div>
                          <p className="text-xs text-[#91A0AA] leading-relaxed">
                            {evt.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SUBTAB 2: SCOREBOARD */}
              {activeSubTab === 'scoreboard' && currentGame.playerGameStats && (
                <div className="overflow-x-auto bg-[#071018] rounded-xl border border-[#354653]/50 p-4">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#354653]/50 text-[#91A0AA] uppercase font-mono text-[10px]">
                        <th className="py-2 px-2">Tuyển thủ</th>
                        <th className="py-2 px-2">Vị trí</th>
                        <th className="py-2 px-2 text-center">K / D / A</th>
                        <th className="py-2 px-2 text-center">Vàng</th>
                        <th className="py-2 px-2 text-center">ST (%)</th>
                        <th className="py-2 px-2 text-center">KP (%)</th>
                        <th className="py-2 px-2 text-right">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#354653]/30">
                      {Object.values(currentGame.playerGameStats).map(st => (
                        <tr
                          key={st.playerName}
                          className={`hover:bg-[#142330]/40 ${
                            st.teamId === currentGame.winnerId
                              ? 'text-[#F2F0E9]'
                              : 'text-[#91A0AA]'
                          }`}
                        >
                          <td className="py-2 px-2 font-bold font-['Barlow_Condensed'] text-sm">
                            {st.playerName}
                          </td>
                          <td className="py-2 px-2 text-[#C9A45C] font-semibold">{st.role}</td>
                          <td className="py-2 px-2 text-center font-mono">
                            {st.kills}/{st.deaths}/{st.assists}
                          </td>
                          <td className="py-2 px-2 text-center font-mono">{st.gold}</td>
                          <td className="py-2 px-2 text-center font-mono">{st.damagePercent}%</td>
                          <td className="py-2 px-2 text-center font-mono">{st.kpPercent}%</td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-[#3EAD83]">
                            {st.performanceScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Game End MVP Banner (When game timeline is finished) */}
              {isCurrentGameFinished && currentGame.mvpDetails && (
                <div className="bg-gradient-to-r from-[#142330] via-[#1C3042] to-[#142330] p-4 rounded-xl border border-[#C9A45C] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#071018] border-2 border-[#C9A45C] p-1 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-[#C9A45C]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#C9A45C] uppercase block">
                        ★ MVP VÁN {currentGame.gameNumber} ★
                      </span>
                      <p className="font-['Barlow_Condensed'] font-black text-lg text-[#F2F0E9]">
                        {currentGame.mvpDetails.playerName} ({currentGame.mvpDetails.role}) — KDA:{' '}
                        {currentGame.mvpDetails.kda}
                      </p>
                      <p className="text-xs text-[#91A0AA]">{currentGame.mvpDetails.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeGameIndex < activeMatch.games.length - 1 ? (
                      <button
                        onClick={() => {
                          setActiveGameIndex(prev => prev + 1);
                          setVisibleEventCount(1);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#071018] font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase hover:scale-105 transition-all cursor-pointer"
                      >
                        VÁN TIẾP THEO ➔
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewState('recap')}
                        className="px-4 py-2 rounded-xl bg-[#3EAD83] text-[#071018] font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase hover:scale-105 transition-all cursor-pointer"
                      >
                        XEM TỔNG KẾT TRẬN ĐẤU
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: RECAP VIEW */}
          {viewState === 'recap' && (
            <div className="space-y-6">
              {/* Winner Celebration Box */}
              <div className="bg-gradient-to-r from-[#142330] via-[#071018] to-[#142330] p-6 rounded-2xl border-2 border-[#C9A45C] text-center space-y-3">
                <span className="text-xs font-black text-[#C9A45C] tracking-widest uppercase block">
                  KẾT QUẢ CHÍNH THỨC
                </span>
                <h3 className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#F2F0E9]">
                  CHIẾN THẮNG THUỘC VỀ:{' '}
                  <span className="text-[#C9A45C]">{activeMatch.winner?.name}</span>
                </h3>

                <div className="inline-flex items-center justify-center gap-4 px-6 py-2 rounded-xl bg-[#071018] border border-[#354653] font-mono font-black text-2xl text-[#C9A45C]">
                  <span>{activeMatch.score1}</span>
                  <span className="text-[#91A0AA]/50">:</span>
                  <span>{activeMatch.score2}</span>
                </div>
              </div>

              {/* Game-by-game MVP list */}
              <div className="space-y-3">
                <h4 className="font-['Barlow_Condensed'] font-bold text-base text-[#C9A45C] tracking-wider uppercase">
                  DANH SÁCH VÁN ĐẤU & MVP
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeMatch.games.map(g => (
                    <div
                      key={g.gameNumber}
                      onClick={() => {
                        setActiveGameIndex(g.gameNumber - 1);
                        setVisibleEventCount(999);
                        setViewState('live');
                      }}
                      className="p-4 rounded-xl bg-[#142330] border border-[#354653]/60 hover:border-[#C9A45C] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-['Barlow_Condensed'] font-bold text-base text-[#F2F0E9]">
                            Ván {g.gameNumber}
                          </span>
                          <span className="text-xs text-[#91A0AA] font-mono">({g.duration})</span>
                        </div>
                        <p className="text-xs text-[#91A0AA]">
                          Thắng:{' '}
                          <strong className="text-[#3EAD83]">
                            {g.winnerId === team1.id ? team1.name : team2.name}
                          </strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#C9A45C] font-black uppercase block">
                          MVP
                        </span>
                        <p className="font-['Barlow_Condensed'] font-bold text-sm text-[#F2F0E9]">
                          {g.mvp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-[#C9A45C] text-[#071018] font-['Barlow_Condensed'] font-black text-lg tracking-wider uppercase shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
              >
                TIẾP TỤC GIẢI ĐẤU (XEM BẢNG ĐẤU)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
