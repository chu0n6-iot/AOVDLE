import React, { useEffect } from 'react';
import { TournamentTeam, FMVPAward, ROLES, ROLE_LABELS, Role } from '../data/types';
import { Trophy, RotateCcw, Shield, Sparkles, Flame, Zap } from './icons';
import { getAssetUrl } from '../utils/assets';
import confetti from 'canvas-confetti';

interface ChampionScreenProps {
  champion: TournamentTeam;
  fmvp?: FMVPAward | null;
  onPlayAgain: () => void;
}

export const ChampionScreen: React.FC<ChampionScreenProps> = ({
  champion,
  fmvp,
  onPlayAgain,
}) => {
  useEffect(() => {
    try {
      const end = Date.now() + 3 * 1000;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#C9A45C', '#F2F0E9', '#3EAD83'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#C9A45C', '#F2F0E9', '#3EAD83'],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      // safe fallback
    }
  }, []);

  const isUserWinner = champion.isPlayer;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-fade-in">
      {/* Trophy Icon with Gold Rings */}
      <div className="relative inline-block mb-6">
        <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-tr from-[#C9A45C] via-[#E5C778] to-[#80683D] flex items-center justify-center shadow-2xl shadow-[#C9A45C]/40 mx-auto border-4 border-[#071018] ring-4 ring-[#C9A45C]/50 animate-bounce">
          <Trophy className="w-16 h-16 lg:w-20 lg:h-20 text-[#071018]" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#071018] text-[#C9A45C] font-black text-xs px-3 py-1 rounded-full border border-[#C9A45C] tracking-widest uppercase">
          APL 2026
        </div>
      </div>

      {/* Headline */}
      <p className="text-sm font-black tracking-widest text-[#C9A45C] uppercase mb-1">
        GG WP • TOURNAMENT FINALS
      </p>
      <h1 className="font-['Barlow_Condensed'] font-black text-5xl lg:text-7xl text-[#F2F0E9] tracking-wider mb-2">
        {isUserWinner ? (
          <>
            WORLDS <span className="text-[#C9A45C]">CHAMPIONS!</span>
          </>
        ) : (
          <>
            QUÁN QUÂN: <span className="text-[#C9A45C]">{champion.name}</span>
          </>
        )}
      </h1>

      <p className="text-sm lg:text-base text-[#91A0AA] max-w-lg mx-auto mb-8">
        {isUserWinner
          ? 'Chúc mừng bạn! Dream Team của bạn đã vượt qua tất cả 15 đối thủ sừng sỏ nhất thế giới để đăng quang ngôi vương APL 2026!'
          : `${champion.name} đã chứng tỏ đẳng cấp vượt trội và giành chiếc cúp vô địch thế giới.`}
      </p>

      {/* FMVP SPOTLIGHT CARD */}
      {fmvp && (
        <div className="bg-gradient-to-r from-[#142330] via-[#1C3042] to-[#142330] rounded-3xl p-6 lg:p-8 border-2 border-[#C9A45C] shadow-2xl shadow-[#C9A45C]/30 mb-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#C9A45C] text-[#071018] font-black text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <Trophy className="w-4 h-4 fill-current" />
            <span>FMVP TOURNAMENT</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
            {/* FMVP Avatar / Icon */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#071018] border-2 border-[#C9A45C] p-2 flex items-center justify-center shadow-xl">
                {fmvp.portrait_url ? (
                  <img
                    src={getAssetUrl(fmvp.portrait_url)}
                    alt={fmvp.playerName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Trophy className="w-12 h-12 text-[#C9A45C]" />
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C9A45C] text-[#071018] font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                {fmvp.role}
              </span>
            </div>

            {/* FMVP Details */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-wider block">
                TUYỂN THỦ XUẤT SẮC NHẤT GIẢI ĐẤU
              </span>
              <h3 className="font-['Barlow_Condensed'] font-black text-3xl text-[#F2F0E9] tracking-wide">
                {fmvp.playerName}
              </h3>
              <p className="text-xs text-[#91A0AA] italic leading-relaxed">
                "{fmvp.citation}"
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-[#071018] border border-[#354653]/60 text-xs">
                  <span className="text-[#91A0AA]">Số lần MVP: </span>
                  <strong className="text-[#C9A45C] font-mono text-sm">{fmvp.mvpCount}</strong>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#071018] border border-[#354653]/60 text-xs">
                  <span className="text-[#91A0AA]">KDA Toàn Giải: </span>
                  <strong className="text-[#3EAD83] font-mono">{fmvp.tournamentKDA}</strong>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#071018] border border-[#354653]/60 text-xs">
                  <span className="text-[#91A0AA]">Tham gia HG: </span>
                  <strong className="text-[#61DAFB] font-mono">{fmvp.kpPercent}%</strong>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#071018] border border-[#354653]/60 text-xs">
                  <span className="text-[#91A0AA]">Điểm Đánh Giá: </span>
                  <strong className="text-[#C9A45C] font-mono">{fmvp.avgPerformanceScore}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Champion Roster Card */}
      <div className="bg-[#0D1923] rounded-3xl p-6 lg:p-8 border-2 border-[#C9A45C] shadow-2xl shadow-[#C9A45C]/20 mb-8 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-[#354653]/60 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#C9A45C]" />
            <h3 className="font-['Barlow_Condensed'] font-black text-2xl text-[#F2F0E9] tracking-wide">
              ĐỘI HÌNH VÔ ĐỊCH: {champion.name}
            </h3>
          </div>
          <span className="font-['Barlow_Condensed'] font-black text-xl text-[#C9A45C]">
            Rating: {champion.effectiveStrength || champion.powerRating}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ROLES.map(role => {
            const player = champion.players[role];
            const label = ROLE_LABELS[role];
            const isFmvp = fmvp?.role === role;

            return (
              <div
                key={role}
                className={`p-4 rounded-xl border flex items-center gap-3 relative ${
                  isFmvp
                    ? 'bg-[#1C3042] border-[#C9A45C] ring-2 ring-[#C9A45C]/40'
                    : 'bg-[#142330] border-[#354653]/60'
                }`}
              >
                {isFmvp && (
                  <span className="absolute -top-2 right-3 bg-[#C9A45C] text-[#071018] font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                    FMVP
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-[#071018] border border-[#354653] p-1.5 shrink-0 flex items-center justify-center">
                  <img src={getAssetUrl(label.icon)} alt={role} className="w-full h-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-['Barlow_Condensed'] font-bold text-base text-[#F2F0E9] truncate">
                    {player.name}
                  </p>
                  <p className="text-[11px] text-[#C9A45C] font-semibold">{role}</p>
                </div>
                <span className="font-mono font-bold text-xs text-[#91A0AA]">
                  {player.rating}
                </span>
              </div>
            );
          })}

          {/* Coach */}
          <div className="bg-[#142330] p-4 rounded-xl border border-[#C9A45C]/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#071018] border border-[#C9A45C] p-1.5 shrink-0 flex items-center justify-center text-[#C9A45C]">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-['Barlow_Condensed'] font-bold text-base text-[#F2F0E9] truncate">
                {champion.coach.name}
              </p>
              <p className="text-[11px] text-[#C9A45C] font-semibold">Head Coach</p>
            </div>
            <span className="font-mono font-bold text-xs text-[#91A0AA]">
              {champion.coach.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Play Again Action */}
      <button
        onClick={onPlayAgain}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-xl tracking-wider uppercase shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 cursor-pointer"
      >
        <RotateCcw className="w-6 h-6" />
        <span>CHƠI PHIÊN MỚI (NEW DRAFT)</span>
      </button>
    </div>
  );
};
