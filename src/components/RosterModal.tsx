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
    <div className="bg-[#0D1923] rounded-xl sm:rounded-2xl border border-[#C9A45C]/40 p-3 sm:p-4 shadow-xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#354653]/60 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#91A0AA] hover:text-[#C9A45C] transition-colors py-1 px-2 rounded-lg bg-[#142330] border border-[#354653]/60 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Đổi Đội</span>
        </button>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#F2F0E9]">
              {team.team_name}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C9A45C] text-[#071018]">
              {team.year}
            </span>
          </div>
          <p className="text-[10px] text-[#91A0AA]">
            Chọn cho vị trí: <span className="text-[#C9A45C] font-bold">{targetRole || 'Còn trống'}</span>
          </p>
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[min(48vh,360px)] overflow-y-auto pr-1">
        {roster.map(player => {
          const picked = isPlayerPicked(player.player_id);
          const roleInfo = ROLE_LABELS[player.role];

          return (
            <div
              key={player.player_id}
              onClick={() => !picked && onSelectPlayer(player)}
              className={`relative rounded-xl p-2 sm:p-2.5 border transition-all duration-200 flex items-center justify-between gap-2 select-none ${
                picked
                  ? 'bg-[#142330]/40 border-[#354653]/30 opacity-40 cursor-not-allowed'
                  : 'bg-[#142330] hover:bg-[#1C3042] border-[#354653]/60 hover:border-[#C9A45C] cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Portrait */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#071018] border border-[#354653] p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={getAssetUrl(player.portrait_url || '/assets/placeholders/player-portrait.svg')}
                    alt={player.player_name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-['Barlow_Condensed'] font-bold text-sm sm:text-base text-[#F2F0E9] truncate">
                      {player.player_name}
                    </span>
                    <span className="px-1 py-0.2 rounded text-[9px] font-black bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                      {player.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#91A0AA]">
                    <span className="flex items-center gap-1 font-medium text-[#C9A45C]">
                      <img src={getAssetUrl(roleInfo.icon)} alt={player.role} className="w-3 h-3" />
                      {player.role}
                    </span>
                    <span>•</span>
                    <span className="truncate">{player.country}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                {picked ? (
                  <span className="text-[9px] text-[#91A0AA] px-1.5 py-0.5 rounded bg-[#071018]">
                    Đã Chọn
                  </span>
                ) : (
                  <button className="px-2.5 py-1 rounded-md bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#071018] font-['Barlow_Condensed'] font-bold text-xs tracking-wider transition-transform hover:scale-105 cursor-pointer">
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
