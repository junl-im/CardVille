import Phaser from 'phaser';
import { ModeCatalogItem } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

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
      catalog.modes.forEach((item, index) => this.createMagicBook(item, index));
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
    const titleGlow = this.add.text(195, 104, '꿈의 서고', {
      fontSize: '42px',
      fontStyle: '900',
      color: '#dff7ff',
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#7bdfff',
        blur: 18,
        fill: true
      }
    }).setOrigin(0.5);

    this.add.text(195, 142, 'Dream Library', {
      fontSize: '16px',
      fontStyle: '800',
      color: '#b8d8ff',
      letterSpacing: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: titleGlow,
      y: 98,
      duration: 1700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createLibraryGuide(): void {
    new GlassPanel(this, 195, 190, 332, 58, 22, 0.12);
    this.add.text(195, 182, '책을 펼치면 카드 게임이 시작돼요.', {
      fontSize: '17px',
      fontStyle: '800',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(195, 205, '새 모드는 새로운 마법서로 추가됩니다.', {
      fontSize: '13px',
      color: '#d0e7ff'
    }).setOrigin(0.5);
  }

  private createMagicBook(item: ModeCatalogItem, index: number): void {
    const x = 195;
    const y = 278 + index * 106;
    const isOpen = item.status === 'open';
    const color = this.parseBookColor(item.bookColor, this.fallbackBookColor(index));
    const book = this.add.container(x, y);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.24);
    shadow.fillRoundedRect(-154, -35 + 12, 308, 76, 18);

    const cover = this.add.graphics();
    cover.fillStyle(color, isOpen ? 0.95 : 0.48);
    cover.fillRoundedRect(-158, -42, 316, 80, 20);
    cover.fillStyle(0xffffff, isOpen ? 0.18 : 0.08);
    cover.fillRoundedRect(-146, -33, 292, 24, 12);
    cover.lineStyle(2, 0xffffff, isOpen ? 0.52 : 0.22);
    cover.strokeRoundedRect(-158, -42, 316, 80, 20);
    cover.lineStyle(1, 0xffffff, isOpen ? 0.34 : 0.14);
    cover.strokeRoundedRect(-148, -32, 296, 60, 15);

    const spine = this.add.graphics();
    spine.fillStyle(0xffffff, isOpen ? 0.22 : 0.1);
    spine.fillRoundedRect(-146, -31, 42, 58, 13);
    spine.lineStyle(1, 0x000000, 0.12);
    spine.strokeRoundedRect(-146, -31, 42, 58, 13);

    const bookmark = this.add.graphics();
    bookmark.fillStyle(0xfff2ac, isOpen ? 0.9 : 0.42);
    bookmark.fillTriangle(115, -42, 139, -42, 127, -12);

    const icon = this.add.text(-125, -2, item.icon, {
      fontSize: '31px'
    }).setOrigin(0.5);

    const title = this.add.text(-82, -13, item.bookTitle ?? item.title, {
      fontSize: '23px',
      fontStyle: '900',
      color: isOpen ? '#10203a' : '#e2e8f2'
    }).setOrigin(0, 0.5);

    const subtitle = this.add.text(-82, 16, isOpen ? item.subtitle : item.unlockText ?? '준비 중', {
      fontSize: '13px',
      fontStyle: '700',
      color: isOpen ? '#243955' : '#aab6ca',
      wordWrap: { width: 218 }
    }).setOrigin(0, 0.5);

    const status = this.add.text(132, 2, isOpen ? '펼치기' : '잠김', {
      fontSize: isOpen ? '15px' : '14px',
      fontStyle: '900',
      color: isOpen ? '#ffffff' : '#d6d8df'
    }).setOrigin(0.5);

    const shine = this.add.graphics();
    shine.fillStyle(0xffffff, isOpen ? 0.22 : 0.06);
    shine.fillRoundedRect(-132, -29, 210, 11, 6);

    book.add([shadow, cover, spine, bookmark, icon, title, subtitle, status, shine]);
    book.setSize(316, 84);
    book.setInteractive(new Phaser.Geom.Rectangle(-158, -42, 316, 84), Phaser.Geom.Rectangle.Contains);
    book.setAlpha(isOpen ? 1 : 0.68);

    if (isOpen) {
      book.on('pointerover', () => {
        this.tweens.add({ targets: book, y: y - 6, scale: 1.025, duration: 120, ease: 'Sine.easeOut' });
      });
      book.on('pointerout', () => {
        this.tweens.add({ targets: book, y, scale: 1, duration: 150, ease: 'Sine.easeInOut' });
      });
      book.on('pointerdown', () => {
        this.tweens.add({ targets: book, scaleX: 0.98, scaleY: 0.98, yoyo: true, duration: 90 });
      });
      book.on('pointerup', () => this.openBook(item));
    } else {
      book.on('pointerup', () => this.showLockedBookHint(item));
    }

    this.tweens.add({
      targets: book,
      y: y + Phaser.Math.Between(-2, 2),
      duration: 1800 + index * 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private openBook(item: ModeCatalogItem): void {
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 0.0);
    flash.fillRect(0, 0, 390, 844);
    this.tweens.add({
      targets: flash,
      alpha: 0.65,
      duration: 120,
      yoyo: true,
      onComplete: () => {
        flash.destroy();
        this.scene.start('StageSelectScene', { modeId: item.modeId, sourceWorld: 'dream_library' });
      }
    });
  }

  private showLockedBookHint(item: ModeCatalogItem): void {
    const text = this.add.text(195, 756, item.unlockText ?? '아직 봉인된 책이에요.', {
      fontSize: '17px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(20, 26, 56, 0.78)',
      padding: { left: 18, right: 18, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: text,
      y: 738,
      alpha: 0,
      delay: 700,
      duration: 420,
      onComplete: () => text.destroy()
    });
  }

  private drawDreamLibraryBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x205f7a, 0x274f86, 0x0d1737, 0x070918, 1);
    g.fillRect(0, 0, 390, 844);

    g.fillStyle(0xffffff, 0.05);
    g.fillCircle(66, 116, 94);
    g.fillStyle(0x8fd3ff, 0.08);
    g.fillCircle(330, 208, 130);
    g.fillStyle(0xffd86f, 0.055);
    g.fillCircle(194, 760, 200);

    this.drawBookshelf(72, 605, 246, 15, 0.18);
    this.drawBookshelf(43, 717, 304, 16, 0.13);

    for (let i = 0; i < 46; i += 1) {
      const star = this.add.text(
        Phaser.Math.Between(18, 372),
        Phaser.Math.Between(30, 810),
        Phaser.Math.RND.pick(['✦', '·', '✧']),
        {
          fontSize: `${Phaser.Math.Between(8, 18)}px`,
          color: Phaser.Math.RND.pick(['#ffffff', '#ccefff', '#fff2b3'])
        }
      ).setAlpha(Phaser.Math.FloatBetween(0.18, 0.58));
      this.floatingStars.push(star);
    }
  }

  private drawBookshelf(x: number, y: number, width: number, count: number, alpha: number): void {
    const shelf = this.add.graphics();
    shelf.fillStyle(0xffffff, alpha * 0.45);
    shelf.fillRoundedRect(x, y + 64, width, 10, 5);
    for (let i = 0; i < count; i += 1) {
      const bookWidth = Phaser.Math.Between(9, 18);
      const bookHeight = Phaser.Math.Between(38, 70);
      const bx = x + 10 + i * Math.floor((width - 20) / count);
      const color = Phaser.Math.RND.pick([0x62d9ff, 0xffd86f, 0xc59bff, 0xff8fcf, 0x8fffc8]);
      shelf.fillStyle(color, alpha);
      shelf.fillRoundedRect(bx, y + 64 - bookHeight, bookWidth, bookHeight, 4);
      shelf.fillStyle(0xffffff, alpha * 0.5);
      shelf.fillRect(bx + 3, y + 70 - bookHeight, Math.max(2, bookWidth - 6), 3);
    }
  }

  private animateAmbientObjects(): void {
    this.floatingStars.forEach((star, index) => {
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.85),
        y: (star as Phaser.GameObjects.Text).y - Phaser.Math.Between(8, 20),
        duration: 1400 + index * 37,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  private parseBookColor(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private fallbackBookColor(index: number): number {
    return [0x62d9ff, 0xffd86f, 0xc59bff, 0xff8fcf, 0x8fffc8][index % 5];
  }
}
