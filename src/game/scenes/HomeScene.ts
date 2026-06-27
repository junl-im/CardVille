import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';

export class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }

  create(): void {
    this.drawBackground();
    this.createTopBar();

    this.add.text(28, 116, '오늘의 모험', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px',
      fontStyle: '900',
      color: '#ffffff'
    });

    this.createModeCard(195, 236, '📚 낱말 카드', 'word_ko_basic', '마법 도서관에서 단어 짝을 찾아요.');
    this.createModeCard(195, 390, '🧠 기억력 카드', 'memory_basic', '곧 추가될 카드 뒤집기 모드.');
    this.createModeCard(195, 544, '⭐ 카드 컬렉션', 'collection', '획득한 카드를 앨범에 모아요.');

    this.game.events.on('cardville:back-button', this.handleBackButton, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('cardville:back-button', this.handleBackButton, this);
    });
  }

  private createTopBar(): void {
    new GlassPanel(this, 195, 54, 350, 70, 22);
    this.add.text(42, 54, '🪙 354', { fontSize: '22px', fontStyle: '800', color: '#fff7ce' }).setOrigin(0, 0.5);
    this.add.text(195, 54, '레벨 1', { fontSize: '23px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(326, 54, '⚙️', { fontSize: '28px' }).setOrigin(0.5);
  }

  private createModeCard(x: number, y: number, title: string, modeId: string, desc: string): void {
    const panel = new GlassPanel(this, x, y, 330, 122, 24);
    panel.setInteractive(new Phaser.Geom.Rectangle(-165, -61, 330, 122), Phaser.Geom.Rectangle.Contains);

    this.add.text(58, y - 25, title, { fontSize: '25px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(58, y + 17, desc, { fontSize: '15px', color: '#d8e2ff', wordWrap: { width: 250 } }).setOrigin(0, 0.5);
    this.add.text(324, y, '›', { fontSize: '44px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);

    panel.on('pointerdown', () => {
      if (modeId === 'collection') {
        this.scene.start('CollectionScene');
        return;
      }
      if (modeId === 'word_ko_basic') {
        this.scene.start('PlayScene', { modeId });
      }
    });
  }

  private handleBackButton(): void {
    const confirmExit = window.confirm('카드마을을 종료할까요?');
    if (confirmExit) {
      window.close();
    }
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1a2f5f, 0x1a2f5f, 0x0e1733, 0x070b1c, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffffff, 0.05);
    g.fillCircle(310, 164, 130);
    g.fillStyle(0xffd36b, 0.06);
    g.fillCircle(70, 740, 180);
  }
}
