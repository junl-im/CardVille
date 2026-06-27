import Phaser from 'phaser';
import { ModeData, ModeStageData } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { CardView } from '../ui/CardView';
import { GlassPanel } from '../ui/GlassPanel';
import { HapticSystem } from '../systems/HapticSystem';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ProgressSystem } from '../systems/ProgressSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { LayoutSystem } from '../systems/LayoutSystem';
import { VisualSystem } from '../systems/VisualSystem';

export class PlayScene extends Phaser.Scene {
  private mode!: ModeData;
  private stage!: ModeStageData;
  private selected: CardView[] = [];
  private remainingPairs = 0;
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private moves = 0;
  private mistakes = 0;
  private startedAt = 0;
  private resolving = false;
  private modeId = 'word_ko_basic';
  private stageIndex = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;
  private remainText?: Phaser.GameObjects.Text;
  private moveText?: Phaser.GameObjects.Text;

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
    this.moves = 0;
    this.mistakes = 0;
    this.resolving = false;
    this.startedAt = Date.now();

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
      this.updateHud();
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
    new GlassPanel(this, 195, 54, 350, 70, 22, 0.13);
    this.add.text(38, 54, '‹', { fontSize: '38px', color: '#ffffff' }).setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('StageSelectScene', { modeId: this.modeId }));
    this.add.text(195, 37, title, { fontSize: '18px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 63, `Stage ${this.stageIndex + 1} · 그림과 단서를 맞춰보세요`, { fontSize: '12px', color: '#cbd8ff' }).setOrigin(0.5);

    new GlassPanel(this, 195, 118, 342, 46, 18, 0.11);
    this.scoreText = this.add.text(52, 109, '점수 0', { fontSize: '14px', fontStyle: '900', color: '#fff0b8' }).setOrigin(0, 0.5);
    this.comboText = this.add.text(338, 109, '콤보 0', { fontSize: '14px', fontStyle: '900', color: '#dff7ff' }).setOrigin(1, 0.5);
    this.remainText = this.add.text(52, 129, '남은 짝 0', { fontSize: '12px', fontStyle: '800', color: '#d9e8ff' }).setOrigin(0, 0.5);
    this.moveText = this.add.text(338, 129, '이동 0', { fontSize: '12px', fontStyle: '800', color: '#d9e8ff' }).setOrigin(1, 0.5);
  }

  private createCards(): void {
    this.remainingPairs = this.stage.goal.targetCount;
    const positions = LayoutSystem.cardGrid(this.stage.cards.length);

    this.stage.cards.forEach((card, index) => {
      const pos = positions[index];
      if (!pos) return;
      const view = new CardView(this, pos.x, pos.y, card);
      view.playSpawn(index);
      view.on('pointerup', () => this.handleCardSelect(view));
    });
  }

  private handleCardSelect(card: CardView): void {
    if (this.resolving || this.selected.includes(card) || this.selected.length >= 2) return;
    HapticSystem.light();
    AudioSystem.playSfx('card');
    card.setSelected(true);
    this.selected.push(card);

    if (this.selected.length === 2) {
      this.resolving = true;
      this.moves += 1;
      this.updateHud();
      this.time.delayedCall(260, () => this.checkSelectedCards());
    }
  }

  private checkSelectedCards(): void {
    const [a, b] = this.selected;
    if (!a || !b) {
      this.resolving = false;
      return;
    }

    const correct = a.dataRef.answerKey === b.dataRef.answerKey && a.dataRef.id !== b.dataRef.id;
    if (correct) {
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.score += 100 + this.combo * 25 + Math.max(0, this.remainingPairs - 1) * 5;
      this.updateHud();
      HapticSystem.success();
      AudioSystem.playSfx('correct');
      VisualSystem.spawnBurst(this, (a.x + b.x) / 2, (a.y + b.y) / 2, '#ffe4a3', 18);
      a.playCorrect();
      b.playCorrect();
      this.remainingPairs -= 1;
      this.selected = [];
      this.resolving = false;
      this.updateHud();

      if (this.remainingPairs <= 0) {
        this.time.delayedCall(620, () => this.clearStage());
      }
    } else {
      this.combo = 0;
      this.mistakes += 1;
      this.score = Math.max(0, this.score - 15);
      this.updateHud();
      HapticSystem.wrong();
      AudioSystem.playSfx('wrong');
      a.playWrong();
      b.playWrong();
      this.time.delayedCall(330, () => {
        a.setSelected(false);
        b.setSelected(false);
        this.selected = [];
        this.resolving = false;
      });
    }
  }

  private updateHud(): void {
    this.scoreText?.setText(`점수 ${this.score.toLocaleString('ko-KR')}`);
    this.comboText?.setText(`콤보 ${this.combo}`);
    this.remainText?.setText(`남은 짝 ${this.remainingPairs}`);
    this.moveText?.setText(`이동 ${this.moves}`);
  }

  private async clearStage(): Promise<void> {
    const elapsedSec = Math.max(1, Math.round((Date.now() - this.startedAt) / 1000));
    const result = {
      modeId: this.mode.modeId,
      stageIndex: this.stageIndex,
      stageTitle: this.stage.title,
      score: this.score,
      combo: this.maxCombo,
      clear: true,
      moves: this.moves,
      mistakes: this.mistakes,
      elapsedSec,
      rewards: this.stage.rewards
    };

    try {
      await ProgressSystem.recordClear(this.mode, result);
    } catch (error) {
      console.warn('[CardVille] Progress save failed.', error);
    }

    this.scene.start('ResultScene', result);
  }

  private drawBackground(): void {
    const variant = this.modeId.includes('memory') ? 'space' : this.modeId.includes('math') ? 'library' : 'play';
    VisualSystem.drawSelectedWorldBackground(this, variant);
    VisualSystem.spawnAmbientStars(this, 22);
    const table = this.add.graphics();
    table.fillStyle(0x000000, 0.11);
    table.fillRoundedRect(24, 154, 342, 670, 30);
    table.lineStyle(1, 0xffffff, 0.12);
    table.strokeRoundedRect(24, 154, 342, 670, 30);
  }
}
