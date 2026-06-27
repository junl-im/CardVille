import Phaser from 'phaser';

export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, radius = 28): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 0.13);
  g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
  g.lineStyle(1, 0xffffff, 0.28);
  g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);
  g.fillStyle(0xffffff, 0.08);
  g.fillRoundedRect(x - w / 2 + 12, y - h / 2 + 12, w - 24, 20, 12);
  return g;
}
