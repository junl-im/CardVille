import Phaser from 'phaser';
import { CardRarity, ModeCardData } from '../types/ModeTypes';
import { PerformanceSystem } from '../systems/PerformanceSystem';
import { VisualSystem } from '../systems/VisualSystem';

const RARITY_COLORS: Record<CardRarity, number> = {
  common: 0xd8ecff,
  uncommon: 0x9fffd0,
  rare: 0x8fd3ff,
  epic: 0xc49bff,
  legendary: 0xffd86f,
  mythic: 0xff8fd8
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
  private visual: Phaser.GameObjects.Text | Phaser.GameObjects.Image;
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

    const textureKey = VisualSystem.imageTextureKey(data.frontImageKey);
    if (textureKey && scene.textures.exists(textureKey)) {
      this.visual = scene.add.image(0, -33, textureKey).setDisplaySize(72, 72).setOrigin(0.5);
    } else {
      this.visual = scene.add.text(0, -35, data.frontEmoji ?? '✦', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '40px',
        color: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);
    }

    this.label = scene.add.text(0, 30, data.frontText, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: this.getLabelSize(data.frontText),
      fontStyle: '900',
      color: '#1c2440',
      align: 'center',
      wordWrap: { width: 108 }
    }).setOrigin(0.5);
    this.subLabel = scene.add.text(0, 54, data.frontSubText ?? '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '10px',
      fontStyle: '800',
      color: '#58647e',
      align: 'center',
      wordWrap: { width: 104 }
    }).setOrigin(0.5);
    this.rarityBadge = scene.add.text(0, -72, RARITY_LABELS[data.rarity], {
      fontSize: '10px',
      fontStyle: '900',
      color: '#14233c',
      backgroundColor: 'rgba(255, 255, 255, 0.86)',
      padding: { left: 8, right: 8, top: 3, bottom: 3 }
    }).setOrigin(0.5);

    this.add([this.bg, this.visual, this.label, this.subLabel, this.rarityBadge]);
    this.setSize(128, 166);
    this.setInteractive(new Phaser.Geom.Rectangle(-64, -84, 128, 166), Phaser.Geom.Rectangle.Contains);
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
      duration: 340,
      ease: 'Back.easeOut'
    });
  }

  setSelected(value: boolean): void {
    if (this.matched || this.selected === value) return;
    this.selected = value;
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      y: value ? this.baseY - 14 : this.baseY,
      scale: value ? 1.06 : 1,
      angle: value ? -1.1 : 0,
      duration: PerformanceSystem.motionDuration(155),
      ease: 'Sine.easeOut'
    });
    this.draw();
    if (value) this.playShine();
  }

  playCorrect(): void {
    this.matched = true;
    this.disableInteractive();
    this.scene.tweens.killTweensOf(this);
    const duration = PerformanceSystem.motionDuration(330);
    this.scene.tweens.add({
      targets: this,
      y: this.baseY - 28,
      scale: 1.12,
      angle: Phaser.Math.Between(-3, 3),
      duration: duration / 2,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          scale: 0.76,
          y: this.baseY - 56,
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
    const shine = this.scene.add.rectangle(-60, -78, 24, 158, 0xffffff, 0.30).setOrigin(0.5).setAngle(-16);
    this.add(shine);
    this.scene.tweens.add({
      targets: shine,
      x: 72,
      alpha: 0,
      duration: 430,
      ease: 'Sine.easeOut',
      onComplete: () => shine.destroy()
    });
  }

  private draw(): void {
    const border = RARITY_COLORS[this.dataRef.rarity];
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.30);
    this.bg.fillRoundedRect(-55, -62, 122, 154, 24);
    this.bg.fillGradientStyle(0xffffff, 0xf7fdff, 0xd9e7ff, 0xfff2d7, 1);
    this.bg.fillRoundedRect(-64, -84, 128, 160, 24);
    this.bg.lineStyle(this.selected ? 6 : 4, border, this.selected ? 1 : 0.94);
    this.bg.strokeRoundedRect(-64, -84, 128, 160, 24);
    this.bg.lineStyle(1, 0xffffff, 0.92);
    this.bg.strokeRoundedRect(-54, -74, 108, 140, 18);
    this.bg.fillStyle(0xffffff, 0.30);
    this.bg.fillRoundedRect(-48, -74, 96, 47, 16);
    this.bg.fillStyle(border, 0.15);
    this.bg.fillCircle(0, -35, 43);
    this.bg.fillStyle(0xffffff, 0.42);
    this.bg.fillCircle(-16, -51, 18);
    this.bg.fillStyle(border, this.selected ? 0.24 : 0.11);
    this.bg.fillRoundedRect(-50, 15, 100, 52, 15);
    if (['epic', 'legendary', 'mythic'].includes(this.dataRef.rarity)) {
      this.bg.lineStyle(1, border, 0.42);
      this.bg.strokeCircle(0, -35, 46);
      this.bg.strokeCircle(0, -35, 36);
    }
  }

  private getLabelSize(text: string): string {
    if (text.length >= 8) return '14px';
    if (text.length >= 5) return '17px';
    return '20px';
  }
}
