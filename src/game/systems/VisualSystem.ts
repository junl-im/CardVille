import Phaser from 'phaser';
import { PerformanceSystem } from './PerformanceSystem';
import { CardRarity } from '../types/ModeTypes';

export type PremiumBackgroundVariant = 'library' | 'play' | 'reward' | 'album' | 'settings' | 'space' | 'forest';

const BACKGROUND_COLORS: Record<PremiumBackgroundVariant, [number, number, number, number]> = {
  library: [0x174c82, 0x23679b, 0x0b1738, 0x050816],
  play: [0x1d4f86, 0x2c6b9c, 0x101a35, 0x071023],
  reward: [0x245d88, 0x316f9f, 0x0d1735, 0x060918],
  album: [0x1d2f62, 0x31417c, 0x0d1328, 0x070914],
  settings: [0x174678, 0x235e8a, 0x0d1530, 0x070a18],
  space: [0x1b2a5f, 0x3a2f74, 0x0d1130, 0x050612],
  forest: [0x124d58, 0x1b7067, 0x0d2435, 0x061119]
};

export class VisualSystem {
  static imageTextureKey(imageKey?: string): string | null {
    return imageKey ? `img:${imageKey}` : null;
  }

  static hasImage(scene: Phaser.Scene, imageKey?: string): boolean {
    const key = this.imageTextureKey(imageKey);
    return Boolean(key && scene.textures.exists(key));
  }

  static drawPremiumBackground(scene: Phaser.Scene, variant: PremiumBackgroundVariant = 'library'): Phaser.GameObjects.Graphics {
    const [tl, tr, bl, br] = BACKGROUND_COLORS[variant];
    const g = scene.add.graphics();
    g.fillGradientStyle(tl, tr, bl, br, 1);
    g.fillRect(0, 0, 390, 844);

    // soft premium bokeh
    g.fillStyle(0xffffff, 0.035);
    g.fillCircle(64, 210, 176);
    g.fillStyle(0x8fd3ff, 0.082);
    g.fillCircle(326, 138, 132);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(70, 746, 172);
    g.fillStyle(0xff8fd8, 0.045);
    g.fillCircle(350, 642, 158);

    // glass vignette
    g.fillStyle(0x000000, 0.16);
    g.fillRoundedRect(14, 68, 362, 752, 42);
    g.lineStyle(1, 0xffffff, 0.09);
    g.strokeRoundedRect(14, 68, 362, 752, 42);
    g.fillStyle(0xffffff, 0.018);
    g.fillRoundedRect(28, 84, 334, 128, 34);

    if (variant === 'library') {
      this.drawLibraryShelves(scene, g);
    }
    return g;
  }

  static drawLibraryShelves(scene: Phaser.Scene, g = scene.add.graphics()): void {
    g.fillStyle(0x071026, 0.14);
    for (let row = 0; row < 5; row += 1) {
      const y = 256 + row * 94;
      g.fillRoundedRect(34, y, 322, 18, 8);
      for (let col = 0; col < 14; col += 1) {
        const x = 48 + col * 21;
        const h = Phaser.Math.Between(30, 58);
        const hue = [0x8fd3ff, 0xffd86f, 0xc59bff, 0xff8fcf, 0x8fffc8][(row + col) % 5];
        g.fillStyle(hue, 0.13 + ((row + col) % 3) * 0.025);
        g.fillRoundedRect(x, y - h, 12, h, 4);
      }
    }
  }

  static spawnAmbientStars(scene: Phaser.Scene, count = 36): Phaser.GameObjects.Text[] {
    const stars: Phaser.GameObjects.Text[] = [];
    const budget = PerformanceSystem.ambientCount(count);
    for (let i = 0; i < budget; i += 1) {
      const star = scene.add.text(Phaser.Math.Between(12, 378), Phaser.Math.Between(74, 814), i % 4 === 0 ? '✦' : '·', {
        fontSize: `${Phaser.Math.Between(9, 21)}px`,
        color: i % 2 === 0 ? '#dff7ff' : '#ffe4a3'
      }).setAlpha(Phaser.Math.FloatBetween(0.10, 0.38)).setOrigin(0.5);
      stars.push(star);
      if (PerformanceSystem.shouldAnimateAmbient()) {
        scene.tweens.add({
          targets: star,
          y: star.y - Phaser.Math.Between(9, 24),
          alpha: Phaser.Math.FloatBetween(0.07, 0.20),
          duration: 1300 + i * 20,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
    return stars;
  }

  static toast(scene: Phaser.Scene, message: string, y = 758): Phaser.GameObjects.Text {
    const toast = scene.add.text(195, y, message, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(10, 18, 40, 0.88)',
      padding: { left: 16, right: 16, top: 10, bottom: 10 },
      align: 'center',
      wordWrap: { width: 320 }
    }).setOrigin(0.5).setDepth(200);
    scene.tweens.add({ targets: toast, y: y - 22, alpha: 0, delay: 1000, duration: 420, ease: 'Sine.easeInOut', onComplete: () => toast.destroy() });
    return toast;
  }

  static spawnBurst(scene: Phaser.Scene, x: number, y: number, color = '#ffe4a3', count = 24): void {
    const budget = PerformanceSystem.particleCount(count);
    for (let i = 0; i < budget; i += 1) {
      const star = scene.add.text(x, y, i % 3 === 0 ? '◆' : '✦', {
        fontSize: `${Phaser.Math.Between(12, 30)}px`,
        color: i % 2 === 0 ? color : '#dff7ff'
      }).setOrigin(0.5).setDepth(160);
      scene.tweens.add({
        targets: star,
        x: x + Phaser.Math.Between(-150, 150),
        y: y + Phaser.Math.Between(-140, 140),
        alpha: 0,
        scale: 0.15,
        duration: PerformanceSystem.motionDuration(680),
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  static emojiForCardId(cardId: string): string {
    const pairs: Array<[string, string]> = [
      ['apple', '🍎'], ['banana', '🍌'], ['grape', '🍇'], ['strawberry', '🍓'], ['peach', '🍑'], ['melon', '🍈'],
      ['cat', '🐱'], ['dog', '🐶'], ['lion', '🦁'], ['whale', '🐳'], ['rabbit', '🐰'], ['fox', '🦊'],
      ['book', '📘'], ['candle', '🕯️'], ['crystal', '🔮'], ['key', '🗝️'], ['scroll', '📜'], ['ink', '✒️'],
      ['moon', '🌙'], ['star', '⭐'], ['rocket', '🚀'], ['planet', '🪐'], ['comet', '☄️'], ['galaxy', '🌌'],
      ['red', '🔴'], ['blue', '🔵'], ['green', '🟢'], ['yellow', '🟡'], ['purple', '🟣'], ['rainbow', '🌈'],
      ['piano', '🎹'], ['guitar', '🎸'], ['drum', '🥁'], ['violin', '🎻'], ['bell', '🔔'], ['music', '🎵'],
      ['doctor', '🩺'], ['chef', '👩‍🍳'], ['pilot', '✈️'], ['artist', '🎨'], ['teacher', '👩‍🏫'], ['firefighter', '🚒'],
      ['hammer', '🔨'], ['scissors', '✂️'], ['pencil', '✏️'], ['camera', '📷'], ['clock', '⏰'], ['compass', '🧭']
    ];
    return pairs.find(([key]) => cardId.includes(key))?.[1] ?? '✦';
  }

  static rarityGlowColor(rarity: CardRarity): string {
    const colors: Record<CardRarity, string> = {
      common: '#d8ecff',
      uncommon: '#9fffd0',
      rare: '#8fd3ff',
      epic: '#c49bff',
      legendary: '#ffd86f',
      mythic: '#ff8fd8'
    };
    return colors[rarity];
  }
}
