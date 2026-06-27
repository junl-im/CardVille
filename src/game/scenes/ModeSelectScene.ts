import Phaser from 'phaser';
import { ModeCatalogItem } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super('ModeSelectScene');
  }

  async create(): Promise<void> {
    this.drawBackground();
    this.addHeader();
    this.add.text(34, 112, '게임 선택', { fontSize: '34px', fontStyle: '900', color: '#ffffff' });
    this.add.text(34, 152, 'JSON만 추가하면 새로운 모드가 열립니다.', { fontSize: '15px', color: '#cfe3ff' });

    try {
      const catalog = await ModeSystem.loadCatalog();
      catalog.modes.forEach((item, index) => this.createModeRow(item, 222 + index * 94));
    } catch (error) {
      this.add.text(195, 420, '모드 목록을 불러오지 못했어요.', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
      console.warn(error);
    }

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createModeRow(item: ModeCatalogItem, y: number): void {
    const panel = new GlassPanel(this, 195, y, 334, 78, 22, item.status === 'open' ? 0.14 : 0.08);
    panel.setInteractive(new Phaser.Geom.Rectangle(-167, -39, 334, 78), Phaser.Geom.Rectangle.Contains);
    this.add.text(52, y, item.icon, { fontSize: '34px' }).setOrigin(0.5);
    this.add.text(88, y - 14, item.title, { fontSize: '22px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(88, y + 16, item.status === 'open' ? item.subtitle : item.unlockText ?? '준비 중', {
      fontSize: '14px',
      color: item.status === 'open' ? '#d9e8ff' : '#9fb0ce'
    }).setOrigin(0, 0.5);
    this.add.text(320, y, item.status === 'open' ? '›' : '🔒', { fontSize: item.status === 'open' ? '40px' : '23px', color: '#ffe4a3' }).setOrigin(0.5);
    if (item.status === 'open') {
      panel.on('pointerup', () => this.scene.start('StageSelectScene', { modeId: item.modeId }));
    }
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1d4c7a, 0x1d4c7a, 0x0d1737, 0x070918, 1);
    g.fillRect(0, 0, 390, 844);
  }
}
