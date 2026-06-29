import Phaser from 'phaser';
import { darkText } from './TextStyles';

export type ButtonAction = () => void;

function chooseButtonSkin(scene: Phaser.Scene, width: number): { normal: string; press: string } | null {
  const size = width >= 240 ? 'Large' : width >= 130 ? 'Medium' : 'Small';
  const normal = `assetButton${size}`;
  const press = `assetButton${size}Press`;
  if (!scene.textures.exists(normal)) return null;
  return { normal, press: scene.textures.exists(press) ? press : normal };
}

export class GameButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private hitZone: Phaser.GameObjects.Zone;
  private skinImage?: Phaser.GameObjects.Image;
  private skin?: { normal: string; press: string } | null;
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

    const hitW = Math.max(width + 6, 48);
    const hitH = Math.max(height + 6, 48);

    this.bg = scene.add.graphics();
    this.skin = chooseButtonSkin(scene, width);
    if (this.skin) {
      this.skinImage = scene.add.image(0, 2, this.skin.normal).setDisplaySize(width + 16, height + 16);
    }
    const labelSize = height >= 58 ? 18 : height <= 46 ? 14 : 16;
    this.label = scene.add.text(0, -1, text, darkText(labelSize)).setOrigin(0.5);
    this.label.setAlign('center');
    this.label.setWordWrapWidth(Math.max(80, width - 34), true);
    this.label.setLineSpacing(-3);
    this.label.setMaxLines(height <= 46 ? 1 : 2);
    this.hitZone = scene.add.zone(0, 0, hitW, hitH)
      .setOrigin(0.5)
      .setName(`hit:${text}`)
      .setInteractive({ useHandCursor: true });

    this.add(this.skinImage ? [this.bg, this.skinImage, this.label, this.hitZone] : [this.bg, this.label, this.hitZone]);
    this.setSize(hitW, hitH);
    this.draw(false);

    this.hitZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      this.pressedInside = true;
      this.setScale(0.982);
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

  getBoundsForAudit(): { width: number; height: number } {
    return { width: this.widthValue, height: this.heightValue };
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
    this.bg.fillStyle(0x000000, pressed ? 0.10 : 0.22);
    this.bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 8, width, height, 20);

    if (this.skinImage && this.skin) {
      this.skinImage.setTexture(pressed ? this.skin.press : this.skin.normal);
      this.skinImage.setDisplaySize(width + 16, height + 16);
      this.skinImage.setAlpha(pressed ? 0.96 : 1);
      this.bg.lineStyle(1, 0xffffff, pressed ? 0.10 : 0.18);
      this.bg.strokeRoundedRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, 18);
      return;
    }

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
