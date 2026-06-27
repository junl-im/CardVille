import Phaser from 'phaser';
import { AssetCatalogSystem, CardImageIndexItem } from '../systems/AssetCatalogSystem';
import { VisualSystem } from '../systems/VisualSystem';
import { GlassPanel } from '../ui/GlassPanel';
import { GameButton } from '../ui/GameButton';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class AssetGalleryScene extends Phaser.Scene {
  private categories: Array<{ key: string; label: string; count: number }> = [];
  private categoryIndex = 0;
  private page = 0;
  private readonly pageSize = 9;
  private gridLayer?: Phaser.GameObjects.Container;
  private pageText?: Phaser.GameObjects.Text;
  private categoryText?: Phaser.GameObjects.Text;
  private summaryText?: Phaser.GameObjects.Text;
  private currentItems: CardImageIndexItem[] = [];

  constructor() {
    super('AssetGalleryScene');
  }

  async create(): Promise<void> {
    VisualSystem.drawSelectedWorldBackground(this, 'album');
    VisualSystem.spawnAmbientStars(this, 20);
    this.addHeader();

    new GlassPanel(this, 195, 132, 340, 122, 30, 0.15);
    this.add.text(195, 96, '카드 이미지 도감', {
      fontSize: '31px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 12, fill: true }
    }).setOrigin(0.5);
    this.summaryText = this.add.text(195, 132, '대형 에셋팩을 분석하고 있어요.', {
      fontSize: '14px',
      fontStyle: '800',
      color: '#d9e8ff',
      align: 'center',
      wordWrap: { width: 305 }
    }).setOrigin(0.5);
    this.add.text(195, 168, '이미지는 페이지 단위로만 불러와 성능을 보호합니다.', {
      fontSize: '12px',
      color: '#abc8ee'
    }).setOrigin(0.5);

    try {
      const summary = await AssetCatalogSystem.getSummary();
      this.categories = [{ key: 'all', label: '전체', count: summary.totalImages }, ...summary.categories];
      this.summaryText.setText(`적용 가능 카드 이미지 ${summary.totalImages.toLocaleString('ko-KR')}장 · 카테고리 ${summary.categories.length}개`);
      this.createCategoryControls();
      this.createPageControls();
      await this.refreshGrid();
    } catch (error) {
      console.warn(error);
      this.summaryText.setText('에셋 도감을 불러오지 못했어요.');
    }

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
    this.add.text(338, 54, '앨범', { fontSize: '18px', fontStyle: '900', color: '#f6e7ff' })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('CollectionScene'));
  }

  private createCategoryControls(): void {
    new GlassPanel(this, 195, 224, 340, 70, 24, 0.13);
    const prev = new GameButton(this, 66, 224, '‹', 56, 42, 0x8fd3ff);
    prev.on('pointerup', () => this.changeCategory(-1));
    const next = new GameButton(this, 324, 224, '›', 56, 42, 0x8fd3ff);
    next.on('pointerup', () => this.changeCategory(1));
    this.categoryText = this.add.text(195, 224, '', {
      fontSize: '18px',
      fontStyle: '900',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }

  private createPageControls(): void {
    const prev = new GameButton(this, 96, 786, '‹ 이전', 116, 48, 0x8fd3ff);
    prev.on('pointerup', () => this.changePage(-1));
    const next = new GameButton(this, 294, 786, '다음 ›', 116, 48, 0x8fd3ff);
    next.on('pointerup', () => this.changePage(1));
    this.pageText = this.add.text(195, 786, '', {
      fontSize: '14px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private async changeCategory(delta: number): Promise<void> {
    if (this.categories.length === 0) return;
    this.categoryIndex = Phaser.Math.Wrap(this.categoryIndex + delta, 0, this.categories.length);
    this.page = 0;
    await this.refreshGrid();
  }

  private async changePage(delta: number): Promise<void> {
    const next = AssetCatalogSystem.clampPage(this.page + delta, this.currentItems.length, this.pageSize);
    if (next === this.page) {
      VisualSystem.toast(this, delta < 0 ? '첫 페이지예요.' : '마지막 페이지예요.');
      return;
    }
    this.page = next;
    await this.renderPage();
  }

  private async refreshGrid(): Promise<void> {
    const category = this.categories[this.categoryIndex] ?? { key: 'all', label: '전체', count: 0 };
    this.currentItems = await AssetCatalogSystem.getItems(category.key);
    this.page = AssetCatalogSystem.clampPage(this.page, this.currentItems.length, this.pageSize);
    this.categoryText?.setText(`${category.label} · ${this.currentItems.length.toLocaleString('ko-KR')}장`);
    await this.renderPage();
  }

  private async renderPage(): Promise<void> {
    this.gridLayer?.destroy();
    this.gridLayer = this.add.container(0, 0);

    const visible = AssetCatalogSystem.page(this.currentItems, this.page, this.pageSize);
    this.updatePageText();

    const missing = visible.filter((item) => !this.textures.exists(AssetCatalogSystem.textureKey(item)));
    if (missing.length > 0) {
      for (const item of missing) {
        this.load.image(AssetCatalogSystem.textureKey(item), AssetCatalogSystem.assetUrl(item));
      }
      this.load.once(Phaser.Loader.Events.COMPLETE, () => this.drawItems(visible));
      this.load.start();
    } else {
      this.drawItems(visible);
    }
  }

  private drawItems(items: CardImageIndexItem[]): void {
    this.gridLayer?.destroy();
    this.gridLayer = this.add.container(0, 0);

    if (items.length === 0) {
      this.gridLayer.add(this.add.text(195, 480, '표시할 이미지가 없어요.', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5));
      return;
    }

    items.forEach((item, index) => {
      const x = 80 + (index % 3) * 115;
      const y = 330 + Math.floor(index / 3) * 138;
      this.createAssetCard(item, x, y, index);
    });
  }

  private createAssetCard(item: CardImageIndexItem, x: number, y: number, index: number): void {
    const box = this.add.container(x, y);
    this.gridLayer?.add(box);

    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.26);
    g.fillRoundedRect(-43, -52 + 8, 86, 118, 20);
    g.fillGradientStyle(0xffffff, 0xf7fdff, 0xddefff, 0xfff4d3, 1);
    g.fillRoundedRect(-47, -58, 94, 122, 20);
    g.lineStyle(2, 0x8fd3ff, 0.82);
    g.strokeRoundedRect(-47, -58, 94, 122, 20);
    g.fillStyle(0xffffff, 0.40);
    g.fillRoundedRect(-36, -48, 72, 68, 16);

    const key = AssetCatalogSystem.textureKey(item);
    const image = this.textures.exists(key)
      ? this.add.image(0, -14, key).setDisplaySize(68, 68).setOrigin(0.5)
      : this.add.text(0, -14, '✦', { fontSize: '30px', color: '#1c2440' }).setOrigin(0.5);

    const label = this.add.text(0, 34, item.label, {
      fontSize: this.getLabelSize(item.label),
      fontStyle: '900',
      color: '#16233c',
      align: 'center',
      wordWrap: { width: 82 }
    }).setOrigin(0.5);

    const tag = this.add.text(0, 54, item.category_ko, {
      fontSize: '10px',
      fontStyle: '800',
      color: '#52617f'
    }).setOrigin(0.5);

    box.add([g, image, label, tag]);
    box.setSize(94, 122).setInteractive(new Phaser.Geom.Rectangle(-47, -58, 94, 122), Phaser.Geom.Rectangle.Contains);
    box.on('pointerup', () => this.showPreview(item));
    box.setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: box, alpha: 1, scale: 1, delay: index * 26, duration: 220, ease: 'Back.easeOut' });
  }

  private showPreview(item: CardImageIndexItem): void {
    const key = AssetCatalogSystem.textureKey(item);
    const blocker = this.add.rectangle(195, 422, 390, 844, 0x020611, 0.60).setDepth(500).setInteractive();
    const panel = new GlassPanel(this, 195, 420, 326, 468, 34, 0.18).setDepth(501);
    const image = this.add.image(195, 322, key).setDisplaySize(190, 190).setDepth(502);
    const title = this.add.text(195, 452, item.label, { fontSize: '28px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5).setDepth(502);
    const meta = this.add.text(195, 492, `${item.category_ko} · ${item.id}`, { fontSize: '13px', color: '#d9e8ff', align: 'center', wordWrap: { width: 260 } }).setOrigin(0.5).setDepth(502);
    const close = new GameButton(this, 195, 574, '닫기', 190, 52, 0xffd86f).setDepth(502);
    close.on('pointerup', () => [blocker, panel, image, title, meta, close].forEach((obj) => obj.destroy()));
  }

  private updatePageText(): void {
    const maxPage = Math.max(1, AssetCatalogSystem.maxPage(this.currentItems.length, this.pageSize) + 1);
    this.pageText?.setText(`${this.page + 1} / ${maxPage}`);
  }

  private getLabelSize(label: string): string {
    if (label.length >= 5) return '11px';
    if (label.length >= 4) return '12px';
    return '14px';
  }
}
