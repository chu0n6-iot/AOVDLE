import React from 'react';
import { TeamSeason, PlayerVersion } from '../data/types';
import { Shield, ChevronRight, Trophy } from './icons';
import { HISTORICAL_PLAYERS } from '../data/historicalData';
import { getAssetUrl } from '../utils/assets';

interface TeamCardProps {
  team: TeamSeason;
  onSelect: () => void;
  index: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onSelect, index }) => {
  // Find player count for this team
  const roster = HISTORICAL_PLAYERS.filter(p => p.team_id === team.team_id);

  // Region color accents
  const getRegionBadge = (region: string) => {
    const reg = region.toUpperCase();
    if (reg.includes('VIETNAM')) return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (reg.includes('THAILAND')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (reg.includes('TAIWAN') || reg.includes('CHINESE TAIPEI')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (reg.includes('INDONESIA')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-[#C9A45C]/10 text-[#C9A45C] border-[#C9A45C]/30';
  };

  return (
    <div
      onClick={onSelect}
      className="group relative cursor-pointer bg-[#0D1923] hover:bg-[#142330] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-[#354653]/60 hover:border-[#C9A45C] transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-[#C9A45C]/10"
    >
      {/* Decorative Gold Accent Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-xl sm:rounded-tr-2xl pointer-events-none">
        <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-[#C9A45C] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-3">
        {/* Team Logo / Crest */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#071018] border border-[#354653] group-hover:border-[#C9A45C] p-1.5 flex items-center justify-center shrink-0 shadow-inner transition-colors">
          <img
            src={getAssetUrl(team.logo_url || '/assets/placeholders/team-logo.svg')}
            alt={team.team_name}
            className="w-full h-full object-contain filter group-hover:brightness-110"
          />
        </div>

        {/* Team Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="font-['Barlow_Condensed'] font-black text-base sm:text-lg text-[#F2F0E9] group-hover:text-[#C9A45C] transition-colors truncate">
              {team.team_name}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/30">
              {team.year}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#91A0AA] flex-wrap">
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${getRegionBadge(team.region)}`}>
              {team.region || 'Quốc tế'}
            </span>
            <span>•</span>
            <span className="truncate text-[10px]">{team.tournament_id}</span>
          </div>
        </div>

        {/* Select Arrow Action */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#142330] group-hover:bg-[#C9A45C] flex items-center justify-center shrink-0 border border-[#354653] group-hover:border-[#C9A45C] text-[#91A0AA] group-hover:text-[#071018] transition-all">
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Roster Mini Preview */}
      <div className="mt-3 pt-3 border-t border-[#354653]/40 flex items-center justify-between text-xs text-[#91A0AA]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-semibold text-[#F2F0E9]">Roster:</span>
          <span className="truncate">
            {roster.slice(0, 5).map(p => p.player_name).join(', ') || 'Đang cập nhật'}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#C9A45C] shrink-0 ml-2">
          {roster.length} Tuyển thủ
        </span>
      </div>
    </div>
  );
};
