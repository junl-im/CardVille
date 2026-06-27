import Phaser from 'phaser';
import { ModeData, ModeStageData } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { CardView } from '../ui/CardView';
import { GlassPanel } from '../ui/GlassPanel';
import { HapticSystem } from '../systems/HapticSystem';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ProgressSystem } from '../systems/ProgressSystem';
import { AudioSystem } from '../systems/AudioSystem';

export class PlayScene extends Phaser.Scene {
  private mode!: ModeData;
  private stage!: ModeStageData;
  private selected: CardView[] = [];
  private remainingPairs = 0;
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private modeId = 'word_ko_basic';
  private stageIndex = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;

  constructor() {
    super('PlayScene');
  }

  async create(data: { modeId: string; stageIndex?: number }): Promise<void> {
    this.modeId = data.modeId ?? 'word_ko_basic';
    this.stageIndex = data.stageIndex ?? 0;
    this.selected = [];
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;

    this.drawBackground();
    this.createHud('불러오는 중...');

    try {
      this.mode = await ModeSystem.loadMode(this.modeId);
      this.stage = this.mode.stages[this.stageIndex] ?? this.mode.stages[0];
      const progress = await ProgressSystem.load(this.mode.modeId);
      if (!ProgressSystem.isStageUnlocked(progress, this.stageIndex)) {
        this.scene.start('StageSelectScene', { modeId: this.mode.modeId, toast: '아직 잠긴 장이에요.' });
        return;
      }

      this.children.removeAll();
      this.drawBackground();
      this.createHud(this.stage.title);
      this.createCards();
    } catch (error) {
      this.add.text(195, 420, '스테이지를 불러오지 못했어요.', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
      console.warn(error);
    }

    SceneBackSystem.bind(this, () => {
      const exit = window.confirm('플레이를 중단하고 스테이지 선택으로 돌아갈까요?');
      if (exit) this.scene.start('StageSelectScene', { modeId: this.modeId });
    });
  }

  private createHud(title: string): void {
    new GlassPanel(this, 195, 54, 350, 70, 22, 0.12);
    this.add.text(38, 54, '‹', { fontSize: '38px', color: '#ffffff' }).setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('StageSelectScene', { modeId: this.modeId }));
    this.add.text(195, 38, title, { fontSize: '18px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 63, `Stage ${this.stageIndex + 1} · 정답을 찾아 카드를 모으세요`, { fontSize: '12px', color: '#cbd8ff' }).setOrigin(0.5);

    new GlassPanel(this, 195, 118, 342, 44, 18, 0.1);
    this.scoreText = this.add.text(58, 118, '점수 0', { fontSize: '15px', fontStyle: '900', color: '#fff0b8' }).setOrigin(0, 0.5);
    this.comboText = this.add.text(326, 118, '콤보 0', { fontSize: '15px', fontStyle: '900', color: '#dff7ff' }).setOrigin(1, 0.5);
  }

  private createCards(): void {
    this.remainingPairs = this.stage.goal.targetCount;
    const positions = [
      [105, 230], [285, 230],
      [105, 402], [285, 402],
      [105, 574], [285, 574],
      [105, 746], [285, 746]
    ];

    this.stage.cards.forEach((card, index) => {
      const pos = positions[index];
      if (!pos) return;
      const view = new CardView(this, pos[0], pos[1], card);
      view.on('pointerup', () => this.handleCardSelect(view));
    });
  }

  private handleCardSelect(card: CardView): void {
    if (this.selected.includes(card) || this.selected.length >= 2) return;
    HapticSystem.light();
    AudioSystem.playSfx('card');
    card.setSelected(true);
    this.selected.push(card);

    if (this.selected.length === 2) {
      this.time.delayedCall(260, () => this.checkSelectedCards());
    }
  }

  private checkSelectedCards(): void {
    const [a, b] = this.selected;
    if (!a || !b) return;

    const correct = a.dataRef.answerKey === b.dataRef.answerKey && a.dataRef.id !== b.dataRef.id;
    if (correct) {
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.score += 100 + this.combo * 25;
      this.updateHud();
      HapticSystem.success();
      AudioSystem.playSfx('correct');
      this.spawnStars((a.x + b.x) / 2, (a.y + b.y) / 2);
      a.playCorrect();
      b.playCorrect();
      this.remainingPairs -= 1;

      if (this.remainingPairs <= 0) {
        this.time.delayedCall(620, () => this.clearStage());
      }
    } else {
      this.combo = 0;
      this.updateHud();
      HapticSystem.wrong();
      AudioSystem.playSfx('wrong');
      a.playWrong();
      b.playWrong();
      a.setSelected(false);
      b.setSelected(false);
    }

    this.selected = [];
  }

  private updateHud(): void {
    this.scoreText?.setText(`점수 ${this.score.toLocaleString('ko-KR')}`);
    this.comboText?.setText(`콤보 ${this.combo}`);
  }

  private async clearStage(): Promise<void> {
    const result = {
      modeId: this.mode.modeId,
      stageIndex: this.stageIndex,
      stageTitle: this.stage.title,
      score: this.score,
      combo: this.maxCombo,
      clear: true,
      rewards: this.stage.rewards
    };

    try {
      await ProgressSystem.recordClear(this.mode, result);
    } catch (error) {
      console.warn('[CardVille] Progress save failed.', error);
    }

    this.scene.start('ResultScene', result);
  }

  private spawnStars(x: number, y: number): void {
    for (let i = 0; i < 16; i += 1) {
      const star = this.add.text(x, y, '✦', { fontSize: `${Phaser.Math.Between(16, 28)}px`, color: '#ffe4a3' }).setOrigin(0.5);
      this.tweens.add({
        targets: star,
        x: x + Phaser.Math.Between(-110, 110),
        y: y + Phaser.Math.Between(-95, 95),
        alpha: 0,
        scale: 0.2,
        duration: 640,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x20376b, 0x20376b, 0x101a35, 0x071023, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffffff, 0.04);
    g.fillCircle(64, 236, 180);
    g.fillStyle(0xffd36b, 0.05);
    g.fillCircle(330, 690, 170);
  }
}
