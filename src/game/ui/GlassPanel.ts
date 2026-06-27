import Phaser from 'phaser';

export class GlassPanel extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, radius = 24, alpha = 0.13) {
    super(scene, x, y);
    this.bg = scene.add.graphics();
    this.add(this.bg);
    this.draw(width, height, radius, alpha);
    scene.add.existing(this);
  }

  private draw(width: number, height: number, radius: number, alpha: number): void {
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.18);
    this.bg.fillRoundedRect(-width / 2 + 3, -height / 2 + 8, width, height, radius);
    this.bg.fillStyle(0xffffff, alpha);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.lineStyle(2, 0xffffff, 0.28);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.lineStyle(1, 0x8fd3ff, 0.32);
    this.bg.strokeRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height - 8, Math.max(1, radius - 4));
    this.bg.fillStyle(0xffffff, 0.08);
    this.bg.fillRoundedRect(-width / 2 + 12, -height / 2 + 10, width - 24, Math.min(42, height / 3), Math.max(1, radius - 10));
  }
}
