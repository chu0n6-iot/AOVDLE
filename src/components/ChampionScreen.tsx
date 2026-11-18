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
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 text-center animate-fade-in flex-1 flex flex-col min-h-0">
      {/* Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
        {/* Trophy Icon with Gold Rings */}
        <div className="relative inline-block mb-2">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#C9A45C] via-[#E5C778] to-[#80683D] flex items-center justify-center shadow-xl shadow-[#C9A45C]/40 mx-auto border-4 border-[#071018] ring-4 ring-[#C9A45C]/50 animate-bounce">
            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-[#071018]" />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#071018] text-[#C9A45C] font-black text-[10px] px-2.5 py-0.5 rounded-full border border-[#C9A45C] tracking-widest uppercase">
            APL 2026
          </div>
        </div>

        {/* Headline */}
        <div>
          <p className="text-xs font-black tracking-widest text-[#C9A45C] uppercase mb-0.5">
            GG WP • TOURNAMENT FINALS
          </p>
          <h1 className="font-['Barlow_Condensed'] font-black text-3xl sm:text-5xl text-[#F2F0E9] tracking-wider mb-1">
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

          <p className="text-xs sm:text-sm text-[#91A0AA] max-w-lg mx-auto">
            {isUserWinner
              ? 'Chúc mừng bạn! Dream Team của bạn đã vượt qua tất cả 15 đối thủ sừng sỏ nhất thế giới để đăng quang ngôi vương APL 2026!'
              : `${champion.name} đã chứng tỏ đẳng cấp vượt trội và giành chiếc cúp vô địch thế giới.`}
          </p>
        </div>

        {/* FMVP SPOTLIGHT CARD */}
        {fmvp && (
          <div className="bg-gradient-to-r from-[#142330] via-[#1C3042] to-[#142330] rounded-2xl p-4 sm:p-6 border-2 border-[#C9A45C] shadow-xl shadow-[#C9A45C]/25 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#C9A45C] text-[#071018] font-black text-[10px] sm:text-xs px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-md">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>FMVP TOURNAMENT</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
              {/* FMVP Avatar / Icon */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#071018] border-2 border-[#C9A45C] p-1.5 flex items-center justify-center shadow-lg">
                  {fmvp.portrait_url ? (
                    <img
                      src={getAssetUrl(fmvp.portrait_url)}
                      alt={fmvp.playerName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Trophy className="w-10 h-10 text-[#C9A45C]" />
                  )}
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C9A45C] text-[#071018] font-black text-[9px] px-2 py-0.2 rounded-full uppercase">
                  {fmvp.role}
                </span>
              </div>

              {/* FMVP Details */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <span className="text-[11px] font-bold text-[#C9A45C] uppercase tracking-wider block">
                  TUYỂN THỦ XUẤT SẮC NHẤT GIẢI ĐẤU
                </span>
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl sm:text-3xl text-[#F2F0E9] tracking-wide">
                  {fmvp.playerName}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#91A0AA] italic leading-relaxed">
                  "{fmvp.citation}"
                </p>

                {/* Stats badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <div className="px-2.5 py-1 rounded-lg bg-[#071018] border border-[#354653]/60 text-[11px]">
                    <span className="text-[#91A0AA]">Số lần MVP: </span>
                    <strong className="text-[#C9A45C] font-mono text-xs">{fmvp.mvpCount}</strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#071018] border border-[#354653]/60 text-[11px]">
                    <span className="text-[#91A0AA]">KDA: </span>
                    <strong className="text-[#3EAD83] font-mono">{fmvp.tournamentKDA}</strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#071018] border border-[#354653]/60 text-[11px]">
                    <span className="text-[#91A0AA]">KP: </span>
                    <strong className="text-[#61DAFB] font-mono">{fmvp.kpPercent}%</strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#071018] border border-[#354653]/60 text-[11px]">
                    <span className="text-[#91A0AA]">Điểm: </span>
                    <strong className="text-[#C9A45C] font-mono">{fmvp.avgPerformanceScore}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Champion Roster Card */}
        <div className="bg-[#0D1923] rounded-2xl p-4 sm:p-6 border-2 border-[#C9A45C] shadow-xl text-left">
          <div className="flex items-center justify-between pb-3 border-b border-[#354653]/60 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C9A45C]" />
              <h3 className="font-['Barlow_Condensed'] font-black text-lg sm:text-xl text-[#F2F0E9] tracking-wide">
                ĐỘI HÌNH VÔ ĐỊCH: {champion.name}
              </h3>
            </div>
            <span className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#C9A45C]">
              Rating: {champion.effectiveStrength || champion.powerRating}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {ROLES.map(role => {
              const player = champion.players[role];
              const label = ROLE_LABELS[role];
              const isFmvp = fmvp?.role === role;

              return (
                <div
                  key={role}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 relative ${
                    isFmvp
                      ? 'bg-[#1C3042] border-[#C9A45C] ring-2 ring-[#C9A45C]/40'
                      : 'bg-[#142330] border-[#354653]/60'
                  }`}
                >
                  {isFmvp && (
                    <span className="absolute -top-1.5 right-2 bg-[#C9A45C] text-[#071018] font-black text-[8px] px-1.5 py-0.2 rounded uppercase">
                      FMVP
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-lg bg-[#071018] border border-[#354653] p-1 shrink-0 flex items-center justify-center">
                    <img src={getAssetUrl(label.icon)} alt={role} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-['Barlow_Condensed'] font-bold text-sm text-[#F2F0E9] truncate">
                      {player.name}
                    </p>
                    <p className="text-[10px] text-[#C9A45C] font-semibold">{role}</p>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#91A0AA]">
                    {player.rating}
                  </span>
                </div>
          
    </div>
  );
};
            })}

            {/* Coach */}
            <div className="bg-[#142330] p-2.5 rounded-xl border border-[#C9A45C]/50 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#071018] border border-[#C9A45C] p-1 shrink-0 flex items-center justify-center text-[#C9A45C]">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-['Barlow_Condensed'] font-bold text-sm text-[#F2F0E9] truncate">
                  {champion.coach.name}
                </p>
                <p className="text-[10px] text-[#C9A45C] font-semibold">Head Coach</p>
              </div>
              <span className="font-mono font-bold text-xs text-[#91A0AA]">
                {champion.coach.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Play Again Action */}
      <div className="pt-3 border-t border-[#354653]/60 shrink-0">
        <button
          onClick={onPlayAgain}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-base sm:text-lg tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>CHƠI PHIÊN MỚI (NEW DRAFT)</span>
        </button>
      </div>
    </div>
  );
  );
};
