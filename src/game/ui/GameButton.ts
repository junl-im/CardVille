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
  private pressedInside = false;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, width = 280, height = 58, color = 0x8fd3ff) {
    super(scene, x, y);
    scene.add.existing(this);
    this.widthValue = width;
    this.heightValue = height;
    this.colorValue = color;

    // 1.0.8의 너무 넓은 hit area가 인접 버튼을 가로챌 수 있어서
    // 1.0.9부터는 보이는 버튼과 거의 같은 범위만 터치하게 한다.
    const hitW = Math.max(width + 10, 48);
    const hitH = Math.max(height + 10, 48);

    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, darkText(height >= 64 ? 20 : 17)).setOrigin(0.5);
    this.hitZone = scene.add.zone(0, 0, hitW, hitH)
      .setOrigin(0.5)
      .setName(`hit:${text}`)
      .setInteractive({ useHandCursor: true });

    this.add([this.bg, this.label, this.hitZone]);
    this.setSize(hitW, hitH);
    this.draw(false);

    this.hitZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      this.pressedInside = true;
      this.setScale(0.985);
      this.draw(true);
      this.emit('buttondown', pointer);
    });

    this.hitZone.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      const shouldClick = this.pressedInside;
      this.pressedInside = false;
      this.resetVisual();
      if (!shouldClick) return;
      this.emit('pointerup', pointer);
      this.emit('click', pointer);
      this.action?.();
    });

    this.hitZone.on('pointerout', () => {
      this.pressedInside = false;
      this.resetVisual();
    });
    this.hitZone.on('pointercancel', () => {
      this.pressedInside = false;
      this.resetVisual();
    });

    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
      const debug = scene.add.rectangle(0, 0, hitW, hitH, 0x00ff66, 0.14).setStrokeStyle(1, 0x00ff66, 0.75);
      this.add(debug);
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
    this.bg.fillStyle(0x000000, pressed ? 0.16 : 0.28);
    this.bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 8, width, height, 20);
    this.bg.fillGradientStyle(0xffffff, 0xffffff, color, color, 1, 0.98, 1, 0.96);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
    this.bg.lineStyle(3, 0xffffff, 0.76);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 20);
    this.bg.lineStyle(1, 0x07152f, 0.22);
    this.bg.strokeRoundedRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, 16);
    this.bg.fillStyle(0xffffff, pressed ? 0.12 : 0.32);
    this.bg.fillRoundedRect(-width / 2 + 16, -height / 2 + 8, width - 32, 12, 8);
  }
}
