import Phaser from 'phaser';
import { layout } from './LayoutSystem';

export const CARDVILLE_SCREEN_UI_REDESIGN_TAG = 'screen-ui-redesign-v158' as const;
export const CARDVILLE_TOUCH_TARGET_TAG = 'mobile-touch-target-v158' as const;
export const CARDVILLE_PLAYFIELD_SAFEZONE_TAG = 'playfield-safezone-v158' as const;

export type MobileSceneFrame = {
  centerX: number;
  left: number;
  right: number;
  width: number;
  titleY: number;
  subtitleY: number;
  statusY: number;
  contentTop: number;
  contentBottom: number;
  actionY: number;
  bottomNoteY: number;
};

export function mobileSceneFrame(scene: Phaser.Scene): MobileSceneFrame {
  const l = layout(scene);
  const left = l.visibleX + 18;
  const right = l.visibleX + l.visibleWidth - 18;
  return {
    centerX: l.visibleX + l.visibleWidth / 2,
    left,
    right,
    width: right - left,
    titleY: 88,
    subtitleY: 120,
    statusY: 166,
    contentTop: 176,
    contentBottom: 704,
    actionY: 770,
    bottomNoteY: 820
  };
}

export function drawMobileActionDock(scene: Phaser.Scene, y = 744, height = 112): Phaser.GameObjects.Graphics {
  const l = layout(scene);
  const g = scene.add.graphics().setName(CARDVILLE_SCREEN_UI_REDESIGN_TAG);
  g.fillStyle(0x061127, 0.82);
  g.fillRoundedRect(l.visibleX + 12, y - height / 2, l.visibleWidth - 24, height, 24);
  g.lineStyle(2, 0xffffff, 0.16);
  g.strokeRoundedRect(l.visibleX + 12, y - height / 2, l.visibleWidth - 24, height, 24);
  g.fillStyle(0xffffff, 0.06);
  g.fillRoundedRect(l.visibleX + 26, y - height / 2 + 10, l.visibleWidth - 52, 12, 8);
  return g;
}

export function drawReadablePanel(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color = 0x07142c, alpha = 0.84): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics().setName(CARDVILLE_PLAYFIELD_SAFEZONE_TAG);
  g.fillStyle(color, alpha);
  g.fillRoundedRect(x - width / 2, y - height / 2, width, height, 28);
  g.lineStyle(2, 0xffffff, 0.18);
  g.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 28);
  return g;
}

export function assertNoVerticalOverlap(scene: Phaser.Scene, label: string, ranges: Array<[string, number, number]>): void {
  for (let i = 0; i < ranges.length; i += 1) {
    for (let j = i + 1; j < ranges.length; j += 1) {
      const [aName, aTop, aBottom] = ranges[i];
      const [bName, bTop, bBottom] = ranges[j];
      const overlap = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);
      if (overlap > 0) {
        console.warn('[CardVille] screen overlap risk', { label, aName, bName, overlap });
      }
    }
  }
}
