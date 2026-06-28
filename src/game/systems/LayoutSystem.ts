import Phaser from 'phaser';

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export type SafeLayout = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  top: number;
  bottom: number;
  side: number;
  boardLeft: number;
  boardRight: number;
  boardWidth: number;
  visibleX: number;
  visibleY: number;
  visibleWidth: number;
  visibleHeight: number;
  extraX: number;
  extraY: number;
};

export function visibleBounds(scene?: Phaser.Scene): Pick<SafeLayout, 'visibleX' | 'visibleY' | 'visibleWidth' | 'visibleHeight' | 'extraX' | 'extraY'> {
  const gameSize = scene?.scale?.gameSize;
  const visibleWidth = Math.max(GAME_WIDTH, gameSize?.width ?? GAME_WIDTH);
  const visibleHeight = Math.max(GAME_HEIGHT, gameSize?.height ?? GAME_HEIGHT);
  const extraX = Math.max(0, (visibleWidth - GAME_WIDTH) / 2);
  const extraY = Math.max(0, (visibleHeight - GAME_HEIGHT) / 2);
  return { visibleX: -extraX, visibleY: -extraY, visibleWidth, visibleHeight, extraX, extraY };
}


export type PlayArea = {
  sideX: number;
  sideLeft: number;
  sideWidth: number;
  boardLeft: number;
  boardRight: number;
  boardWidth: number;
  boardCenter: number;
};

export function playArea(scene?: Phaser.Scene): PlayArea {
  const bounds = visibleBounds(scene);
  const sideWidth = 56;
  const sideLeft = bounds.visibleX + 8;
  const sideX = sideLeft + sideWidth / 2;
  const boardLeft = sideLeft + sideWidth + 8;
  const boardRight = bounds.visibleX + bounds.visibleWidth - 8;
  const boardWidth = Math.max(300, boardRight - boardLeft);
  return {
    sideX,
    sideLeft,
    sideWidth,
    boardLeft,
    boardRight,
    boardWidth,
    boardCenter: boardLeft + boardWidth / 2
  };
}

export function distributeColumns(left: number, width: number, count: number): number[] {
  const spacing = width / Math.max(1, count);
  return Array.from({ length: count }, (_, index) => left + spacing * (index + 0.5));
}

export function applyResponsiveCamera(scene: Phaser.Scene): void {
  const apply = () => {
    const bounds = visibleBounds(scene);
    scene.cameras.main.setScroll(bounds.visibleX, bounds.visibleY);
    scene.cameras.main.setBackgroundColor('#071126');
  };
  apply();
  scene.scale.off(Phaser.Scale.Events.RESIZE, apply);
  scene.scale.on(Phaser.Scale.Events.RESIZE, apply);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.scale.off(Phaser.Scale.Events.RESIZE, apply));
}

export function layout(scene?: Phaser.Scene): SafeLayout {
  const bounds = visibleBounds(scene);
  return {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    cx: GAME_WIDTH / 2,
    cy: GAME_HEIGHT / 2,
    top: 22,
    bottom: GAME_HEIGHT - 24,
    side: 10,
    boardLeft: playArea(scene).boardLeft,
    boardRight: playArea(scene).boardRight,
    boardWidth: playArea(scene).boardWidth,
    ...bounds
  };
}

export function addFullBleedRect(scene: Phaser.Scene, color: number, alpha = 1): Phaser.GameObjects.Rectangle {
  const b = visibleBounds(scene);
  return scene.add.rectangle(b.visibleX + b.visibleWidth / 2, b.visibleY + b.visibleHeight / 2, b.visibleWidth, b.visibleHeight, color, alpha);
}

export function addCoverImage(scene: Phaser.Scene, key: string, alpha = 1, sourceW = GAME_WIDTH, sourceH = GAME_HEIGHT): Phaser.GameObjects.Image | null {
  if (!scene.textures.exists(key)) return null;
  const b = visibleBounds(scene);
  const scale = Math.max(b.visibleWidth / sourceW, b.visibleHeight / sourceH);
  return scene.add.image(b.visibleX + b.visibleWidth / 2, b.visibleY + b.visibleHeight / 2, key).setDisplaySize(sourceW * scale, sourceH * scale).setAlpha(alpha);
}

export function addFullBleedShade(scene: Phaser.Scene, color: number, alpha: number): Phaser.GameObjects.Rectangle {
  const b = visibleBounds(scene);
  return scene.add.rectangle(b.visibleX + b.visibleWidth / 2, b.visibleY + b.visibleHeight / 2, b.visibleWidth, b.visibleHeight, color, alpha);
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
