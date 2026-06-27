import Phaser from 'phaser';
import { PlayResultData } from '../types/ModeTypes';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class ResultScene extends Phaser.Scene {
  private result!: PlayResultData;

  constructor() {
    super('ResultScene');
  }

  create(data: PlayResultData): void {
    this.result = data;
    this.drawBackground();
    new GlassPanel(this, 195, 384, 326, 430, 32, 0.16);

    this.add.text(195, 234, data.clear ? '스테이지 클리어!' : '다시 도전', {
      fontSize: '34px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(195, 288, data.stageTitle, { fontSize: '20px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);
    this.add.text(195, 348, `점수 ${data.score}`, { fontSize: '28px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 392, `최대 콤보 ${data.combo}`, { fontSize: '20px', color: '#d9e8ff' }).setOrigin(0.5);

    const reward = new GameButton(this, 195, 492, '보상 받기', 250, 58, 0xffd86f);
    reward.on('pointerup', () => this.scene.start('RewardScene', this.result));

    const lobby = new GameButton(this, 195, 572, '메인 로비', 250, 58, 0x8fd3ff);
    lobby.on('pointerup', () => this.scene.start('MainLobbyScene'));

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1b4e79, 0x1b4e79, 0x0d1735, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffd86f, 0.07);
    g.fillCircle(195, 390, 190);
  }
}
