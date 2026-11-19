const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HISTORICAL_DATA = path.join(ROOT, 'src/data/historicalData.ts');
const TEAMS_DIR = path.join(ROOT, 'public/assets/teams');
const PLAYERS_DIR = path.join(ROOT, 'public/assets/players');
const MANIFEST_PATH = path.join(ROOT, 'public/assets/media_manifest.json');

const source = fs.readFileSync(HISTORICAL_DATA, 'utf8');
const teamSection = source.slice(source.indexOf('export const HISTORICAL_TEAMS'), source.indexOf('export const HISTORICAL_PLAYERS'));
const playerSection = source.slice(source.indexOf('export const HISTORICAL_PLAYERS'));

const teams = new Set([...teamSection.matchAll(/"team_id":\s*"([^"]+)"/g)].map(match => match[1]));
const players = new Set([...playerSection.matchAll(/"player_id":\s*"([^"]+)"/g)].map(match => match[1]));

function getLocalAssetIds(directory, fileName) {
  if (!fs.existsSync(directory)) return new Set();
  return new Set(fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => fs.existsSync(path.join(directory, entry.name, fileName)))
    .map(entry => entry.name));
}

const teamLogos = getLocalAssetIds(TEAMS_DIR, 'logo.svg');
const playerPortraits = getLocalAssetIds(PLAYERS_DIR, 'portrait.svg');

const missingTeamLogos = [...teams].filter(id => !teamLogos.has(id)).sort();
const missingPlayerPortraits = [...players].filter(id => !playerPortraits.has(id)).sort();

let manifest = [];
if (fs.existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  manifest = manifest.map(asset => {
    if (asset.entity_type === 'team' || asset.entity_type === 'player') {
      const assetPath = path.join(ROOT, 'public', asset.image_url.replace(/^\/+/, '').replace(/\//g, path.sep));
      const isGeneratedPlaceholder = fs.existsSync(assetPath)
        && fs.readFileSync(assetPath, 'utf8').includes('Generated');
      if (isGeneratedPlaceholder) {
        return {
          ...asset,
          verification_status: 'unverified',
          permission_status: 'pending_permission',
          notes: 'Local generated placeholder; awaiting authenticated historical photo/logo verification.'
        };
      }
    }
    return asset;
  });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

const report = {
  audited_at: new Date().toISOString(),
  team_seasons_audited: teams.size,
  local_team_logo_assets: teamLogos.size,
  missing_team_logos: missingTeamLogos,
  player_versions_audited: players.size,
  local_player_portrait_assets: playerPortraits.size,
  missing_player_portraits: missingPlayerPortraits,
  manifest_entries: manifest.length,
};

console.log(JSON.stringify(report, null, 2));
