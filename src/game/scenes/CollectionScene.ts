import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';
import { GameButton } from '../ui/GameButton';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { CollectionSystem } from '../systems/CollectionSystem';
import { LayoutSystem } from '../systems/LayoutSystem';
import { VisualSystem } from '../systems/VisualSystem';
import { CardRarity } from '../types/ModeTypes';
import { CollectionCardDefinition, OwnedCardRecord } from '../types/CollectionTypes';

type AlbumFilter = 'all' | 'owned' | 'missing' | CardRarity;

export class CollectionScene extends Phaser.Scene {
  private allCards: CollectionCardDefinition[] = [];
  private ownedMap = new Map<string, OwnedCardRecord>();
  private filter: AlbumFilter = 'all';
  private page = 0;
  private readonly pageSize = 12;
  private cardLayer?: Phaser.GameObjects.Container;
  private pageText?: Phaser.GameObjects.Text;
  private filterText?: Phaser.GameObjects.Text;

  constructor() {
    super('CollectionScene');
  }

  async create(): Promise<void> {
    this.drawBackground();
    this.addHeader();
    this.add.text(195, 104, '카드 컬렉션', { fontSize: '34px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 142, '그림 + 텍스트 카드를 모아 앨범을 완성하세요.', { fontSize: '15px', color: '#cbd8ff' }).setOrigin(0.5);

    try {
      this.allCards = await CollectionSystem.getAllCards();
      this.ownedMap = CollectionSystem.getOwnedMap();
      this.createSummary();
      this.createFilterBar();
      this.renderAlbumPage();
      this.createPageControls();
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

    new GlassPanel(this, 195, 204, 334, 74, 24, 0.14);
    this.createSummaryItem(88, 196, `${ownedUnique} / ${total}`, '앨범 완성', '#ffe4a3');
    this.createSummaryItem(195, 196, `${totalCopies}`, '보유 카드', '#dff7ff');
    const completion = total > 0 ? Math.round((ownedUnique / total) * 100) : 0;
    this.createSummaryItem(302, 196, `${completion}%`, '수집률', '#b7ffd8');
  }

  private createSummaryItem(x: number, y: number, value: string, label: string, color: string): void {
    this.add.text(x, y, value, { fontSize: '25px', fontStyle: '900', color }).setOrigin(0.5);
    this.add.text(x, y + 27, label, { fontSize: '12px', color: '#d9e8ff' }).setOrigin(0.5);
  }

  private createFilterBar(): void {
    new GlassPanel(this, 195, 272, 334, 54, 20, 0.11);
    const filters: Array<{ key: AlbumFilter; label: string; x: number }> = [
      { key: 'all', label: '전체', x: 72 },
      { key: 'owned', label: '보유', x: 132 },
      { key: 'missing', label: '미획득', x: 198 },
      { key: 'rare', label: '희귀+', x: 270 },
      { key: 'legendary', label: '전설+', x: 330 }
    ];

    filters.forEach((item) => {
      const text = this.add.text(item.x, 272, item.label, {
        fontSize: '13px',
        fontStyle: '900',
        color: this.filter === item.key ? '#17243c' : '#e8f4ff',
        backgroundColor: this.filter === item.key ? 'rgba(255, 216, 111, 0.92)' : 'rgba(255, 255, 255, 0.08)',
        padding: { left: 8, right: 8, top: 6, bottom: 6 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      text.on('pointerup', () => {
        this.filter = item.key;
        this.page = 0;
        this.children.remove(text);
        this.scene.restart();
      });
    });

    this.filterText = this.add.text(195, 310, '', { fontSize: '12px', color: '#bcd0ee' }).setOrigin(0.5);
  }

  private renderAlbumPage(): void {
    this.cardLayer?.destroy();
    this.cardLayer = this.add.container(0, 0);

    const sorted = this.getFilteredCards();
    this.page = LayoutSystem.clampPage(this.page, sorted.length, this.pageSize);
    const visible = LayoutSystem.page(sorted, this.page, this.pageSize);

    this.filterText?.setText(`${this.getFilterLabel()} · ${sorted.length}장`);

    visible.forEach((card, index) => {
      const x = 72 + (index % 4) * 82;
      const y = 382 + Math.floor(index / 4) * 132;
      this.createAlbumCard(card, x, y, index);
    });

    if (visible.length === 0) {
      this.cardLayer.add(this.add.text(195, 514, '조건에 맞는 카드가 아직 없어요.', {
        fontSize: '18px',
        fontStyle: '900',
        color: '#ffffff'
      }).setOrigin(0.5));
    }

    this.updatePageText(sorted.length);
  }

  private createPageControls(): void {
    const prev = new GameButton(this, 96, 780, '‹ 이전', 118, 46, 0x8fd3ff);
    prev.on('pointerup', () => this.changePage(-1));

    const next = new GameButton(this, 294, 780, '다음 ›', 118, 46, 0x8fd3ff);
    next.on('pointerup', () => this.changePage(1));

    this.pageText = this.add.text(195, 780, '', {
      fontSize: '14px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.updatePageText(this.getFilteredCards().length);
  }

  private changePage(delta: number): void {
    const total = this.getFilteredCards().length;
    const next = LayoutSystem.clampPage(this.page + delta, total, this.pageSize);
    if (next === this.page) {
      VisualSystem.toast(this, delta < 0 ? '첫 페이지예요.' : '마지막 페이지예요.');
      return;
    }
    this.page = next;
    this.renderAlbumPage();
  }

  private updatePageText(totalItems: number): void {
    const maxPage = Math.max(1, Math.ceil(totalItems / this.pageSize));
    this.pageText?.setText(`${this.page + 1} / ${maxPage}`);
  }

  private getFilteredCards(): CollectionCardDefinition[] {
    const sorted = [...this.allCards].sort((a, b) => {
      const rarityDiff = CollectionSystem.getRarityRank(b.rarity) - CollectionSystem.getRarityRank(a.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name, 'ko');
    });

    if (this.filter === 'owned') return sorted.filter((card) => this.ownedMap.has(card.cardId));
    if (this.filter === 'missing') return sorted.filter((card) => !this.ownedMap.has(card.cardId));
    if (this.filter === 'rare') return sorted.filter((card) => CollectionSystem.getRarityRank(card.rarity) >= CollectionSystem.getRarityRank('rare'));
    if (this.filter === 'legendary') return sorted.filter((card) => CollectionSystem.getRarityRank(card.rarity) >= CollectionSystem.getRarityRank('legendary'));
    return sorted;
  }

  private getFilterLabel(): string {
    const labels: Record<AlbumFilter, string> = {
      all: '전체 카드',
      owned: '보유 카드',
      missing: '미획득 카드',
      common: '일반 카드',
      uncommon: '고급 카드',
      rare: '희귀 이상',
      epic: '영웅 카드',
      legendary: '전설 이상',
      mythic: '신화 카드'
    };
    return labels[this.filter];
  }

  private createAlbumCard(card: CollectionCardDefinition, x: number, y: number, index: number): void {
    const owned = this.ownedMap.get(card.cardId);
    const isOwned = Boolean(owned);
    const color = CollectionSystem.getRarityColor(card.rarity);
    const box = this.add.container(x, y);
    this.cardLayer?.add(box);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.24);
    shadow.fillRoundedRect(-32, -48 + 7, 64, 104, 15);

    const frame = this.add.graphics();
    frame.fillStyle(isOwned ? 0xffffff : 0x34405f, isOwned ? 0.9 : 0.58);
    frame.fillRoundedRect(-32, -48, 64, 104, 15);
    frame.lineStyle(3, isOwned ? color : 0x7d8aac, isOwned ? 0.94 : 0.32);
    frame.strokeRoundedRect(-32, -48, 64, 104, 15);
    frame.fillStyle(isOwned ? color : 0x0f1b36, isOwned ? 0.16 : 0.34);
    frame.fillRoundedRect(-24, -40, 48, 48, 13);
    frame.fillStyle(0xffffff, isOwned ? 0.33 : 0.08);
    frame.fillRoundedRect(-22, -38, 44, 10, 6);

    const textureKey = VisualSystem.imageTextureKey(card.imageKey);
    const icon = isOwned && textureKey && this.textures.exists(textureKey)
      ? this.add.image(0, -17, textureKey).setDisplaySize(42, 42).setOrigin(0.5)
      : this.add.text(0, -17, isOwned ? VisualSystem.emojiForCardId(card.cardId) : '?', {
        fontSize: isOwned ? '28px' : '25px',
        fontStyle: '900',
        color: '#ffffff'
      }).setOrigin(0.5);

    const name = this.add.text(0, 22, isOwned ? card.name : '미획득', {
      fontSize: this.getCardNameSize(card.name),
      fontStyle: '900',
      color: isOwned ? '#17243c' : '#d8e2ff',
      align: 'center',
      wordWrap: { width: 58 }
    }).setOrigin(0.5);

    const rarity = this.add.text(0, 42, CollectionSystem.getRarityLabel(card.rarity), {
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

    box.setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: box, alpha: 1, scale: 1, delay: index * 26, duration: 220, ease: 'Back.easeOut' });

    if (isOwned && this.isHighRarity(card.rarity)) {
      this.tweens.add({ targets: box, y: y - 4, duration: 1350, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private isHighRarity(rarity: CardRarity): boolean {
    return ['epic', 'legendary', 'mythic'].includes(rarity);
  }

  private getCardNameSize(name: string): string {
    if (name.length >= 5) return '10px';
    if (name.length >= 4) return '11px';
    return '12px';
  }

  private drawBackground(): void {
    VisualSystem.drawPremiumBackground(this, 'album');
    VisualSystem.spawnAmbientStars(this, 24);
  }
}
