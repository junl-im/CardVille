import Phaser from 'phaser';
import { PerformanceSystem } from './PerformanceSystem';
import { CardRarity } from '../types/ModeTypes';

export type PremiumBackgroundVariant = 'library' | 'play' | 'reward' | 'album' | 'settings' | 'space' | 'forest';

const BACKGROUND_COLORS: Record<PremiumBackgroundVariant, [number, number, number, number]> = {
  library: [0x163f70, 0x1f5687, 0x0c1738, 0x060918],
  play: [0x203b72, 0x245182, 0x101a35, 0x071023],
  reward: [0x214d78, 0x275e8e, 0x0d1735, 0x060918],
  album: [0x1d2751, 0x283b72, 0x0d1328, 0x070914],
  settings: [0x173b70, 0x214e7e, 0x0d1530, 0x070a18],
  space: [0x1b2a5f, 0x3a2f74, 0x0d1130, 0x050612],
  forest: [0x124d58, 0x1b7067, 0x0d2435, 0x061119]
};

export class VisualSystem {
  static drawPremiumBackground(scene: Phaser.Scene, variant: PremiumBackgroundVariant = 'library'): Phaser.GameObjects.Graphics {
    const [tl, tr, bl, br] = BACKGROUND_COLORS[variant];
    const g = scene.add.graphics();
    g.fillGradientStyle(tl, tr, bl, br, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffffff, 0.035);
    g.fillCircle(64, 210, 176);
    g.fillStyle(0x8fd3ff, 0.07);
    g.fillCircle(326, 138, 132);
    g.fillStyle(0xffd86f, 0.055);
    g.fillCircle(70, 746, 172);
    g.fillStyle(0xff8fd8, 0.04);
    g.fillCircle(350, 642, 158);
    return g;
  }

  static spawnAmbientStars(scene: Phaser.Scene, count = 36): Phaser.GameObjects.Text[] {
    const stars: Phaser.GameObjects.Text[] = [];
    const budget = PerformanceSystem.ambientCount(count);
    for (let i = 0; i < budget; i += 1) {
      const star = scene.add.text(Phaser.Math.Between(12, 378), Phaser.Math.Between(74, 814), i % 4 === 0 ? '✦' : '·', {
        fontSize: `${Phaser.Math.Between(9, 21)}px`,
        color: i % 2 === 0 ? '#dff7ff' : '#ffe4a3'
      }).setAlpha(Phaser.Math.FloatBetween(0.12, 0.42)).setOrigin(0.5);
      stars.push(star);
      if (PerformanceSystem.shouldAnimateAmbient()) {
        scene.tweens.add({
          targets: star,
          y: star.y - Phaser.Math.Between(9, 24),
          alpha: Phaser.Math.FloatBetween(0.08, 0.22),
          duration: 1200 + i * 18,
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
      backgroundColor: 'rgba(12, 18, 38, 0.86)',
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
