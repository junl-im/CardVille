import Phaser from 'phaser';
import { CollectionCardDefinition, OwnedCardRecord } from '../types/CollectionTypes';
import { CollectionSystem } from '../systems/CollectionSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { VisualSystem } from '../systems/VisualSystem';

export interface CardDetailSceneData { cardId: string; }

export class CardDetailScene extends Phaser.Scene {
  constructor() {
    super('CardDetailScene');
  }

  async create(data: CardDetailSceneData): Promise<void> {
    VisualSystem.drawSelectedWorldBackground(this, 'album');
    VisualSystem.spawnAmbientStars(this, 18);
    this.addHeader();
    try {
      const cards = await CollectionSystem.getAllCards();
      const card = cards.find((item) => item.cardId === data.cardId);
      const owned = CollectionSystem.getOwnedMap().get(data.cardId);
      if (!card) throw new Error(`Card not found: ${data.cardId}`);
      this.renderCard(card, owned);
    } catch (error) {
      console.warn(error);
      VisualSystem.toast(this, '카드 상세 정보를 불러오지 못했어요.');
      this.time.delayedCall(600, () => this.scene.start('CollectionScene'));
    }
    SceneBackSystem.bind(this, () => this.scene.start('CollectionScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 앨범', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('CollectionScene'));
  }

  private renderCard(card: CollectionCardDefinition, owned?: OwnedCardRecord): void {
    const color = CollectionSystem.getRarityColor(card.rarity);
    new GlassPanel(this, 195, 426, 342, 616, 36, 0.16);
    this.add.text(195, 104, '카드 상세', { fontSize: '31px', fontStyle: '900', color: '#ffffff', shadow: { offsetX: 0, offsetY: 0, color: VisualSystem.rarityGlowColor(card.rarity), blur: 16, fill: true } }).setOrigin(0.5);

    const frameKey = `frame:${card.rarity}`;
    if (this.textures.exists(frameKey)) {
      this.add.image(195, 288, frameKey).setDisplaySize(202, 286).setAlpha(0.98);
    } else {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.92);
      g.fillRoundedRect(94, 148, 202, 286, 32);
      g.lineStyle(5, color, 0.95);
      g.strokeRoundedRect(94, 148, 202, 286, 32);
    }

    const textureKey = VisualSystem.imageTextureKey(card.imageKey);
    if (textureKey && this.textures.exists(textureKey)) {
      this.add.image(195, 246, textureKey).setDisplaySize(132, 132).setOrigin(0.5);
    } else {
      this.add.text(195, 246, VisualSystem.emojiForCardId(card.cardId), { fontSize: '72px' }).setOrigin(0.5);
    }

    this.add.text(195, 366, card.name, { fontSize: '29px', fontStyle: '900', color: '#17243c' }).setOrigin(0.5);
    this.add.text(195, 398, `${CollectionSystem.getRarityLabel(card.rarity)} · ${card.setTitle}`, { fontSize: '14px', fontStyle: '900', color: '#314568' }).setOrigin(0.5);

    new GlassPanel(this, 195, 536, 292, 126, 28, 0.13);
    this.add.text(195, 492, owned ? `보유 수량 x${owned.count}` : '아직 미획득 카드', { fontSize: '21px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 526, `카드 ID · ${card.cardId}`, { fontSize: '12px', color: '#cfe8ff' }).setOrigin(0.5);
    this.add.text(195, 556, `이미지 · ${card.imageKey}`, { fontSize: '11px', color: '#9fb8e9', align: 'center', wordWrap: { width: 260 } }).setOrigin(0.5);
    this.add.text(195, 608, owned ? `처음 획득: ${owned.firstObtainedAt.slice(0, 10)}` : '카드팩을 열어 이 카드를 수집해보세요.', { fontSize: '13px', color: '#d9e8ff' }).setOrigin(0.5);

    const pack = new GameButton(this, 195, 690, '카드팩 확률 보기', 250, 54, 0xffd86f);
    pack.on('pointerup', () => this.scene.start('PackInfoScene'));
    const album = new GameButton(this, 195, 758, '앨범으로 돌아가기', 250, 54, 0x8fd3ff);
    album.on('pointerup', () => this.scene.start('CollectionScene'));

    if (['legendary', 'mythic'].includes(card.rarity)) {
      VisualSystem.spawnBurst(this, 195, 162, VisualSystem.rarityGlowColor(card.rarity), 18);
    }
  }
}
