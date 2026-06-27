import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressText!: Phaser.GameObjects.Text;

  constructor() {
    super('LoadingScene');
  }

  preload(): void {
    this.createLoadingUi();

    this.load.json('assetManifest', `${import.meta.env.BASE_URL}assets/manifest/assets.manifest.json`);
    this.load.json('modeCatalog', `${import.meta.env.BASE_URL}assets/data/modes/catalog.json`);
    this.load.json('worlds', `${import.meta.env.BASE_URL}assets/data/worlds/worlds.json`);
    this.load.json('collectionBase', `${import.meta.env.BASE_URL}assets/data/cards/collection.base.json`);

    this.load.on('progress', (value: number) => this.updateProgress(value));
  }

  create(): void {
    this.updateProgress(1);
    this.time.delayedCall(500, () => this.scene.start('LoginScene'));
  }

  private createLoadingUi(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x182a5a, 0x182a5a, 0x0d1530, 0x070a18, 1);
    g.fillRect(0, 0, 390, 844);

    this.add.text(195, 324, '마법 카드 준비 중', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '30px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.progressBar = this.add.graphics();
    this.progressText = this.add.text(195, 442, '0%', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      fontStyle: '800',
      color: '#cfe8ff'
    }).setOrigin(0.5);
    this.updateProgress(0);
  }

  private updateProgress(value: number): void {
    const width = 270;
    const height = 18;
    const x = 195 - width / 2;
    const y = 392;
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 0.14);
    this.progressBar.fillRoundedRect(x, y, width, height, 9);
    this.progressBar.fillStyle(0x8fd3ff, 0.92);
    this.progressBar.fillRoundedRect(x, y, width * value, height, 9);
    this.progressBar.lineStyle(1, 0xffffff, 0.35);
    this.progressBar.strokeRoundedRect(x, y, width, height, 9);
    this.progressText.setText(`${Math.round(value * 100)}%`);
  }
}
