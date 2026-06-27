import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/phaserConfig';
import { addGlassPanel, addTopBar, drawWorldBackground } from '../ui/SceneHelpers';

const SAMPLE_CARDS = [
  { name: '낡은 마법책', rarity: '일반', color: '#f1d8a8' },
  { name: '작은 촛불', rarity: '일반', color: '#f1d8a8' },
  { name: '푸른 깃펜', rarity: '희귀', color: '#8fc9ff' },
  { name: '기억 수정', rarity: '희귀', color: '#8fc9ff' },
  { name: '별빛 페이지', rarity: '영웅', color: '#c59cff' },
  { name: '카드마을의 문', rarity: '전설', color: '#ffd166' },
];

export class CollectionScene extends Phaser.Scene {
  constructor() {
    super('CollectionScene');
  }

  create(): void {
    drawWorldBackground(this);
    addTopBar(this, '카드 컬렉션');

    this.add
      .text(30, 112, '← 홈', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        fontStyle: '800',
        color: '#ffffff',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('HomeScene'));

    this.add
      .text(GAME_WIDTH / 2, 146, '마법 도서관 기본 세트', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        fontStyle: '900',
        color: '#ffd166',
      })
      .setOrigin(0.5);

    SAMPLE_CARDS.forEach((card, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 40 + col * 166;
      const y = 188 + row * 146;
      addGlassPanel(this, x, y, 144, 124, 22);
      const frame = this.add.graphics();
      frame.fillStyle(0xfffbef, 1);
      frame.lineStyle(3, Phaser.Display.Color.HexStringToColor(card.color).color, 1);
      frame.fillRoundedRect(x + 32, y + 14, 80, 72, 16);
      frame.strokeRoundedRect(x + 32, y + 14, 80, 72, 16);
      this.add
        .text(x + 72, y + 50, '✦', {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '26px',
          color: card.color,
        })
        .setOrigin(0.5);
      this.add
        .text(x + 72, y + 96, card.name, {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '15px',
          fontStyle: '900',
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: 120 },
        })
        .setOrigin(0.5);
      this.add
        .text(x + 72, y + 116, card.rarity, {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          color: card.color,
        })
        .setOrigin(0.5);
    });

    this.add
      .text(GAME_WIDTH / 2, 700, '다음 단계에서 Firestore 컬렉션과 연결됩니다.', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        color: '#dbe3ff',
      })
      .setOrigin(0.5);
  }
}
