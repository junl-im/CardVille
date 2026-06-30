import Phaser from 'phaser';
import { responsiveSurfaceBox, RESPONSIVE_SURFACE_SPREAD_TAG } from '../systems/LayoutSystem';

export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, radius = 28): Phaser.GameObjects.Graphics {
  const box = responsiveSurfaceBox(scene, x, y, w, h);
  x = box.x;
  y = box.y;
  w = box.width;
  h = box.height;
  const g = scene.add.graphics().setName(RESPONSIVE_SURFACE_SPREAD_TAG);

  g.fillStyle(0x000000, 0.30);
  g.fillRoundedRect(x - w / 2 + 5, y - h / 2 + 9, w, h, radius);

  // Less transparent than the previous glass panel: calmer eyes, better readability.
  g.fillGradientStyle(0x132c5c, 0x173b76, 0x0b1c3d, 0x0b1833, 0.96, 0.96, 0.98, 0.98);
  g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);

  g.lineStyle(3, 0xffffff, 0.42);
  g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);

  g.lineStyle(1, 0x8fd3ff, 0.34);
  g.strokeRoundedRect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8, Math.max(8, radius - 5));

  g.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.22, 0.12, 0.02, 0.02);
  g.fillRoundedRect(x - w / 2 + 16, y - h / 2 + 13, w - 32, 20, 12);

  return g;
}
