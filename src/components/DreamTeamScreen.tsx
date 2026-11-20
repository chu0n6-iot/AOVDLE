import React from 'react';
import { DreamTeam, ROLES, ROLE_LABELS, Role } from '../data/types';
import { calculateSynergies } from '../engine/synergy';
import { Shield, Sparkles, Trophy, ArrowRight, Zap, CheckCircle2 } from './icons';
import { getAssetUrl } from '../utils/assets';
import confetti from 'canvas-confetti';

interface DreamTeamScreenProps {
  dreamTeam: DreamTeam;
  onEnterTournament: () => void;
  onResetDraft: () => void;
}

export const DreamTeamScreen: React.FC<DreamTeamScreenProps> = ({
  dreamTeam,
  onEnterTournament,
  onResetDraft,
}) => {
  const { links: synergies, bonusPercent } = calculateSynergies(dreamTeam, dreamTeam.coach);

  // Trigger celebration confetti on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A45C', '#F2F0E9', '#3EAD83'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex-1 flex flex-col min-h-0 animate-fade-in">
      {/* Title & Banner Header */}
      <div className="text-center mb-3 sm:mb-4 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/40 text-[#C9A45C] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>DREAM TEAM HOÀN TẤT</span>
        </div>
        <h1 className="font-['Barlow_Condensed'] font-black text-2xl sm:text-4xl text-[#F2F0E9] tracking-wider">
          ĐỘI HÌNH <span className="text-[#C9A45C]">HUYỀN THOẠI</span> CỦA BẠN
        </h1>
        <p className="text-[11px] sm:text-xs text-[#91A0AA] max-w-lg mx-auto">
          5 vị trí và 1 Head Coach đã sẵn sàng bước vào giải đấu quốc tế APL 2026.
        </p>
      </div>

      {/* Scrollable Center: 5 Player Cards + Coach + Synergies */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 mb-3">
        <h3 className="font-['Barlow_Condensed'] font-bold text-base sm:text-lg text-[#F2F0E9] tracking-wider mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C9A45C]" />
          <span>CHI TIẾT 5 TUYỂN THỦ THEO TỪNG VỊ TRÍ</span>
        </h3>

        {ROLES.map(role => {
          const player = dreamTeam[role];
          const label = ROLE_LABELS[role];
          if (!player) return null;

          return (
            <div
              key={role}
              className="bg-[#0D1923] hover:bg-[#142330] rounded-xl p-2.5 sm:p-3 border border-[#354653]/70 hover:border-[#C9A45C]/80 transition-all duration-200 flex items-center justify-between gap-3 shadow-md group"
            >
              {/* Role Icon & Label */}
              <div className="flex items-center gap-2 w-24 sm:w-36 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#071018] border border-[#354653] p-1.5 flex items-center justify-center shrink-0">
                  <img src={getAssetUrl(label.icon)} alt={role} className="w-full h-full" />
                </div>
                <div>
                  <span className="font-['Barlow_Condensed'] font-black text-xs sm:text-sm text-[#C9A45C] tracking-wide block">
                    {role}
                  </span>
                  <span className="text-[9px] text-[#91A0AA] hidden sm:block">
                    {label.vi}
                  </span>
                </div>
              </div>

              {/* Player Portrait & Info */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#071018] border border-[#354653] group-hover:border-[#C9A45C] overflow-hidden shrink-0 shadow-inner">
                  <img
                    src={getAssetUrl(player.portrait_url || '/assets/placeholders/player-portrait.svg')}
                    alt={player.player_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#F2F0E9] group-hover:text-[#C9A45C] transition-colors truncate">
                      {player.player_name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                      {player.year}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#91A0AA] truncate">
                    {player.team_name} • {player.country}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="text-right shrink-0">
                <div className="font-['Barlow_Condensed'] font-black text-xl sm:text-2xl text-[#C9A45C]">
                  {player.rating}
                </div>
                <div className="text-[8px] uppercase tracking-wider text-[#91A0AA] font-bold">
                  Rating
                </div>
              </div>
            </div>
          );
        })}

        {/* Coach Row */}
        {dreamTeam.coach && (
          <div className="bg-[#142330] rounded-xl p-2.5 sm:p-3 border border-[#C9A45C]/50 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 w-24 sm:w-36 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#071018] border border-[#C9A45C] p-1.5 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#C9A45C]" />
              </div>
              <div>
                <span className="font-['Barlow_Condensed'] font-black text-xs sm:text-sm text-[#C9A45C] tracking-wide block">
                  COACH
                </span>
                <span className="text-[9px] text-[#91A0AA] hidden sm:block">
                  Huấn Luyện Viên
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#071018] border border-[#C9A45C] overflow-hidden shrink-0 shadow-inner">
                <img
                  src={getAssetUrl(dreamTeam.coach.portrait_url || '/assets/placeholders/coach-portrait.svg')}
                  alt={dreamTeam.coach.coach_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#F2F0E9] truncate">
                    {dreamTeam.coach.coach_name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                    {dreamTeam.coach.year}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-[#91A0AA] truncate">
                  {dreamTeam.coach.team_name} • {dreamTeam.coach.country}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-['Barlow_Condensed'] font-black text-xl sm:text-2xl text-[#C9A45C]">
                {dreamTeam.coach.rating}
              </div>
              <div className="text-[8px] uppercase tracking-wider text-[#91A0AA] font-bold">
                Tactics
              </div>
            </div>
          </div>
        )}

        {/* Activated Synergies Section */}
        {synergies.length > 0 && (
          <div className="bg-[#0D1923] rounded-2xl p-3 sm:p-4 border border-[#3EAD83]/40 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#3EAD83]" />
              <h3 className="font-['Barlow_Condensed'] font-bold text-sm sm:text-base text-[#F2F0E9] tracking-wider">
                HIDDEN SYNERGY ĐÃ KÍCH HOẠT (+{bonusPercent}% BUFF)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {synergies.map(syn => (
                <div
                  key={syn.id}
                  className="bg-[#142330] p-2.5 rounded-lg border border-[#354653]/60 flex items-start gap-2.5"
                >
                  <div className="w-6 h-6 rounded-md bg-[#3EAD83]/10 border border-[#3EAD83]/30 flex items-center justify-center shrink-0 text-[#3EAD83] mt-0.5">
                    <Zap className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Barlow_Condensed'] font-bold text-xs sm:text-sm text-[#F2F0E9]">
                        {syn.title}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#3EAD83]/20 text-[#3EAD83]">
                        +{syn.bonusPercent}%
                      </span>
                    </div>
                    <p className="text-[10px] text-[#91A0AA] mt-0.5 leading-relaxed">
                      {syn.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="shrink-0 flex items-center justify-between gap-3 pt-3 border-t border-[#354653]/60 bg-[#071018]/90 backdrop-blur-sm">
        <button
          onClick={onResetDraft}
          className="text-xs font-semibold text-[#91A0AA] hover:text-[#D45B58] transition-colors py-2 px-3 sm:px-4 rounded-xl bg-[#142330] border border-[#354653]/60"
        >
          Draft Lại
        </button>

        <button
          onClick={onEnterTournament}
          className="flex-1 sm:flex-initial px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E5C778] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-[#C9A45C]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>TIẾN VÀO GIẢI ĐẤU APL 2026</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
