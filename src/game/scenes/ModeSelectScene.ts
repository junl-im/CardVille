import Phaser from 'phaser';
import { ModeCatalogItem, ModeData } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ProgressSystem } from '../systems/ProgressSystem';

export class ModeSelectScene extends Phaser.Scene {
  private floatingStars: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('ModeSelectScene');
  }

  async create(): Promise<void> {
    this.floatingStars = [];
    this.drawDreamLibraryBackground();
    this.addHeader();
    this.createWorldTitle();
    this.createLibraryGuide();

    try {
      const catalog = await ModeSystem.loadCatalog();
      for (let index = 0; index < catalog.modes.length; index += 1) {
        const item = catalog.modes[index];
        const mode = item.status === 'open' ? await this.tryLoadMode(item.modeId) : null;
        await this.createMagicBook(item, index, mode);
      }
    } catch (error) {
      this.add.text(195, 430, '꿈의 서고를 불러오지 못했어요.', {
        fontSize: '18px',
        color: '#ffffff'
      }).setOrigin(0.5);
      console.warn(error);
    }

    this.animateAmbientObjects();
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private async tryLoadMode(modeId: string): Promise<ModeData | null> {
    try {
      return await ModeSystem.loadMode(modeId);
    } catch (error) {
      console.warn(`[CardVille] Mode data missing: ${modeId}`, error);
      return null;
    }
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', {
      fontSize: '20px',
      fontStyle: '900',
      color: '#ffffff'
    })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));

    this.add.text(344, 54, '앨범', {
      fontSize: '18px',
      fontStyle: '900',
      color: '#f6e7ff'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('CollectionScene'));
  }

  private createWorldTitle(): void {
    const titleGlow = this.add.text(195, 98, '꿈의 서고', {
      fontSize: '42px',
      fontStyle: '900',
      color: '#dff7ff',
      shadow: { offsetX: 0, offsetY: 0, color: '#7bdfff', blur: 18, fill: true }
    }).setOrigin(0.5);

    this.add.text(195, 136, 'Dream Library', {
      fontSize: '16px',
      fontStyle: '800',
      color: '#b8d8ff',
      letterSpacing: 2
    }).setOrigin(0.5);

    this.tweens.add({ targets: titleGlow, y: 92, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private createLibraryGuide(): void {
    new GlassPanel(this, 195, 184, 332, 58, 22, 0.12);
    this.add.text(195, 176, '책을 펼치면 카드 게임이 시작돼요.', {
      fontSize: '17px',
      fontStyle: '800',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(195, 199, '별을 모으면 서고의 책장이 밝아집니다.', {
      fontSize: '13px',
      color: '#d0e7ff'
    }).setOrigin(0.5);
  }

  private async createMagicBook(item: ModeCatalogItem, index: number, mode: ModeData | null): Promise<void> {
    const x = 195;
    const y = 268 + index * 96;
    const isOpen = item.status === 'open' && Boolean(mode);
    const progress = mode ? await ProgressSystem.load(mode.modeId) : null;
    const summary = mode && progress ? ProgressSystem.getSummary(mode, progress) : null;
    const color = this.parseBookColor(item.bookColor, this.fallbackBookColor(index));
    const book = this.add.container(x, y);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.24);
    shadow.fillRoundedRect(-154, -33 + 12, 308, 72, 18);

    const cover = this.add.graphics();
    cover.fillStyle(color, isOpen ? 0.95 : 0.48);
    cover.fillRoundedRect(-158, -40, 316, 76, 20);
    cover.fillStyle(0xffffff, isOpen ? 0.18 : 0.08);
    cover.fillRoundedRect(-146, -31, 292, 22, 12);
    cover.lineStyle(2, 0xffffff, isOpen ? 0.52 : 0.22);
    cover.strokeRoundedRect(-158, -40, 316, 76, 20);
    cover.lineStyle(1, 0xffffff, isOpen ? 0.34 : 0.14);
    cover.strokeRoundedRect(-148, -30, 296, 56, 15);

    const spine = this.add.graphics();
    spine.fillStyle(0xffffff, isOpen ? 0.22 : 0.1);
    spine.fillRoundedRect(-146, -29, 38, 56, 13);

    const icon = this.add.text(-126, 0, item.icon, { fontSize: '30px' }).setOrigin(0.5);
    const title = this.add.text(-88, -14, item.bookTitle ?? item.title, {
      fontSize: '20px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    const subtitleText = summary
      ? `진행 ${summary.clearedStages}/${summary.stageCount} · 별 ${summary.totalStars}/${summary.maxStars}`
      : (item.unlockText ?? item.subtitle);
    const subtitle = this.add.text(-88, 12, subtitleText, {
      fontSize: '12px',
      color: isOpen ? '#e7f5ff' : '#c3cde2',
      wordWrap: { width: 218 }
    }).setOrigin(0, 0.5);

    const badge = this.add.text(124, 0, isOpen ? '펼치기' : '잠김', {
      fontSize: '12px',
      fontStyle: '900',
      color: isOpen ? '#17243c' : '#d8e2ff',
      backgroundColor: isOpen ? 'rgba(255, 246, 187, 0.92)' : 'rgba(36, 47, 78, 0.74)',
      padding: { left: 10, right: 10, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    book.add([shadow, cover, spine, icon, title, subtitle, badge]);
    book.setSize(316, 76);
    book.setInteractive(new Phaser.Geom.Rectangle(-158, -40, 316, 76), Phaser.Geom.Rectangle.Contains);
    book.on('pointerover', () => { if (isOpen) this.tweens.add({ targets: book, scale: 1.025, duration: 120 }); });
    book.on('pointerout', () => { if (isOpen) this.tweens.add({ targets: book, scale: 1, duration: 120 }); });
    book.on('pointerup', () => {
      if (!isOpen) {
        this.showToast(item.unlockText ?? '아직 준비 중인 마법서예요.');
        return;
      }
      this.playBookOpenTransition(book, item.modeId);
    });

    if (isOpen) {
      this.tweens.add({ targets: book, y: y - 4, duration: 1500 + index * 130, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private playBookOpenTransition(book: Phaser.GameObjects.Container, modeId: string): void {
    this.tweens.add({
      targets: book,
      scale: 1.08,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.cameras.main.flash(260, 220, 245, 255);
        this.time.delayedCall(120, () => this.scene.start('StageSelectScene', { modeId }));
      }
    });
  }

  private showToast(message: string): void {
    const toast = this.add.text(195, 768, message, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(12, 18, 38, 0.82)',
      padding: { left: 16, right: 16, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(50);

    this.tweens.add({ targets: toast, y: 748, alpha: 0, delay: 1000, duration: 420, onComplete: () => toast.destroy() });
  }

  private animateAmbientObjects(): void {
    this.floatingStars.forEach((star, index) => {
      this.tweens.add({ targets: star, y: '-=18', alpha: 0.15, delay: index * 90, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
  }

  private drawDreamLibraryBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x153b64, 0x193f70, 0x0d1735, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x070a19, 0.32);
    g.fillRoundedRect(25, 218, 340, 538, 28);

    for (let i = 0; i < 7; i += 1) {
      g.fillStyle(i % 2 === 0 ? 0x203f72 : 0x2a4b82, 0.38);
      g.fillRoundedRect(46, 236 + i * 72, 298, 18, 7);
    }

    for (let i = 0; i < 72; i += 1) {
      const star = this.add.text(Phaser.Math.Between(16, 374), Phaser.Math.Between(70, 812), i % 3 === 0 ? '✦' : '·', {
        fontSize: `${Phaser.Math.Between(11, 22)}px`,
        color: i % 2 === 0 ? '#dff7ff' : '#ffe4a3'
      }).setAlpha(Phaser.Math.FloatBetween(0.12, 0.4)).setOrigin(0.5);
      this.floatingStars.push(star);
    }

    g.fillStyle(0x8fd3ff, 0.08);
    g.fillCircle(318, 128, 120);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(54, 744, 170);
  }

  private parseBookColor(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value.replace(/^0x/, ''), 16);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private fallbackBookColor(index: number): number {
    return [0x62d9ff, 0xffd86f, 0xc59bff, 0xff8fcf, 0x8fffc8][index % 5];
  }
}
