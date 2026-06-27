import Phaser from 'phaser';
import { CardRarity, ModeCardData } from '../types/ModeTypes';

const RARITY_COLORS: Record<CardRarity, number> = {
  common: 0xf4ead7,
  rare: 0x8fd3ff,
  epic: 0xc59bff,
  legendary: 0xffd36b
};

export class CardView extends Phaser.GameObjects.Container {
  readonly dataRef: ModeCardData;
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private selected = false;

  constructor(scene: Phaser.Scene, x: number, y: number, data: ModeCardData) {
    super(scene, x, y);
    this.dataRef = data;
    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 4, data.frontText, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      fontStyle: '700',
      color: '#4a2432',
      align: 'center',
      wordWrap: { width: 108 }
    }).setOrigin(0.5);

    this.add([this.bg, this.label]);
    this.setSize(126, 164);
    this.setInteractive({ useHandCursor: true });
    this.draw();
    scene.add.existing(this);
  }

  setSelected(value: boolean): void {
    this.selected = value;
    this.scene.tweens.add({
      targets: this,
      y: value ? this.y - 10 : this.y + 10,
      scale: value ? 1.04 : 1,
      duration: 130,
      ease: 'Sine.easeOut'
    });
    this.draw();
  }

  playCorrect(): void {
    this.scene.tweens.add({
      targets: this,
      scale: 1.14,
      alpha: 0.2,
      angle: Phaser.Math.Between(-4, 4),
      duration: 260,
      ease: 'Back.easeIn',
      onComplete: () => this.destroy()
    });
  }

  playWrong(): void {
    this.scene.tweens.add({
      targets: this,
      x: { from: this.x - 8, to: this.x + 8 },
      yoyo: true,
      repeat: 3,
      duration: 42,
      onComplete: () => {
        this.x = Math.round(this.x);
      }
    });
  }

  private draw(): void {
    const border = RARITY_COLORS[this.dataRef.rarity];
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.2);
    this.bg.fillRoundedRect(-58, -70, 120, 154, 18);
    this.bg.fillStyle(0xfffbf1, 1);
    this.bg.fillRoundedRect(-63, -82, 126, 158, 18);
    this.bg.lineStyle(this.selected ? 5 : 4, border, this.selected ? 1 : 0.92);
    this.bg.strokeRoundedRect(-63, -82, 126, 158, 18);
    this.bg.lineStyle(1, 0xffffff, 0.9);
    this.bg.strokeRoundedRect(-55, -74, 110, 142, 14);
    this.bg.fillStyle(0xffffff, 0.22);
    this.bg.fillRoundedRect(-50, -72, 100, 42, 12);
  }
}
