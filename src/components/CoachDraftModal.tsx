import React from 'react';
import { CoachVersion, PlayerVersion, Role } from '../data/types';
import { Shield, Sparkles, Trophy } from './icons';

interface CoachDraftModalProps {
  coaches: CoachVersion[];
  picks: Record<Role, PlayerVersion | null>;
  onSelectCoach: (coach: CoachVersion) => void;
}

export const CoachDraftModal: React.FC<CoachDraftModalProps> = ({
  coaches,
  picks,
  onSelectCoach,
}) => {
  // Check potential synergy for each coach
  const getCoachSynergies = (coach: CoachVersion) => {
    const matchedPlayers: PlayerVersion[] = [];
    Object.values(picks).forEach(p => {
      if (p && p.team_id === coach.team_id && p.tournament_id === coach.tournament_id) {
        matchedPlayers.push(p);
      }
    });
    return matchedPlayers;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0D1923] border-2 border-[#C9A45C] rounded-3xl max-w-4xl w-full p-6 lg:p-8 shadow-2xl shadow-[#C9A45C]/20 text-[#F2F0E9]">
        {/* Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 border border-[#C9A45C]/40 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Giai Đoạn 2: Coach Draft</span>
          </div>
          <h2 className="font-['Barlow_Condensed'] font-black text-3xl lg:text-4xl text-[#F2F0E9] tracking-wide">
            CHỌN <span className="text-[#C9A45C]">HEAD COACH</span> CHO DREAM TEAM
          </h2>
          <p className="text-xs text-[#91A0AA] max-w-lg mx-auto mt-1">
            Lựa chọn 1 trong 3 Huấn luyện viên trưởng kỳ cựu. HLV cùng đội tuyển và thời kỳ với tuyển thủ sẽ kích hoạt Hidden Synergy!
          </p>
        </div>

        {/* 3 Coach Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {coaches.map(coach => {
            const synergies = getCoachSynergies(coach);

            return (
              <div
                key={coach.coach_id}
                onClick={() => onSelectCoach(coach)}
                className="group relative cursor-pointer bg-[#142330] hover:bg-[#1C3042] rounded-2xl p-5 border border-[#354653] hover:border-[#C9A45C] transition-all duration-300 flex flex-col items-center text-center shadow-xl hover:shadow-2xl hover:shadow-[#C9A45C]/15 hover:-translate-y-1.5"
              >
                {/* Synergy Indicator Badge if applicable */}
                {synergies.length > 0 && (
                  <div className="absolute -top-3 bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg ring-2 ring-[#071018]">
                    <Sparkles className="w-3 h-3" />
                    <span>SYNERGY ({synergies.length} TUYỂN THỦ)</span>
                  </div>
                )}

                {/* Coach Portrait */}
                <div className="w-24 h-24 rounded-2xl bg-[#071018] border-2 border-[#354653] group-hover:border-[#C9A45C] p-2 overflow-hidden mb-4 relative shadow-inner">
                  <img
                    src={coach.portrait_url || '/assets/placeholders/coach-portrait.svg'}
                    alt={coach.coach_name}
                    className="w-full h-full object-cover filter group-hover:brightness-110"
                  />
                  <div className="absolute bottom-1 right-1 bg-[#0D1923] text-[#C9A45C] font-black text-xs px-1.5 py-0.5 rounded border border-[#C9A45C]/40">
                    {coach.rating}
                  </div>
                </div>

                {/* Details */}
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl text-[#F2F0E9] group-hover:text-[#C9A45C] transition-colors">
                  {coach.coach_name}
                </h3>
                <p className="text-xs text-[#C9A45C] font-semibold mt-0.5">
                  {coach.role}
                </p>
                <p className="text-xs text-[#91A0AA] mt-1 font-medium">
                  {coach.team_name} ({coach.year})
                </p>

                {/* Synergy Details Preview */}
                {synergies.length > 0 ? (
                  <div className="mt-3 w-full bg-[#071018]/80 p-2 rounded-xl border border-[#C9A45C]/30 text-[11px] text-[#C9A45C]">
                    ⚡ Cùng thời kỳ với: {synergies.map(s => s.player_name).join(', ')}
                  </div>
                ) : (
                  <div className="mt-3 w-full py-2 text-[11px] text-[#91A0AA]/50">
                    Chiến thuật gia độc lập
                  </div>
                )}

                {/* CTA Button */}
                <button className="mt-4 w-full py-2.5 rounded-xl bg-[#C9A45C] group-hover:bg-[#C9A45C]/90 text-[#071018] font-['Barlow_Condensed'] font-black text-sm tracking-wider uppercase transition-all shadow-md group-hover:shadow-lg">
                  CHỌN HLV NÀY
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
