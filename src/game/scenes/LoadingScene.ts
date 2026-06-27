import Phaser from 'phaser';
import { PRELOAD_IMAGES } from '../assets/preloadImages';

export class LoadingScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressText!: Phaser.GameObjects.Text;
  private loadingNote!: Phaser.GameObjects.Text;
  private videoElement?: Phaser.GameObjects.DOMElement;
  private startedAt = 0;

  constructor() {
    super('LoadingScene');
  }

  preload(): void {
    this.startedAt = Date.now();
    this.createLoadingUi();

    this.load.json('assetManifest', `${import.meta.env.BASE_URL}assets/manifest/assets.manifest.json`);
    this.load.json('modeCatalog', `${import.meta.env.BASE_URL}assets/data/modes/catalog.json`);
    this.load.json('worlds', `${import.meta.env.BASE_URL}assets/data/worlds/worlds.json`);
    this.load.json('collectionBase', `${import.meta.env.BASE_URL}assets/data/cards/collection.base.json`);
    this.load.json('puzzleBasic', `${import.meta.env.BASE_URL}assets/data/modes/puzzle_basic.json`);

    PRELOAD_IMAGES.forEach((asset) => {
      if (!this.textures.exists(asset.key)) {
        this.load.image(asset.key, `${import.meta.env.BASE_URL}${asset.path}`);
      }
    });

    this.load.on('progress', (value: number) => this.updateProgress(value));
    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.loadingNote.setText(`불러오는 중 · ${file.key}`);
    });
  }

  create(): void {
    this.updateProgress(1);
    this.loadingNote.setText('꿈의 서고 준비 완료');
    const elapsed = Date.now() - this.startedAt;
    const minIntroMs = 1500;
    const delay = Math.max(260, minIntroMs - elapsed);
    this.time.delayedCall(delay, () => this.scene.start('LoginScene'));
  }

  private createLoadingUi(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x172c62, 0x20517f, 0x0b1430, 0x060816, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x8fd3ff, 0.08);
    g.fillCircle(315, 138, 140);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(62, 710, 176);

    this.createIntroVideo();

    this.add.text(195, 612, '꿈의 서고를 여는 중', {
      fontSize: '28px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 14, fill: true }
    }).setOrigin(0.5);

    this.loadingNote = this.add.text(195, 650, '인트로와 카드 에셋을 준비하고 있어요.', {
      fontSize: '13px',
      fontStyle: '800',
      color: '#cfe8ff',
      align: 'center',
      wordWrap: { width: 310 }
    }).setOrigin(0.5);

    this.progressBar = this.add.graphics();
    this.progressText = this.add.text(195, 736, '0%', {
      fontSize: '18px',
      fontStyle: '900',
      color: '#e8f7ff'
    }).setOrigin(0.5);
    this.updateProgress(0);
  }

  private createIntroVideo(): void {
    const src = `${import.meta.env.BASE_URL}assets/video/cardville_intro_loading.mp4`;
    const html = `
      <div class="cardville-intro-shell">
        <video class="cardville-intro-video" src="${src}" autoplay muted playsinline loop preload="auto"></video>
        <div class="cardville-intro-fade"></div>
      </div>
    `;
    this.videoElement = this.add.dom(195, 304).createFromHTML(html).setDepth(2);
    const video = (this.videoElement.node as HTMLElement).querySelector('video');
    video?.play().catch(() => undefined);
  }

  private updateProgress(value: number): void {
    const width = 286;
    const height = 18;
    const x = 195 - width / 2;
    const y = 694;
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 0.13);
    this.progressBar.fillRoundedRect(x, y, width, height, 9);
    this.progressBar.fillGradientStyle(0x8fd3ff, 0xdff7ff, 0xffd86f, 0xfff2b8, 1);
    this.progressBar.fillRoundedRect(x + 2, y + 2, Math.max(8, (width - 4) * value), height - 4, 7);
    this.progressBar.lineStyle(1, 0xffffff, 0.42);
    this.progressBar.strokeRoundedRect(x, y, width, height, 9);
    this.progressText.setText(`${Math.round(value * 100)}%`);
  }
}
