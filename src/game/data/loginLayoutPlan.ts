export const LOGIN_LAYOUT_PLAN_VERSION = '1.0.32' as const;

export type LoginControlRect = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minGap: number;
};

export const LOGIN_PANEL = {
  x: 195,
  y: 670,
  width: 342,
  height: 300,
  top: 520,
  bottom: 820
} as const;

export const LOGIN_CONTROL_RECTS: readonly LoginControlRect[] = [
  { id: 'status', label: '상태 문구', x: 195, y: 588, width: 316, height: 22, minGap: 12 },
  { id: 'guest', label: '게임 시작', x: 195, y: 640, width: 316, height: 58, minGap: 12 },
  { id: 'google', label: 'Google 로그인', x: 195, y: 708, width: 300, height: 50, minGap: 10 },
  { id: 'email', label: '이메일', x: 118, y: 766, width: 144, height: 46, minGap: 8 },
  { id: 'signup', label: '가입', x: 272, y: 766, width: 144, height: 46, minGap: 8 }
] as const;

export const LOGIN_LAYOUT_GUARDS = [
  '첫 CTA는 Phaser LoginScene에서만 표시',
  '버튼 히트존 세로 겹침 없음',
  '이메일/가입 버튼 가로 간격 유지',
  '상태 문구는 기본 시작 버튼 위에 고정',
  '하단 CTA 그룹은 모바일 세이프 영역 안에 유지'
] as const;

export function rectsOverlap(a: LoginControlRect, b: LoginControlRect): boolean {
  return Math.abs(a.x - b.x) * 2 < a.width + b.width && Math.abs(a.y - b.y) * 2 < a.height + b.height;
}
