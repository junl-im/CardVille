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
    this.bg.fillStyle(0x000000, 0.20);
    this.bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 10, width, height, radius);
    this.bg.fillGradientStyle(0xffffff, 0xffffff, 0xc9edff, 0xffffff, alpha);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.lineStyle(2, 0xffffff, 0.32);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.lineStyle(1, 0x8fd3ff, 0.34);
    this.bg.strokeRoundedRect(-width / 2 + 5, -height / 2 + 5, width - 10, height - 10, Math.max(1, radius - 5));
    this.bg.fillStyle(0xffffff, 0.10);
    this.bg.fillRoundedRect(-width / 2 + 14, -height / 2 + 12, width - 28, Math.min(46, height / 3), Math.max(1, radius - 11));
    this.bg.fillStyle(0x8fd3ff, 0.045);
    this.bg.fillCircle(width / 2 - 48, -height / 2 + 48, 42);
  }
}
