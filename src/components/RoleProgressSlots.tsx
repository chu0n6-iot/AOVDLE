import React from 'react';
import { Role, ROLES, ROLE_LABELS, PlayerVersion, CoachVersion } from '../data/types';
import { RotateCcw, Shield, CheckCircle2, Sparkles } from './icons';

interface RoleProgressSlotsProps {
  picks: Record<Role, PlayerVersion | null>;
  coach: CoachVersion | null;
  targetRole: Role | null;
  rerollsLeft: number;
  onReroll: () => void;
  onSelectRole: (role: Role) => void;
  canReroll: boolean;
}

export const RoleProgressSlots: React.FC<RoleProgressSlotsProps> = ({
  picks,
  coach,
  targetRole,
  rerollsLeft,
  onReroll,
  onSelectRole,
  canReroll,
}) => {
  return (
    <div className="bg-[#0D1923] rounded-2xl p-4 lg:p-5 border border-[#354653]/60 shadow-xl mb-6">
      <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-[#354653]/40 flex-wrap">
        <div>
          <h3 className="font-['Barlow_Condensed'] font-black text-lg text-[#F2F0E9] flex items-center gap-2">
            <span>ĐỘI HÌNH DRAFT</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#142330] text-[#C9A45C] border border-[#C9A45C]/30">
              {ROLES.filter(r => picks[r] !== null).length}/5 TUYỂN THỦ
            </span>
          </h3>
          <p className="text-xs text-[#91A0AA]">
            Chọn lần lượt 5 vị trí trên bản đồ, sau đó chọn 1 Head Coach.
          </p>
        </div>

        {/* Reroll Button */}
        <button
          onClick={onReroll}
          disabled={!canReroll || rerollsLeft <= 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-['Barlow_Condensed'] font-bold text-sm tracking-wider transition-all duration-200 border ${
            canReroll && rerollsLeft > 0
              ? 'bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] border-[#F2F0E9]/30 hover:shadow-lg hover:shadow-[#C9A45C]/25 hover:scale-105 active:scale-95'
              : 'bg-[#142330] text-[#91A0AA]/40 border-[#354653]/40 cursor-not-allowed'
          }`}
          title={rerollsLeft <= 0 ? 'Đã hết lượt reroll' : 'Đổi 3 đội tuyển khác'}
        >
          <RotateCcw className={`w-4 h-4 ${rerollsLeft > 0 ? 'animate-spin-slow' : ''}`} />
          <span>REROLL ({rerollsLeft}/3)</span>
        </button>
      </div>

      {/* 5 Role Slots + 1 Coach Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ROLES.map(role => {
          const player = picks[role];
          const isTarget = targetRole === role;
          const label = ROLE_LABELS[role];

          return (
            <div
              key={role}
              onClick={() => onSelectRole(role)}
              className={`relative rounded-xl p-2.5 border transition-all cursor-pointer flex flex-col items-center text-center ${
                player
                  ? 'bg-[#142330] border-[#C9A45C]/60 hover:border-[#C9A45C]'
                  : isTarget
                  ? 'bg-[#142330]/80 border-[#C9A45C] ring-2 ring-[#C9A45C]/40 animate-pulse'
                  : 'bg-[#071018]/60 border-[#354653]/60 hover:border-[#354653]'
              }`}
            >
              {/* Role Indicator Header */}
              <div className="w-full flex items-center justify-between mb-1.5 px-1">
                <span className="font-['Barlow_Condensed'] font-bold text-xs text-[#C9A45C] tracking-wide">
                  {role}
                </span>
                {player && <CheckCircle2 className="w-3.5 h-3.5 text-[#3EAD83]" />}
              </div>

              {/* Slot Avatar / Placeholder */}
              <div className="w-12 h-12 rounded-lg bg-[#071018] border border-[#354653] overflow-hidden flex items-center justify-center mb-1.5 p-1 relative">
                {player ? (
                  <img
                    src={player.portrait_url || '/assets/placeholders/player-portrait.svg'}
                    alt={player.player_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={label.icon}
                    alt={role}
                    className="w-6 h-6 opacity-40"
                  />
                )}
                {player && (
                  <span className="absolute bottom-0 right-0 bg-[#0D1923] text-[#C9A45C] font-black text-[9px] px-1 border-t border-l border-[#C9A45C]/40 rounded-tl">
                    {player.rating}
                  </span>
                )}
              </div>

              {/* Player Name / Empty Label */}
              <p className="font-['Barlow_Condensed'] font-bold text-xs text-[#F2F0E9] truncate w-full">
                {player ? player.player_name : label.vi}
              </p>
              <p className="text-[10px] text-[#91A0AA] truncate w-full">
                {player ? `${player.year} • ${player.team_name.split(' ')[0]}` : 'Chưa chọn'}
              </p>
            </div>
          );
        })}

        {/* Coach Slot */}
        <div
          className={`relative rounded-xl p-2.5 border transition-all flex flex-col items-center text-center ${
            coach
              ? 'bg-[#142330] border-[#C9A45C]/60'
              : 'bg-[#071018]/60 border-[#354653]/60'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-1.5 px-1">
            <span className="font-['Barlow_Condensed'] font-bold text-xs text-[#C9A45C] tracking-wide">
              COACH
            </span>
            {coach && <CheckCircle2 className="w-3.5 h-3.5 text-[#3EAD83]" />}
          </div>

          <div className="w-12 h-12 rounded-lg bg-[#071018] border border-[#354653] overflow-hidden flex items-center justify-center mb-1.5 p-1 relative">
            {coach ? (
              <img
                src={coach.portrait_url || '/assets/placeholders/coach-portrait.svg'}
                alt={coach.coach_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Shield className="w-6 h-6 text-[#91A0AA]/30" />
            )}
            {coach && (
              <span className="absolute bottom-0 right-0 bg-[#0D1923] text-[#C9A45C] font-black text-[9px] px-1 border-t border-l border-[#C9A45C]/40 rounded-tl">
                {coach.rating}
              </span>
            )}
          </div>

          <p className="font-['Barlow_Condensed'] font-bold text-xs text-[#F2F0E9] truncate w-full">
            {coach ? coach.coach_name : 'Head Coach'}
          </p>
          <p className="text-[10px] text-[#91A0AA] truncate w-full">
            {coach ? `${coach.year} • ${coach.team_name.split(' ')[0]}` : 'Vòng 2'}
          </p>
        </div>
      </div>
    </div>
  );
};
