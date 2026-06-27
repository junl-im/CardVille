import Phaser from 'phaser';
import { PlayResultData } from '../types/ModeTypes';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ProgressSystem } from '../systems/ProgressSystem';
import { ModeSystem } from '../systems/ModeSystem';
import { VisualSystem } from '../systems/VisualSystem';

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

    new GlassPanel(this, 195, 390, 330, 510, 34, 0.17);

    this.add.text(195, 164, data.clear ? '스테이지 클리어!' : '다시 도전', {
      fontSize: '34px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 16, fill: true }
    }).setOrigin(0.5);

    this.add.text(195, 212, data.stageTitle, { fontSize: '20px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);
    this.createStarRank(195, 268, stars);

    this.add.text(195, 330, `점수 ${data.score.toLocaleString('ko-KR')}`, { fontSize: '28px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.createMetricRow(195, 384, [
      `최대 콤보 ${data.combo}`,
      `이동 ${data.moves ?? 0}`,
      `${data.elapsedSec ?? 0}초`
    ]);
    this.add.text(195, 430, `실수 ${data.mistakes ?? 0}회 · 별 ${stars}/3`, {
      fontSize: '15px',
      fontStyle: '800',
      color: '#d9e8ff'
    }).setOrigin(0.5);

    const reward = new GameButton(this, 195, 516, '보상 받기', 260, 58, 0xffd86f);
    reward.on('pointerup', () => this.scene.start('RewardScene', this.result));

    const retry = new GameButton(this, 195, 588, '다시 도전', 260, 54, 0xc59bff);
    retry.on('pointerup', () => this.scene.start('PlayScene', { modeId: data.modeId, stageIndex: data.stageIndex }));

    const stages = new GameButton(this, 195, 656, '스테이지 선택', 260, 54, 0x8fd3ff);
    stages.on('pointerup', () => this.scene.start('StageSelectScene', { modeId: data.modeId }));

    const lobby = new GameButton(this, 195, 722, '메인 로비', 260, 48, 0xb7ffd8);
    lobby.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createMetricRow(x: number, y: number, values: string[]): void {
    values.forEach((value, index) => {
      const px = x - 108 + index * 108;
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.1);
      g.fillRoundedRect(px - 48, y - 18, 96, 36, 14);
      g.lineStyle(1, 0xffffff, 0.18);
      g.strokeRoundedRect(px - 48, y - 18, 96, 36, 14);
      this.add.text(px, y, value, {
        fontSize: '12px',
        fontStyle: '900',
        color: '#dff7ff',
        align: 'center',
        wordWrap: { width: 84 }
      }).setOrigin(0.5);
    });
  }

  private createStarRank(x: number, y: number, stars: number): void {
    for (let i = 0; i < 3; i += 1) {
      const filled = i < stars;
      const star = this.add.text(x - 58 + i * 58, y, filled ? '★' : '☆', {
        fontSize: filled ? '46px' : '40px',
        fontStyle: '900',
        color: filled ? '#ffe48a' : '#8ba0c6',
        shadow: filled ? { offsetX: 0, offsetY: 0, color: '#ffd86f', blur: 13, fill: true } : undefined
      }).setOrigin(0.5);
      if (filled) {
        star.setScale(0.4);
        this.tweens.add({ targets: star, scale: 1, delay: 120 * i, duration: 360, ease: 'Back.easeOut' });
      }
    }
  }

  private drawBackground(): void {
    VisualSystem.drawSelectedWorldBackground(this, 'reward');
    VisualSystem.spawnAmbientStars(this, 26);
    VisualSystem.spawnBurst(this, 195, 274, '#ffe4a3', 16);
  }
}
