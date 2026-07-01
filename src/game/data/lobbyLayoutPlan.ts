export const LOBBY_LAYOUT_PLAN_VERSION = '1.0.72' as const;

export type LobbySafeZone = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rule: string;
};

export const LOBBY_SAFE_ZONES: readonly LobbySafeZone[] = [
  { id: 'topHud', label: '상단 브랜드 HUD', x: 129, y: 38, width: 230, height: 52, rule: '성/추천 리본/설정 버튼과 겹치지 않음' },
  { id: 'album', label: '앨범 버튼', x: 288, y: 38, width: 74, height: 48, rule: '상단 HUD 오른쪽 독립 버튼' },
  { id: 'settings', label: '설정 버튼', x: 351, y: 38, width: 50, height: 50, rule: '오른쪽 상단 고정, 추천 리본과 분리' },
  { id: 'routeRibbon', label: '추천 루트 리본', x: 195, y: 96, width: 374, height: 28, rule: '건물 그림 위를 덮지 않는 상단 얇은 안내' },
  { id: 'buildingField', label: '건물/NPC 필드', x: 195, y: 492, width: 390, height: 658, rule: '좌우 끝 공간까지 쓰되 HUD와 하단 힌트 미겹침' },
  { id: 'heroHome', label: '주인공/고양이 홈', x: 178, y: 588, width: 112, height: 136, rule: '중앙 주인공이 건물 이름표와 하단 HUD에 묻히지 않음' },
  { id: 'bottomHint', label: '하단 힌트 패널', x: 195, y: 826, width: 344, height: 34, rule: '하단 세이프 영역 전용, 건물 이름표와 분리' }
] as const;

export const LOBBY_LAYOUT_GUARDS = [
  'fixed camera one-screen diorama',
  '1080x1920 premium background must use cover composition, not forced stretch',
  'all building touch zones are separate from each other',
  'hero and black cat remain visually centered',
  'building labels avoid OPEN/LOCK text and use only recommendation/reward chips',
  'no SVG and no emoji-only production asset dependency',
  'premium 1254 PNG buildings must be aspect-fit into visual boxes without forced stretch',
  'scene navigation must pass through NavigationSystem.safeStart or safeRestart',
  'route ribbon must not overlap the top HUD, settings button, or building touch zones',
  'mobile text should keep a readable minimum size on 390px wide screens',
  'village buildings should use left/right edge columns with enough center breathing room',
  'critical lobby background and building textures use stable PNG master loading',
  'scene navigation includes native timer fallback so input locks cannot linger',
  'selected 1.0.55 lobby/NPC/building/background assets must be paired with layout and backdrop checks',
  'scene-premium-backdrop-v155 must be used by gameplay scenes with content-specific backgrounds',
  '1.0.56 separates top HUD, route ribbon, settings, building field, and bottom hint into non-overlap safe zones',
  'user-lobby-asset-assignment-v156 locks uploaded castle/library/lab/forest building art to runtime building keys',
  'user-lobby-npc-visible-v156 makes uploaded shopkeeper/alchemist/scholar/forest-sage NPCs visible and larger',
  '1.0.59 blocks lobby entry until critical PNG building/NPC textures finish loading',
  '1.0.59 removes visible patch/update/debug text from the bottom lobby HUD',
  '1.0.60 keeps intro video looping until assets complete',
  '1.0.60 resets lobby input state after returning from buildings',
  '1.0.60 removes OPEN/LOCK building status text from the village',
  'intro-video-holds-until-assets-v160',
  'lobby-input-reset-v160',
  'lobby-fullscreen-spread-v160',
  'lobby-edge-to-edge-spread-v160',
  'lobby-edge-npc-spread-v160',
  'responsive-mobile-viewport-v162',
  'safe-area-phone-layout-v161',
  'not-screenshot-fixed-layout-v161',
  'lobby-force-load-gate-v159',
  'lobby-screenshot-repair-v159',
  'lobby-no-bottom-patch-text-v159',
  'lobby-wide-village-spacing-v159',
  'intro-video-holds-until-assets-v160',
  'lobby-input-reset-v160',
  'lobby-fullscreen-spread-v160',
  'lobby-edge-to-edge-spread-v160',
  'lobby-edge-npc-spread-v160',
  'responsive-mobile-viewport-v162',
  'safe-area-phone-layout-v161',
  'not-screenshot-fixed-layout-v161'
] as const;

export const LOBBY_DESIGN_CHECKS = [
  'building status chip is limited to recommendation/reward states, not OPEN/LOCK labels',
  'ambient loops must pass through QualitySystem gates',
  'large button labels use fitTextSize and compactText before rendering',
  'double taps should not trigger duplicate scene navigation',
  'motion-reduced users keep readable static scene without flashing shake',
  'premium buildings use visualWidth/visualHeight and fitImageToBox to prevent squashed art',
  'new merchant and town cat NPCs must remain large enough to read but outside bottom HUD',
  '1.0.51 village buildings render larger with readable premium stage shadows and no empty texture feel',
  'village-readable-building-scale-v150',
  'screen-ui-stability-pass-v152',
  'scene-navigation-guard-v152',
  'mobile-readable-layout-v153',
  'village-edge-spacing-v153',
  'exit-real-close-v153',
  'lobby-building-visible-png-v154',
  'lobby-critical-png-runtime-v154',
  'scene-navigation-no-freeze-v154',
  'mobile-readable-text-v154',
  'mobile-readable-text-v155',
  'scene-premium-backdrop-v155',
  'lobby-art-placement-v155',
  'lobby-ui-nonoverlap-v156',
  'lobby-user-assets-visible-v156',
  'user-lobby-asset-assignment-v156',
  'user-lobby-npc-visible-v156',
  'lobby-force-load-gate-v159',
  'lobby-screenshot-repair-v159',
  'lobby-no-bottom-patch-text-v159',
  'lobby-wide-village-spacing-v159',
  'intro-video-holds-until-assets-v160',
  'lobby-input-reset-v160',
  'lobby-fullscreen-spread-v160',
  'lobby-edge-to-edge-spread-v160',
  'lobby-edge-npc-spread-v160',
  'responsive-mobile-viewport-v162',
  'safe-area-phone-layout-v161',
  'not-screenshot-fixed-layout-v161'
] as const;

export const LOBBY_PREMIUM_VISUAL_FIT_AUDIT = [
  'building_castle/library/lab/shop/school/forest/event/harbor/plaza are square 1254 PNG cutouts after 1.0.46',
  '1.0.51 renders those square assets with fitImageToBox instead of setDisplaySize(width,height) stretch',
  '1.0.59 bottom row nameplates stay above the compact y=808 hint panel',
  '1.0.60 moves side buildings and NPCs closer to the screen edges without overlapping touch zones',
  '1.0.63 maps lobby buildings/NPCs/props through real viewport width, height, and safe-area insets instead of one screenshot size',
  'event READY badge is offset inward so READY n does not collide with forest/harbor chips',
  'npc_merchant and npc_forest_sage use aspect-fit readable sizes after premium asset import',
  '1.0.55 selected castle/library/lab/forest buildings use new 1254 RGBA cutouts',
  '1.0.55 scene backdrops use library/lab/forest/shop/palace variants for screen-specific readability',
  '1.0.56 selected user assets are larger, unobscured, and kept out of top/bottom UI layers'
] as const;

export const MIN_TOUCH_SIZE = 44;

export function rectsOverlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
  return Math.abs(a.x - b.x) * 2 < a.width + b.width && Math.abs(a.y - b.y) * 2 < a.height + b.height;
}

export const LOBBY_VISIBLE_ASSET_ROUTE_AUDIT = [
  '1.0.55 keeps premium lobby assets and UI-only selected assets self-contained in patch ZIPs',
  'IntroLoadingScene loads public assets with BASE_URL and CARDVILLE_ASSET_VERSION cache busting',
  'GameButton defaults to premium vector CTA styling instead of old baked button skins',
  'GameButton disabled state remains styled and readable instead of looking broken',
  'major scene transitions are guarded against duplicate taps and modal leftovers',
  'exit flow attempts real close only and never sends the player to a blank page',
  'button and panel text use mobile-readable minimum sizing',
  '1.0.55 uses PNG source for critical lobby assets instead of runtime WebP substitution',
  '1.0.55 lobby transition uses scene-navigation-no-freeze-v154 native timer fallback',
  '1.0.55 art placement uses lobby-art-placement-v155 and scene-premium-backdrop-v155',
  '1.0.56 keeps lobby HUD/UI in safe lanes so building art and NPCs stay visible',
  '1.0.57 keeps larger mobile text paired with resized card-game panels and bottom rails',
  'mobile-card-layout-v157 protects word cards, answer buttons, and bottom controls from overlap'
] as const;

export const CARDVILLE_SCREEN_UI_AUDIT_V158 = 'screen-ui-redesign-v158 · playfield-safezone-v158 · mobile-touch-target-v158' as const;
