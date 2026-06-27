import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class MainLobbyScene extends Phaser.Scene {
  constructor() {
    super('MainLobbyScene');
  }

  create(): void {
    this.drawBackground();
    this.createTopBar();
    this.createHeroPanel();
    this.createMenu();

    SceneBackSystem.bind(this, () => {
      const confirmExit = window.confirm('카드마을을 종료할까요?');
      if (confirmExit) window.close();
    });
  }

  private createTopBar(): void {
    new GlassPanel(this, 195, 54, 350, 70, 22, 0.12);
    this.add.text(42, 54, '🪙 354', { fontSize: '21px', fontStyle: '900', color: '#fff7ce' }).setOrigin(0, 0.5);
    this.add.text(164, 54, '💎 12', { fontSize: '21px', fontStyle: '900', color: '#d5fbff' }).setOrigin(0, 0.5);
    this.add.text(306, 54, '⚙️', { fontSize: '26px' }).setOrigin(0.5);
  }

  private createHeroPanel(): void {
    new GlassPanel(this, 195, 214, 334, 210, 30, 0.14);
    const name = AuthSystem.currentUser?.isAnonymous ? '여행자' : AuthSystem.currentUser?.displayName ?? '카드마을 주민';
    this.add.text(48, 142, `환영해요, ${name}!`, { fontSize: '22px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(48, 184, '오늘은 꿈의 서고에서\n새로운 마법서를 펼쳐볼까요?', {
      fontSize: '18px',
      color: '#d9e8ff',
      lineSpacing: 5
    }).setOrigin(0, 0.5);
    this.add.text(300, 218, '📚', { fontSize: '72px' }).setOrigin(0.5);
  }

  private createMenu(): void {
    const play = new GameButton(this, 195, 390, '꿈의 서고 입장', 300, 64, 0xffd86f);
    play.on('pointerup', () => this.scene.start('ModeSelectScene')); // Dream Library

    const collection = new GameButton(this, 195, 472, '카드 컬렉션', 300, 64, 0x8fd3ff);
    collection.on('pointerup', () => this.scene.start('CollectionScene'));

    const mission = new GameButton(this, 195, 554, '오늘의 미션 준비 중', 300, 64, 0xc59bff);
    mission.on('pointerup', () => undefined);

    this.add.text(195, 676, 'Aqua Glass + Cute Premium + 2.5D', {
      fontSize: '15px',
      color: '#9fb8e9'
    }).setOrigin(0.5);
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1a4e79, 0x1d4376, 0x0e1838, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    for (let i = 0; i < 60; i += 1) {
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.05, 0.18));
      g.fillCircle(Phaser.Math.Between(0, 390), Phaser.Math.Between(0, 844), Phaser.Math.FloatBetween(1, 2.5));
    }
    g.fillStyle(0x8fd3ff, 0.07);
    g.fillCircle(320, 174, 142);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(76, 746, 176);
  }
}
