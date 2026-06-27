import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class CollectionScene extends Phaser.Scene {
  constructor() {
    super('CollectionScene');
  }

  create(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1d2751, 0x1d2751, 0x0d1328, 0x070914, 1);
    g.fillRect(0, 0, 390, 844);

    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));

    this.add.text(195, 108, '카드 컬렉션', { fontSize: '34px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 148, '그림 + 텍스트 카드를 모아 앨범을 완성하세요.', { fontSize: '15px', color: '#cbd8ff' }).setOrigin(0.5);

    const rarities = [
      ['일반', 'common'],
      ['고급', 'uncommon'],
      ['희귀', 'rare'],
      ['영웅', 'epic'],
      ['전설', 'legendary'],
      ['신화', 'mythic']
    ];

    rarities.forEach(([label], i) => {
      const x = 104 + (i % 2) * 182;
      const y = 252 + Math.floor(i / 2) * 164;
      new GlassPanel(this, x, y, 140, 126, 22, 0.14);
      this.add.text(x, y - 18, label, { fontSize: '22px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);
      this.add.text(x, y + 24, '0 / 0', { fontSize: '16px', color: '#d8e2ff' }).setOrigin(0.5);
    });

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }
}
