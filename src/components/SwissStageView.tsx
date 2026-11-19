import React from 'react';
import {
  SwissStageState,
  TournamentMatch,
  TournamentTeam,
} from '../data/types';
import { getAssetUrl } from '../utils/assets';
import { CheckCircle2, FastForward, Eye, Trophy } from './icons';

interface SwissStageViewProps {
  state: SwissStageState;
  onAdvance: () => void;
  onOpenMatch: (match: TournamentMatch) => void;
  onOpenPlayoffs: () => void;
}

const recordGroups = ['0-0', '1-0', '0-1', '2-0', '1-1', '0-2', '2-1', '1-2', '2-2'];

function TeamLogo({ team, small = false }: { team: TournamentTeam; small?: boolean }) {
  return (
    <img
      src={getAssetUrl(team.logo_url || '/assets/placeholders/team-logo.svg')}
      alt={team.name}
      className={`${small ? 'w-7 h-7' : 'w-9 h-9'} object-contain shrink-0`}
    />
  );
}

function MatchCard({
  match,
  onOpen,
}: {
  match: TournamentMatch;
  onOpen: (match: TournamentMatch) => void;
}) {
  const status = match.isComplete
    ? 'completed'
    : match.team1.isPlayer || match.team2.isPlayer
      ? 'live'
      : 'pending';

  return (
    <button
      type="button"
      onClick={() => onOpen(match)}
      className={`swiss-match-card swiss-match-${status} w-full grid grid-cols-[1fr_32px_1fr] items-center gap-1.5 px-2 py-2 text-left`}
    >
      <div className="flex items-center gap-1 min-w-0">
        <TeamLogo team={match.team1} small />
        <span className="font-['Barlow_Condensed'] font-black text-[10px] uppercase truncate text-[#F2F0E9]">
          {match.team1.name}
        </span>
      </div>
      <div className="text-center">
        <span className="block text-[8px] font-black text-[#C9A45C]">{match.format}</span>
        <span className="font-mono text-[10px] font-black text-[#F2F0E9]">
          {match.score1}-{match.score2}
        </span>
      </div>
      <div className="flex items-center justify-end gap-1 min-w-0">
        <span className="font-['Barlow_Condensed'] font-black text-[10px] uppercase truncate text-right text-[#F2F0E9]">
          {match.team2.name}
        </span>
        <TeamLogo team={match.team2} small />
      </div>
    </button>
  );
}

export const SwissStageView: React.FC<SwissStageViewProps> = ({
  state,
  onAdvance,
  onOpenMatch,
  onOpenPlayoffs,
}) => {
  const completedCount = state.currentMatches.filter(match => match.isComplete).length;
  const history = [...state.historyMatches, ...state.currentMatches].filter(match => match.isComplete);

  return (
    <div className="swiss-stage-shell flex-1 min-h-0 overflow-hidden flex flex-col">
      <div className="swiss-stage-topbar shrink-0 flex items-center justify-between px-3 sm:px-5 py-2">
        <div className="flex items-center gap-2">
          <img
            src={getAssetUrl('/assets/branding/aov-logo.svg')}
            alt="Arena of Valor"
            className="h-8 sm:h-10 w-auto"
          />
          <div>
            <p className="text-[8px] sm:text-[10px] tracking-[0.28em] font-black text-[#61DAFB] uppercase">
              Arena of Valor Premier League
            </p>
            <h2 className="font-['Barlow_Condensed'] font-black text-xl sm:text-3xl leading-none text-[#F2F0E9]">
              SWISS STAGE
            </h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-[#91A0AA] uppercase tracking-wider">Round</p>
          <p className="font-['Barlow_Condensed'] font-black text-2xl text-[#C9A45C] leading-none">
            {state.round}/5
          </p>
        </div>
      </div>

      <div className="swiss-bracket-grid flex-1 min-h-0 overflow-x-auto px-2 sm:px-4 py-3">
        {recordGroups.map(record => {
          const [wins, losses] = record.split('-').map(Number);
          const teams = state.teams.filter(
            team =>
              team.status === 'active' &&
              team.swissRecord.wins === wins &&
              team.swissRecord.losses === losses
          );
          const roundMatches = state.currentMatches.filter(
            match =>
              (match.team1.swissRecord.wins === wins &&
                match.team1.swissRecord.losses === losses) ||
              (match.team2.swissRecord.wins === wins &&
                match.team2.swissRecord.losses === losses)
          );
          const isEliminationGroup = wins === 0 && losses === 2;
          const isQualificationGroup = wins === 2 && losses === 0;

          return (
            <section
              key={record}
              className={`swiss-record-column ${isEliminationGroup ? 'elimination-column' : ''}`}
            >
              <div className={`swiss-record-heading ${wins === 2 ? 'qualified-heading' : losses === 2 ? 'eliminated-heading' : ''}`}>
                <span>{record}</span>
                {isQualificationGroup && <b>QUALIFY</b>}
                {isEliminationGroup && <b>ELIMINATE</b>}
              </div>

              <div className="space-y-1.5">
                {roundMatches.length > 0
                  ? roundMatches.map(match => (
                      <MatchCard key={match.id} match={match} onOpen={onOpenMatch} />
                    ))
                  : teams.map(team => (
                      <div
                        key={team.id}
                        className={`swiss-team-card ${team.status === 'qualified' ? 'qualified' : ''}`}
                      >
                        <TeamLogo team={team} />
                        <div className="min-w-0">
                          <p className="font-['Barlow_Condensed'] font-black text-[11px] uppercase truncate">
                            {team.name}
                          </p>
                          <p className="text-[8px] text-[#91A0AA] uppercase truncate">
                            {team.team_id?.includes('APL') ? 'APL' : 'International'}
                          </p>
                        </div>
                        <span className="font-mono text-[9px] font-black text-[#C9A45C]">
                          {team.swissRecord.wins}-{team.swissRecord.losses}
                        </span>
                      </div>
                    ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="swiss-qualified-bar shrink-0 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-2 px-3 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {state.qualifiedTeams.map(team => (
            <div key={team.id} className="qualified-team-chip">
              <TeamLogo team={team} small />
              <span>{team.name}</span>
              <b>{team.swissRecord.wins}-{team.swissRecord.losses}</b>
            </div>
          ))}
          {state.eliminatedTeams.length > 0 && (
            <div className="eliminated-count">
              ELIMINATED: {state.eliminatedTeams.length}
            </div>
          )}
        </div>
        {state.isComplete ? (
          <button
            type="button"
            onClick={onOpenPlayoffs}
            className="swiss-action-button"
          >
            <Trophy className="w-4 h-4" />
            QUARTERFINALS
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdvance}
            className="swiss-action-button"
          >
            <FastForward className="w-4 h-4" />
            {completedCount === state.currentMatches.length
              ? `ROUND ${state.round + 1}`
              : `SIMULATE ROUND ${state.round}`}
          </button>
        )}
      </div>

      {history.length > 0 && (
        <details className="swiss-history shrink-0">
          <summary>
            <Eye className="w-3.5 h-3.5" />
            MATCH HISTORY ({history.length})
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-28 overflow-y-auto p-2">
            {history.map(match => (
              <button
                key={match.id}
                type="button"
                onClick={() => onOpenMatch(match)}
                className="history-match-row"
              >
                <span>{match.roundName}</span>
                <strong>{match.team1.name} {match.score1}-{match.score2} {match.team2.name}</strong>
                <CheckCircle2 className="w-3 h-3" />
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
