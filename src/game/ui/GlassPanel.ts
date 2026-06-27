import Phaser from 'phaser';

export class GlassPanel extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, radius = 24) {
    super(scene, x, y);
    this.bg = scene.add.graphics();
    this.add(this.bg);
    this.draw(width, height, radius);
    scene.add.existing(this);
  }

  private draw(width: number, height: number, radius: number): void {
    this.bg.clear();
    this.bg.fillStyle(0xffffff, 0.12);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.lineStyle(2, 0xffffff, 0.22);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.lineStyle(1, 0x8fb8ff, 0.25);
    this.bg.strokeRoundedRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, radius - 3);
  }
}
