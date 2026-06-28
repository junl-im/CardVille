import Phaser from 'phaser';
import { darkText } from './TextStyles';

export type ButtonAction = () => void;

export class GameButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private hitZone: Phaser.GameObjects.Zone;
  private widthValue: number;
  private heightValue: number;
  private colorValue: number;
  private disabled = false;
  private action?: ButtonAction;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, width = 280, height = 58, color = 0x8fd3ff) {
    super(scene, x, y);
    scene.add.existing(this);
    this.widthValue = width;
    this.heightValue = height;
    this.colorValue = color;

    const hitW = Math.max(width + 58, 160);
    const hitH = Math.max(height + 42, 88);

    this.hitZone = scene.add.zone(0, 0, hitW, hitH)
      .setOrigin(0.5)
      .setName(`hit:${text}`)
      .setInteractive({ useHandCursor: true });

    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, darkText(height >= 64 ? 19 : 17)).setOrigin(0.5);
    this.add([this.hitZone, this.bg, this.label]);
    this.setSize(hitW, hitH);
    this.draw(false);

    this.hitZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      this.setScale(0.985);
      this.draw(true);
      this.emit('buttondown', pointer);
    });

    this.hitZone.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      this.setScale(1);
      this.draw(false);
      this.emit('pointerup', pointer);
      this.emit('click', pointer);
      this.action?.();
    });

    this.hitZone.on('pointerout', () => this.resetVisual());
    this.hitZone.on('pointercancel', () => this.resetVisual());

    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
      const debug = scene.add.rectangle(0, 0, hitW, hitH, 0xff00ff, 0.12).setStrokeStyle(1, 0xff00ff, 0.6);
      this.addAt(debug, 1);
    }
  }

  onClick(action: ButtonAction): this {
    this.action = action;
    return this;
  }

  setDisabled(value: boolean): this {
    this.disabled = value;
    this.alpha = value ? 0.52 : 1;
    this.hitZone.disableInteractive();
    if (!value) this.hitZone.setInteractive({ useHandCursor: true });
    return this;
  }

  setLabel(text: string): this {
    this.label.setText(text);
    return this;
  }

  private resetVisual(): void {
    this.setScale(1);
    this.draw(false);
  }

  private draw(pressed: boolean): void {
    const width = this.widthValue;
    const height = this.heightValue;
    const color = this.colorValue;
    this.bg.clear();
    this.bg.fillStyle(0x000000, pressed ? 0.18 : 0.3);
    this.bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 9, width, height, 22);
    this.bg.fillGradientStyle(0xffffff, 0xffffff, color, color, 1, 0.98, 1, 0.95);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 22);
    this.bg.lineStyle(3, 0xffffff, 0.72);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 22);
    this.bg.lineStyle(1, 0x07152f, 0.2);
    this.bg.strokeRoundedRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, 18);
    this.bg.fillStyle(0xffffff, pressed ? 0.14 : 0.34);
    this.bg.fillRoundedRect(-width / 2 + 16, -height / 2 + 8, width - 32, 13, 8);
  }
}
