import React from 'react';
import { TeamSeason, PlayerVersion, Role, ROLE_LABELS } from '../data/types';
import { ArrowLeft, Shield, Sparkles } from './icons';
import { getAssetUrl } from '../utils/assets';

interface RosterModalProps {
  team: TeamSeason;
  roster: PlayerVersion[];
  targetRole: Role | null;
  onSelectPlayer: (player: PlayerVersion) => void;
  onBack: () => void;
  existingPicks: Record<Role, PlayerVersion | null>;
}

export const RosterModal: React.FC<RosterModalProps> = ({
  team,
  roster,
  targetRole,
  onSelectPlayer,
  onBack,
  existingPicks,
}) => {
  // Check if player is already picked
  const isPlayerPicked = (playerId: string) => {
    return Object.values(existingPicks).some(p => p !== null && p.player_id === playerId);
  };

  return (
    <div className="bg-[#0D1923] rounded-2xl border border-[#C9A45C]/40 p-4 lg:p-6 shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#354653]/60 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#91A0AA] hover:text-[#C9A45C] transition-colors py-1 px-2.5 rounded-lg bg-[#142330] border border-[#354653]/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại Chọn Đội</span>
        </button>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="font-['Barlow_Condensed'] font-black text-xl text-[#F2F0E9]">
              {team.team_name}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C] text-[#071018]">
              {team.year}
            </span>
          </div>
          <p className="text-[11px] text-[#91A0AA]">
            Chọn 1 tuyển thủ cho vị trí: <span className="text-[#C9A45C] font-bold">{targetRole || 'Còn trống'}</span>
          </p>
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
        {roster.map(player => {
          const picked = isPlayerPicked(player.player_id);
          const roleInfo = ROLE_LABELS[player.role];

          return (
            <div
              key={player.player_id}
              onClick={() => !picked && onSelectPlayer(player)}
              className={`relative rounded-xl p-3 border transition-all duration-200 flex items-center justify-between gap-3 ${
                picked
                  ? 'bg-[#142330]/40 border-[#354653]/30 opacity-40 cursor-not-allowed'
                  : 'bg-[#142330] hover:bg-[#1C3042] border-[#354653]/60 hover:border-[#C9A45C] cursor-pointer shadow-md hover:shadow-lg hover:shadow-[#C9A45C]/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Portrait */}
                <div className="w-12 h-12 rounded-lg bg-[#071018] border border-[#354653] p-1 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={getAssetUrl(player.portrait_url || '/assets/placeholders/player-portrait.svg')}
                    alt={player.player_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Barlow_Condensed'] font-bold text-base text-[#F2F0E9] truncate">
                      {player.player_name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                      {player.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#91A0AA] mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#C9A45C]">
                      <img src={getAssetUrl(roleInfo.icon)} alt={player.role} className="w-3.5 h-3.5" />
                      {player.role}
                    </span>
                    <span>•</span>
                    <span className="truncate text-[11px]">{player.country}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                {picked ? (
                  <span className="text-[10px] text-[#91A0AA] px-2 py-1 rounded bg-[#071018]">
                    Đã Chọn
                  </span>
                ) : (
                  <button className="px-3 py-1.5 rounded-lg bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#071018] font-['Barlow_Condensed'] font-bold text-xs tracking-wider transition-transform hover:scale-105">
                    CHỌN
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
