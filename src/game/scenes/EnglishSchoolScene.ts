import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { allowAmbientMotion, ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, scaledDuration } from '../systems/QualitySystem';
import { EnglishCard, EnglishStage, getEnglishStage } from '../data/englishStages';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, cardText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';

export class EnglishSchoolScene extends Phaser.Scene {
  private stageId = 1;
  private stage!: EnglishStage;
  private deck: EnglishCard[] = [];
  private index = 0;
  private score = 0;
  private combo = 0;
  private bestCombo = 0;
  private hearts = 3;
  private locked = false;
  private questionLayer?: Phaser.GameObjects.Container;
  private wordText?: Phaser.GameObjects.Text;
  private exampleText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;
  private progressFill?: Phaser.GameObjects.Rectangle;
  private quality: CardVilleQuality = getCardVilleQuality();

  constructor() { super('EnglishSchoolScene'); }

  init(data: { stage?: number } = {}): void {
    this.stageId = data.stage ?? 1;
  }

  create(): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    this.stage = getEnglishStage(this.stageId);
    this.deck = this.shuffle(this.stage.cards);
    this.index = 0;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hearts = 3;
    this.locked = false;

    DrawSystem.background(this, '영어 학교');
    this.drawSchoolDecor();
    this.add.text(195, 94, this.stage.title, goldText(24)).setOrigin(0.5);
    this.add.text(195, 122, `${this.stage.subtitle} · ${this.stage.difficulty} · ${this.stage.theme}`, applyWrap(mutedText(12), 314)).setOrigin(0.5);
    this.add.text(195, 148, this.lessonRewardLabel(), goldText(10)).setOrigin(0.5).setAlpha(0.9);
    this.drawClassBoard();
    this.drawQuestion();
    new GameButton(this, 195, 768, '광장으로', 238, 54, 0xc9f4ff).onClick(() => NavigationSystem.safeStart(this, 'MainLobbyScene'));
    this.showEnglishCoach();
  }

  private showEnglishCoach(): void {
    CoachMarkSystem.showOnce(this, {
      id: 'english_meaning_choice_v140',
      title: '영어 학교 수업 팁',
      body: '가운데 영어 단어와 예문을 보고 아래 뜻 카드 4장 중 하나를 고르세요. 연속 정답은 콤보와 영어 카드팩 보상 기대치를 올립니다.',
      x: 195,
      y: 650,
      width: 324,
      tone: 'blue',
      anchorX: 195,
      anchorY: 348
    });
  }

  private drawSchoolDecor(): void {
    const l = layout(this);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, 432, l.visibleWidth, 690, 0xffe8a6, 0.06);
    if (this.textures.exists('dioramaSchool')) this.add.image(314, 168, 'dioramaSchool').setDisplaySize(94, 82).setAlpha(0.9);
    if (this.textures.exists('npcTeacher')) this.add.image(72, 184, 'npcTeacher').setDisplaySize(54, 72).setAlpha(0.96);
    for (let i = 0; i < ambientCount(8, this.quality, 2); i += 1) {
      const x = 36 + i * 45;
      const y = 182 + (i % 4) * 86;
      const sparkle = this.textures.exists('particleSparkle')
        ? this.add.image(x, y, 'particleSparkle').setDisplaySize(12, 12)
        : this.add.text(x, y, 'ABC'[i % 3], mutedText(10)).setOrigin(0.5);
      sparkle.setAlpha(0.30).setDepth(2);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: sparkle, y: y - 14, alpha: 0.08, duration: scaledDuration(1100 + i * 80, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawClassBoard(): void {
    panel(this, 195, 404, 342, 466, 34);
    this.add.rectangle(195, 218, 286, 52, 0xffffff, 0.10).setStrokeStyle(1, 0xffd86f, 0.38);
    this.statusText = this.add.text(195, 211, '', goldText(13)).setOrigin(0.5);
    this.add.text(195, 234, '영어 단어와 뜻을 맞추면 콤보 보상이 올라가요.', mutedText(9)).setOrigin(0.5);
    this.add.rectangle(195, 258, 276, 10, 0x07142c, 0.62).setStrokeStyle(1, 0xffffff, 0.16);
    this.progressFill = this.add.rectangle(57, 258, 0, 8, 0x9fe7ff, 0.92).setOrigin(0, 0.5);
    this.add.rectangle(195, 348, 262, 112, 0x08233f, 0.84).setStrokeStyle(3, 0xffd86f, 0.48);
    this.wordText = this.add.text(195, 326, '', titleText(42)).setOrigin(0.5);
    this.exampleText = this.add.text(195, 382, '', applyWrap(bodyText(13), 238)).setOrigin(0.5).setAlpha(0.92);
    this.hintText = this.add.text(195, 452, '', applyWrap(mutedText(12), 288)).setOrigin(0.5);
  }

  private drawQuestion(): void {
    const card = this.currentCard();
    this.locked = false;
    this.questionLayer?.destroy(true);
    this.questionLayer = this.add.container(0, 0);
    this.statusText?.setText(`문제 ${this.index + 1}/${this.deck.length} · 점수 ${this.score} · 콤보 ${this.combo} · 생명 ${'♥'.repeat(this.hearts)}`);
    this.progressFill?.setDisplaySize(276 * ((this.index + 1) / this.deck.length), 8);
    this.wordText?.setText(card.word);
    this.exampleText?.setText(card.example);
    this.hintText?.setText(`힌트: ${card.hint}`);
    const choices = this.makeChoices(card);
    choices.forEach((choice, slot) => {
      const x = slot % 2 === 0 ? 112 : 278;
      const y = 544 + Math.floor(slot / 2) * 98;
      this.drawChoiceCard(card, choice, x, y);
    });
  }

  private makeChoices(card: EnglishCard): EnglishCard[] {
    const others = this.stage.cards.filter((item) => item.id !== card.id);
    return this.shuffle([card, ...this.shuffle(others).slice(0, 3)]);
  }

  private drawChoiceCard(answer: EnglishCard, choice: EnglishCard, x: number, y: number): void {
    const group = this.add.container(x, y);
    this.questionLayer?.add(group);
    group.add(this.add.rectangle(0, 0, 136, 76, 0xfffbf1, 0.94).setStrokeStyle(3, 0xffd86f, 0.62));
    group.add(this.add.text(0, -6, choice.meaning, darkText(choice.meaning.length > 5 ? 17 : 20)).setOrigin(0.5));
    group.add(this.add.text(0, 27, '뜻 카드', cardText(10)).setOrigin(0.5).setAlpha(0.7));
    group.setSize(142, 82).setInteractive({ useHandCursor: true });
    group.on('pointerover', () => { if (!this.locked) this.tweens.add({ targets: group, scale: 1.04, duration: 110 }); });
    group.on('pointerout', () => { if (!this.locked) this.tweens.add({ targets: group, scale: 1, duration: 110 }); });
    group.on('pointerup', () => this.chooseAnswer(group, answer, choice));
  }

  private chooseAnswer(group: Phaser.GameObjects.Container, answer: EnglishCard, choice: EnglishCard): void {
    if (this.locked) return;
    this.locked = true;
    const correct = choice.id === answer.id;
    if (correct) {
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.score += 105 + this.combo * 18 + this.stage.id * 8;
      this.flash(0x9fe7ff, 0.14);
      if (isMotionEnabled(this.quality)) this.tweens.add({ targets: group, scale: 1.16, duration: 110, yoyo: true, ease: 'Back.easeOut' });
      this.spawnResultText(group.x, group.y - 56, 'Good!', 0x9fe7ff);
    } else {
      this.combo = 0;
      this.hearts -= 1;
      this.flash(0xff9ab1, 0.13);
      if (isMotionEnabled(this.quality)) this.cameras.main.shake(120, 0.0035);
      this.spawnResultText(group.x, group.y - 56, `${answer.meaning}`, 0xffd86f);
    }

    this.time.delayedCall(540, () => {
      if (this.hearts <= 0) {
        this.finish(false);
        return;
      }
      this.index += 1;
      if (this.index >= this.deck.length) this.finish(true);
      else this.drawQuestion();
    });
  }

  private finish(success: boolean): void {
    const solved = success ? this.deck.length : this.index;
    const difficultyBonus = this.stage.difficulty === '도전' ? 80 : this.stage.difficulty === '연습' ? 42 : 18;
    const stars = success ? (this.hearts >= 3 ? 3 : this.hearts >= 2 ? 2 : 1) : 1;
    const finalScore = Math.max(90, this.score + solved * 24 + difficultyBonus + this.stage.id * 15);
    NavigationSystem.safeStart(this, 'RewardScene', { modeId: 'english', stage: this.stage.id, score: finalScore, bestCombo: this.bestCombo, stars, stepsLeft: this.hearts });
  }

  private lessonRewardLabel(): string {
    const bonus = this.stage.difficulty === '도전' ? '챌린지 보상 +++' : this.stage.difficulty === '연습' ? '연습 보상 ++' : '첫 수업 보상 +';
    return `${bonus} · 영어 카드팩 기대치 상승`;
  }

  private currentCard(): EnglishCard {
    return this.deck[this.index] ?? this.deck[this.deck.length - 1];
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
