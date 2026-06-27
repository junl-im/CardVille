import Phaser from 'phaser';
import { ModeData, ModeStageData } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class StageSelectScene extends Phaser.Scene {
  private mode!: ModeData;

  constructor() {
    super('StageSelectScene');
  }

  async create(data: { modeId: string }): Promise<void> {
    this.drawBackground();
    this.add.text(34, 54, '‹ 꿈의 서고', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('ModeSelectScene'));

    try {
      this.mode = await ModeSystem.loadMode(data.modeId ?? 'word_ko_basic');
      this.add.text(34, 112, this.mode.title, { fontSize: '34px', fontStyle: '900', color: '#ffffff' });
      this.add.text(34, 152, '책 속의 장을 선택하세요.', { fontSize: '15px', color: '#cfe3ff' });
      this.mode.stages.forEach((stage, index) => this.createStageCard(stage, index));
    } catch (error) {
      this.add.text(195, 420, '스테이지를 불러오지 못했어요.', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
      console.warn(error);
    }

    SceneBackSystem.bind(this, () => this.scene.start('ModeSelectScene'));
  }

  private createStageCard(stage: ModeStageData, index: number): void {
    const x = 105 + (index % 2) * 180;
    const y = 240 + Math.floor(index / 2) * 150;
    const panel = new GlassPanel(this, x, y, 150, 118, 24, 0.14);
    panel.setInteractive(new Phaser.Geom.Rectangle(-75, -59, 150, 118), Phaser.Geom.Rectangle.Contains);
    this.add.text(x, y - 28, `${index + 1}`, { fontSize: '30px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0.5);
    this.add.text(x, y + 8, stage.title, { fontSize: '17px', fontStyle: '900', color: '#ffffff', align: 'center', wordWrap: { width: 120 } }).setOrigin(0.5);
    this.add.text(x, y + 39, `🪙 ${stage.rewards.coins}`, { fontSize: '14px', color: '#d9e8ff' }).setOrigin(0.5);
    panel.on('pointerup', () => this.scene.start('PlayScene', { modeId: this.mode.modeId, stageIndex: index }));
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x1a406e, 0x1a406e, 0x0d1735, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
  }
}
