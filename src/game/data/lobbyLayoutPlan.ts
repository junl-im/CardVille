export const LOBBY_LAYOUT_PLAN_VERSION = '1.0.39' as const;

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
  { id: 'bottomHint', label: '하단 힌트 패널', x: 195, y: 782, width: 350, height: 88, rule: '하단 세이프 영역과 겹치지 않음' }
] as const;

export const LOBBY_LAYOUT_GUARDS = [
  'fixed camera one-screen diorama',
  '1080x1920 premium background must use cover composition, not forced stretch',
  'all building touch zones are separate from each other',
  'hero and black cat remain visually centered',
  'open/planned/locked building assignment must be visible',
  'no SVG and no emoji-only production asset dependency'
] as const;

export const LOBBY_DESIGN_CHECKS = [
  'building state chip is visible for open/recommended/locked states',
  'ambient loops must pass through QualitySystem gates',
  'large button labels use fitTextSize and compactText before rendering',
  'double taps should not trigger duplicate scene navigation',
  'motion-reduced users keep readable static scene without flashing shake'
] as const;

export const MIN_TOUCH_SIZE = 44;

export function rectsOverlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
  return Math.abs(a.x - b.x) * 2 < a.width + b.width && Math.abs(a.y - b.y) * 2 < a.height + b.height;
}
