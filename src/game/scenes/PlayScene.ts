import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { GameButton } from '../ui/GameButton';
import { applyWrap, bodyText, cardSmallText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';

type WordCategory = 'tired' | 'strong' | 'cute' | 'place' | 'taste' | 'guard' | 'animal' | 'nature';

type WordCard = {
  id: string;
  label: string;
  category: WordCategory;
  tag: string;
};

type GoalCard = {
  label: string;
  category: WordCategory;
  needed: number;
};

type StageDeck = {
  steps: number;
  title: string;
  goals: GoalCard[];
  columns: WordCard[][];
};

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

const STAGE_DATA: Record<number, StageDeck> = {
  1: {
    title: '첫 말 카드 정리',
    steps: 24,
    goals: [
      { label: '피곤함', category: 'tired', needed: 3 },
      { label: '강한 느낌', category: 'strong', needed: 2 }
    ],
    columns: [
      [
        { id: 'nap', label: '잠깐 눈붙임', category: 'tired', tag: '행동' },
        { id: 'drowsy', label: '나른함', category: 'tired', tag: '상태' },
        { id: 'sleepy', label: '졸림', category: 'tired', tag: '상태' }
      ],
      [
        { id: 'cute_smile', label: '귀여운 웃음', category: 'cute', tag: '표정' },
        { id: 'tough', label: '튼튼함', category: 'strong', tag: '성질' },
        { id: 'firm', label: '단단함', category: 'strong', tag: '성질' }
      ],
      [
        { id: 'yawn', label: '하품', category: 'tired', tag: '행동' },
        { id: 'watch', label: '경계', category: 'guard', tag: '방어' },
        { id: 'wall', label: '장벽', category: 'guard', tag: '방어' }
      ],
      [
        { id: 'heavy_eyes', label: '눈꺼풀 무거움', category: 'tired', tag: '상태' },
        { id: 'taste', label: '맛보다', category: 'taste', tag: '행동' },
        { id: 'underground', label: '지하 묘지', category: 'place', tag: '장소' }
      ]
    ]
  },
  2: {
    title: '럭키와 방패',
    steps: 23,
    goals: [
      { label: '럭키', category: 'cute', needed: 3 },
      { label: '방패', category: 'guard', needed: 3 }
    ],
    columns: [
      [
        { id: 'charm', label: '매력', category: 'cute', tag: '감정' },
        { id: 'wink', label: '윙크', category: 'cute', tag: '표정' },
        { id: 'smile', label: '방긋', category: 'cute', tag: '표정' }
      ],
      [
        { id: 'sweet', label: '달콤함', category: 'taste', tag: '맛' },
        { id: 'barrier', label: '보호막', category: 'guard', tag: '방어' },
        { id: 'shield', label: '방패', category: 'guard', tag: '도구' }
      ],
      [
        { id: 'ribbon', label: '리본', category: 'cute', tag: '장식' },
        { id: 'gate', label: '성문', category: 'guard', tag: '방어' },
        { id: 'castle', label: '요새', category: 'place', tag: '장소' }
      ],
      [
        { id: 'guard', label: '지키다', category: 'guard', tag: '행동' },
        { id: 'luck', label: '행운', category: 'cute', tag: '기분' },
        { id: 'sleep', label: '졸음', category: 'tired', tag: '상태' }
      ]
    ]
  },
  3: {
    title: '큐브와 장소',
    steps: 22,
    goals: [
      { label: '정육면체', category: 'strong', needed: 3 },
      { label: '장소 카드', category: 'place', needed: 3 }
    ],
    columns: [
      [
        { id: 'village', label: '마을 광장', category: 'place', tag: '장소' },
        { id: 'block', label: '블록', category: 'strong', tag: '모양' },
        { id: 'cube', label: '큐브', category: 'strong', tag: '모양' }
      ],
      [
        { id: 'soft', label: '폭신함', category: 'cute', tag: '감촉' },
        { id: 'shop', label: '카드 상점', category: 'place', tag: '장소' },
        { id: 'tower', label: '카드 타워', category: 'place', tag: '장소' }
      ],
      [
        { id: 'hard', label: '단단함', category: 'strong', tag: '성질' },
        { id: 'home', label: '작은 집', category: 'place', tag: '장소' },
        { id: 'fort', label: '요새', category: 'guard', tag: '장소' }
      ],
      [
        { id: 'square', label: '정사각형', category: 'strong', tag: '모양' },
        { id: 'look', label: '보다', category: 'taste', tag: '행동' },
        { id: 'grave', label: '지하 묘지', category: 'place', tag: '장소' }
      ]
    ]
  },
  4: {
    title: '동물과 자연',
    steps: 26,
    goals: [
      { label: '동물 친구', category: 'animal', needed: 4 },
      { label: '자연 카드', category: 'nature', needed: 3 }
    ],
    columns: [
      [
        { id: 'leaf', label: '나뭇잎', category: 'nature', tag: '자연' },
        { id: 'cat', label: '고양이', category: 'animal', tag: '동물' },
        { id: 'puppy', label: '강아지', category: 'animal', tag: '동물' },
        { id: 'bird', label: '새', category: 'animal', tag: '동물' }
      ],
      [
        { id: 'mountain', label: '산', category: 'nature', tag: '자연' },
        { id: 'river', label: '강물', category: 'nature', tag: '자연' },
        { id: 'fox', label: '여우', category: 'animal', tag: '동물' }
      ],
      [
        { id: 'shield2', label: '보호막', category: 'guard', tag: '방어' },
        { id: 'flower', label: '꽃', category: 'nature', tag: '자연' },
        { id: 'rabbit', label: '토끼', category: 'animal', tag: '동물' }
      ],
      [
        { id: 'sleep2', label: '나른함', category: 'tired', tag: '상태' },
        { id: 'forest', label: '숲', category: 'nature', tag: '장소' },
        { id: 'horse', label: '말', category: 'animal', tag: '동물' }
      ]
    ]
  }
};

const CATEGORY_LABELS: Record<WordCategory, string> = {
  tired: '피로/졸림',
  strong: '단단함/강함',
  cute: '귀여움/행운',
  place: '장소',
  taste: '맛/감각',
  guard: '방어/보호',
  animal: '동물',
  nature: '자연'
};

const CATEGORY_COLOR: Record<WordCategory, number> = {
  tired: 0x94c8ff,
  strong: 0xffb24f,
  cute: 0xff8dc7,
  place: 0x8fd3ff,
  taste: 0xb9ff9d,
  guard: 0xc1b7ff,
  animal: 0xffd86f,
  nature: 0x7cf2bd
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
  private hintsLeft = 1;
  private shufflesLeft = 1;
  private inputLocked = false;

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
    this.deck = STAGE_DATA[this.stage] ?? STAGE_DATA[1];
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
      this.hintsLeft = 1;
      this.shufflesLeft = 1;
    }

    DrawSystem.background(this, `말 카드 · ${this.stage}`);
    DrawSystem.topHud(this, profile.coins, profile.level);
    this.drawHud();
    this.goalLayer = this.add.container(0, 0);
    this.boardLayer = this.add.container(0, 0);
    this.effectLayer = this.add.container(0, 0);
    this.drawGoalArea();
    this.drawSidePanel();
    this.noteText = this.add.text(195, 806, '목표와 같은 계열의 맨 위 카드를 고르세요.', applyWrap(mutedText(12), 336)).setOrigin(0.5);
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
    g.fillStyle(0x07142c, 0.46);
    g.fillRoundedRect(146, 126, 98, 34, 16);
    g.fillRoundedRect(252, 126, 104, 34, 16);
    g.lineStyle(1, 0xffffff, 0.16);
    g.strokeRoundedRect(146, 126, 98, 34, 16);
    g.strokeRoundedRect(252, 126, 104, 34, 16);
    this.scoreText = this.add.text(195, 143, '점수 0', goldText(14)).setOrigin(0.5);
    this.comboText = this.add.text(304, 143, '콤보 0', bodyText(13)).setOrigin(0.5);
    this.hudLayer.add([g, this.scoreText, this.comboText]);
  }

  private drawSidePanel(): void {
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.52);
    g.fillRoundedRect(14, 152, 92, 136, 18);
    g.lineStyle(2, 0x8fd3ff, 0.26);
    g.strokeRoundedRect(14, 152, 92, 136, 18);
    this.add.text(60, 173, '스텝', bodyText(15)).setOrigin(0.5);
    this.stepText = this.add.text(60, 219, `${this.stepsLeft}`, titleText(46)).setOrigin(0.5);
    this.add.text(60, 264, '남은 수', mutedText(11)).setOrigin(0.5);

    this.hintButton = new GameButton(this, 60, 424, `힌트 ${this.hintsLeft}`, 82, 62, 0x8fd3ff).onClick(() => this.useHint());
    this.shuffleButton = new GameButton(this, 60, 518, `셔플 ${this.shufflesLeft}`, 82, 62, 0xf0c7ff).onClick(() => this.useShuffle());

    const back = new GameButton(this, 60, 620, '나가기', 82, 54, 0xc9f4ff).onClick(() => this.scene.start('StageSelectScene', { modeId: this.modeId, title: '말 카드' }));
    back.setScale(0.92);
  }

  private drawGoalArea(): void {
    this.goalLayer.removeAll(true);
    const goal = this.currentGoal();
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.08);
    g.fillRoundedRect(120, 174, 254, 180, 24);
    g.lineStyle(1, 0xffffff, 0.18);
    g.strokeRoundedRect(120, 174, 254, 180, 24);
    this.goalLayer.add(g);

    this.drawGoalCard(214, 258, 112, 132, goal);
    this.drawBackCardToLayer(this.goalLayer, 324, 258, 66, 92, `${Math.max(0, this.deck.goals.length - this.goalIndex - 1)}`);
    this.goalTitleText = this.add.text(214, 333, `목표 ${this.goalIndex + 1}/${this.deck.goals.length}`, goldText(14)).setOrigin(0.5);
    this.goalMetaText = this.add.text(214, 184, this.deck.title, mutedText(12)).setOrigin(0.5);
    this.progressText = this.add.text(214, 352, `${this.goalProgress}/${goal.needed}`, bodyText(14)).setOrigin(0.5);
    this.goalLayer.add([this.goalTitleText, this.goalMetaText, this.progressText]);
  }

  private drawGoalCard(x: number, y: number, w: number, h: number, goal: GoalCard): void {
    const g = this.add.graphics();
    const color = CATEGORY_COLOR[goal.category];
    g.fillStyle(0x000000, 0.2);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 7, w, h, 18);
    g.fillStyle(0xfffbf1, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 18);
    g.lineStyle(5, color, 1);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 18);
    g.fillStyle(color, 0.18);
    g.fillRoundedRect(x - w / 2 + 8, y - h / 2 + 8, w - 16, 26, 10);
    const label = this.add.text(x, y - 8, goal.label, applyWrap(cardText(goal.label.length > 4 ? 20 : 24), w - 16)).setOrigin(0.5);
    const tag = this.add.text(x, y + 44, CATEGORY_LABELS[goal.category], cardSmallText(10)).setOrigin(0.5);
    this.goalLayer.add([g, label, tag]);
  }

  private redrawBoard(): void {
    this.boardLayer.removeAll(true);
    const xs = [146, 216, 286, 356];
    const baseY = 420;
    const cardW = 64;
    const cardH = 88;
    const gapY = 44;

    this.columns.forEach((column, colIndex) => {
      column.forEach((card, rowIndex) => {
        const x = xs[colIndex];
        const y = baseY + rowIndex * gapY;
        const isTop = rowIndex === column.length - 1;
        this.boardLayer.add(this.createWordCard(card, colIndex, x, y, cardW, cardH, isTop));
      });
      if (!column.length) {
        const empty = this.add.graphics();
        empty.lineStyle(2, 0xffffff, 0.14);
        empty.strokeRoundedRect(xs[colIndex] - cardW / 2, baseY - cardH / 2, cardW, cardH, 14);
        this.boardLayer.add(empty);
        const done = this.add.text(xs[colIndex], baseY, '정리됨', mutedText(11)).setOrigin(0.5);
        this.boardLayer.add(done);
      }
    });
  }

  private createWordCard(card: WordCard, colIndex: number, x: number, y: number, w: number, h: number, interactive: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setName(`card:${card.id}`);
    const g = this.add.graphics();
    const color = CATEGORY_COLOR[card.category];
    g.fillStyle(0x000000, 0.2);
    g.fillRoundedRect(-w / 2 + 3, -h / 2 + 5, w, h, 14);
    g.fillStyle(interactive ? 0xfffbf1 : 0xfff6df, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    g.lineStyle(3, interactive ? color : 0xffcc73, interactive ? 1 : 0.75);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
    g.lineStyle(1, 0xffffff, 0.9);
    g.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 10);
    g.fillStyle(color, interactive ? 0.95 : 0.62);
    g.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w - 10, 20, 8);

    const tag = this.add.text(0, -h / 2 + 15, card.tag, cardSmallText(9)).setOrigin(0.5);
    const label = this.add.text(0, 11, card.label, applyWrap(cardText(card.label.length > 5 ? 14 : card.label.length > 3 ? 17 : 20), w - 12)).setOrigin(0.5);
    container.add([g, tag, label]);

    if (interactive) {
      const zone = this.add.zone(0, 0, w + 4, h + 4).setOrigin(0.5).setInteractive({ useHandCursor: true });
      let downInside = false;
      zone.on('pointerdown', () => {
        if (this.inputLocked) return;
        downInside = true;
        this.tweens.add({ targets: container, scale: 0.96, duration: 60 });
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
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
        const debug = this.add.rectangle(0, 0, w + 4, h + 4, 0x00ff66, 0.12).setStrokeStyle(1, 0x00ff66, 0.75);
        container.add(debug);
      }
    } else {
      container.setAlpha(0.82);
    }

    return container;
  }

  private drawBackCardToLayer(layer: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, count: string): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.2);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 7, w, h, 16);
    g.fillStyle(0xff8a19, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    g.lineStyle(4, 0xffffff, 0.9);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    g.fillStyle(0xffb347, 0.42);
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        g.fillEllipse(x - 22 + col * 22, y - 30 + row * 18, 18, 28);
      }
    }
    const text = this.add.text(x - 18, y + 32, count, bodyText(14)).setOrigin(0.5);
    layer.add([g, text]);
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
      const earned = 100 + this.combo * 25;
      this.score += earned;
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.goalProgress += 1;
      column.pop();
      this.noteText.setText(`정답! ${CATEGORY_LABELS[goal.category]} 계열이에요. +${earned}`);
      this.animateCorrect(source, earned);
      this.time.delayedCall(230, () => this.afterCorrect());
      return;
    }

    this.combo = 0;
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
      });
      return;
    }

    this.redrawBoard();
    this.refreshHud();
    this.inputLocked = false;
  }

  private useHint(): void {
    if (this.inputLocked || this.hintsLeft <= 0) return;
    const match = this.findTopMatch();
    this.hintsLeft -= 1;
    this.combo = 0;
    this.refreshHud();
    this.hintButton?.setLabel(`힌트 ${this.hintsLeft}`).setDisabled(this.hintsLeft <= 0);
    if (!match) {
      this.noteText.setText('현재 맨 위 카드에는 정답이 없어요. 셔플을 사용해보세요.');
      this.flyText(214, 392, '셔플 추천', 0x8fd3ff);
      return;
    }
    this.noteText.setText(`${match.card.label} 카드를 찾아보세요.`);
    this.highlightColumn(match.colIndex);
  }

  private useShuffle(): void {
    if (this.inputLocked || this.shufflesLeft <= 0) return;
    this.shufflesLeft -= 1;
    this.combo = 0;
    this.stepsLeft = Math.max(0, this.stepsLeft - 1);
    const sizes = this.columns.map((column) => column.length);
    const cards = this.columns.flat();
    Phaser.Utils.Array.Shuffle(cards);
    this.columns = sizes.map((size) => cards.splice(0, size));
    this.noteText.setText('남은 카드 스택을 섞었어요. 셔플은 스텝 1을 사용합니다.');
    this.shuffleButton?.setLabel(`셔플 ${this.shufflesLeft}`).setDisabled(this.shufflesLeft <= 0);
    this.redrawBoard();
    this.refreshHud();
    this.flyText(220, 430, '셔플!', 0xf0c7ff);
    if (this.stepsLeft <= 0) this.finish(false);
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
    const xs = [146, 216, 286, 356];
    const y = 420 + Math.max(0, this.columns[colIndex].length - 1) * 44;
    const marker = this.add.rectangle(xs[colIndex], y, 74, 98, 0x7cf2bd, 0.12).setStrokeStyle(4, 0x7cf2bd, 0.95);
    this.effectLayer.add(marker);
    this.tweens.add({ targets: marker, scale: 1.12, alpha: 0, duration: 850, ease: 'Sine.easeOut', onComplete: () => marker.destroy() });
  }

  private animateCorrect(source: Phaser.GameObjects.Container, points: number): void {
    this.flash(0x58ffba);
    this.tweens.add({ targets: source, y: source.y - 20, alpha: 0, scale: 1.08, duration: 220, ease: 'Back.easeIn', onComplete: () => source.destroy() });
    this.flyText(source.x, source.y - 64, `+${points}`, 0x58ffba);
  }

  private animateWrong(source: Phaser.GameObjects.Container): void {
    this.cameras.main.shake(120, 0.004);
    this.flash(0xff5e7a);
    this.tweens.add({ targets: source, x: source.x + 5, yoyo: true, repeat: 3, duration: 38, onComplete: () => { source.x -= 0; } });
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
    this.scoreText?.setText(`점수 ${this.score}`);
    this.comboText?.setText(this.combo > 0 ? `콤보 ${this.combo}` : '콤보 0');
    this.progressText?.setText(`${this.goalProgress}/${goal.needed}`);
    this.goalTitleText?.setText(`목표 ${Math.min(this.goalIndex + 1, this.deck.goals.length)}/${this.deck.goals.length}`);
    this.hintButton?.setLabel(`힌트 ${this.hintsLeft}`).setDisabled(this.hintsLeft <= 0);
    this.shuffleButton?.setLabel(`셔플 ${this.shufflesLeft}`).setDisabled(this.shufflesLeft <= 0);
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
