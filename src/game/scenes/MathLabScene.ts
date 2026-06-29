import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { allowAmbientMotion, ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, scaledDuration } from '../systems/QualitySystem';
import { getMathStage, MathProblem, MathStage } from '../data/mathStages';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, cardText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class MathLabScene extends Phaser.Scene {
  private stageId = 1;
  private stage!: MathStage;
  private index = 0;
  private score = 0;
  private combo = 0;
  private bestCombo = 0;
  private hearts = 3;
  private locked = false;
  private answerLayer?: Phaser.GameObjects.Container;
  private equationText?: Phaser.GameObjects.Text;
  private promptText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;
  private progressFill?: Phaser.GameObjects.Rectangle;
  private challengeText?: Phaser.GameObjects.Text;
  private quality: CardVilleQuality = getCardVilleQuality();

  constructor() { super('MathLabScene'); }

  init(data: { stage?: number } = {}): void {
    this.stageId = data.stage ?? 1;
  }

  create(): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    this.stage = getMathStage(this.stageId);
    this.index = 0;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hearts = 3;
    this.locked = false;

    DrawSystem.background(this, '연산 연구소', 'lab');
    this.drawLabDecor();
    this.add.text(195, 96, this.stage.title, goldText(24)).setOrigin(0.5);
    this.add.text(195, 124, `${this.stage.subtitle} · ${this.stage.difficulty} · ${this.stage.id}단계`, applyWrap(mutedText(12), 310)).setOrigin(0.5);
    this.add.text(195, 150, this.difficultyRewardLabel(), goldText(10)).setOrigin(0.5).setAlpha(0.9);
    this.drawConsole();
    this.drawProblem();
    new GameButton(this, 195, 768, '광장으로', 238, 54, 0xc9f4ff).onClick(() => NavigationSystem.safeStart(this, 'MainLobbyScene'));
  }

  private drawLabDecor(): void {
    const l = layout(this);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, 430, l.visibleWidth, 690, 0x2f1755, 0.10);
    if (this.textures.exists('dioramaLab')) this.add.image(314, 168, 'dioramaLab').setDisplaySize(94, 82).setAlpha(0.92);
    if (this.textures.exists('npcWizard')) this.add.image(72, 182, 'npcWizard').setDisplaySize(54, 72).setAlpha(0.96);
    if (this.textures.exists('effectAura')) {
      const aura = this.add.image(195, 332, 'effectAura').setDisplaySize(230, 230).setAlpha(0.18);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: aura, scale: 1.12, alpha: 0.07, duration: scaledDuration(1100, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    for (let i = 0; i < ambientCount(10, this.quality, 3); i += 1) {
      const sparkle = this.textures.exists('particleSparkle')
        ? this.add.image(35 + i * 36, 170 + (i % 4) * 94, 'particleSparkle').setDisplaySize(14, 14)
        : this.add.circle(35 + i * 36, 170 + (i % 4) * 94, 3, 0xffe08a, 0.48);
      sparkle.setAlpha(0.35).setDepth(2);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: sparkle, y: sparkle.y - 18, alpha: 0.08, duration: scaledDuration(1200 + i * 80, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawConsole(): void {
    panel(this, 195, 396, 342, 458, 34);
    if (this.textures.exists('uiMathConsole')) {
      this.add.image(195, 356, 'uiMathConsole').setDisplaySize(318, 212).setAlpha(0.88);
    }
    this.add.rectangle(195, 216, 276, 48, 0xffffff, 0.10).setStrokeStyle(1, 0xffe08a, 0.45);
    this.statusText = this.add.text(195, 210, '', goldText(13)).setOrigin(0.5);
    this.challengeText = this.add.text(195, 232, '', mutedText(9)).setOrigin(0.5);
    this.add.rectangle(195, 252, 276, 10, 0x07142c, 0.62).setStrokeStyle(1, 0xffffff, 0.16);
    this.progressFill = this.add.rectangle(57, 252, 0, 8, 0xffd86f, 0.9).setOrigin(0, 0.5);
    this.promptText = this.add.text(195, 292, '', applyWrap(bodyText(15), 294)).setOrigin(0.5);
    this.add.rectangle(195, 352, 252, 86, 0x080b1f, 0.82).setStrokeStyle(3, 0xffd86f, 0.56);
    this.equationText = this.add.text(195, 352, '', titleText(38)).setOrigin(0.5);
    this.hintText = this.add.text(195, 447, '', applyWrap(mutedText(12), 288)).setOrigin(0.5);
  }

  private drawProblem(): void {
    const problem = this.currentProblem();
    this.locked = false;
    this.answerLayer?.destroy(true);
    this.answerLayer = this.add.container(0, 0);
    this.statusText?.setText(`문제 ${this.index + 1}/${this.stage.problems.length} · 점수 ${this.score} · 콤보 ${this.combo} · 생명 ${'♥'.repeat(this.hearts)}`);
    this.challengeText?.setText(`${this.stage.difficulty} 문제팩 · 연속 정답 보너스와 단계 보상이 같이 적용됩니다.`);
    this.progressFill?.setDisplaySize(276 * ((this.index + 1) / this.stage.problems.length), 8);
    this.promptText?.setText(problem.prompt);
    this.equationText?.setText(problem.expression);
    this.hintText?.setText(`힌트: ${problem.hint}`);

    const choices = this.shuffle(problem.choices);
    choices.forEach((answer, slot) => {
      const x = slot % 2 === 0 ? 112 : 278;
      const y = 542 + Math.floor(slot / 2) * 98;
      this.drawAnswerCard(problem, answer, x, y);
    });
  }

  private drawAnswerCard(problem: MathProblem, answer: number, x: number, y: number): void {
    const group = this.add.container(x, y);
    this.answerLayer?.add(group);
    if (this.textures.exists('uiPanelGold')) group.add(this.add.image(0, 0, 'uiPanelGold').setDisplaySize(136, 76));
    else group.add(this.add.rectangle(0, 0, 136, 76, 0xffd86f, 0.94).setStrokeStyle(3, 0xffffff, 0.72));
    group.add(this.add.text(0, 0, `${answer}`, darkText(28)).setOrigin(0.5));
    group.add(this.add.text(0, 30, '숫자 카드', cardText(10)).setOrigin(0.5).setAlpha(0.7));
    group.setSize(142, 82).setInteractive({ useHandCursor: true });
    group.on('pointerover', () => { if (!this.locked) this.tweens.add({ targets: group, scale: 1.04, duration: 110 }); });
    group.on('pointerout', () => { if (!this.locked) this.tweens.add({ targets: group, scale: 1, duration: 110 }); });
    group.on('pointerup', () => this.chooseAnswer(group, problem, answer));
  }

  private chooseAnswer(group: Phaser.GameObjects.Container, problem: MathProblem, answer: number): void {
    if (this.locked) return;
    this.locked = true;
    const correct = answer === problem.answer;
    if (correct) {
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.score += 120 + this.combo * 15;
      this.flash(0xffe08a, 0.14);
      if (isMotionEnabled(this.quality)) this.tweens.add({ targets: group, scale: 1.18, duration: 110, yoyo: true, ease: 'Back.easeOut' });
      this.spawnResultText(group.x, group.y - 56, '정답!', 0xffe08a);
    } else {
      this.combo = 0;
      this.hearts -= 1;
      this.flash(0xff6f91, 0.13);
      if (isMotionEnabled(this.quality)) this.cameras.main.shake(130, 0.004);
      this.spawnResultText(group.x, group.y - 56, `정답은 ${problem.answer}`, 0xff9bb0);
    }

    this.time.delayedCall(540, () => {
      if (this.hearts <= 0) {
        this.finish(false);
        return;
      }
      this.index += 1;
      if (this.index >= this.stage.problems.length) this.finish(true);
      else this.drawProblem();
    });
  }

  private finish(success: boolean): void {
    const solved = success ? this.stage.problems.length : this.index;
    const difficultyBonus = this.stage.difficulty === '도전' ? 80 : this.stage.difficulty === '집중' ? 40 : 0;
    const stars = success ? (this.hearts >= 3 ? 3 : this.hearts >= 2 ? 2 : 1) : 1;
    const finalScore = Math.max(80, this.score + solved * 25 + difficultyBonus + this.stage.id * 12);
    NavigationSystem.safeStart(this, 'RewardScene', { modeId: 'math', stage: this.stage.id, score: finalScore, bestCombo: this.bestCombo, stars, stepsLeft: this.hearts });
  }

  private difficultyRewardLabel(): string {
    const bonus = this.stage.difficulty === '도전' ? '보스 보상 +++' : this.stage.difficulty === '집중' ? '집중 보상 ++' : '기본 보상 +';
    return `${bonus} · 단계 ${this.stage.id} 클리어 시 카드팩 기대치 상승`;
  }

  private currentProblem(): MathProblem {
    return this.stage.problems[this.index] ?? this.stage.problems[this.stage.problems.length - 1];
  }

  private shuffle<T>(items: readonly T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }

  private flash(color: number, alpha: number): void {
    const l = layout(this);
    const overlay = this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, color, alpha).setDepth(2000);
    this.tweens.add({ targets: overlay, alpha: 0, duration: 260, onComplete: () => overlay.destroy() });
  }

  private spawnResultText(x: number, y: number, label: string, color: number): void {
    const text = this.add.text(x, y, label, { ...titleText(18), color: `#${color.toString(16).padStart(6, '0')}` }).setOrigin(0.5).setDepth(2001);
    this.tweens.add({ targets: text, y: y - 24, alpha: 0, duration: 620, ease: 'Sine.easeOut', onComplete: () => text.destroy() });
  }
}
