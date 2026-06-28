import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { GameButton } from '../ui/GameButton';
import { applyWrap, bodyText, cardSmallText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { CATEGORY_COLOR, CATEGORY_LABELS, getStageDeck, GoalCard, StageDeck, WordCard } from '../data/wordStages';
import { compactText, fitTextSize, hasTouchDebug, layout } from '../systems/LayoutSystem';

type ResumeState = {
  columns: WordCard[][];
  goalIndex: number;
  goalProgress: number;
  stepsLeft: number;
  moves: number;
  score: number;
  combo: number;
  bestCombo: number;
  hintsLeft: number;
  shufflesLeft: number;
};

export class PlayScene extends Phaser.Scene {
  private modeId = 'word';
  private stage = 1;
  private deck!: StageDeck;
  private columns: WordCard[][] = [];
  private goalIndex = 0;
  private goalProgress = 0;
  private stepsLeft = 0;
  private moves = 0;
  private score = 0;
  private combo = 0;
  private bestCombo = 0;
  private hintsLeft = 2;
  private shufflesLeft = 1;
  private inputLocked = false;
  private bonusMeter = 0;

  private hudLayer!: Phaser.GameObjects.Container;
  private goalLayer!: Phaser.GameObjects.Container;
  private boardLayer!: Phaser.GameObjects.Container;
  private effectLayer!: Phaser.GameObjects.Container;

  private goalTitleText!: Phaser.GameObjects.Text;
  private goalMetaText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private stepText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private meterText!: Phaser.GameObjects.Text;
  private noteText!: Phaser.GameObjects.Text;
  private hintButton?: GameButton;
  private shuffleButton?: GameButton;
  private resumeState?: ResumeState;

  constructor() { super('PlayScene'); }

  init(data: { modeId?: string; stage?: number; continueState?: ResumeState }): void {
    this.modeId = data.modeId ?? 'word';
    this.stage = data.stage ?? 1;
    this.resumeState = data.continueState;
  }

  create(): void {
    const profile = SaveSystem.loadProfile();
    this.deck = getStageDeck(this.stage);

    if (this.resumeState) {
      this.columns = this.cloneColumns(this.resumeState.columns);
      this.goalIndex = this.resumeState.goalIndex;
      this.goalProgress = this.resumeState.goalProgress;
      this.stepsLeft = this.resumeState.stepsLeft;
      this.moves = this.resumeState.moves;
      this.score = this.resumeState.score;
      this.combo = this.resumeState.combo;
      this.bestCombo = this.resumeState.bestCombo;
      this.hintsLeft = this.resumeState.hintsLeft;
      this.shufflesLeft = this.resumeState.shufflesLeft;
    } else {
      this.columns = this.cloneColumns(this.deck.columns);
      this.goalIndex = 0;
      this.goalProgress = 0;
      this.stepsLeft = this.deck.steps;
      this.moves = 0;
      this.score = 0;
      this.combo = 0;
      this.bestCombo = 0;
      this.hintsLeft = this.deck.difficulty === '도전' ? 2 : 1;
      this.shufflesLeft = this.deck.difficulty === '도전' ? 2 : 1;
      this.bonusMeter = 0;
    }

    DrawSystem.background(this, `말 카드 · ${this.stage}`);
    DrawSystem.topHud(this, profile.coins, profile.level);
    this.drawHud();
    this.goalLayer = this.add.container(0, 0);
    this.boardLayer = this.add.container(0, 0);
    this.effectLayer = this.add.container(0, 0);
    this.drawGoalArea();
    this.drawSidePanel();
    this.noteText = this.add.text(195, 812, '맨 위 카드만 선택됩니다. 목표 계열을 보고 카드 스택을 정리하세요.', applyWrap(mutedText(12), 366)).setOrigin(0.5);
    this.redrawBoard();
    this.refreshHud();
  }

  private cloneColumns(columns: WordCard[][]): WordCard[][] {
    return columns.map((column) => column.map((card) => ({ ...card })));
  }

  private currentGoal(): GoalCard {
    return this.deck.goals[this.goalIndex] ?? this.deck.goals[this.deck.goals.length - 1];
  }

  private drawHud(): void {
    this.hudLayer = this.add.container(0, 0);
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.66);
    g.fillRoundedRect(72, 128, 310, 44, 20);
    g.lineStyle(1, 0xffffff, 0.22);
    g.strokeRoundedRect(72, 128, 310, 44, 20);
    g.fillStyle(0xffffff, 0.10);
    g.fillRoundedRect(80, 136, 116, 28, 14);
    g.fillRoundedRect(202, 136, 82, 28, 14);
    g.fillRoundedRect(290, 136, 84, 28, 14);
    if (this.textures.exists('assetTrophy')) this.add.image(94, 150, 'assetTrophy').setDisplaySize(22, 22);
    if (this.textures.exists('assetCombo')) this.add.image(216, 150, 'assetCombo').setDisplaySize(22, 22);
    this.scoreText = this.add.text(140, 150, '0점', goldText(13)).setOrigin(0.5);
    this.comboText = this.add.text(252, 150, '콤보 0', bodyText(12)).setOrigin(0.5);
    this.meterText = this.add.text(333, 150, '보너스 0', mutedText(10)).setOrigin(0.5);
    this.hudLayer.add([g, this.scoreText, this.comboText, this.meterText]);
  }

  private drawSidePanel(): void {
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.66);
    g.fillRoundedRect(5, 150, 58, 150, 18);
    g.lineStyle(2, 0x8fd3ff, 0.34);
    g.strokeRoundedRect(5, 150, 58, 150, 18);
    g.fillStyle(0xffffff, 0.10);
    g.fillRoundedRect(11, 160, 46, 25, 12);
    this.add.text(34, 173, '스텝', bodyText(11)).setOrigin(0.5);
    this.stepText = this.add.text(34, 225, `${this.stepsLeft}`, titleText(40)).setOrigin(0.5);
    this.add.text(34, 281, '남은 수', mutedText(9)).setOrigin(0.5);

    this.drawMiniSlot(34, 344, '힌트', 0x8fd3ff);
    this.hintButton = new GameButton(this, 34, 405, `힌트${this.hintsLeft}`, 58, 48, 0x8fd3ff).onClick(() => this.useHint());
    this.drawMiniSlot(34, 448, '섞기', 0xf0c7ff);
    this.shuffleButton = new GameButton(this, 34, 509, `섞기${this.shufflesLeft}`, 58, 48, 0xf0c7ff).onClick(() => this.useShuffle());

    new GameButton(this, 34, 614, '나감', 58, 48, 0xc9f4ff).onClick(() => this.scene.start('StageSelectScene', { modeId: this.modeId, title: '말 카드' }));
  }

  private drawMiniSlot(x: number, y: number, label: string, color: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.52);
    g.fillRoundedRect(x - 28, y - 27, 56, 46, 14);
    g.lineStyle(1, color, 0.46);
    g.strokeRoundedRect(x - 28, y - 27, 56, 46, 14);
    g.fillStyle(color, 0.24);
    g.fillCircle(x, y - 3, 14);
    const iconKey = label === '힌트' ? 'assetStar' : 'assetPack';
    if (this.textures.exists(iconKey)) this.add.image(x, y - 3, iconKey).setDisplaySize(26, 26);
    this.add.text(x, y + 22, label, mutedText(9)).setOrigin(0.5);
  }

  private drawGoalArea(): void {
    this.goalLayer.removeAll(true);
    const goal = this.currentGoal();
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.38);
    g.fillRoundedRect(68, 184, 316, 172, 24);
    g.lineStyle(1, 0xffffff, 0.24);
    g.strokeRoundedRect(68, 184, 316, 172, 24);
    g.fillStyle(0xffffff, 0.11);
    g.fillRoundedRect(82, 194, 288, 26, 12);
    this.goalLayer.add(g);

    this.drawGoalCard(208, 267, 132, 130, goal);
    this.drawBackCardToLayer(this.goalLayer, 338, 267, 76, 98, `${Math.max(0, this.deck.goals.length - this.goalIndex - 1)}`);
    this.goalTitleText = this.add.text(208, 334, `목표 ${this.goalIndex + 1}/${this.deck.goals.length}`, goldText(13)).setOrigin(0.5);
    this.goalMetaText = this.add.text(208, 207, `${this.deck.title} · ${this.deck.difficulty}`, mutedText(11)).setOrigin(0.5);
    this.progressText = this.add.text(208, 352, `${this.goalProgress}/${goal.needed}`, bodyText(13)).setOrigin(0.5);
    this.goalLayer.add([this.goalTitleText, this.goalMetaText, this.progressText]);
  }

  private drawGoalCard(x: number, y: number, w: number, h: number, goal: GoalCard): void {
    const g = this.add.graphics();
    const color = CATEGORY_COLOR[goal.category];
    g.fillStyle(0x000000, 0.23);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 8, w, h, 19);
    g.fillStyle(0xfffbf1, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 19);
    g.lineStyle(5, color, 1);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 19);
    g.fillStyle(color, 0.22);
    g.fillRoundedRect(x - w / 2 + 8, y - h / 2 + 8, w - 16, 28, 11);
    g.fillStyle(0xffffff, 0.28);
    g.fillRoundedRect(x - w / 2 + 12, y - h / 2 + 45, w - 24, 12, 6);
    const label = this.add.text(x, y - 6, goal.label, applyWrap(cardText(fitTextSize(goal.label, 24, 14)), w - 16)).setOrigin(0.5);
    const tag = this.add.text(x, y + 42, CATEGORY_LABELS[goal.category], cardSmallText(10)).setOrigin(0.5);
    this.goalLayer.add([g, label, tag]);
  }


  private boardLayout(): { xs: number[]; baseY: number; cardW: number; cardH: number; gapY: number; railX: number; railY: number; railW: number; railH: number } {
    return {
      xs: [108, 187, 266, 345],
      baseY: 430,
      cardW: 76,
      cardH: 96,
      gapY: 43,
      railX: layout().boardLeft,
      railY: 378,
      railW: layout().boardWidth,
      railH: 340
    };
  }

  private redrawBoard(): void {
    this.boardLayer.removeAll(true);
    const { xs, baseY, cardW, cardH, gapY, railX, railY, railW, railH } = this.boardLayout();

    const rail = this.add.graphics();
    rail.fillStyle(0x07142c, 0.34);
    rail.fillRoundedRect(railX, railY, railW, railH, 26);
    rail.lineStyle(2, 0xffffff, 0.16);
    rail.strokeRoundedRect(railX, railY, railW, railH, 26);
    rail.fillStyle(0xffffff, 0.055);
    for (const x of xs) rail.fillRoundedRect(x - cardW / 2 - 5, railY + 12, cardW + 10, railH - 24, 18);
    this.boardLayer.add(rail);

    this.columns.forEach((column, colIndex) => {
      const columnHeight = Math.max(1, column.length);
      const topY = baseY + Math.max(0, columnHeight - 1) * gapY;
      const glow = this.add.rectangle(xs[colIndex], topY, cardW + 12, cardH + 12, 0xffffff, 0.025);
      this.boardLayer.add(glow);
      column.forEach((card, rowIndex) => {
        const x = xs[colIndex];
        const y = baseY + rowIndex * gapY;
        const isTop = rowIndex === column.length - 1;
        this.boardLayer.add(this.createWordCard(card, colIndex, x, y, cardW, cardH, isTop));
      });
      if (!column.length) {
        const empty = this.add.graphics();
        empty.lineStyle(2, 0xffffff, 0.16);
        empty.strokeRoundedRect(xs[colIndex] - cardW / 2, baseY - cardH / 2, cardW, cardH, 14);
        this.boardLayer.add(empty);
        const done = this.add.text(xs[colIndex], baseY, '완료', mutedText(11)).setOrigin(0.5);
        this.boardLayer.add(done);
      }
    });
  }

  private createWordCard(card: WordCard, colIndex: number, x: number, y: number, w: number, h: number, interactive: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setName(`card:${card.id}`);
    const g = this.add.graphics();
    const color = CATEGORY_COLOR[card.category];
    g.fillStyle(0x000000, 0.28);
    g.fillRoundedRect(-w / 2 + 4, -h / 2 + 8, w, h, 16);
    g.fillGradientStyle(0xffffff, 0xffffff, interactive ? 0xfff1dc : 0xf5dfbb, interactive ? 0xfffbf1 : 0xffefd0, 1, 1, 1, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
    g.lineStyle(3, interactive ? color : 0xffcc73, interactive ? 1 : 0.72);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    g.lineStyle(1, 0xffffff, 0.94);
    g.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 11);
    g.fillStyle(color, interactive ? 0.96 : 0.6);
    g.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w - 10, 22, 9);
    g.fillStyle(0xffffff, interactive ? 0.22 : 0.1);
    g.fillEllipse(-w / 2 + 15, -h / 2 + 50, 14, 20);
    g.fillEllipse(w / 2 - 16, h / 2 - 16, 18, 14);

    const frameKey = interactive ? 'assetFrameRare' : 'assetFrameEpic';
    const frame = this.textures.exists(frameKey) ? this.add.image(0, 0, frameKey).setDisplaySize(w + 18, h + 18).setAlpha(interactive ? 0.30 : 0.16) : null;
    const shine = this.textures.exists('effectShine') ? this.add.image(0, -10, 'effectShine').setDisplaySize(w + 10, h + 10).setAlpha(interactive ? 0.09 : 0.04) : null;
    const tag = this.add.text(0, -h / 2 + 16, compactText(card.tag, 6), cardSmallText(9)).setOrigin(0.5);
    const label = this.add.text(0, 10, card.label, applyWrap(cardText(fitTextSize(card.label, 22, 12)), w - 12)).setOrigin(0.5);
    const contents: Phaser.GameObjects.GameObject[] = frame ? [g, frame] : [g];
    if (shine) contents.push(shine);
    contents.push(tag, label);
    container.add(contents);

    if (interactive) {
      const zone = this.add.zone(0, 0, w + 2, h + 2).setOrigin(0.5).setInteractive({ useHandCursor: true });
      let downInside = false;
      zone.on('pointerdown', () => {
        if (this.inputLocked) return;
        downInside = true;
        this.tweens.add({ targets: container, scale: 0.965, duration: 55 });
      });
      zone.on('pointerup', () => {
        if (!downInside || this.inputLocked) return;
        downInside = false;
        this.tweens.add({ targets: container, scale: 1, duration: 70 });
        this.selectCard(card, colIndex, container);
      });
      zone.on('pointerout', () => {
        downInside = false;
        this.tweens.add({ targets: container, scale: 1, duration: 70 });
      });
      container.add(zone);
      if (hasTouchDebug()) {
        const debug = this.add.rectangle(0, 0, w + 2, h + 2, 0x00ff66, 0.12).setStrokeStyle(1, 0x00ff66, 0.75);
        container.add(debug);
      }
    } else {
      container.setAlpha(0.82);
    }

    return container;
  }

  private drawBackCardToLayer(layer: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, count: string): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.24);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 8, w, h, 16);
    layer.add(g);
    if (this.textures.exists('assetCardBackStar')) {
      const back = this.add.image(x, y, 'assetCardBackStar').setDisplaySize(w, h);
      layer.add(back);
    } else {
      const card = this.add.graphics();
      card.fillGradientStyle(0xffad27, 0xff8a19, 0xff6f11, 0xff9b24, 1, 1, 1, 1);
      card.fillRoundedRect(x - w / 2, y - h / 2, w, h, 16);
      card.lineStyle(4, 0xffffff, 0.9);
      card.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 16);
      layer.add(card);
    }
    const text = this.add.text(x - 18, y + h / 2 - 16, count, bodyText(14)).setOrigin(0.5);
    layer.add(text);
  }

  private selectCard(card: WordCard, colIndex: number, source: Phaser.GameObjects.Container): void {
    if (this.inputLocked || this.stepsLeft <= 0) return;
    const column = this.columns[colIndex];
    const top = column[column.length - 1];
    if (!top || top.id !== card.id) return;

    this.inputLocked = true;
    this.moves += 1;
    this.stepsLeft -= 1;

    const goal = this.currentGoal();
    if (card.category === goal.category) {
      const streakBonus = Math.min(this.combo, 6) * 25;
      const meterBonus = this.bonusMeter >= 4 ? 80 : 0;
      const earned = 100 + streakBonus + meterBonus;
      this.score += earned;
      this.combo += 1;
      this.bonusMeter = meterBonus > 0 ? 0 : Math.min(4, this.bonusMeter + 1);
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.goalProgress += 1;
      column.pop();
      this.noteText.setText(meterBonus > 0 ? `보너스 정답! ${card.label} +${earned}` : `정답! ${CATEGORY_LABELS[goal.category]} 계열이에요. +${earned}`);
      this.animateCorrect(source, earned);
      this.time.delayedCall(230, () => this.afterCorrect());
      return;
    }

    this.combo = 0;
    this.bonusMeter = 0;
    this.score = Math.max(0, this.score - 30);
    this.noteText.setText(`${card.label}은(는) ${goal.label} 계열이 아니에요. 맨 위 카드만 신중하게 골라요.`);
    this.animateWrong(source);
    this.time.delayedCall(240, () => {
      this.inputLocked = false;
      this.refreshHud();
      this.redrawBoard();
      if (this.stepsLeft <= 0) this.finish(false);
    });
  }

  private afterCorrect(): void {
    const goal = this.currentGoal();
    if (this.goalProgress >= goal.needed) {
      this.flyText(195, 374, '목표 완료!', 0xffd86f);
      this.goalIndex += 1;
      this.goalProgress = 0;
      if (this.goalIndex >= this.deck.goals.length) {
        this.time.delayedCall(360, () => this.finish(true));
        return;
      }
      this.time.delayedCall(220, () => {
        this.drawGoalArea();
        this.redrawBoard();
        this.refreshHud();
        this.inputLocked = false;
        this.noteText.setText('새 목표가 나왔어요. 맨 위 카드부터 다시 살펴보세요.');
      });
      return;
    }

    this.redrawBoard();
    this.refreshHud();
    this.inputLocked = false;
    if (!this.findTopMatch()) this.noteText.setText('현재 맨 위 정답이 없을 수 있어요. 셔플이나 힌트를 써보세요.');
  }

  private useHint(): void {
    if (this.inputLocked || this.hintsLeft <= 0) return;
    const match = this.findTopMatch();
    this.hintsLeft -= 1;
    this.combo = 0;
    this.bonusMeter = 0;
    this.refreshHud();
    if (!match) {
      this.noteText.setText('현재 맨 위 카드에는 정답이 없어요. 셔플을 사용해보세요.');
      this.flyText(214, 392, '셔플 추천', 0x8fd3ff);
      return;
    }
    this.noteText.setText(`${match.card.label} 카드가 목표 계열이에요.`);
    this.highlightColumn(match.colIndex);
  }

  private useShuffle(): void {
    if (this.inputLocked || this.shufflesLeft <= 0) return;
    this.inputLocked = true;
    this.shufflesLeft -= 1;
    this.combo = 0;
    this.bonusMeter = 0;
    this.stepsLeft = Math.max(0, this.stepsLeft - 1);
    const sizes = this.columns.map((column) => column.length);
    const cards = this.columns.flat();
    Phaser.Utils.Array.Shuffle(cards);
    this.columns = sizes.map((size) => cards.splice(0, size));
    this.noteText.setText('남은 카드 스택을 섞었어요. 셔플은 스텝 1을 사용합니다.');
    this.redrawBoard();
    this.refreshHud();
    this.flyText(220, 430, '셔플!', 0xf0c7ff);
    this.time.delayedCall(180, () => {
      this.inputLocked = false;
      if (this.stepsLeft <= 0) this.finish(false);
    });
  }

  private findTopMatch(): { card: WordCard; colIndex: number } | null {
    const goal = this.currentGoal();
    for (let colIndex = 0; colIndex < this.columns.length; colIndex += 1) {
      const card = this.columns[colIndex][this.columns[colIndex].length - 1];
      if (card?.category === goal.category) return { card, colIndex };
    }
    return null;
  }

  private highlightColumn(colIndex: number): void {
    const { xs, baseY, gapY, cardW, cardH } = this.boardLayout();
    const y = baseY + Math.max(0, this.columns[colIndex].length - 1) * gapY;
    const marker = this.add.rectangle(xs[colIndex], y, cardW + 14, cardH + 14, 0x7cf2bd, 0.12).setStrokeStyle(4, 0x7cf2bd, 0.95);
    this.effectLayer.add(marker);
    this.tweens.add({ targets: marker, scale: 1.12, alpha: 0, duration: 850, ease: 'Sine.easeOut', onComplete: () => marker.destroy() });
  }

  private animateCorrect(source: Phaser.GameObjects.Container, points: number): void {
    this.flash(0x58ffba);
    if (this.textures.exists('effectCorrect')) {
      const effect = this.add.image(source.x, source.y, 'effectCorrect').setDisplaySize(110, 110).setAlpha(0.72);
      this.effectLayer.add(effect);
      this.tweens.add({ targets: effect, scale: 1.45, alpha: 0, duration: 360, ease: 'Sine.easeOut', onComplete: () => effect.destroy() });
    }
    this.tweens.add({ targets: source, y: source.y - 24, alpha: 0, scale: 1.10, angle: 4, duration: 220, ease: 'Back.easeIn', onComplete: () => source.destroy() });
    this.flyText(source.x, source.y - 64, `+${points}`, 0x58ffba);
  }

  private animateWrong(source: Phaser.GameObjects.Container): void {
    this.cameras.main.shake(120, 0.004);
    this.flash(0xff5e7a);
    if (this.textures.exists('effectWrong')) {
      const effect = this.add.image(source.x, source.y, 'effectWrong').setDisplaySize(94, 94).setAlpha(0.54);
      this.effectLayer.add(effect);
      this.tweens.add({ targets: effect, scale: 1.28, alpha: 0, duration: 300, ease: 'Sine.easeOut', onComplete: () => effect.destroy() });
    }
    const originalX = source.x;
    this.tweens.add({ targets: source, x: originalX + 5, yoyo: true, repeat: 3, duration: 38, onComplete: () => { source.x = originalX; } });
    this.flyText(source.x, source.y - 64, '-30', 0xff8aa0);
  }

  private flyText(x: number, y: number, text: string, color: number): void {
    const style = color === 0xff8aa0 ? mutedText(16) : goldText(16);
    const obj = this.add.text(x, y, text, style).setOrigin(0.5).setTint(color);
    this.effectLayer.add(obj);
    this.tweens.add({ targets: obj, y: y - 34, alpha: 0, duration: 720, ease: 'Sine.easeOut', onComplete: () => obj.destroy() });
  }

  private flash(color: number): void {
    const rect = this.add.rectangle(195, 422, 390, 844, color, 0.08);
    this.effectLayer.add(rect);
    this.tweens.add({ targets: rect, alpha: 0, duration: 180, onComplete: () => rect.destroy() });
  }

  private refreshHud(): void {
    const goal = this.currentGoal();
    this.stepText?.setText(`${this.stepsLeft}`);
    this.scoreText?.setText(`${this.score}점`);
    this.comboText?.setText(this.combo > 0 ? `콤보 ${this.combo}` : '콤보 0');
    this.meterText?.setText(`보너스 ${this.bonusMeter}/4`);
    this.progressText?.setText(`${this.goalProgress}/${goal.needed}`);
    this.goalTitleText?.setText(`목표 ${Math.min(this.goalIndex + 1, this.deck.goals.length)}/${this.deck.goals.length}`);
    this.hintButton?.setLabel(`힌트${this.hintsLeft}`).setDisabled(this.hintsLeft <= 0);
    this.shuffleButton?.setLabel(`섞기${this.shufflesLeft}`).setDisabled(this.shufflesLeft <= 0);
  }

  private finish(success: boolean): void {
    this.inputLocked = true;
    this.scene.start('ResultScene', {
      modeId: this.modeId,
      stage: this.stage,
      moves: this.moves,
      stepsLeft: this.stepsLeft,
      score: this.score,
      bestCombo: this.bestCombo,
      failed: !success
    });
  }
}
