import React, { useState, useEffect } from 'react';
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
import { FooterNavigation } from './components/FooterNavigation';

const STORAGE_KEY = 'aovdle_game_state_v2';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'draft' | 'dreamteam' | 'tournament' | 'champion'>(
    'draft'
  );

  // Draft State
  const [draftState, setDraftState] = useState(() => initializeDraft());

  // Dream Team snapshot
  const [dreamTeam, setDreamTeam] = useState<DreamTeam | null>(null);

  // Tournament States
  const [swissState, setSwissState] = useState<SwissStageState | null>(null);
  const [playoffBracket, setPlayoffBracket] = useState<PlayoffBracket | null>(null);
  const [champion, setChampion] = useState<TournamentTeam | null>(null);

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentTab) setCurrentTab(parsed.currentTab);
        if (parsed.draftState) setDraftState(parsed.draftState);
        if (parsed.dreamTeam) setDreamTeam(parsed.dreamTeam);
        if (parsed.swissState) setSwissState(parsed.swissState);
        if (parsed.playoffBracket) setPlayoffBracket(parsed.playoffBracket);
        if (parsed.champion) setChampion(parsed.champion);
      }
    } catch (e) {
      // safe fallback
    }
  }, []);

  // Persist session to localStorage
  useEffect(() => {
    try {
      const payload = {
        currentTab,
        draftState,
        dreamTeam,
        swissState,
        playoffBracket,
        champion,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // safe fallback
    }
  }, [currentTab, draftState, dreamTeam, swissState, playoffBracket, champion]);

  // Count picks
  const picksCount = ROLES.filter(r => draftState.picks[r] !== null).length;
  const hasCoach = draftState.coach !== null;

  // Handle Team Selection
  const handleSelectTeam = (team: any) => {
    setDraftState(prev => selectTeam(prev, team));
  };

  // Handle Player Selection
  const handleSelectPlayer = (player: PlayerVersion) => {
    const updated = pickPlayer(draftState, player);
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
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      const freshDraft = initializeDraft();
      setDraftState(freshDraft);
      setDreamTeam(null);
      setSwissState(null);
      setPlayoffBracket(null);
      setChampion(null);
      setCurrentTab('draft');
    }
  };

  // Draft view mode for mobile screens: 'teams' or 'map'
  const [mobileDraftView, setMobileDraftView] = useState<'teams' | 'map'>('teams');

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#071018] text-[#F2F0E9] flex flex-col overflow-hidden selection:bg-[#C9A45C] selection:text-[#071018]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab === 'champion' ? 'tournament' : currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        rerollsLeft={draftState.rerollsLeft}
        picksCount={picksCount}
        hasCoach={hasCoach}
        onResetGame={handleResetGame}
      />

      {/* Main Content Area - Contained Viewport Scroll */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
        {/* TAB 1: DRAFT SCREEN */}
        {currentTab === 'draft' && (
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex-1 flex flex-col min-h-0">
            <div className="draft-screen-header shrink-0 mb-3 text-center">
              <p className="text-[9px] sm:text-[10px] font-black tracking-[0.32em] text-[#C9A45C]">
                ROUND {picksCount + 1} / 5
              </p>
              <h1 className="font-['Barlow_Condensed'] font-black text-[30px] sm:text-[42px] leading-none text-[#F2F0E9]">
                {draftState.phase === 'player_draft' ? 'SELECT A PLAYER' : 'SELECT A TEAM'}
              </h1>
            </div>

            {/* Mobile View Toggle Pills (Visible only on < lg) */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-3 shrink-0">
              <button
                onClick={() => setMobileDraftView('teams')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-['Barlow_Condensed'] font-bold tracking-wider uppercase transition-all ${
                  mobileDraftView === 'teams'
                    ? 'bg-[#C9A45C] text-[#071018] shadow-md shadow-[#C9A45C]/20'
                    : 'bg-[#142330] text-[#91A0AA] border border-[#354653]/60'
                }`}
              >
                {draftState.phase === 'player_draft' ? 'Chọn Tuyển Thủ' : '3 Đội Tuyển'}
              </button>
              <button
                onClick={() => setMobileDraftView('map')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-['Barlow_Condensed'] font-bold tracking-wider uppercase transition-all ${
                  mobileDraftView === 'map'
                    ? 'bg-[#C9A45C] text-[#071018] shadow-md shadow-[#C9A45C]/20'
                    : 'bg-[#142330] text-[#91A0AA] border border-[#354653]/60'
                }`}
              >
                Bản Đồ Chiến Trường ({picksCount}/5)
              </button>
            </div>

            {/* Main Draft Layout: 42% / 54% desktop, switchable mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-[42fr_54fr] gap-3 lg:gap-5 items-stretch flex-1 min-h-0">
              {/* LEFT COLUMN: 3 Team Cards or Roster Selection */}
              <div
                className={`min-h-0 ${
                  mobileDraftView === 'teams' ? 'block' : 'hidden lg:block'
                }`}
              >
                {draftState.phase === 'team_draft' && (
                  <div className="flex flex-col h-full min-h-0">
                    <div className="grid gap-2 flex-1 content-start">
                      {draftState.currentTeamChoices.map((team, idx) => (
                        <TeamCard
                          key={team.team_id}
                          team={team}
                          index={idx}
                          onSelect={() => handleSelectTeam(team)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraftState(prev => rerollDraftTeams(prev))}
                      disabled={draftState.rerollsLeft <= 0}
                      className="mt-3 w-full h-11 border border-[#C9A45C]/70 bg-[#0D1923] text-[#C9A45C] font-['Barlow_Condensed'] font-black text-[16px] tracking-[0.18em] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#142330] transition-colors"
                    >
                      REROLL ({draftState.rerollsLeft}/3)
                    </button>
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

              {/* RIGHT COLUMN: Interactive Antaris Battlefield Map */}
              <div
                className={`flex flex-col items-center justify-center min-h-0 ${
                  mobileDraftView === 'map' ? 'block' : 'hidden lg:flex'
                }`}
              >
                <MapDraftView
                  picks={draftState.picks}
                  targetRole={draftState.targetRole}
                  onSelectRole={role => {
                    setDraftState(prev => ({ ...prev, targetRole: role }));
                    if (window.innerWidth < 1024) setMobileDraftView('teams');
                  }}
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
            fmvp={playoffBracket?.fmvp}
            onPlayAgain={handleResetGame}
          />
        )}
      </main>

      {/* Footer Navigation */}
      <FooterNavigation />
    </div>
  );
};
