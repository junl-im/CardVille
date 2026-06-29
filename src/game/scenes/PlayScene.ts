import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { GameButton } from '../ui/GameButton';
import { applyWrap, bodyText, cardSmallText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { CATEGORY_COLOR, CATEGORY_LABELS, getStageDeck, GoalCard, StageDeck, WordCard } from '../data/wordStages';
import { applyResponsiveCamera, compactText, distributeColumns, fitTextSize, hasTouchDebug, layout, playArea } from '../systems/LayoutSystem';
import { ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, scaledDuration } from '../systems/QualitySystem';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';

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
  bonusMeter: number;
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
  private quality: CardVilleQuality = getCardVilleQuality();

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
  private comboCoachText!: Phaser.GameObjects.Text;
  private noteText!: Phaser.GameObjects.Text;
  private bonusPipRects: Phaser.GameObjects.Rectangle[] = [];
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
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
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
      this.bonusMeter = this.resumeState.bonusMeter ?? 0;
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
    this.drawPremiumBottomRail();
    this.comboCoachText = this.add.text(195, 788, '콤보 코치 · 연속 정답으로 보너스 게이지를 채우세요.', applyWrap(goldText(10), Math.min(410, layout(this).visibleWidth - 34))).setOrigin(0.5);
    this.noteText = this.add.text(195, 816, '맨 위 카드만 선택됩니다. 목표 계열을 보고 카드 스택을 정리하세요.', applyWrap(mutedText(11), Math.min(420, layout(this).visibleWidth - 28))).setOrigin(0.5);
    this.redrawBoard();
    this.refreshHud();
    this.showWordCoach();
  }


  private showWordCoach(): void {
    CoachMarkSystem.showOnce(this, {
      id: 'word_top_card_coach_v140',
      title: '도서관 카드 정리법',
      body: '각 열의 맨 위 카드만 터치돼요. 목표 계열과 맞는 TOP 카드가 없으면 복구 버튼으로 스택을 섞고, 힌트는 정답 TOP 카드가 있을 때만 켜집니다.',
      x: 232,
      y: 682,
      width: 304,
      tone: 'gold',
      anchorX: 88,
      anchorY: 405
    });
  }


  private drawPremiumBottomRail(): void {
    const l = layout(this);
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.66);
    g.fillRoundedRect(l.visibleX + 18, 768, l.visibleWidth - 36, 64, 22);
    g.lineStyle(1, 0xffffff, 0.14);
    g.strokeRoundedRect(l.visibleX + 18, 768, l.visibleWidth - 36, 64, 22);
    g.fillStyle(0x8fd3ff, 0.10);
    g.fillRoundedRect(l.visibleX + 34, 778, 74, 8, 4);
    g.fillStyle(0xffd86f, 0.10);
    g.fillRoundedRect(l.visibleX + l.visibleWidth - 108, 778, 74, 8, 4);
    this.bonusPipRects = [];
    const startX = 129;
    for (let i = 0; i < 4; i += 1) {
      const pip = this.add.rectangle(startX + i * 44, 801, 30, 8, 0x26334f, 0.58).setStrokeStyle(1, 0xffffff, 0.15);
      this.bonusPipRects.push(pip);
    }
  }

  private cloneColumns(columns: WordCard[][]): WordCard[][] {
    return columns.map((column) => column.map((card) => ({ ...card })));
  }

  private currentGoal(): GoalCard {
    return this.deck.goals[this.goalIndex] ?? this.deck.goals[this.deck.goals.length - 1];
  }

  private drawHud(): void {
    this.hudLayer = this.add.container(0, 0);
    const l = layout(this);
    const x = Math.max(66, l.visibleX + 70);
    const w = Math.min(l.visibleWidth - 82, 356);
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.88);
    g.fillRoundedRect(x, 128, w, 44, 20);
    g.lineStyle(1, 0xffffff, 0.25);
    g.strokeRoundedRect(x, 128, w, 44, 20);
    const scoreW = Math.max(112, w * 0.38);
    const comboW = Math.max(82, w * 0.26);
    const meterW = Math.max(84, w - scoreW - comboW - 18);
    g.fillStyle(0xffffff, 0.12);
    g.fillRoundedRect(x + 8, 136, scoreW, 28, 14);
    g.fillRoundedRect(x + 14 + scoreW, 136, comboW, 28, 14);
    g.fillRoundedRect(x + 20 + scoreW + comboW, 136, meterW, 28, 14);
    const scoreCx = x + 8 + scoreW / 2;
    const comboCx = x + 14 + scoreW + comboW / 2;
    const meterCx = x + 20 + scoreW + comboW + meterW / 2;
    if (this.textures.exists('assetTrophy')) this.add.image(scoreCx - 42, 150, 'assetTrophy').setDisplaySize(22, 22);
    if (this.textures.exists('assetCombo')) this.add.image(comboCx - 28, 150, 'assetCombo').setDisplaySize(22, 22);
    this.scoreText = this.add.text(scoreCx + 6, 150, '0점', goldText(13)).setOrigin(0.5);
    this.comboText = this.add.text(comboCx + 8, 150, '콤보 0', bodyText(12)).setOrigin(0.5);
    this.meterText = this.add.text(meterCx, 150, '보너스 0', mutedText(10)).setOrigin(0.5);
    this.hudLayer.add([g, this.scoreText, this.comboText, this.meterText]);
  }

  private drawSidePanel(): void {
    const area = playArea(this);
    const x = area.sideX;
    const left = area.sideLeft;
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.90);
    g.fillRoundedRect(left, 150, area.sideWidth, 150, 18);
    g.lineStyle(2, 0x8fd3ff, 0.38);
    g.strokeRoundedRect(left, 150, area.sideWidth, 150, 18);
    g.fillStyle(0xffffff, 0.12);
    g.fillRoundedRect(left + 7, 160, area.sideWidth - 10, 25, 12);
    this.add.text(x, 173, '스텝', bodyText(11)).setOrigin(0.5);
    this.stepText = this.add.text(x, 225, `${this.stepsLeft}`, titleText(40)).setOrigin(0.5);
    this.add.text(x, 281, '남은 수', mutedText(9)).setOrigin(0.5);

    this.drawMiniSlot(x, 344, '힌트', 0x8fd3ff);
    this.hintButton = new GameButton(this, x, 405, `힌트${this.hintsLeft}`, 56, 48, 0x8fd3ff).onClick(() => this.useHint());
    this.drawMiniSlot(x, 448, '섞기', 0xf0c7ff);
    this.shuffleButton = new GameButton(this, x, 509, `섞기${this.shufflesLeft}`, 56, 48, 0xf0c7ff).onClick(() => this.useShuffle());

    new GameButton(this, x, 614, '나감', 56, 48, 0xc9f4ff).onClick(() => this.scene.start('StageSelectScene', { modeId: this.modeId, title: '말 카드' }));
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
    const area = playArea(this);
    const goalW = Math.max(316, area.boardWidth);
    const goalX = area.boardLeft;
    const goalCenter = area.boardCenter;
    const goalCardW = Phaser.Math.Clamp(Math.floor(goalW * 0.38), 132, 154);
    const goalCardX = goalCenter - Math.min(42, Math.max(18, goalW * 0.08));
    const backW = Phaser.Math.Clamp(Math.floor(goalW * 0.22), 74, 90);
    const backX = Math.min(area.boardRight - backW / 2 - 10, goalCardX + goalCardW / 2 + backW / 2 + 22);
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.86);
    g.fillRoundedRect(goalX, 184, goalW, 172, 24);
    g.lineStyle(1, 0xffffff, 0.28);
    g.strokeRoundedRect(goalX, 184, goalW, 172, 24);
    g.fillStyle(0xffffff, 0.12);
    g.fillRoundedRect(goalX + 16, 194, goalW - 32, 26, 12);
    const chainW = goalW - 42;
    const chainProgress = Phaser.Math.Clamp((this.goalIndex + this.goalProgress / Math.max(1, goal.needed)) / Math.max(1, this.deck.goals.length), 0, 1);
    g.fillStyle(0x26334f, 0.78);
    g.fillRoundedRect(goalX + 21, 226, chainW, 9, 5);
    g.fillStyle(0xffd86f, 0.86);
    g.fillRoundedRect(goalX + 21, 226, Math.max(10, chainW * chainProgress), 9, 5);
    g.fillStyle(0xffffff, 0.08);
    g.fillRoundedRect(goalX + 32, 242, goalW - 64, 22, 11);
    this.goalLayer.add(g);

    this.drawGoalCard(goalCardX, 273, goalCardW, 124, goal);
    this.drawBackCardToLayer(this.goalLayer, backX, 273, backW, 94, `${Math.max(0, this.deck.goals.length - this.goalIndex - 1)}`);
    this.goalTitleText = this.add.text(goalCardX, 335, `목표 ${this.goalIndex + 1}/${this.deck.goals.length}`, goldText(13)).setOrigin(0.5);
    this.goalMetaText = this.add.text(goalCenter, 207, `${this.deck.title} · ${this.deck.difficulty}`, mutedText(11)).setOrigin(0.5);
    const chainText = this.add.text(goalCenter, 253, `목표 체인 ${Math.round(chainProgress * 100)}%`, mutedText(9)).setOrigin(0.5);
    this.progressText = this.add.text(goalCardX, 351, `${this.goalProgress}/${goal.needed}`, bodyText(13)).setOrigin(0.5);
    this.goalLayer.add([this.goalTitleText, this.goalMetaText, chainText, this.progressText]);
  }

  private drawGoalCard(x: number, y: number, w: number, h: number, goal: GoalCard): void {
    const g = this.add.graphics();
    const color = CATEGORY_COLOR[goal.category];
    g.fillStyle(0x000000, 0.30);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 8, w, h, 19);
    g.fillGradientStyle(0xfffff7, 0xfffbef, 0xfff3df, 0xfffff8, 1, 1, 1, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 19);
    g.lineStyle(7, color, 0.96);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 19);
    g.fillStyle(color, 0.90);
    g.fillRoundedRect(x - w / 2 + 8, y - h / 2 + 8, w - 16, 28, 11);
    g.fillStyle(0x6b3a16, 0.08);
    g.fillRoundedRect(x - w / 2 + 12, y - h / 2 + 45, w - 24, 12, 6);
    const label = this.add.text(x, y - 6, goal.label, applyWrap(cardText(fitTextSize(goal.label, 24, 14)), w - 16)).setOrigin(0.5);
    const tag = this.add.text(x, y + 42, CATEGORY_LABELS[goal.category], cardSmallText(10)).setOrigin(0.5);
    this.goalLayer.add([g, label, tag]);
  }


  private boardLayout(): { xs: number[]; baseY: number; cardW: number; cardH: number; gapY: number; railX: number; railY: number; railW: number; railH: number } {
    const area = playArea(this);
    const railW = area.boardWidth;
    const xs = distributeColumns(area.boardLeft + 4, railW - 8, this.columns.length || 4);
    const spacing = railW / Math.max(4, this.columns.length || 4);
    return {
      xs,
      baseY: 430,
      cardW: Phaser.Math.Clamp(Math.floor(spacing - 11), 78, 92),
      cardH: Phaser.Math.Clamp(Math.floor((spacing - 11) * 1.26), 98, 116),
      gapY: 43,
      railX: area.boardLeft,
      railY: 378,
      railW,
      railH: 340
    };
  }

  private redrawBoard(): void {
    this.boardLayer.removeAll(true);
    const { xs, baseY, cardW, cardH, gapY, railX, railY, railW, railH } = this.boardLayout();

    const rail = this.add.graphics();
    rail.fillStyle(0x07142c, 0.88);
    rail.fillRoundedRect(railX, railY, railW, railH, 26);
    rail.fillStyle(0x1d4d84, 0.14);
    rail.fillRoundedRect(railX + 10, railY + 10, railW - 20, 36, 18);
    rail.fillStyle(0xffd86f, 0.12);
    rail.fillRoundedRect(railX + 20, railY + 18, railW - 40, 7, 4);
    rail.lineStyle(2, 0xffffff, 0.24);
    rail.strokeRoundedRect(railX, railY, railW, railH, 26);
    rail.fillStyle(0xfff3d0, 0.12);
    for (const x of xs) rail.fillRoundedRect(x - cardW / 2 - 5, railY + 12, cardW + 10, railH - 24, 18);
    this.boardLayer.add(rail);
    this.boardLayer.add(this.add.text(railX + 22, railY + 36, '카드 보드 · TOP 카드만 터치', mutedText(9)).setOrigin(0, 0.5));
    this.boardLayer.add(this.add.text(railX + railW - 22, railY + 36, `${this.columns.flat().length}장 남음`, goldText(10)).setOrigin(1, 0.5));

    this.columns.forEach((column, colIndex) => {
      const columnHeight = Math.max(1, column.length);
      const topY = baseY + Math.max(0, columnHeight - 1) * gapY;
      const glow = this.add.rectangle(xs[colIndex], topY, cardW + 12, cardH + 12, 0xffffff, 0.045);
      const columnBadge = this.add.text(xs[colIndex], railY + 62, `${column.length}`, mutedText(9)).setOrigin(0.5);
      this.boardLayer.add([glow, columnBadge]);
      column.forEach((card, rowIndex) => {
        const x = xs[colIndex];
        const y = baseY + rowIndex * gapY;
        const isTop = rowIndex === column.length - 1;
        const cardObj = this.createWordCard(card, colIndex, x, y, cardW, cardH, isTop);
        this.boardLayer.add(cardObj);
        this.animateCardSettle(cardObj, rowIndex, isTop);
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

  private animateCardSettle(cardObj: Phaser.GameObjects.Container, rowIndex: number, isTop: boolean): void {
    cardObj.setAlpha(isTop ? 1 : 0.96);
    if (!isMotionEnabled(this.quality)) return;
    const targetY = cardObj.y;
    cardObj.y = targetY - (isTop ? 10 : 5);
    this.tweens.add({
      targets: cardObj,
      y: targetY,
      alpha: isTop ? 1 : 0.96,
      duration: scaledDuration(120 + rowIndex * 18, this.quality),
      ease: 'Sine.easeOut'
    });
  }

  private createWordCard(card: WordCard, colIndex: number, x: number, y: number, w: number, h: number, interactive: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setName(`card:${card.id}`);
    const g = this.add.graphics();
    const color = CATEGORY_COLOR[card.category];
    // SOLID_CARD_POLISH_V121: card readability first, decorative transparency last.
    g.fillStyle(0x000000, 0.34);
    g.fillRoundedRect(-w / 2 + 5, -h / 2 + 9, w, h, 18);
    g.fillGradientStyle(0xfffff8, 0xfff8eb, interactive ? 0xffeed4 : 0xf2ddbd, interactive ? 0xfffffb : 0xfff1d2, 1, 1, 1, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 18);
    g.lineStyle(6, interactive ? color : 0xbc884c, interactive ? 1 : 0.92);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 18);
    g.lineStyle(2, 0xffffff, 0.86);
    g.strokeRoundedRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 12);
    g.fillStyle(color, interactive ? 0.98 : 0.84);
    g.fillRoundedRect(-w / 2 + 8, -h / 2 + 8, w - 16, 24, 10);
    g.fillStyle(0xffffff, interactive ? 0.20 : 0.10);
    g.fillRoundedRect(-w / 2 + 17, -h / 2 + 12, w - 34, 5, 3);
    g.fillStyle(0x6b3a16, interactive ? 0.075 : 0.055);
    g.fillRoundedRect(-w / 2 + 13, -h / 2 + 43, w - 26, 11, 6);
    g.fillStyle(color, interactive ? 0.18 : 0.10);
    g.fillCircle(-w / 2 + 17, h / 2 - 17, 8);

    const frameKey = interactive ? 'assetFrameRare' : 'assetFrameEpic';
    const frame = this.textures.exists(frameKey) ? this.add.image(0, 0, frameKey).setDisplaySize(w + 13, h + 13).setAlpha(interactive ? 0.045 : 0.02) : null;
    const shine = this.textures.exists('effectShine') ? this.add.image(0, -12, 'effectShine').setDisplaySize(w + 6, h + 6).setAlpha(interactive ? 0.006 : 0.002) : null;
    const tag = this.add.text(0, -h / 2 + 18, compactText(CATEGORY_LABELS[card.category], 8), cardSmallText(8)).setOrigin(0.5);
    const label = this.add.text(0, 5, card.label, applyWrap(cardText(fitTextSize(card.label, 22, 12)), w - 12)).setOrigin(0.5);
    const sub = this.add.text(0, h / 2 - 16, compactText(card.tag, 7), cardSmallText(8)).setOrigin(0.5).setAlpha(0.88);
    const contents: Phaser.GameObjects.GameObject[] = [g];
    if (frame) contents.unshift(frame);
    if (shine) contents.push(shine);
    contents.push(tag, label, sub);
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
      container.setAlpha(0.96);
    }

    return container;
  }

  private drawBackCardToLayer(layer: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, count: string): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.24);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 8, w, h, 16);
    layer.add(g);
    const backKey = this.textures.exists('cardBackLibraryPremium') ? 'cardBackLibraryPremium' : this.textures.exists('assetCardBackStar') ? 'assetCardBackStar' : '';
    if (backKey) {
      const back = this.add.image(x, y, backKey).setDisplaySize(w, h);
      layer.add(back);
    } else {
      const card = this.add.graphics();
      card.fillGradientStyle(0xffb22d, 0xff8c18, 0xff6f11, 0xffa52a, 1, 1, 1, 1);
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
      this.noteText.setText(meterBonus > 0 ? `보너스 정답! ${card.label} +${earned}` : `정답! ${card.label}은(는) ${CATEGORY_LABELS[goal.category]} 계열이에요. +${earned}`);
      this.animateCorrect(source, earned);
      this.time.delayedCall(230, () => this.afterCorrect());
      return;
    }

    this.combo = 0;
    this.bonusMeter = 0;
    this.score = Math.max(0, this.score - 30);
    this.noteText.setText(`${card.label}은(는) 현재 목표(${goal.label} · ${CATEGORY_LABELS[goal.category]})와 다른 연상 계열이에요.`);
    this.animateWrong(source);
    this.time.delayedCall(240, () => {
      this.inputLocked = false;
      this.refreshHud();
      this.redrawBoard();
      if (!this.findTopMatch()) this.pulseAssistButton(this.shuffleButton);
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
    if (!this.findTopMatch()) {
      this.noteText.setText('현재 맨 위 정답이 없을 수 있어요. 셔플이나 복구 버튼을 써보세요.');
      this.pulseAssistButton(this.shuffleButton);
    }
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
      this.pulseAssistButton(this.shuffleButton);
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
    this.tweens.add({ targets: source, y: source.y - 32, alpha: 0, scale: 1.14, angle: 5, duration: 240, ease: 'Back.easeIn', onComplete: () => source.destroy() });
    this.spawnMiniSparkles(source.x, source.y, 0x58ffba);
    this.flyText(source.x, source.y - 64, `+${points}`, 0x58ffba);
  }

  private spawnMiniSparkles(x: number, y: number, color: number): void {
    const texture = this.textures.exists('particleSparkle') ? 'particleSparkle' : undefined;
    const count = ambientCount(6, this.quality, 2);
    for (let i = 0; i < count; i += 1) {
      const obj = texture ? this.add.image(x, y, texture).setDisplaySize(14, 14) : this.add.circle(x, y, 4, color, 0.75);
      this.effectLayer.add(obj);
      this.tweens.add({
        targets: obj,
        x: x + Phaser.Math.Between(-34, 34),
        y: y + Phaser.Math.Between(-42, -16),
        alpha: 0,
        scale: { from: 0.7, to: 1.3 },
        duration: scaledDuration(440 + i * 18, this.quality),
        ease: 'Sine.easeOut',
        onComplete: () => obj.destroy()
      });
    }
  }

  private animateWrong(source: Phaser.GameObjects.Container): void {
    if (isMotionEnabled(this.quality)) this.cameras.main.shake(120, 0.004);
    this.flash(0xff5e7a);
    if (this.textures.exists('effectWrong')) {
      const effect = this.add.image(source.x, source.y, 'effectWrong').setDisplaySize(94, 94).setAlpha(0.54);
      this.effectLayer.add(effect);
      this.tweens.add({ targets: effect, scale: 1.28, alpha: 0, duration: 300, ease: 'Sine.easeOut', onComplete: () => effect.destroy() });
    }
    const originalX = source.x;
    if (isMotionEnabled(this.quality)) this.tweens.add({ targets: source, x: originalX + 5, yoyo: true, repeat: 3, duration: scaledDuration(38, this.quality), onComplete: () => { source.x = originalX; } });
    this.flyText(source.x, source.y - 64, '-30', 0xff8aa0);
  }

  private flyText(x: number, y: number, text: string, color: number): void {
    const style = color === 0xff8aa0 ? mutedText(16) : goldText(16);
    const obj = this.add.text(x, y, text, style).setOrigin(0.5).setTint(color);
    this.effectLayer.add(obj);
    this.tweens.add({ targets: obj, y: y - 34, alpha: 0, duration: 720, ease: 'Sine.easeOut', onComplete: () => obj.destroy() });
  }

  private flash(color: number): void {
    const l = layout(this);
    const rect = this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, color, 0.08);
    this.effectLayer.add(rect);
    this.tweens.add({ targets: rect, alpha: 0, duration: 180, onComplete: () => rect.destroy() });
  }

  private refreshHud(): void {
    const goal = this.currentGoal();
    const hasCards = this.hasCardsLeft();
    const noTopMatch = hasCards && !this.findTopMatch();
    this.stepText?.setText(`${this.stepsLeft}`);
    this.scoreText?.setText(`${this.score}점`);
    this.comboText?.setText(this.combo > 0 ? `콤보 ${this.combo}` : '콤보 0');
    this.meterText?.setText(`보너스 ${this.bonusMeter}/4`);
    this.progressText?.setText(`${this.goalProgress}/${goal.needed}`);
    this.goalTitleText?.setText(`목표 ${Math.min(this.goalIndex + 1, this.deck.goals.length)}/${this.deck.goals.length}`);
    this.hintButton?.setLabel(noTopMatch ? '힌트?' : `힌트${this.hintsLeft}`).setDisabled(this.hintsLeft <= 0 || noTopMatch);
    this.shuffleButton?.setLabel(noTopMatch ? `복구${this.shufflesLeft}` : `섞기${this.shufflesLeft}`).setDisabled(this.shufflesLeft <= 0 || this.stepsLeft <= 0);
    this.updateBonusPips();
    this.updateComboCoach(noTopMatch);
  }

  private hasCardsLeft(): boolean {
    return this.columns.some((column) => column.length > 0);
  }

  private updateBonusPips(): void {
    this.bonusPipRects.forEach((pip, index) => {
      const active = index < this.bonusMeter;
      pip.setFillStyle(active ? 0xffd86f : 0x26334f, active ? 0.88 : 0.58);
      pip.setStrokeStyle(1, active ? 0xfff3c2 : 0xffffff, active ? 0.62 : 0.15);
    });
  }

  private updateComboCoach(noTopMatch: boolean): void {
    if (!this.comboCoachText) return;
    if (noTopMatch && this.shufflesLeft > 0) {
      this.comboCoachText.setText('복구 필요 · 셔플로 새 TOP 카드를 열어주세요.');
      return;
    }
    if (this.bonusMeter >= 4) {
      this.comboCoachText.setText('보너스 장전 · 다음 정답에 추가 점수가 붙어요.');
      return;
    }
    if (this.combo >= 3) {
      this.comboCoachText.setText(`콤보 ${this.combo} · 연속 정답 흐름을 유지하세요.`);
      return;
    }
    this.comboCoachText.setText('콤보 코치 · 힌트는 정답 TOP 카드, 셔플은 스텝 1을 사용합니다.');
  }

  private pulseAssistButton(button?: GameButton): void {
    if (!button || !isMotionEnabled(this.quality)) return;
    this.tweens.add({ targets: button, scale: 1.08, duration: scaledDuration(120, this.quality), yoyo: true, repeat: 2, ease: 'Sine.easeInOut' });
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
