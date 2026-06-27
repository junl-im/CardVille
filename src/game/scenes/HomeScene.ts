import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/phaserConfig';
import { KakaoBrowserSystem } from '../systems/KakaoBrowserSystem';
import { addButton, addGlassPanel, addTopBar, drawWorldBackground } from '../ui/SceneHelpers';

export class HomeScene extends Phaser.Scene {
  private exitPopup?: Phaser.GameObjects.Container;

  constructor() {
    super('HomeScene');
  }

  create(): void {
    drawWorldBackground(this);
    addTopBar(this, '카드마을');

    this.add
      .text(34, 112, '🪙 0', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
        fontStyle: '900',
        color: '#ffe4a3',
      })
      .setOrigin(0, 0.5);

    this.add
      .text(GAME_WIDTH - 34, 112, '⚙', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
        color: '#ffffff',
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('SettingsScene'));

    addGlassPanel(this, 28, 150, GAME_WIDTH - 56, 310, 30);
    this.add
      .text(GAME_WIDTH / 2, 205, '마법 도서관', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
        fontStyle: '900',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 255, 'JSON 모드를 바꾸면\n새로운 카드 게임이 열립니다.', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '19px',
        fontStyle: '700',
        color: '#dbe3ff',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.createFloatingBook(195, 360);

    addButton(this, GAME_WIDTH / 2, 540, 286, 66, '모드 선택', () => this.scene.start('ModeSelectScene'));
    addButton(this, GAME_WIDTH / 2, 626, 286, 66, '카드 컬렉션', () => this.scene.start('CollectionScene'));
    addButton(this, GAME_WIDTH / 2, 712, 286, 66, '설정', () => this.scene.start('SettingsScene'));

    KakaoBrowserSystem.installBackGuard(this, () => this.showExitPopup());
  }

  private createFloatingBook(x: number, y: number): void {
    const book = this.add.container(x, y);
    const left = this.add.graphics();
    left.fillStyle(0x7a4bea, 1);
    left.lineStyle(2, 0xe6d6ff, 0.7);
    left.fillRoundedRect(-58, -34, 58, 74, 10);
    left.strokeRoundedRect(-58, -34, 58, 74, 10);
    const right = this.add.graphics();
    right.fillStyle(0x9f6bff, 1);
    right.lineStyle(2, 0xe6d6ff, 0.7);
    right.fillRoundedRect(0, -34, 58, 74, 10);
    right.strokeRoundedRect(0, -34, 58, 74, 10);
    const star = this.add.text(0, 0, '✦', { fontSize: '34px', color: '#ffd166' }).setOrigin(0.5);
    book.add([left, right, star]);
    this.tweens.add({ targets: book, y: y - 10, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private showExitPopup(): void {
    if (this.exitPopup) {
      this.exitPopup.destroy();
      this.exitPopup = undefined;
      return;
    }

    const popup = this.add.container(0, 0).setDepth(1000);
    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5).setInteractive();
    const panel = this.add.graphics();
    panel.fillStyle(0xffffff, 0.14);
    panel.lineStyle(1, 0xffffff, 0.3);
    panel.fillRoundedRect(44, 304, 302, 202, 26);
    panel.strokeRoundedRect(44, 304, 302, 202, 26);
    const text = this.add
      .text(GAME_WIDTH / 2, 366, '게임을 종료할까요?', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '25px',
        fontStyle: '900',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    const close = this.add
      .text(GAME_WIDTH / 2, 444, '계속하기', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        fontStyle: '900',
        color: '#3b1d12',
        backgroundColor: '#ffd166',
        padding: { left: 22, right: 22, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        popup.destroy();
        this.exitPopup = undefined;
      });
    popup.add([overlay, panel, text, close]);
    this.exitPopup = popup;
  }
}
