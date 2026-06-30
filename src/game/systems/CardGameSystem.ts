import Phaser from 'phaser';

export const CARDVILLE_WORD_CARD_UI_TAG = 'word-card-ui-frame-v157' as const;
export const CARDVILLE_CARD_GAME_PERFORMANCE_TAG = 'card-game-performance-v157' as const;
export const CARDVILLE_MOBILE_CARD_LAYOUT_TAG = 'mobile-card-layout-v157' as const;

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
