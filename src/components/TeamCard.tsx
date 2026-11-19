import React from 'react';
import { TeamSeason, ROLES, ROLE_LABELS } from '../data/types';
import { ChevronRight } from './icons';
import { HISTORICAL_PLAYERS } from '../data/historicalData';
import { getAssetUrl } from '../utils/assets';

interface TeamCardProps {
  team: TeamSeason;
  onSelect: () => void;
  index: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onSelect, index }) => {
  const roster = HISTORICAL_PLAYERS.filter(p => p.team_id === team.team_id);
  const orderedRoster = ROLES.map(role =>
    roster.find(player => player.role === role)
  ).filter((player): player is typeof roster[number] => Boolean(player)).slice(0, 5);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="draft-gold-card group relative w-full cursor-pointer overflow-hidden text-left bg-[#0D1923] hover:bg-[#142330] border border-[#C9A45C]/70 px-3 py-2.5 transition-all duration-200 shadow-[0_10px_30px_rgba(0,0,0,.28)] hover:shadow-[0_12px_30px_rgba(201,164,92,.12)]"
    >
      <div className="grid grid-cols-[76px_1fr_28px] items-center gap-3">
        <div className="h-[68px] flex items-center justify-center">
          <img
            src={getAssetUrl(team.logo_url || '/assets/placeholders/team-logo.svg')}
            alt={team.team_name}
            className="w-[68px] h-[68px] object-contain"
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-['Barlow_Condensed'] font-black text-[24px] leading-[0.9] text-[#F2F0E9] uppercase truncate">
            {team.team_name}
          </h3>
          <p className="mt-1 font-['Barlow_Condensed'] text-[13px] font-bold tracking-[0.16em] text-[#C9A45C]">
            {team.year}
          </p>
          <div className="mt-2 h-px bg-[#C9A45C]/45" />
          <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
            {orderedRoster.map(player => (
              <div key={player.player_id} className="flex items-center gap-1 min-w-0">
                <img src={getAssetUrl(ROLE_LABELS[player.role].icon)} alt="" className="w-3 h-3 shrink-0" />
                <span className="font-['Barlow_Condensed'] text-[12px] font-bold uppercase truncate text-[#E6E0CF]">
                  {player.player_name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-7 h-7 border border-[#C9A45C]/50 flex items-center justify-center text-[#C9A45C] group-hover:bg-[#C9A45C] group-hover:text-[#071018] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};
