import Phaser from 'phaser';
import { responsiveSurfaceBox, RESPONSIVE_SURFACE_SPREAD_TAG } from '../systems/LayoutSystem';
export const CARDVILLE_PANEL_SEAM_FIX_TAG = 'panel-seamless-surface-v163' as const;
export const CARDVILLE_PANEL_LINELESS_TAG = 'panel-lineless-surface-v164' as const;

export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, radius = 28): Phaser.GameObjects.Graphics {
  const box = responsiveSurfaceBox(scene, x, y, w, h);
  x = box.x;
  y = box.y;
  w = box.width;
  h = box.height;
  const g = scene.add.graphics().setName(`${RESPONSIVE_SURFACE_SPREAD_TAG}:${CARDVILLE_PANEL_SEAM_FIX_TAG}:${CARDVILLE_PANEL_LINELESS_TAG}`);

  g.fillStyle(0x000000, 0.30);
  g.fillRoundedRect(x - w / 2 + 5, y - h / 2 + 9, w, h, radius);

  // Less transparent than the previous glass panel: calmer eyes, better readability.
  g.fillGradientStyle(0x132c5c, 0x173b76, 0x0b1c3d, 0x0b1833, 0.96, 0.96, 0.98, 0.98);
  g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);

  g.lineStyle(1, 0xffffff, 0.10);
  g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);

  return g;
}
