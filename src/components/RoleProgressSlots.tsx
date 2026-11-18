import React from 'react';
import { Role, ROLES, ROLE_LABELS, PlayerVersion, CoachVersion } from '../data/types';
import { RotateCcw, Shield, CheckCircle2 } from './icons';
import { getAssetUrl } from '../utils/assets';

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
  const pickedCount = ROLES.filter(r => picks[r] !== null).length;

  return (
    <div className="bg-[#0D1923] rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-[#354653]/60 shadow-lg mb-2 sm:mb-3 shrink-0">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#354653]/40">
        <div className="flex items-center gap-2">
          <h3 className="font-['Barlow_Condensed'] font-black text-sm sm:text-base text-[#F2F0E9] flex items-center gap-1.5">
            <span>ĐỘI HÌNH DRAFT</span>
            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.2 rounded-full bg-[#142330] text-[#C9A45C] border border-[#C9A45C]/30">
              {pickedCount}/5 TUYỂN THỦ
            </span>
          </h3>
          <span className="text-[11px] text-[#91A0AA] hidden md:inline">
            • Chọn 5 vị trí trên bản đồ, sau đó chọn Head Coach
          </span>
        </div>

        {/* Reroll Button */}
        <button
          onClick={onReroll}
          disabled={!canReroll || rerollsLeft <= 0}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-['Barlow_Condensed'] font-bold text-xs tracking-wider transition-all border cursor-pointer ${
            canReroll && rerollsLeft > 0
              ? 'bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] border-[#F2F0E9]/30 hover:scale-105 active:scale-95 shadow-sm'
              : 'bg-[#142330] text-[#91A0AA]/40 border-[#354653]/40 cursor-not-allowed'
          }`}
          title={rerollsLeft <= 0 ? 'Đã hết lượt reroll' : 'Đổi 3 đội tuyển khác'}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${rerollsLeft > 0 ? 'animate-spin-slow' : ''}`} />
          <span>REROLL ({rerollsLeft}/3)</span>
        </button>
      </div>

      {/* 5 Role Slots + 1 Coach Slot Grid (Single row of 6 on sm+) */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {ROLES.map(role => {
          const player = picks[role];
          const isTarget = targetRole === role;
          const label = ROLE_LABELS[role];

          return (
            <div
              key={role}
              onClick={() => onSelectRole(role)}
              className={`relative rounded-lg p-1 sm:p-1.5 border transition-all cursor-pointer flex flex-col items-center text-center select-none ${
                player
                  ? 'bg-[#142330] border-[#C9A45C]/60 hover:border-[#C9A45C]'
                  : isTarget
                  ? 'bg-[#142330] border-[#C9A45C] ring-1 ring-[#C9A45C] shadow-sm'
                  : 'bg-[#071018]/70 border-[#354653]/50 hover:border-[#354653]'
              }`}
            >
              {/* Role Header */}
              <div className="w-full flex items-center justify-between px-0.5 mb-1 leading-none">
                <span className="font-['Barlow_Condensed'] font-bold text-[10px] sm:text-xs text-[#C9A45C]">
                  {role}
                </span>
                {player && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#3EAD83]" />}
              </div>

              {/* Avatar Icon */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-[#071018] border border-[#354653] overflow-hidden flex items-center justify-center p-0.5 relative mb-0.5">
                {player ? (
                  <img
                    src={getAssetUrl(player.portrait_url || '/assets/placeholders/player-portrait.svg')}
                    alt={player.player_name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <img
                    src={getAssetUrl(label.icon)}
                    alt={role}
                    className="w-4 h-4 sm:w-5 sm:h-5 opacity-40"
                  />
                )}
                {player && (
                  <span className="absolute bottom-0 right-0 bg-[#0D1923] text-[#C9A45C] font-black text-[8px] sm:text-[9px] px-0.5 leading-none rounded-tl">
                    {player.rating}
                  </span>
                )}
              </div>

              {/* Name */}
              <p className="font-['Barlow_Condensed'] font-bold text-[10px] sm:text-xs text-[#F2F0E9] truncate w-full leading-tight">
                {player ? player.player_name : label.vi}
              </p>
            </div>
          );
        })}

        {/* Coach Slot */}
        <div
          className={`relative rounded-lg p-1 sm:p-1.5 border transition-all flex flex-col items-center text-center select-none ${
            coach
              ? 'bg-[#142330] border-[#C9A45C]/60'
              : 'bg-[#071018]/70 border-[#354653]/50'
          }`}
        >
          <div className="w-full flex items-center justify-between px-0.5 mb-1 leading-none">
            <span className="font-['Barlow_Condensed'] font-bold text-[10px] sm:text-xs text-[#C9A45C]">
              COACH
            </span>
            {coach && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#3EAD83]" />}
          </div>

          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-[#071018] border border-[#354653] overflow-hidden flex items-center justify-center p-0.5 relative mb-0.5">
            {coach ? (
              <img
                src={getAssetUrl(coach.portrait_url || '/assets/placeholders/coach-portrait.svg')}
                alt={coach.coach_name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#91A0AA]/30" />
            )}
            {coach && (
              <span className="absolute bottom-0 right-0 bg-[#0D1923] text-[#C9A45C] font-black text-[8px] sm:text-[9px] px-0.5 leading-none rounded-tl">
                {coach.rating}
              </span>
            )}
          </div>

          <p className="font-['Barlow_Condensed'] font-bold text-[10px] sm:text-xs text-[#F2F0E9] truncate w-full leading-tight">
            {coach ? coach.coach_name : 'HLV Trưởng'}
          </p>
        </div>
      </div>
    </div>
  );
};
