export type EntityType = 'team' | 'player' | 'coach' | 'map';
export type PermissionStatus = 'approved' | 'pending_permission' | 'denied';

export interface MediaAsset {
  asset_id: string;
  entity_type: EntityType;
  entity_id: string;
  player_version_id?: string;
  team_season_id?: string;
  tournament_id?: string;
  year: number;
  image_url: string; // Local storage path or verified URL
  source_url: string;
  source_name: string;
  license_type: string;
  copyright_owner: string;
  permission_status: PermissionStatus;
  verification_status: 'verified' | 'partial' | 'unverified';
  date_accessed: string;
  notes: string;
}

// Map Asset
export const AOV_MAP_ASSET: MediaAsset = {
  asset_id: 'MAP_AOV_ANTARIS_2026',
  entity_type: 'map',
  entity_id: 'antaris_battlefield',
  year: 2026,
  image_url: '/assets/maps/aov_antaris_map.png',
  source_url: 'https://arenaofvalor.com',
  source_name: 'Arena of Valor Official Art / User Reference',
  license_type: 'Fair Use / Gameplay Reference',
  copyright_owner: 'Level Infinite / TiMi Studio Group',
  permission_status: 'approved',
  verification_status: 'verified',
  date_accessed: '2026-11-18',
  notes: 'High-res Antaris Battlefield overhead map perspective for draft pin placement'
};

// Known verified/official logos or placeholders
export const MEDIA_REGISTRY: Record<string, MediaAsset> = {
  // Verified Team Logos
  'APL2026_TF': {
    asset_id: 'LOGO_TEAM_FLASH',
    entity_type: 'team',
    entity_id: 'APL2026_TF',
    team_season_id: 'APL2026_TF',
    tournament_id: 'APL2026',
    year: 2026,
    image_url: '/assets/placeholders/team-logo.svg',
    source_url: 'https://liquipedia.net/honorofkings/Team_Flash',
    source_name: 'Team Flash Official Media',
    license_type: 'Editorial / Non-commercial',
    copyright_owner: 'Team Flash',
    permission_status: 'pending_permission',
    verification_status: 'partial',
    date_accessed: '2026-11-18',
    notes: 'Official Team Flash orange bolt logo'
  },
  'APL2026_SGP': {
    asset_id: 'LOGO_SAIGON_PHANTOM',
    entity_type: 'team',
    entity_id: 'APL2026_SGP',
    team_season_id: 'APL2026_SGP',
    tournament_id: 'APL2026',
    year: 2026,
    image_url: '/assets/placeholders/team-logo.svg',
    source_url: 'https://liquipedia.net/honorofkings/Saigon_Phantom',
    source_name: 'Saigon Phantom Official',
    license_type: 'Editorial / Non-commercial',
    copyright_owner: 'Saigon Phantom Esports',
    permission_status: 'pending_permission',
    verification_status: 'partial',
    date_accessed: '2026-11-18',
    notes: 'Saigon Phantom Ghost Crest'
  },
  'APL2026_BT': {
    asset_id: 'LOGO_BACON_TIME',
    entity_type: 'team',
    entity_id: 'APL2026_BT',
    team_season_id: 'APL2026_BT',
    tournament_id: 'APL2026',
    year: 2026,
    image_url: '/assets/placeholders/team-logo.svg',
    source_url: 'https://liquipedia.net/honorofkings/Bacon_Time',
    source_name: 'Bacon Time Official',
    license_type: 'Editorial / Non-commercial',
    copyright_owner: 'Bacon Time',
    permission_status: 'pending_permission',
    verification_status: 'partial',
    date_accessed: '2026-11-18',
    notes: 'Bacon Time Piglet Logo'
  },
  'APL2026_BRU': {
    asset_id: 'LOGO_BURIRAM_UNITED',
    entity_type: 'team',
    entity_id: 'APL2026_BRU',
    team_season_id: 'APL2026_BRU',
    tournament_id: 'APL2026',
    year: 2026,
    image_url: '/assets/placeholders/team-logo.svg',
    source_url: 'https://liquipedia.net/honorofkings/Buriram_United_Esports',
    source_name: 'Buriram United Esports Official',
    license_type: 'Editorial / Non-commercial',
    copyright_owner: 'Buriram United',
    permission_status: 'pending_permission',
    verification_status: 'partial',
    date_accessed: '2026-11-18',
    notes: 'Buriram Castle Crest'
  },
  'APL2026_FW': {
    asset_id: 'LOGO_FLASH_WOLVES',
    entity_type: 'team',
    entity_id: 'APL2026_FW',
    team_season_id: 'APL2026_FW',
    tournament_id: 'APL2026',
    year: 2026,
    image_url: '/assets/placeholders/team-logo.svg',
    source_url: 'https://liquipedia.net/honorofkings/Flash_Wolves',
    source_name: 'Flash Wolves Official',
    license_type: 'Editorial / Non-commercial',
    copyright_owner: 'Flash Wolves',
    permission_status: 'pending_permission',
    verification_status: 'partial',
    date_accessed: '2026-11-18',
    notes: 'Flash Wolves Red/Black Wolf Logo'
  }
};

export function getAssetForEntity(type: EntityType, id: string, year?: number): MediaAsset {
  const existing = MEDIA_REGISTRY[id];
  if (existing) return existing;

  // Fallback placeholder asset
  const placeholderMap: Record<EntityType, string> = {
    team: '/assets/placeholders/team-logo.svg',
    player: '/assets/placeholders/player-portrait.svg',
    coach: '/assets/placeholders/coach-portrait.svg',
    map: '/assets/maps/aov_antaris_map.png'
  };

  return {
    asset_id: `ASSET_${type.toUpperCase()}_${id}`,
    entity_type: type,
    entity_id: id,
    year: year || 2026,
    image_url: placeholderMap[type],
    source_url: 'internal://assets/placeholders',
    source_name: 'AOVDLE Builtin SVG Assets',
    license_type: 'CC0 Public Domain / Internal',
    copyright_owner: 'AOVDLE',
    permission_status: 'approved',
    verification_status: 'verified',
    date_accessed: '2026-11-18',
    notes: 'Standard neutral esports placeholder'
  };
}
