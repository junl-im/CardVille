import Phaser from 'phaser';

export const CARDVILLE_WORD_CARD_UI_TAG = 'word-card-ui-frame-v157' as const;
export const CARDVILLE_CARD_GAME_PERFORMANCE_TAG = 'card-game-performance-v158' as const;
export const CARDVILLE_MOBILE_CARD_LAYOUT_TAG = 'mobile-card-layout-v158' as const;
export const CARDVILLE_CARD_ENGINE_UPGRADE_TAG = 'card-engine-upgrade-v158' as const;

export type WordCardFrameVariant = 'front' | 'goal' | 'slot' | 'back' | 'choice';

export function shuffleCopy<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function wordCardFrameKey(scene: Phaser.Scene, variant: WordCardFrameVariant): string | null {
  const preferred = variant === 'back'
    ? ['wordCardBackDesign', 'cardBackLibraryPremium', 'assetCardBackStar']
    : variant === 'slot'
      ? ['wordCardFrameSyllableSlots', 'wordCardFrameLayoutA', 'wordCardFrameLayoutC']
      : variant === 'goal'
        ? ['wordCardFrameLayoutB', 'wordCardFrameLayoutC', 'wordCardFrameLayoutA']
        : variant === 'choice'
          ? ['wordCardFrameLayoutC', 'wordCardFrameLayoutB', 'wordCardFrameLayoutA']
          : ['wordCardFrameLayoutA', 'wordCardFrameLayoutC', 'wordCardFrameLayoutB'];
  return preferred.find((key) => scene.textures.exists(key)) ?? null;
}

export function addAspectFitImage(scene: Phaser.Scene, key: string, x: number, y: number, maxW: number, maxH: number, alpha = 1): Phaser.GameObjects.Image | null {
  if (!scene.textures.exists(key)) return null;
  const source = scene.textures.get(key).getSourceImage() as HTMLImageElement | HTMLCanvasElement | { width?: number; height?: number };
  const sourceW = Math.max(1, Number(source.width) || maxW);
  const sourceH = Math.max(1, Number(source.height) || maxH);
  const scale = Math.min(maxW / sourceW, maxH / sourceH);
  return scene.add.image(x, y, key).setDisplaySize(sourceW * scale, sourceH * scale).setAlpha(alpha).setName(`${CARDVILLE_WORD_CARD_UI_TAG}:${key}`);
}

export function addWordCardFrame(scene: Phaser.Scene, x: number, y: number, w: number, h: number, variant: WordCardFrameVariant, alpha = 1): Phaser.GameObjects.Image | null {
  const key = wordCardFrameKey(scene, variant);
  if (!key) return null;
  return addAspectFitImage(scene, key, x, y, w, h, alpha);
}


export type TapGuard = {
  canTap: () => boolean;
  lock: (durationMs?: number) => void;
  unlock: () => void;
};

export function createTapGuard(scene: Phaser.Scene, defaultDurationMs = 260): TapGuard {
  let lockedUntil = -1;
  return {
    canTap: () => scene.time.now >= lockedUntil,
    lock: (durationMs = defaultDurationMs) => { lockedUntil = Math.max(lockedUntil, scene.time.now + durationMs); },
    unlock: () => { lockedUntil = -1; }
  };
}

export function calculateComboScore(base: number, combo: number, stageBonus = 0): number {
  const safeCombo = Phaser.Math.Clamp(combo, 0, 12);
  return Math.max(0, Math.round(base + safeCombo * 16 + stageBonus));
}
