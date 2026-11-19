import React from 'react';
import { TeamSeason, PlayerVersion, Role, ROLE_LABELS } from '../data/types';
import { ArrowLeft } from './icons';
import { ROLES } from '../data/types';
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
  const isPlayerPicked = (playerId: string) => {
    return Object.values(existingPicks).some(p => p !== null && p.player_id === playerId);
  };
  const orderedRoster = ROLES.map(role =>
    roster.find(player => player.role === role)
  ).filter((player): player is PlayerVersion => Boolean(player));

  return (
    <div className="relative bg-[#0D1923]/75 border-y border-[#C9A45C]/50 py-2 shadow-xl animate-fade-in">
      <div className="relative h-[74px] mb-2 flex items-center justify-center">
        <img
          src={getAssetUrl(team.logo_url || '/assets/placeholders/team-logo.svg')}
          alt=""
          className="absolute left-1/2 -translate-x-1/2 h-[72px] w-[72px] object-contain opacity-15"
        />
        <button
          onClick={onBack}
          className="absolute left-1 top-1 flex items-center gap-1 text-[10px] font-bold text-[#C9A45C] border border-[#C9A45C]/40 px-2 py-1"
        >
          <ArrowLeft className="w-3 h-3" /> Đổi đội
        </button>
        <div className="relative text-center">
          <h3 className="font-['Barlow_Condensed'] text-[28px] font-black leading-none text-[#F2F0E9] uppercase">
            {team.team_name}
          </h3>
          <p className="mt-1 text-[12px] font-bold tracking-[0.2em] text-[#C9A45C]">{team.year}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 px-2">
        {orderedRoster.map(player => {
          const picked = isPlayerPicked(player.player_id);
          const roleInfo = ROLE_LABELS[player.role];
          return (
            <button
              type="button"
              key={player.player_id}
              onClick={() => !picked && onSelectPlayer(player)}
              disabled={picked}
              className={`draft-gold-card relative h-[88px] grid grid-cols-[92px_1fr] overflow-hidden border text-left transition-all ${
                picked
                  ? 'bg-[#142330]/35 border-[#354653]/40 opacity-40 cursor-not-allowed'
                  : 'bg-[#142330] border-[#C9A45C]/70 hover:border-[#F2F0E9] hover:bg-[#1C3042] cursor-pointer'
              }`}
            >
              <div className="h-full bg-[#071018] overflow-hidden border-r border-[#C9A45C]/40">
                <img
                  src={getAssetUrl(player.portrait_url || '/assets/placeholders/player-portrait.svg')}
                  alt={player.player_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center justify-center px-3">
                <span className="font-['Barlow_Condensed'] font-black text-[22px] leading-none text-[#F2F0E9] uppercase text-center truncate w-full">
                  {player.player_name}
                </span>
                <span className="mt-2 text-[10px] font-bold tracking-widest text-[#C9A45C]">{player.year}</span>
                <img src={getAssetUrl(roleInfo.icon)} alt={player.role} className="w-7 h-7 mt-1.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
