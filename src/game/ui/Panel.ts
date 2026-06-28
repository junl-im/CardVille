import Phaser from 'phaser';

export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, radius = 28): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();

  g.fillStyle(0x000000, 0.26);
  g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 8, w, h, radius);

  g.fillGradientStyle(0x102854, 0x153a72, 0x07152f, 0x091936, 0.88, 0.84, 0.92, 0.9);
  g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);

  g.lineStyle(2, 0xffffff, 0.38);
  g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);

  g.lineStyle(1, 0x8fd3ff, 0.28);
  g.strokeRoundedRect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, Math.max(8, radius - 4));

  g.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.24, 0.15, 0.02, 0.02);
  g.fillRoundedRect(x - w / 2 + 14, y - h / 2 + 12, w - 28, 22, 12);

  return g;
}
