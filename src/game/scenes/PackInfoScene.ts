import Phaser from 'phaser';
import { CardRarity } from '../types/ModeTypes';
import { PackDefinition } from '../types/CollectionTypes';
import { CollectionSystem } from '../systems/CollectionSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { VisualSystem } from '../systems/VisualSystem';

const RARITIES: CardRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export class PackInfoScene extends Phaser.Scene {
  private packs: PackDefinition[] = [];
  private index = 0;
  private layer?: Phaser.GameObjects.Container;

  constructor() {
    super('PackInfoScene');
  }

  async create(): Promise<void> {
    VisualSystem.drawSelectedWorldBackground(this, 'reward');
    VisualSystem.spawnAmbientStars(this, 18);
    this.addHeader();
    new GlassPanel(this, 195, 118, 334, 106, 30, 0.15);
    this.add.text(195, 94, '카드팩 확률표', { fontSize: '31px', fontStyle: '900', color: '#ffffff', shadow: { offsetX: 0, offsetY: 0, color: '#ffd86f', blur: 14, fill: true } }).setOrigin(0.5);
    this.add.text(195, 132, '무료 플레이 기준 안내용 확률표예요. 유료 결제와 연결하지 않았어요.', { fontSize: '12px', color: '#d9e8ff', align: 'center', wordWrap: { width: 300 } }).setOrigin(0.5);
    try {
      const catalog = await CollectionSystem.loadPackCatalog();
      this.packs = catalog.packs;
      this.createControls();
      this.renderPack();
    } catch (error) {
      console.warn(error);
      VisualSystem.toast(this, '카드팩 데이터를 불러오지 못했어요.');
    }
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createControls(): void {
    const prev = new GameButton(this, 64, 744, '‹', 56, 48, 0x8fd3ff);
    prev.on('pointerup', () => this.changePack(-1));
    const next = new GameButton(this, 326, 744, '›', 56, 48, 0x8fd3ff);
    next.on('pointerup', () => this.changePack(1));
    const open = new GameButton(this, 195, 744, '앨범 보기', 172, 48, 0xffd86f);
    open.on('pointerup', () => this.scene.start('CollectionScene'));
  }

  private changePack(delta: number): void {
    if (this.packs.length === 0) return;
    this.index = Phaser.Math.Wrap(this.index + delta, 0, this.packs.length);
    this.renderPack();
  }

  private renderPack(): void {
    this.layer?.destroy();
    this.layer = this.add.container(0, 0);
    const pack = this.packs[this.index];
    if (!pack) return;

    const panel = new GlassPanel(this, 195, 404, 342, 498, 34, 0.16);
    this.layer.add(panel);
    const packKey = this.getPackTextureKey(pack.packId);
    const packImage = this.textures.exists(packKey)
      ? this.add.image(195, 258, packKey).setDisplaySize(132, 158).setOrigin(0.5)
      : this.add.text(195, 258, pack.visual.symbol, { fontSize: '74px', color: '#ffffff' }).setOrigin(0.5);
    this.layer.add(packImage);

    this.layer.add(this.add.text(195, 366, pack.title, { fontSize: '27px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5));
    this.layer.add(this.add.text(195, 397, pack.subtitle, { fontSize: '13px', color: '#d9e8ff', align: 'center', wordWrap: { width: 286 } }).setOrigin(0.5));
    this.layer.add(this.add.text(195, 428, `슬롯 ${pack.slots}장 · 보장 ${pack.guaranteedRarity ? CollectionSystem.getRarityLabel(pack.guaranteedRarity) + ' 이상' : '없음'}`, { fontSize: '13px', fontStyle: '800', color: '#ffe4a3' }).setOrigin(0.5));

    const total = RARITIES.reduce((sum, rarity) => sum + Math.max(0, pack.rarityWeights[rarity] ?? 0), 0) || 1;
    RARITIES.forEach((rarity, i) => {
      const y = 476 + i * 34;
      const value = Math.max(0, pack.rarityWeights[rarity] ?? 0);
      const ratio = value / total;
      const color = CollectionSystem.getRarityColor(rarity);
      const row = this.add.container(0, 0);
      const bg = this.add.graphics();
      bg.fillStyle(0xffffff, 0.10);
      bg.fillRoundedRect(58, y - 10, 274, 20, 10);
      bg.fillStyle(color, 0.72);
      bg.fillRoundedRect(60, y - 8, Math.max(4, 270 * ratio), 16, 8);
      row.add(bg);
      row.add(this.add.text(64, y, CollectionSystem.getRarityLabel(rarity), { fontSize: '12px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5));
      row.add(this.add.text(326, y, `${Math.round(ratio * 1000) / 10}%`, { fontSize: '12px', fontStyle: '900', color: '#ffffff' }).setOrigin(1, 0.5));
      this.layer?.add(row);
    });

    this.layer.add(this.add.text(195, 692, `${this.index + 1} / ${this.packs.length}`, { fontSize: '14px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5));
  }

  private getPackTextureKey(packId: string): string {
    if (packId.includes('mythic')) return 'pack:legendary_open';
    if (packId.includes('legendary') || packId.includes('starlight')) return 'pack:legendary_open';
    if (packId.includes('rare')) return 'pack:rare_closed';
    return 'pack:common_closed';
  }
}
