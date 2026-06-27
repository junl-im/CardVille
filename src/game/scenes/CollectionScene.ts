import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';

export class CollectionScene extends Phaser.Scene {
  constructor() {
    super('CollectionScene');
  }

  create(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1d2751, 0x1d2751, 0x0d1328, 0x070914, 1);
    g.fillRect(0, 0, 390, 844);

    this.add.text(34, 54, '‹ 홈', { fontSize: '20px', fontStyle: '800', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('HomeScene'));

    this.add.text(195, 92, '카드 컬렉션', { fontSize: '34px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 134, '카드팩, 앨범, 등급 시스템이 연결될 공간', { fontSize: '16px', color: '#cbd8ff' }).setOrigin(0.5);

    const rarities = ['일반', '희귀', '영웅', '전설'];
    rarities.forEach((label, i) => {
      const x = 104 + (i % 2) * 182;
      const y = 252 + Math.floor(i / 2) * 210;
      new GlassPanel(this, x, y, 140, 174, 22);
      this.add.text(x, y - 24, label, { fontSize: '24px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);
      this.add.text(x, y + 22, '준비 중', { fontSize: '16px', color: '#d8e2ff' }).setOrigin(0.5);
    });
  }
}
