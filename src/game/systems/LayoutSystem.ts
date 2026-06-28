export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export function hasTouchDebug(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function fitTextSize(text: string, base: number, min = 10): number {
  if (text.length <= 3) return base;
  if (text.length <= 5) return Math.max(min, base - 3);
  if (text.length <= 8) return Math.max(min, base - 6);
  return Math.max(min, base - 9);
}

export function preventBrowserGestures(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('contextmenu', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('touchmove', (event) => {
    if ((event.target as HTMLElement | null)?.closest?.('#app')) event.preventDefault();
  }, { passive: false });
}
