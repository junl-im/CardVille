import Phaser from 'phaser';
import { GameCardData, Rarity } from '../types/GameData';

type CardPalette = {
  border: number;
  fill: number;
  glow: number;
};

const RARITY_PALETTE: Record<Rarity, CardPalette> = {
  common: { border: 0xf1d8a8, fill: 0xfffbef, glow: 0xffffff },
  rare: { border: 0x8fc9ff, fill: 0xf1f8ff, glow: 0x78c6ff },
  epic: { border: 0xc59cff, fill: 0xf7f0ff, glow: 0xb982ff },
  legendary: { border: 0xffd166, fill: 0xfff7df, glow: 0xffd166 },
};

export class CardView extends Phaser.GameObjects.Container {
  readonly data: GameCardData;
  private readonly widthValue: number;
  private readonly heightValue: number;
  private faceUp = false;
  private locked = false;
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, data: GameCardData) {
    super(scene, x, y);
    this.data = data;
    this.widthValue = width;
    this.heightValue = height;
    this.bg = scene.add.graphics();
    this.label = scene.add
      .text(0, 0, '', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '21px',
        fontStyle: '900',
        color: '#4a2732',
        align: 'center',
        wordWrap: { width: width - 22 },
      })
      .setOrigin(0.5);

    this.add([this.bg, this.label]);
    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });
    this.redraw();
    scene.add.existing(this);
  }

  isLocked(): boolean {
    return this.locked;
  }

  isFaceUp(): boolean {
    return this.faceUp;
  }

  flipUp(): Promise<void> {
    if (this.locked || this.faceUp) return Promise.resolve();
    return this.flipTo(true);
  }

  flipDown(): Promise<void> {
    if (this.locked || !this.faceUp) return Promise.resolve();
    return this.flipTo(false);
  }

  markMatched(): void {
    this.locked = true;
    this.disableInteractive();
    this.scene.tweens.add({
      targets: this,
      alpha: 0.68,
      scale: 0.9,
      y: this.y + 6,
      duration: 240,
      ease: 'Back.easeOut',
    });
  }

  bounceSelected(): void {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 8,
      scale: 1.05,
      duration: 120,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  shake(): void {
    this.scene.tweens.add({
      targets: this,
      x: this.x + 7,
      duration: 45,
      yoyo: true,
      repeat: 4,
      ease: 'Sine.easeInOut',
    });
  }

  private flipTo(nextFaceUp: boolean): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 0.04,
        duration: 110,
        ease: 'Sine.easeIn',
        onComplete: () => {
          this.faceUp = nextFaceUp;
          this.redraw();
          this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            duration: 130,
            ease: 'Sine.easeOut',
            onComplete: () => resolve(),
          });
        },
      });
    });
  }

  private redraw(): void {
    const w = this.widthValue;
    const h = this.heightValue;
    const palette = RARITY_PALETTE[this.data.rarity];
    this.bg.clear();

    this.bg.fillStyle(0x000000, 0.22);
    this.bg.fillRoundedRect(-w / 2 + 4, -h / 2 + 6, w, h, 18);

    if (this.faceUp) {
      this.bg.fillStyle(palette.glow, this.data.rarity === 'common' ? 0.12 : 0.24);
      this.bg.fillRoundedRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, 20);
      this.bg.fillStyle(palette.fill, 1);
      this.bg.lineStyle(3, palette.border, 1);
      this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 18);
      this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 18);
      this.bg.lineStyle(1, 0xffffff, 0.72);
      this.bg.strokeRoundedRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 14);
      this.label.setText(this.data.frontText);
      this.label.setColor('#4a2732');
      return;
    }

    this.bg.fillGradientStyle(0xf49a36, 0xf27726, 0xdc5f1e, 0xb84618, 1);
    this.bg.lineStyle(3, 0xffe6b5, 0.92);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 18);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 18);

    for (let i = -h / 2 + 16; i < h / 2 - 8; i += 18) {
      this.bg.fillStyle(0xffc06c, 0.23);
      this.bg.fillEllipse(-w / 4, i, 28, 16);
      this.bg.fillEllipse(w / 4, i + 4, 28, 16);
    }

    this.label.setText('★');
    this.label.setColor('#fff3cf');
  }
}
