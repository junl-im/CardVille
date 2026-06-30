import Phaser from 'phaser';

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;
export const RESPONSIVE_MOBILE_LAYOUT_TAG = 'responsive-mobile-viewport-v162' as const;
export const RESPONSIVE_SURFACE_SPREAD_TAG = 'responsive-surface-spread-v162' as const;

export type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

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
  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;
  responsiveScale: number;
};

export type ResponsiveSurfaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let cachedInsets: SafeAreaInsets | null = null;
let cachedInsetAt = 0;

function readCssPx(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function safeAreaInsets(): SafeAreaInsets {
  if (typeof document === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
  const now = Date.now();
  if (cachedInsets && now - cachedInsetAt < 500) return cachedInsets;
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  probe.style.inset = '0';
  probe.style.paddingTop = 'env(safe-area-inset-top)';
  probe.style.paddingRight = 'env(safe-area-inset-right)';
  probe.style.paddingBottom = 'env(safe-area-inset-bottom)';
  probe.style.paddingLeft = 'env(safe-area-inset-left)';
  document.body.appendChild(probe);
  const style = window.getComputedStyle(probe);
  cachedInsets = {
    top: readCssPx(style.paddingTop),
    right: readCssPx(style.paddingRight),
    bottom: readCssPx(style.paddingBottom),
    left: readCssPx(style.paddingLeft)
  };
  cachedInsetAt = now;
  probe.remove();
  return cachedInsets;
}

export function visibleBounds(scene?: Phaser.Scene): Pick<SafeLayout, 'visibleX' | 'visibleY' | 'visibleWidth' | 'visibleHeight' | 'extraX' | 'extraY'> {
  const gameSize = scene?.scale?.gameSize;
  let visibleWidth = Math.max(GAME_WIDTH, gameSize?.width ?? GAME_WIDTH);
  let visibleHeight = Math.max(GAME_HEIGHT, gameSize?.height ?? GAME_HEIGHT);

  // On a few mobile browser / PWA combinations Phaser can report the base game size
  // during the first tick while visualViewport already knows the real phone aspect.
  // Use that aspect only to expand the virtual camera; never shrink below 390x844.
  if (typeof window !== 'undefined' && window.visualViewport) {
    const viewport = window.visualViewport;
    if (viewport.width > 0 && viewport.height > 0) {
      const aspect = viewport.width / viewport.height;
      const widthFromBaseHeight = GAME_HEIGHT * aspect;
      const heightFromBaseWidth = GAME_WIDTH / Math.max(0.1, aspect);
      visibleWidth = Math.max(visibleWidth, widthFromBaseHeight);
      visibleHeight = Math.max(visibleHeight, heightFromBaseWidth);
    }
  }

  const extraX = Math.max(0, (visibleWidth - GAME_WIDTH) / 2);
  const extraY = Math.max(0, (visibleHeight - GAME_HEIGHT) / 2);
  return { visibleX: -extraX, visibleY: -extraY, visibleWidth, visibleHeight, extraX, extraY };
}

export function responsiveX(scene: Phaser.Scene | undefined, baseX: number): number {
  const b = visibleBounds(scene);
  return b.visibleX + (baseX / GAME_WIDTH) * b.visibleWidth;
}

export function responsiveY(scene: Phaser.Scene | undefined, baseY: number): number {
  const b = visibleBounds(scene);
  return b.visibleY + (baseY / GAME_HEIGHT) * b.visibleHeight;
}

export function responsiveScale(scene: Phaser.Scene | undefined, min = 0.96, max = 1.12): number {
  const b = visibleBounds(scene);
  const scale = Math.min(b.visibleWidth / GAME_WIDTH, b.visibleHeight / GAME_HEIGHT);
  return clamp(scale, min, max);
}

export function responsivePoint(scene: Phaser.Scene | undefined, baseX: number, baseY: number): { x: number; y: number } {
  return { x: responsiveX(scene, baseX), y: responsiveY(scene, baseY) };
}

export function viewportCenterX(scene?: Phaser.Scene): number {
  const b = visibleBounds(scene);
  return b.visibleX + b.visibleWidth / 2;
}

export function viewportCenterY(scene?: Phaser.Scene): number {
  const b = visibleBounds(scene);
  return b.visibleY + b.visibleHeight / 2;
}

export function responsiveSurfaceWidth(scene: Phaser.Scene | undefined, baseWidth: number, margin = 18, maxExtra = 178): number {
  const b = visibleBounds(scene);
  const insets = safeAreaInsets();
  const available = Math.max(baseWidth, b.visibleWidth - Math.max(margin * 2, insets.left + insets.right + margin * 2));
  const extra = Math.min(maxExtra, b.extraX * 1.72);
  return clamp(baseWidth + extra, baseWidth, available);
}

export function responsiveSurfaceBox(scene: Phaser.Scene | undefined, x: number, y: number, width: number, height: number, margin = 18): ResponsiveSurfaceBox {
  const centerX = Math.abs(x - GAME_WIDTH / 2) <= 1 ? viewportCenterX(scene) : x;
  return {
    x: centerX,
    y,
    width: responsiveSurfaceWidth(scene, width, margin),
    height
  };
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
  const insets = safeAreaInsets();
  const sideWidth = 56;
  const sideLeft = bounds.visibleX + Math.max(8, insets.left + 8);
  const sideX = sideLeft + sideWidth / 2;
  const boardLeft = sideLeft + sideWidth + 8;
  const boardRight = bounds.visibleX + bounds.visibleWidth - Math.max(8, insets.right + 8);
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
    cachedInsets = null;
    const bounds = visibleBounds(scene);
    scene.cameras.main.setScroll(bounds.visibleX, bounds.visibleY);
    scene.cameras.main.setBackgroundColor('#071126');
  };
  apply();
  scene.scale.off(Phaser.Scale.Events.RESIZE, apply);
  scene.scale.on(Phaser.Scale.Events.RESIZE, apply);
  if (typeof window !== 'undefined' && window.visualViewport) {
    window.visualViewport.removeEventListener('resize', apply);
    window.visualViewport.addEventListener('resize', apply);
  }
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.scale.off(Phaser.Scale.Events.RESIZE, apply);
    if (typeof window !== 'undefined' && window.visualViewport) window.visualViewport.removeEventListener('resize', apply);
  });
}

export function layout(scene?: Phaser.Scene): SafeLayout {
  const bounds = visibleBounds(scene);
  const insets = safeAreaInsets();
  const sideInset = Math.max(10, insets.left + 10, insets.right + 10);
  return {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    cx: GAME_WIDTH / 2,
    cy: GAME_HEIGHT / 2,
    top: bounds.visibleY + Math.max(18, insets.top + 18),
    bottom: bounds.visibleY + bounds.visibleHeight - Math.max(20, insets.bottom + 20),
    side: sideInset,
    boardLeft: playArea(scene).boardLeft,
    boardRight: playArea(scene).boardRight,
    boardWidth: playArea(scene).boardWidth,
    safeTop: insets.top,
    safeBottom: insets.bottom,
    safeLeft: insets.left,
    safeRight: insets.right,
    responsiveScale: responsiveScale(scene),
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
