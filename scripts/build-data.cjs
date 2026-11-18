const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser that handles quotes if any
    const line = lines[i];
    const values = [];
    let insideQuote = false;
    let currentValue = '';
    
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    if (values.length >= headers.length) {
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }
  }
  return rows;
}

// Deterministic rating generator (75 - 98) based on team prestige, player handle, and tournament
function generateRating(name, teamName, tournamentId, role) {
  let hash = 0;
  const str = `${name}_${teamName}_${tournamentId}_${role}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash) % 100;
  
  // Powerhouse teams bonus
  let bonus = 0;
  const upper = teamName.toUpperCase();
  if (upper.includes('FLASH') || upper.includes('SAIGON PHANTOM') || upper.includes('BACON') || upper.includes('BURIRAM') || upper.includes('TALON') || upper.includes('MAD')) {
    bonus += 4;
  } else if (upper.includes('V GAMING') || upper.includes('ONE TEAM') || upper.includes('WOLVES') || upper.includes('BANMEI') || upper.includes('BIKERTOPIA')) {
    bonus += 3;
  }
  
  // Base rating 82 + bonus + variation (-6 to +12)
  const rating = 82 + bonus + (normalized % 15) - 3;
  return Math.min(97, Math.max(76, rating));
}

function generateCoachRating(name, teamName) {
  let hash = 0;
  const str = `coach_${name}_${teamName}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash) % 100;
  let bonus = 0;
  const upper = teamName.toUpperCase();
  if (upper.includes('FLASH') || upper.includes('BACON') || upper.includes('PHANTOM') || upper.includes('TALON')) {
    bonus = 4;
  }
  return Math.min(96, Math.max(78, 83 + bonus + (normalized % 11) - 2));
}

// 1. Load Tournaments
const tourneyRaw = fs.readFileSync(path.join(__dirname, '../data/research/tournaments.csv'), 'utf8');
const tourneyRows = parseCSV(tourneyRaw);
const tournaments = tourneyRows.map(r => ({
  tournament_id: r.tournament_id,
  tournament_name: r.tournament_name,
  year: parseInt(r.year, 10) || 2026,
  event_series: r.event_series,
  game_title: r.game_title,
  region_scope: r.region_scope,
  edition_status: r.edition_status,
  start_date: r.start_date,
  end_date: r.end_date,
  liquipedia_url: r.liquipedia_url,
  verification_status: r.verification_status,
  notes: r.notes || ''
}));

// 2. Load Teams
const teamRaw = fs.readFileSync(path.join(__dirname, '../data/research/teams.csv'), 'utf8');
const teamRows = parseCSV(teamRaw);
const teams = teamRows.map(r => {
  const yearMatch = (r.tournament_id || '').match(/20\d\d/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;
  return {
    team_id: r.team_id,
    tournament_id: r.tournament_id,
    team_name: r.team_name,
    region: r.region || 'International',
    country: r.country || r.region || 'International',
    source_url: r.source_url,
    verification_status: r.verification_status,
    year,
    logo_url: `/assets/teams/${r.team_id}/logo.svg`
  };
});

// 3. Load Coaches
const coachRaw = fs.readFileSync(path.join(__dirname, '../data/research/coaches.csv'), 'utf8');
const coachRows = parseCSV(coachRaw);
const coaches = coachRows.map(r => {
  const yearMatch = (r.tournament_id || '').match(/20\d\d/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;
  return {
    coach_id: r.coach_id,
    coach_name: r.coach_name,
    team_id: r.team_id,
    team_name: r.team_name,
    tournament_id: r.tournament_id,
    role: r.role || 'Head Coach',
    source_url: r.source_url,
    verification_status: r.verification_status,
    country: r.country || 'International',
    year,
    rating: generateCoachRating(r.coach_name, r.team_name),
    portrait_url: `/assets/coaches/${r.coach_id}/portrait.svg`
  };
});

// 4. Load Players & Rosters
const playerRaw = fs.readFileSync(path.join(__dirname, '../data/research/players.csv'), 'utf8');
const playerRows = parseCSV(playerRaw);

const rosterRaw = fs.readFileSync(path.join(__dirname, '../data/research/rosters.csv'), 'utf8');
const rosterRows = parseCSV(rosterRaw);

// Build map of roster roles by player_id
const rosterRoleMap = new Map();
rosterRows.forEach(r => {
  if (r.player_id && r.role) {
    rosterRoleMap.set(r.player_id, r.role);
  }
});

const validRoles = ['DSL', 'Jungle', 'Mid', 'Farm', 'Support'];
const players = playerRows.map(r => {
  const yearMatch = (r.tournament_id || '').match(/20\d\d/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;
  
  let role = r.role;
  if (!role || !validRoles.includes(role)) {
    role = rosterRoleMap.get(r.player_id) || 'Mid';
  }
  if (!validRoles.includes(role)) {
    // Default fallback
    role = 'Mid';
  }
  
  return {
    player_id: r.player_id,
    player_name: r.player_name,
    nickname: r.nickname || r.player_name,
    country: r.country || 'International',
    team_id: r.team_id,
    tournament_id: r.tournament_id,
    team_name: r.team_name,
    role,
    source_url: r.source_url,
    verification_status: r.verification_status,
    year,
    rating: generateRating(r.player_name, r.team_name, r.tournament_id, role),
    portrait_url: `/assets/players/${r.player_id}/portrait.svg`
  };
});

// Output code
const tsContent = `// Auto-generated from data/research historical dataset
import { Tournament, TeamSeason, CoachVersion, PlayerVersion, RosterMember } from './types';

export const HISTORICAL_TOURNAMENTS: Tournament[] = ${JSON.stringify(tournaments, null, 2)};

export const HISTORICAL_TEAMS: TeamSeason[] = ${JSON.stringify(teams, null, 2)};

export const HISTORICAL_COACHES: CoachVersion[] = ${JSON.stringify(coaches, null, 2)};

export const HISTORICAL_PLAYERS: PlayerVersion[] = ${JSON.stringify(players, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/historicalData.ts'), tsContent, 'utf8');
console.log(`Successfully generated src/data/historicalData.ts!`);
console.log(`- Tournaments: ${tournaments.length}`);
console.log(`- Teams: ${teams.length}`);
console.log(`- Coaches: ${coaches.length}`);
console.log(`- Players: ${players.length}`);
