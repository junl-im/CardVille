import Phaser from 'phaser';
import { CardRarity, ModeCardData } from '../types/ModeTypes';

const RARITY_COLORS: Record<CardRarity, number> = {
  common: 0xf4ead7,
  uncommon: 0xa7f3d0,
  rare: 0x8fd3ff,
  epic: 0xc59bff,
  legendary: 0xffd36b,
  mythic: 0xff7bc8
};

export class CardView extends Phaser.GameObjects.Container {
  readonly dataRef: ModeCardData;
  private bg: Phaser.GameObjects.Graphics;
  private icon: Phaser.GameObjects.Text;
  private label: Phaser.GameObjects.Text;
  private selected = false;

  constructor(scene: Phaser.Scene, x: number, y: number, data: ModeCardData) {
    super(scene, x, y);
    this.dataRef = data;
    this.bg = scene.add.graphics();
    this.icon = scene.add.text(0, -32, data.frontEmoji ?? '✦', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '38px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    this.label = scene.add.text(0, 38, data.frontText, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '21px',
      fontStyle: '900',
      color: '#422239',
      align: 'center',
      wordWrap: { width: 108 }
    }).setOrigin(0.5);

    this.add([this.bg, this.icon, this.label]);
    this.setSize(126, 164);
    this.setInteractive(new Phaser.Geom.Rectangle(-63, -82, 126, 164), Phaser.Geom.Rectangle.Contains);
    this.draw();
    scene.add.existing(this);
  }

  setSelected(value: boolean): void {
    if (this.selected === value) return;
    this.selected = value;
    this.scene.tweens.add({
      targets: this,
      y: value ? this.y - 10 : this.y + 10,
      scale: value ? 1.045 : 1,
      duration: 130,
      ease: 'Sine.easeOut'
    });
    this.draw();
    if (value) this.playShine();
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

  private playShine(): void {
    const shine = this.scene.add.rectangle(-56, -76, 22, 154, 0xffffff, 0.28).setOrigin(0.5).setAngle(-16);
    this.add(shine);
    this.scene.tweens.add({
      targets: shine,
      x: 68,
      alpha: 0,
      duration: 420,
      ease: 'Sine.easeOut',
      onComplete: () => shine.destroy()
    });
  }

  private draw(): void {
    const border = RARITY_COLORS[this.dataRef.rarity];
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.28);
    this.bg.fillRoundedRect(-56, -67, 120, 154, 20);
    this.bg.fillGradientStyle(0xfffbf1, 0xfffbf1, 0xdceaff, 0xfff3d5, 1);
    this.bg.fillRoundedRect(-63, -82, 126, 158, 20);
    this.bg.lineStyle(this.selected ? 6 : 4, border, this.selected ? 1 : 0.92);
    this.bg.strokeRoundedRect(-63, -82, 126, 158, 20);
    this.bg.lineStyle(1, 0xffffff, 0.9);
    this.bg.strokeRoundedRect(-54, -73, 108, 140, 15);
    this.bg.fillStyle(0xffffff, 0.24);
    this.bg.fillRoundedRect(-48, -71, 96, 44, 13);
    this.bg.fillStyle(border, 0.14);
    this.bg.fillCircle(0, -30, 34);
  }
}
