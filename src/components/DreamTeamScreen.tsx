import React from 'react';
import { DreamTeam, ROLES, ROLE_LABELS, Role } from '../data/types';
import { calculateDreamTeamStrength } from '../engine/rating';
import { calculateSynergies } from '../engine/synergy';
import { Shield, Sparkles, Trophy, ArrowRight, Zap, CheckCircle2 } from './icons';
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
  const strength = calculateDreamTeamStrength(dreamTeam, dreamTeam.coach);
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Title & Banner Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/40 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 text-[#C9A45C]" />
          <span>DREAM TEAM HOÀN TẤT</span>
        </div>
        <h1 className="font-['Barlow_Condensed'] font-black text-4xl lg:text-5xl text-[#F2F0E9] tracking-wider">
          ĐỘI HÌNH <span className="text-[#C9A45C]">HUYỀN THOẠI</span> CỦA BẠN
        </h1>
        <p className="text-xs lg:text-sm text-[#91A0AA] max-w-xl mx-auto mt-1">
          5 vị trí và 1 Head Coach đã sẵn sàng bước vào giải đấu quốc tế APL 2026.
        </p>
      </div>

      {/* Main Stats Summary Card */}
      <div className="bg-[#0D1923] rounded-3xl p-6 lg:p-8 border border-[#C9A45C]/40 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A45C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 text-center">
          <div className="bg-[#142330] p-4 rounded-2xl border border-[#354653]/50">
            <p className="text-[11px] font-semibold text-[#91A0AA] uppercase tracking-wider mb-1">
              Điểm Tuyển Thủ
            </p>
            <p className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#F2F0E9]">
              {strength.playerAverage}
            </p>
            <p className="text-[10px] text-[#91A0AA]">Trung bình 5 vị trí</p>
          </div>

          <div className="bg-[#142330] p-4 rounded-2xl border border-[#354653]/50">
            <p className="text-[11px] font-semibold text-[#91A0AA] uppercase tracking-wider mb-1">
              HLV Bonus
            </p>
            <p className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#C9A45C]">
              +{strength.coachBonus}
            </p>
            <p className="text-[10px] text-[#91A0AA]">
              {dreamTeam.coach?.coach_name || 'Chiến thuật'}
            </p>
          </div>

          <div className="bg-[#142330] p-4 rounded-2xl border border-[#354653]/50">
            <p className="text-[11px] font-semibold text-[#91A0AA] uppercase tracking-wider mb-1">
              Hidden Synergy
            </p>
            <p className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#3EAD83]">
              +{bonusPercent}%
            </p>
            <p className="text-[10px] text-[#91A0AA]">
              {synergies.length} Liên kết kích hoạt
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1C3042] to-[#142330] p-4 rounded-2xl border-2 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/10">
            <p className="text-[11px] font-bold text-[#C9A45C] uppercase tracking-wider mb-1">
              TỔNG SỨC MẠNH
            </p>
            <p className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#C9A45C]">
              {strength.finalStrength}
            </p>
            <p className="text-[10px] text-[#F2F0E9]">Hạng Tier S</p>
          </div>
        </div>
      </div>

      {/* 5 Vertical Player Cards (Reference 2 Style) */}
      <div className="space-y-3 mb-8">
        <h3 className="font-['Barlow_Condensed'] font-bold text-xl text-[#F2F0E9] tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C9A45C]" />
          <span>CHI TIẾT 5 TUYỂN THỦ THEO TỪNG VỊ TRÍ</span>
        </h3>

        {ROLES.map(role => {
          const player = dreamTeam[role];
          const label = ROLE_LABELS[role];
          if (!player) return null;

          return (
            <div
              key={role}
              className="bg-[#0D1923] hover:bg-[#142330] rounded-2xl p-4 border border-[#354653]/70 hover:border-[#C9A45C]/80 transition-all duration-300 flex items-center justify-between gap-4 shadow-lg group"
            >
              {/* Role Icon & Label */}
              <div className="flex items-center gap-3 w-32 sm:w-44 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#071018] border border-[#354653] p-2 flex items-center justify-center shrink-0">
                  <img src={label.icon} alt={role} className="w-full h-full" />
                </div>
                <div>
                  <span className="font-['Barlow_Condensed'] font-black text-sm lg:text-base text-[#C9A45C] tracking-wide block">
                    {role}
                  </span>
                  <span className="text-[10px] text-[#91A0AA] hidden sm:block">
                    {label.vi}
                  </span>
                </div>
              </div>

              {/* Player Portrait & Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-[#071018] border-2 border-[#354653] group-hover:border-[#C9A45C] overflow-hidden shrink-0 shadow-inner">
                  <img
                    src={player.portrait_url || '/assets/placeholders/player-portrait.svg'}
                    alt={player.player_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-['Barlow_Condensed'] font-black text-xl lg:text-2xl text-[#F2F0E9] group-hover:text-[#C9A45C] transition-colors truncate">
                      {player.player_name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                      {player.year}
                    </span>
                  </div>
                  <p className="text-xs text-[#91A0AA] truncate">
                    {player.team_name} • {player.country}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="text-right shrink-0">
                <div className="font-['Barlow_Condensed'] font-black text-2xl lg:text-3xl text-[#C9A45C]">
                  {player.rating}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#91A0AA] font-bold">
                  Rating
                </div>
              </div>
            </div>
          );
        })}

        {/* Coach Row */}
        {dreamTeam.coach && (
          <div className="bg-[#142330] rounded-2xl p-4 border border-[#C9A45C]/50 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3 w-32 sm:w-44 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#071018] border border-[#C9A45C] p-2 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#C9A45C]" />
              </div>
              <div>
                <span className="font-['Barlow_Condensed'] font-black text-sm lg:text-base text-[#C9A45C] tracking-wide block">
                  HEAD COACH
                </span>
                <span className="text-[10px] text-[#91A0AA] hidden sm:block">
                  Huấn Luyện Viên
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-[#071018] border-2 border-[#C9A45C] overflow-hidden shrink-0 shadow-inner">
                <img
                  src={dreamTeam.coach.portrait_url || '/assets/placeholders/coach-portrait.svg'}
                  alt={dreamTeam.coach.coach_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-['Barlow_Condensed'] font-black text-xl lg:text-2xl text-[#F2F0E9] truncate">
                    {dreamTeam.coach.coach_name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                    {dreamTeam.coach.year}
                  </span>
                </div>
                <p className="text-xs text-[#91A0AA] truncate">
                  {dreamTeam.coach.team_name} • {dreamTeam.coach.country}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-['Barlow_Condensed'] font-black text-2xl lg:text-3xl text-[#C9A45C]">
                {dreamTeam.coach.rating}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[#91A0AA] font-bold">
                Tactics
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activated Synergies Section */}
      {synergies.length > 0 && (
        <div className="bg-[#0D1923] rounded-3xl p-6 border border-[#3EAD83]/40 shadow-xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#3EAD83]" />
            <h3 className="font-['Barlow_Condensed'] font-bold text-xl text-[#F2F0E9] tracking-wider">
              HIDDEN SYNERGY ĐÃ KÍCH HOẠT (+{bonusPercent}% BUFF)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synergies.map(syn => (
              <div
                key={syn.id}
                className="bg-[#142330] p-4 rounded-xl border border-[#354653]/60 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3EAD83]/10 border border-[#3EAD83]/30 flex items-center justify-center shrink-0 text-[#3EAD83] mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Barlow_Condensed'] font-bold text-base text-[#F2F0E9]">
                      {syn.title}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#3EAD83]/20 text-[#3EAD83]">
                      +{syn.bonusPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-[#91A0AA] mt-1 leading-relaxed">
                    {syn.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#354653]/60">
        <button
          onClick={onResetDraft}
          className="text-xs font-semibold text-[#91A0AA] hover:text-[#D45B58] transition-colors py-2 px-4 rounded-xl bg-[#142330] border border-[#354653]/60"
        >
          Draft Lại Từ Đầu
        </button>

        <button
          onClick={onEnterTournament}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A45C] via-[#E5C778] to-[#80683D] text-[#071018] font-['Barlow_Condensed'] font-black text-lg tracking-wider uppercase shadow-xl shadow-[#C9A45C]/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>TIẾN VÀO GIẢI ĐẤU APL 2026</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
