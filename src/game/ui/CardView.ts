import Phaser from 'phaser';
import { CardRarity, ModeCardData } from '../types/ModeTypes';
import { PerformanceSystem } from '../systems/PerformanceSystem';

const RARITY_COLORS: Record<CardRarity, number> = {
  common: 0xf4ead7,
  uncommon: 0xa7f3d0,
  rare: 0x8fd3ff,
  epic: 0xc59bff,
  legendary: 0xffd36b,
  mythic: 0xff7bc8
};

const RARITY_LABELS: Record<CardRarity, string> = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설',
  mythic: '신화'
};

export class CardView extends Phaser.GameObjects.Container {
  readonly dataRef: ModeCardData;
  private bg: Phaser.GameObjects.Graphics;
  private icon: Phaser.GameObjects.Text;
  private label: Phaser.GameObjects.Text;
  private subLabel: Phaser.GameObjects.Text;
  private rarityBadge: Phaser.GameObjects.Text;
  private selected = false;
  private matched = false;
  private readonly baseY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, data: ModeCardData) {
    super(scene, x, y);
    this.dataRef = data;
    this.baseY = y;
    this.bg = scene.add.graphics();
    this.icon = scene.add.text(0, -35, data.frontEmoji ?? '✦', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '40px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    this.label = scene.add.text(0, 29, data.frontText, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: this.getLabelSize(data.frontText),
      fontStyle: '900',
      color: '#35213e',
      align: 'center',
      wordWrap: { width: 106 }
    }).setOrigin(0.5);
    this.subLabel = scene.add.text(0, 53, data.frontSubText ?? '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '10px',
      fontStyle: '800',
      color: '#6c5578',
      align: 'center',
      wordWrap: { width: 104 }
    }).setOrigin(0.5);
    this.rarityBadge = scene.add.text(0, -70, RARITY_LABELS[data.rarity], {
      fontSize: '10px',
      fontStyle: '900',
      color: '#17243c',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { left: 7, right: 7, top: 3, bottom: 3 }
    }).setOrigin(0.5);

    this.add([this.bg, this.icon, this.label, this.subLabel, this.rarityBadge]);
    this.setSize(126, 164);
    this.setInteractive(new Phaser.Geom.Rectangle(-63, -82, 126, 164), Phaser.Geom.Rectangle.Contains);
    this.draw();
    scene.add.existing(this);
  }

  playSpawn(index = 0): void {
    if (PerformanceSystem.getProfile().reducedMotion) return;
    this.setAlpha(0).setScale(0.84).setY(this.baseY + 22);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scale: 1,
      y: this.baseY,
      delay: index * 45,
      duration: 320,
      ease: 'Back.easeOut'
    });
  }

  setSelected(value: boolean): void {
    if (this.matched || this.selected === value) return;
    this.selected = value;
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      y: value ? this.baseY - 12 : this.baseY,
      scale: value ? 1.055 : 1,
      angle: value ? -1.2 : 0,
      duration: PerformanceSystem.motionDuration(150),
      ease: 'Sine.easeOut'
    });
    this.draw();
    if (value) this.playShine();
  }

  playCorrect(): void {
    this.matched = true;
    this.disableInteractive();
    this.scene.tweens.killTweensOf(this);
    const duration = PerformanceSystem.motionDuration(320);
    this.scene.tweens.add({
      targets: this,
      y: this.baseY - 24,
      scale: 1.1,
      angle: Phaser.Math.Between(-3, 3),
      duration: duration / 2,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          scale: 0.78,
          y: this.baseY - 50,
          duration,
          ease: 'Sine.easeIn',
          onComplete: () => this.destroy()
        });
      }
    });
  }

  playWrong(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: { from: this.x - 9, to: this.x + 9 },
      yoyo: true,
      repeat: 3,
      duration: PerformanceSystem.motionDuration(46),
      onComplete: () => {
        this.x = Math.round(this.x);
        this.y = this.baseY;
        this.scale = 1;
        this.angle = 0;
      }
    });
  }

  private playShine(): void {
    if (PerformanceSystem.getProfile().reducedMotion) return;
    const shine = this.scene.add.rectangle(-58, -78, 22, 156, 0xffffff, 0.28).setOrigin(0.5).setAngle(-16);
    this.add(shine);
    this.scene.tweens.add({
      targets: shine,
      x: 70,
      alpha: 0,
      duration: 420,
      ease: 'Sine.easeOut',
      onComplete: () => shine.destroy()
    });
  }

  private draw(): void {
    const border = RARITY_COLORS[this.dataRef.rarity];
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.27);
    this.bg.fillRoundedRect(-55, -64, 120, 154, 22);
    this.bg.fillGradientStyle(0xffffff, 0xfffbf1, 0xdceaff, 0xfff3d5, 1);
    this.bg.fillRoundedRect(-63, -82, 126, 158, 22);
    this.bg.lineStyle(this.selected ? 6 : 4, border, this.selected ? 1 : 0.92);
    this.bg.strokeRoundedRect(-63, -82, 126, 158, 22);
    this.bg.lineStyle(1, 0xffffff, 0.9);
    this.bg.strokeRoundedRect(-54, -73, 108, 140, 16);
    this.bg.fillStyle(0xffffff, 0.28);
    this.bg.fillRoundedRect(-48, -72, 96, 45, 14);
    this.bg.fillStyle(border, 0.16);
    this.bg.fillCircle(0, -35, 37);
    this.bg.fillStyle(border, this.selected ? 0.22 : 0.1);
    this.bg.fillRoundedRect(-50, 14, 100, 52, 14);
    if (['epic', 'legendary', 'mythic'].includes(this.dataRef.rarity)) {
      this.bg.lineStyle(1, border, 0.36);
      this.bg.strokeCircle(0, -35, 43);
    }
  }

  private getLabelSize(text: string): string {
    if (text.length >= 8) return '15px';
    if (text.length >= 5) return '18px';
    return '21px';
  }
}
