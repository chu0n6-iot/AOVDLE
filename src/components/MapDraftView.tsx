import React from 'react';
import { Role, ROLES, ROLE_LABELS, PlayerVersion } from '../data/types';
import { Shield, Sparkles } from './icons';
import { getAssetUrl } from '../utils/assets';

interface MapDraftViewProps {
  picks: Record<Role, PlayerVersion | null>;
  targetRole: Role | null;
  onSelectRole?: (role: Role) => void;
}

// Coordinates in percentage on Antaris Battlefield overhead map
const ROLE_COORDINATES: Record<Role, { top: string; left: string }> = {
  DSL: { top: '22%', left: '26%' },       // Top Lane (Dark Slayer Lane)
  Jungle: { top: '38%', left: '40%' },    // Upper Jungle area
  Mid: { top: '50%', left: '50%' },       // Mid Lane Center
  Support: { top: '65%', left: '60%' },   // Abyssal Dragon Pit / Roam
  Farm: { top: '78%', left: '76%' },      // Dragon / Bot Lane
};

export const MapDraftView: React.FC<MapDraftViewProps> = ({
  picks,
  targetRole,
  onSelectRole,
}) => {
  return (
    <div className="relative w-full aspect-square max-h-[min(50vh,440px)] max-w-[min(50vh,440px)] mx-auto rounded-2xl overflow-hidden border-2 border-[#C9A45C]/40 bg-[#071018] shadow-2xl shadow-[#C9A45C]/15 group shrink-0">
      {/* Background Overhead Map */}
      <img
        src={getAssetUrl('/assets/maps/aov_antaris_map.png')}
        alt="Arena of Valor Antaris Battlefield"
        className="w-full h-full object-cover filter brightness-90 contrast-110 select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
      />

      {/* Map Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071018]/80 via-transparent to-[#071018]/40 pointer-events-none" />

      {/* Map Border Corner Accents */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#C9A45C] pointer-events-none" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#C9A45C] pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#C9A45C] pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#C9A45C] pointer-events-none" />

      {/* Map Header Tag */}
      <div className="absolute top-3 left-3 bg-[#0D1923]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C9A45C]/30 flex items-center gap-2 z-10 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#3EAD83] animate-pulse" />
        <span className="font-['Barlow_Condensed'] font-bold text-xs tracking-wider text-[#F2F0E9]">
          CHIẾN TRƯỜNG ANTARIS
        </span>
      </div>

      {/* 5 Role Pins on Map */}
      {ROLES.map(role => {
        const player = picks[role];
        const isTarget = targetRole === role;
        const coords = ROLE_COORDINATES[role];
        const label = ROLE_LABELS[role];

        return (
          <div
            key={role}
            style={{ top: coords.top, left: coords.left }}
            onClick={() => onSelectRole && onSelectRole(role)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 hover:scale-110 ${
              isTarget ? 'scale-110' : ''
            }`}
          >
            {player ? (
              /* FILLED ROLE PIN */
              <div className="flex flex-col items-center group/pin">
                {/* Avatar Pin */}
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#C9A45C] bg-[#142330] shadow-xl shadow-black/80 ring-2 ring-[#C9A45C]/50 flex items-center justify-center">
                    <img
                      src={getAssetUrl(player.portrait_url || '/assets/placeholders/player-portrait.svg')}
                      alt={player.player_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Mini Role / Team Badge on Top Right */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#071018] border border-[#C9A45C] flex items-center justify-center shadow-md">
                    <img
                      src={getAssetUrl(label.icon)}
                      alt={role}
                      className="w-3.5 h-3.5"
                    />
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute -bottom-1 -left-1 px-1 py-0.2 rounded bg-[#0D1923] border border-[#C9A45C]/60 text-[9px] font-black text-[#C9A45C]">
                    {player.rating}
                  </div>
                </div>

                {/* Name Tag Pill */}
                <div className="mt-1 bg-[#0D1923]/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#354653] shadow-md text-center max-w-[90px]">
                  <p className="font-['Barlow_Condensed'] font-bold text-xs text-[#F2F0E9] truncate leading-tight">
                    {player.player_name}
                  </p>
                  <p className="text-[9px] text-[#91A0AA] truncate font-medium">
                    {player.year} • {player.team_name.split(' ')[0]}
                  </p>
                </div>
              </div>
            ) : (
              /* EMPTY TARGET SLOT PIN */
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                    isTarget
                      ? 'border-[#C9A45C] bg-[#C9A45C]/20 shadow-lg shadow-[#C9A45C]/40 animate-pulse'
                      : 'border-[#354653] bg-[#0D1923]/80 hover:border-[#C9A45C]/60'
                  }`}
                >
                  <img
                    src={getAssetUrl(label.icon)}
                    alt={role}
                    className={`w-6 h-6 sm:w-7 sm:h-7 opacity-75 ${
                      isTarget ? 'filter drop-shadow-[0_0_8px_rgba(201,164,92,0.8)]' : ''
                    }`}
                  />
                </div>

                <div className="mt-1 bg-[#071018]/90 px-1.5 py-0.5 rounded border border-[#354653]/60 text-[10px] font-bold text-[#C9A45C] tracking-wide">
                  {role}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
