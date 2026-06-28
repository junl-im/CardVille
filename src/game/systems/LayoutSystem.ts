export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export type SafeLayout = {
  width: number;
  height: number;
  cx: number;
  top: number;
  bottom: number;
  side: number;
  boardLeft: number;
  boardRight: number;
  boardWidth: number;
};

export function layout(): SafeLayout {
  return {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    cx: GAME_WIDTH / 2,
    top: 22,
    bottom: GAME_HEIGHT - 24,
    side: 10,
    boardLeft: 56,
    boardRight: 386,
    boardWidth: 330
  };
}

export function hasTouchDebug(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function fitTextSize(text: string, base: number, min = 10): number {
  const length = [...text].length;
  if (length <= 3) return base;
  if (length <= 5) return Math.max(min, base - 3);
  if (length <= 8) return Math.max(min, base - 6);
  return Math.max(min, base - 9);
}

export function compactText(text: string, max = 8): string {
  return [...text].length > max ? `${[...text].slice(0, max - 1).join('')}…` : text;
}

export function preventBrowserGestures(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('contextmenu', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('touchmove', (event) => {
    if ((event.target as HTMLElement | null)?.closest?.('#app')) event.preventDefault();
  }, { passive: false });
  document.documentElement.style.touchAction = 'none';
  document.body.style.touchAction = 'none';
}
