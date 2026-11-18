import React, { useState } from 'react';
import {
  initializeDraft,
  selectTeam,
  backToTeamDraft,
  rerollDraftTeams,
  pickPlayer,
  pickCoach,
} from './engine/draft';
import {
  initializeSwissStage,
  convertDreamTeamToTournamentTeam,
} from './engine/tournament';
import { calculateDreamTeamStrength } from './engine/rating';
import { calculateSynergies } from './engine/synergy';
import {
  Role,
  ROLES,
  PlayerVersion,
  CoachVersion,
  DreamTeam,
  TournamentTeam,
  SwissStageState,
  PlayoffBracket,
} from './data/types';
import { Navbar } from './components/Navbar';
import { TeamCard } from './components/TeamCard';
import { RosterModal } from './components/RosterModal';
import { RoleProgressSlots } from './components/RoleProgressSlots';
import { MapDraftView } from './components/MapDraftView';
import { CoachDraftModal } from './components/CoachDraftModal';
import { DreamTeamScreen } from './components/DreamTeamScreen';
import { TournamentScreen } from './components/TournamentScreen';
import { ChampionScreen } from './components/ChampionScreen';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'draft' | 'dreamteam' | 'tournament' | 'champion'>('draft');

  // Draft State
  const [draftState, setDraftState] = useState(() => initializeDraft());

  // Dream Team snapshot
  const [dreamTeam, setDreamTeam] = useState<DreamTeam | null>(null);

  // Tournament States
  const [swissState, setSwissState] = useState<SwissStageState | null>(null);
  const [playoffBracket, setPlayoffBracket] = useState<PlayoffBracket | null>(null);
  const [champion, setChampion] = useState<TournamentTeam | null>(null);

  // Count picks
  const picksCount = ROLES.filter(r => draftState.picks[r] !== null).length;
  const hasCoach = draftState.coach !== null;

  // Handle Team Selection
  const handleSelectTeam = (team: any) => {
    setDraftState(prev => selectTeam(prev, team));
  };

  // Handle Player Selection
  const handleSelectPlayer = (player: PlayerVersion) => {
    const updated = pickPlayer(draftState, player, draftState.targetRole || undefined);
    setDraftState(updated);

    // If 5 roles are now filled and coach is selected, construct dream team
    checkAndBuildDreamTeam(updated.picks, updated.coach);
  };

  // Handle Coach Selection
  const handleSelectCoach = (coach: CoachVersion) => {
    const updated = pickCoach(draftState, coach);
    setDraftState(updated);
    checkAndBuildDreamTeam(updated.picks, coach);
    setCurrentTab('dreamteam');
  };

  // Build Dream Team
  const checkAndBuildDreamTeam = (
    picks: Record<Role, PlayerVersion | null>,
    coach: CoachVersion | null
  ) => {
    const isFiveFilled = ROLES.every(r => picks[r] !== null);
    if (isFiveFilled) {
      const { links, bonusPercent } = calculateSynergies(picks, coach);
      const str = calculateDreamTeamStrength(picks, coach);

      const dt: DreamTeam = {
        DSL: picks.DSL,
        Jungle: picks.Jungle,
        Mid: picks.Mid,
        Farm: picks.Farm,
        Support: picks.Support,
        coach,
        synergies: links,
        totalRating: str.playerAverage,
        synergyBonus: bonusPercent,
        finalStrength: str.finalStrength,
      };
      setDreamTeam(dt);
    }
  };

  // Handle Entering Tournament
  const handleEnterTournament = () => {
    if (!dreamTeam) return;
    const userTourneyTeam = convertDreamTeamToTournamentTeam(dreamTeam);
    const initialSwiss = initializeSwissStage(userTourneyTeam);
    setSwissState(initialSwiss);
    setPlayoffBracket(null);
    setChampion(null);
    setCurrentTab('tournament');
  };

  // Handle Reset Game
  const handleResetGame = () => {
    if (window.confirm('Bạn có chắc muốn bắt đầu lại phiên Draft mới?')) {
      const freshDraft = initializeDraft();
      setDraftState(freshDraft);
      setDreamTeam(null);
      setSwissState(null);
      setPlayoffBracket(null);
      setChampion(null);
      setCurrentTab('draft');
    }
  };

  return (
    <div className="min-h-screen bg-[#071018] text-[#F2F0E9] flex flex-col selection:bg-[#C9A45C] selection:text-[#071018]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab === 'champion' ? 'tournament' : currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        rerollsLeft={draftState.rerollsLeft}
        picksCount={picksCount}
        hasCoach={hasCoach}
        onResetGame={handleResetGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* TAB 1: DRAFT SCREEN */}
        {currentTab === 'draft' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            {/* Top Slots Progress Indicator */}
            <RoleProgressSlots
              picks={draftState.picks}
              coach={draftState.coach}
              targetRole={draftState.targetRole}
              rerollsLeft={draftState.rerollsLeft}
              onReroll={() => setDraftState(prev => rerollDraftTeams(prev))}
              onSelectRole={role => setDraftState(prev => ({ ...prev, targetRole: role }))}
              canReroll={draftState.phase === 'team_draft'}
            />

            {/* Two-Column Layout (Reference 3 & PRD Style) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: 3 Team Cards or Roster Selection (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                {draftState.phase === 'team_draft' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-['Barlow_Condensed'] font-black text-2xl text-[#F2F0E9] tracking-wider">
                        CHỌN 1 TRONG 3 ĐỘI TUYỂN
                      </h2>
                      <span className="text-xs text-[#C9A45C] font-semibold">
                        Lượt {picksCount + 1} / 5
                      </span>
                    </div>

                    <div className="space-y-4">
                      {draftState.currentTeamChoices.map((team, idx) => (
                        <TeamCard
                          key={team.team_id}
                          team={team}
                          index={idx}
                          onSelect={() => handleSelectTeam(team)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {draftState.phase === 'player_draft' && draftState.selectedTeam && (
                  <RosterModal
                    team={draftState.selectedTeam}
                    roster={draftState.teamRoster}
                    targetRole={draftState.targetRole}
                    onSelectPlayer={handleSelectPlayer}
                    onBack={() => setDraftState(prev => backToTeamDraft(prev))}
                    existingPicks={draftState.picks}
                  />
                )}
              </div>

              {/* RIGHT COLUMN: Interactive Antaris Battlefield Map (6 cols) */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <MapDraftView
                  picks={draftState.picks}
                  targetRole={draftState.targetRole}
                  onSelectRole={role => setDraftState(prev => ({ ...prev, targetRole: role }))}
                />
              </div>
            </div>

            {/* Coach Draft Modal (Popup when 5 players chosen) */}
            {draftState.phase === 'coach_draft' && (
              <CoachDraftModal
                coaches={draftState.coachChoices}
                picks={draftState.picks}
                onSelectCoach={handleSelectCoach}
              />
            )}
          </div>
        )}

        {/* TAB 2: DREAM TEAM SCREEN */}
        {currentTab === 'dreamteam' && dreamTeam && (
          <DreamTeamScreen
            dreamTeam={dreamTeam}
            onEnterTournament={handleEnterTournament}
            onResetDraft={handleResetGame}
          />
        )}

        {/* TAB 3: TOURNAMENT SIMULATION SCREEN */}
        {currentTab === 'tournament' && swissState && (
          <TournamentScreen
            swissState={swissState}
            onUpdateSwissState={setSwissState}
            playoffBracket={playoffBracket}
            onUpdatePlayoffBracket={setPlayoffBracket}
            onViewChampion={champ => {
              setChampion(champ);
              setCurrentTab('champion');
            }}
          />
        )}

        {/* TAB 4: CHAMPION CELEBRATION SCREEN */}
        {currentTab === 'champion' && champion && (
          <ChampionScreen
            champion={champion}
            onPlayAgain={handleResetGame}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#354653]/40 py-6 text-center text-xs text-[#91A0AA] bg-[#071018]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AOVDLE — Arena of Valor Draft & Tournament Simulation 2019–2026</span>
          <span className="text-[#C9A45C]">Tất cả dữ liệu lịch sử quốc tế AWC, AIC, APL</span>
        </div>
      </footer>
    </div>
  );
};
