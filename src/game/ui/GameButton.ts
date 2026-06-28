import Phaser from 'phaser';
import { darkText } from './TextStyles';

export class GameButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private widthValue: number;
  private heightValue: number;
  private colorValue: number;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, width = 280, height = 58, color = 0x8fd3ff) {
    super(scene, x, y);
    scene.add.existing(this);
    this.widthValue = width;
    this.heightValue = height;
    this.colorValue = color;

    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, darkText(height >= 64 ? 19 : 17)).setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.draw(false);

    const hitW = Math.max(width + 34, 112);
    const hitH = Math.max(height + 28, 64);
    this.setSize(hitW, hitH);
    this.setInteractive(new Phaser.Geom.Rectangle(-hitW / 2, -hitH / 2, hitW, hitH), Phaser.Geom.Rectangle.Contains);
    this.input!.cursor = 'pointer';

    this.on('pointerdown', () => { this.setScale(0.98); this.draw(true); });
    this.on('pointerup', () => { this.setScale(1); this.draw(false); });
    this.on('pointerout', () => { this.setScale(1); this.draw(false); });
    this.on('pointercancel', () => { this.setScale(1); this.draw(false); });
  }

  private draw(pressed: boolean): void {
    const width = this.widthValue;
    const height = this.heightValue;
    const color = this.colorValue;
    this.bg.clear();
    this.bg.fillStyle(0x000000, pressed ? 0.2 : 0.28);
    this.bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 8, width, height, 22);
    this.bg.fillGradientStyle(0xffffff, 0xffffff, color, color, 1, 0.96, 1, 0.94);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 22);
    this.bg.lineStyle(3, 0xffffff, 0.68);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 22);
    this.bg.lineStyle(1, 0x07152f, 0.18);
    this.bg.strokeRoundedRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, 18);
    this.bg.fillStyle(0xffffff, pressed ? 0.16 : 0.32);
    this.bg.fillRoundedRect(-width / 2 + 16, -height / 2 + 8, width - 32, 13, 8);
  }
}
