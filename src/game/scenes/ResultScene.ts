import Phaser from 'phaser';
import { PlayResultData } from '../types/ModeTypes';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ProgressSystem } from '../systems/ProgressSystem';
import { ModeSystem } from '../systems/ModeSystem';

export class ResultScene extends Phaser.Scene {
  private result!: PlayResultData;

  constructor() {
    super('ResultScene');
  }

  create(data: PlayResultData): void {
    this.result = data;
    this.drawBackground();
    this.render(data);
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private async render(data: PlayResultData): Promise<void> {
    let stars = 1;
    try {
      const mode = await ModeSystem.loadMode(data.modeId);
      const stage = mode.stages[data.stageIndex];
      stars = ProgressSystem.calculateStars(data.score, data.combo, stage?.goal.targetCount ?? 4);
    } catch (error) {
      console.warn('[CardVille] Result star calculation fallback.', error);
    }

    new GlassPanel(this, 195, 386, 326, 458, 32, 0.16);

    this.add.text(195, 212, data.clear ? '스테이지 클리어!' : '다시 도전', {
      fontSize: '34px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 16, fill: true }
    }).setOrigin(0.5);

    this.add.text(195, 266, data.stageTitle, { fontSize: '20px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);
    this.createStarRank(195, 316, stars);
    this.add.text(195, 374, `점수 ${data.score.toLocaleString('ko-KR')}`, { fontSize: '27px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 418, `최대 콤보 ${data.combo}`, { fontSize: '20px', color: '#d9e8ff' }).setOrigin(0.5);

    const reward = new GameButton(this, 195, 514, '보상 받기', 250, 58, 0xffd86f);
    reward.on('pointerup', () => this.scene.start('RewardScene', this.result));

    const retry = new GameButton(this, 195, 588, '다시 도전', 250, 54, 0xc59bff);
    retry.on('pointerup', () => this.scene.start('PlayScene', { modeId: data.modeId, stageIndex: data.stageIndex }));

    const lobby = new GameButton(this, 195, 656, '메인 로비', 250, 54, 0x8fd3ff);
    lobby.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createStarRank(x: number, y: number, stars: number): void {
    for (let i = 0; i < 3; i += 1) {
      const filled = i < stars;
      const star = this.add.text(x - 54 + i * 54, y, filled ? '★' : '☆', {
        fontSize: filled ? '42px' : '38px',
        fontStyle: '900',
        color: filled ? '#ffe48a' : '#8ba0c6',
        shadow: filled ? { offsetX: 0, offsetY: 0, color: '#ffd86f', blur: 12, fill: true } : undefined
      }).setOrigin(0.5);
      if (filled) {
        star.setScale(0.4);
        this.tweens.add({ targets: star, scale: 1, delay: 120 * i, duration: 360, ease: 'Back.easeOut' });
      }
    }
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1b4e79, 0x1b4e79, 0x0d1735, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffd86f, 0.07);
    g.fillCircle(195, 390, 190);
  }
}
