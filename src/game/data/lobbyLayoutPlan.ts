export const LOBBY_LAYOUT_PLAN_VERSION = '1.0.53' as const;

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
  { id: 'topHud', label: '상단 브랜드 HUD', x: 195, y: 54, width: 354, height: 86, rule: '건물 터치존과 겹치지 않음' },
  { id: 'settings', label: '설정 버튼', x: 352, y: 116, width: 58, height: 58, rule: '오른손 엄지 터치 영역 유지' },
  { id: 'heroHome', label: '주인공/고양이 홈', x: 178, y: 566, width: 112, height: 152, rule: '중앙 주인공이 건물 이름표에 묻히지 않음' },
  { id: 'edgeColumns', label: '좌우 끝 건물 컬럼', x: 195, y: 508, width: 374, height: 462, rule: '좌우 끝 공간까지 쓰되 터치존은 겹치지 않음' },
  { id: 'bottomHint', label: '하단 힌트 패널', x: 195, y: 782, width: 350, height: 88, rule: '하단 세이프 영역과 겹치지 않음' }
] as const;

export const LOBBY_LAYOUT_GUARDS = [
  'fixed camera one-screen diorama',
  '1080x1920 premium background must use cover composition, not forced stretch',
  'all building touch zones are separate from each other',
  'hero and black cat remain visually centered',
  'open/planned/locked building assignment must be visible',
  'no SVG and no emoji-only production asset dependency',
  'premium 1254 PNG buildings must be aspect-fit into visual boxes without forced stretch',
  'scene navigation must pass through NavigationSystem.safeStart or safeRestart',
  'route ribbon must not overlap the top HUD, settings button, or building touch zones',
  'mobile text should keep a readable minimum size on 390px wide screens',
  'village buildings should use left/right edge columns with enough center breathing room'
] as const;

export const LOBBY_DESIGN_CHECKS = [
  'building state chip is visible for open/recommended/locked states',
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
  'exit-real-close-v153'
] as const;


export const LOBBY_PREMIUM_VISUAL_FIT_AUDIT = [
  'building_castle/library/lab/shop/school/forest/event/harbor/plaza are square 1254 PNG cutouts after 1.0.46',
  '1.0.51 renders those square assets with fitImageToBox instead of setDisplaySize(width,height) stretch',
  'bottom row nameplates stay above y=746 bottom hint safe zone',
  'event READY badge is offset inward so READY n does not collide with forest/harbor chips',
  'npc_merchant and npc_town_cat use aspect-fit readable sizes after premium asset import'
] as const;

export const MIN_TOUCH_SIZE = 44;

export function rectsOverlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
  return Math.abs(a.x - b.x) * 2 < a.width + b.width && Math.abs(a.y - b.y) * 2 < a.height + b.height;
}

export const LOBBY_VISIBLE_ASSET_ROUTE_AUDIT = [
  '1.0.53 keeps premium lobby assets and UI-only selected assets self-contained in patch ZIPs',
  'IntroLoadingScene loads public assets with BASE_URL and CARDVILLE_ASSET_VERSION cache busting',
  'GameButton defaults to premium vector CTA styling instead of old baked button skins',
  'GameButton disabled state remains styled and readable instead of looking broken',
  'major scene transitions are guarded against duplicate taps and modal leftovers',
  'exit flow attempts real close only and never sends the player to a blank page',
  'button and panel text use mobile-readable minimum sizing'
] as const;
