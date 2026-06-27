import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { CollectionSystem } from '../systems/CollectionSystem';
import { CardRarity } from '../types/ModeTypes';
import { CollectionCardDefinition, OwnedCardRecord } from '../types/CollectionTypes';

export class CollectionScene extends Phaser.Scene {
  private allCards: CollectionCardDefinition[] = [];
  private ownedMap = new Map<string, OwnedCardRecord>();

  constructor() {
    super('CollectionScene');
  }

  async create(): Promise<void> {
    this.drawBackground();
    this.addHeader();
    this.add.text(195, 108, '카드 컬렉션', { fontSize: '34px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 148, '그림 + 텍스트 카드를 모아 앨범을 완성하세요.', { fontSize: '15px', color: '#cbd8ff' }).setOrigin(0.5);

    try {
      this.allCards = await CollectionSystem.getAllCards();
      this.ownedMap = CollectionSystem.getOwnedMap();
      this.createSummary();
      this.createCardAlbum();
    } catch (error) {
      console.warn(error);
      this.add.text(195, 420, '컬렉션 데이터를 불러오지 못했어요.', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
    }

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));

    this.add.text(338, 54, '서고', { fontSize: '18px', fontStyle: '900', color: '#f6e7ff' })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('ModeSelectScene'));
  }

  private createSummary(): void {
    const ownedUnique = this.ownedMap.size;
    const total = this.allCards.length;
    const totalCopies = CollectionSystem.getTotalOwnedCount();

    new GlassPanel(this, 195, 210, 334, 74, 24, 0.14);
    this.add.text(88, 201, `${ownedUnique} / ${total}`, {
      fontSize: '25px',
      fontStyle: '900',
      color: '#ffe4a3'
    }).setOrigin(0.5);
    this.add.text(88, 228, '앨범 완성', { fontSize: '12px', color: '#d9e8ff' }).setOrigin(0.5);

    this.add.text(195, 201, `${totalCopies}`, {
      fontSize: '25px',
      fontStyle: '900',
      color: '#dff7ff'
    }).setOrigin(0.5);
    this.add.text(195, 228, '보유 카드', { fontSize: '12px', color: '#d9e8ff' }).setOrigin(0.5);

    const completion = total > 0 ? Math.round((ownedUnique / total) * 100) : 0;
    this.add.text(302, 201, `${completion}%`, {
      fontSize: '25px',
      fontStyle: '900',
      color: '#b7ffd8'
    }).setOrigin(0.5);
    this.add.text(302, 228, '수집률', { fontSize: '12px', color: '#d9e8ff' }).setOrigin(0.5);
  }

  private createCardAlbum(): void {
    const sorted = [...this.allCards].sort((a, b) => {
      const rarityDiff = CollectionSystem.getRarityRank(b.rarity) - CollectionSystem.getRarityRank(a.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name, 'ko');
    });

    sorted.forEach((card, index) => {
      const x = 72 + (index % 4) * 82;
      const y = 312 + Math.floor(index / 4) * 146;
      this.createAlbumCard(card, x, y);
    });

    if (sorted.length <= 8) {
      this.add.text(195, 782, 'v0.4에서는 기본 컬렉션 8종을 제공합니다. 다음 패치에서 100종 이상으로 확장합니다.', {
        fontSize: '12px',
        color: '#aebfe6',
        align: 'center',
        wordWrap: { width: 330 }
      }).setOrigin(0.5);
    }
  }

  private createAlbumCard(card: CollectionCardDefinition, x: number, y: number): void {
    const owned = this.ownedMap.get(card.cardId);
    const isOwned = Boolean(owned);
    const color = CollectionSystem.getRarityColor(card.rarity);
    const box = this.add.container(x, y);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.22);
    shadow.fillRoundedRect(-32, -48 + 7, 64, 104, 15);

    const frame = this.add.graphics();
    frame.fillStyle(isOwned ? 0xffffff : 0x34405f, isOwned ? 0.88 : 0.58);
    frame.fillRoundedRect(-32, -48, 64, 104, 15);
    frame.lineStyle(3, isOwned ? color : 0x7d8aac, isOwned ? 0.94 : 0.32);
    frame.strokeRoundedRect(-32, -48, 64, 104, 15);
    frame.fillStyle(isOwned ? color : 0x0f1b36, isOwned ? 0.16 : 0.34);
    frame.fillRoundedRect(-24, -40, 48, 48, 13);
    frame.fillStyle(0xffffff, isOwned ? 0.33 : 0.08);
    frame.fillRoundedRect(-22, -38, 44, 10, 6);

    const icon = this.add.text(0, -17, isOwned ? this.getFallbackEmoji(card.cardId) : '?', {
      fontSize: isOwned ? '28px' : '25px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    const name = this.add.text(0, 23, isOwned ? card.name : '미획득', {
      fontSize: '12px',
      fontStyle: '900',
      color: isOwned ? '#17243c' : '#d8e2ff'
    }).setOrigin(0.5);

    const rarity = this.add.text(0, 40, CollectionSystem.getRarityLabel(card.rarity), {
      fontSize: '10px',
      fontStyle: '900',
      color: isOwned ? '#17243c' : '#aebce0'
    }).setOrigin(0.5);

    box.add([shadow, frame, icon, name, rarity]);

    if (owned && owned.count > 1) {
      const duplicate = this.add.text(24, -44, `x${owned.count}`, {
        fontSize: '10px',
        fontStyle: '900',
        color: '#10203a',
        backgroundColor: 'rgba(255, 216, 111, 0.92)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);
      box.add(duplicate);
    }

    if (isOwned && this.isHighRarity(card.rarity)) {
      this.tweens.add({
        targets: box,
        y: y - 4,
        duration: 1350,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  private isHighRarity(rarity: CardRarity): boolean {
    return ['epic', 'legendary', 'mythic'].includes(rarity);
  }

  private getFallbackEmoji(cardId: string): string {
    if (cardId.includes('apple')) return '🍎';
    if (cardId.includes('banana')) return '🍌';
    if (cardId.includes('grape')) return '🍇';
    if (cardId.includes('strawberry')) return '🍓';
    if (cardId.includes('cat')) return '🐱';
    if (cardId.includes('dog')) return '🐶';
    if (cardId.includes('lion')) return '🦁';
    if (cardId.includes('whale')) return '🐳';
    return '✦';
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1d2751, 0x1d2751, 0x0d1328, 0x070914, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x8fd3ff, 0.07);
    g.fillCircle(74, 180, 150);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(330, 620, 180);
  }
}
