import Phaser from 'phaser';
import { ModeData, ModeStageData } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ProgressSystem } from '../systems/ProgressSystem';
import { ModeProgressRecord } from '../types/ProgressTypes';

export class StageSelectScene extends Phaser.Scene {
  private mode!: ModeData;
  private progress!: ModeProgressRecord;

  constructor() {
    super('StageSelectScene');
  }

  async create(data: { modeId: string; toast?: string }): Promise<void> {
    this.drawBackground();
    this.add.text(34, 54, '‹ 꿈의 서고', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('ModeSelectScene'));

    try {
      this.mode = await ModeSystem.loadMode(data.modeId ?? 'word_ko_basic');
      this.progress = await ProgressSystem.load(this.mode.modeId);
      const summary = ProgressSystem.getSummary(this.mode, this.progress);
      this.add.text(34, 110, this.mode.title, { fontSize: '34px', fontStyle: '900', color: '#ffffff' });
      this.add.text(34, 150, `클리어 ${summary.clearedStages}/${summary.stageCount} · 별 ${summary.totalStars}/${summary.maxStars}`, { fontSize: '15px', color: '#cfe3ff' });
      this.createProgressBar(34, 178, 322, 15, summary.completionRatio);
      this.mode.stages.forEach((stage, index) => this.createStageCard(stage, index));
      if (data.toast) this.showToast(data.toast);
    } catch (error) {
      this.add.text(195, 420, '스테이지를 불러오지 못했어요.', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
      console.warn(error);
    }

    SceneBackSystem.bind(this, () => this.scene.start('ModeSelectScene'));
  }

  private createStageCard(stage: ModeStageData, index: number): void {
    const x = 105 + (index % 2) * 180;
    const y = 270 + Math.floor(index / 2) * 150;
    const unlocked = ProgressSystem.isStageUnlocked(this.progress, index);
    const stageProgress = ProgressSystem.getStage(this.progress, stage.stageId);
    const stars = stageProgress?.stars ?? 0;
    const panel = new GlassPanel(this, x, y, 150, 124, 24, unlocked ? 0.15 : 0.08);
    panel.setAlpha(unlocked ? 1 : 0.58);
    panel.setInteractive(new Phaser.Geom.Rectangle(-75, -62, 150, 124), Phaser.Geom.Rectangle.Contains);

    this.add.text(x, y - 38, unlocked ? `${index + 1}` : '🔒', {
      fontSize: unlocked ? '30px' : '24px',
      fontStyle: '900',
      color: unlocked ? '#ffe4a3' : '#b9c5e5'
    }).setOrigin(0.5);

    this.add.text(x, y - 2, stage.title, {
      fontSize: '16px',
      fontStyle: '900',
      color: unlocked ? '#ffffff' : '#b9c5e5',
      align: 'center',
      wordWrap: { width: 120 }
    }).setOrigin(0.5);

    this.add.text(x, y + 29, this.getStarsLabel(stars), {
      fontSize: '16px',
      fontStyle: '900',
      color: stars > 0 ? '#ffe48a' : '#8ba0c6'
    }).setOrigin(0.5);

    this.add.text(x, y + 50, unlocked ? `🪙 ${stage.rewards.coins}` : '이전 장 클리어', {
      fontSize: '12px',
      color: unlocked ? '#d9e8ff' : '#9fb0d5'
    }).setOrigin(0.5);

    panel.on('pointerup', () => {
      if (!unlocked) {
        this.showToast('이전 스테이지를 클리어하면 열려요.');
        return;
      }
      this.scene.start('PlayScene', { modeId: this.mode.modeId, stageIndex: index });
    });
  }

  private getStarsLabel(stars: number): string {
    return `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
  }

  private createProgressBar(x: number, y: number, width: number, height: number, ratio: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.24);
    g.fillRoundedRect(x, y, width, height, height / 2);
    g.fillGradientStyle(0x8fd3ff, 0xdff7ff, 0xffd86f, 0xfff2b8, 1);
    g.fillRoundedRect(x + 2, y + 2, Math.max(8, (width - 4) * ratio), height - 4, (height - 4) / 2);
    g.lineStyle(1, 0xffffff, 0.35);
    g.strokeRoundedRect(x, y, width, height, height / 2);
  }

  private showToast(message: string): void {
    const toast = this.add.text(195, 766, message, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(12, 18, 38, 0.82)',
      padding: { left: 16, right: 16, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: toast, y: 744, alpha: 0, delay: 1000, duration: 420, onComplete: () => toast.destroy() });
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1a406e, 0x1a406e, 0x0d1735, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x8fd3ff, 0.07);
    g.fillCircle(330, 168, 150);
    g.fillStyle(0xffd86f, 0.05);
    g.fillCircle(80, 730, 160);
  }
}
