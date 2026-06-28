import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, cardSmallText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';

type WordCategory = 'tired' | 'strong' | 'cute' | 'place' | 'taste' | 'guard';

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
  goals: GoalCard[];
  columns: WordCard[][];
};

type CardView = {
  card: WordCard;
  container: Phaser.GameObjects.Container;
};

type ResumeState = {
  columns: WordCard[][];
  goalIndex: number;
  stepsLeft: number;
  moves: number;
};

const STAGE_DATA: Record<number, StageDeck> = {
  1: {
    steps: 24,
    goals: [
      { label: '피곤함', category: 'tired', needed: 3 },
      { label: '강한 느낌', category: 'strong', needed: 2 }
    ],
    columns: [
      [
        { id: 'sleepy', label: '졸림', category: 'tired', tag: '상태' },
        { id: 'drowsy', label: '나른함', category: 'tired', tag: '상태' },
        { id: 'nap', label: '잠깐 눈붙임', category: 'tired', tag: '행동' }
      ],
      [
        { id: 'firm', label: '단단함', category: 'strong', tag: '성질' },
        { id: 'tough', label: '튼튼함', category: 'strong', tag: '성질' },
        { id: 'cute_smile', label: '귀여운 웃음', category: 'cute', tag: '표정' }
      ],
      [
        { id: 'wall', label: '장벽', category: 'guard', tag: '방어' },
        { id: 'watch', label: '경계', category: 'guard', tag: '방어' },
        { id: 'yawn', label: '하품', category: 'tired', tag: '행동' }
      ],
      [
        { id: 'underground', label: '지하 묘지', category: 'place', tag: '장소' },
        { id: 'taste', label: '맛보다', category: 'taste', tag: '행동' },
        { id: 'heavy_eyes', label: '눈꺼풀 무거움', category: 'tired', tag: '상태' }
      ]
    ]
  },
  2: {
    steps: 22,
    goals: [
      { label: '럭키', category: 'cute', needed: 3 },
      { label: '방패', category: 'guard', needed: 2 }
    ],
    columns: [
      [
        { id: 'smile', label: '방긋', category: 'cute', tag: '표정' },
        { id: 'wink', label: '윙크', category: 'cute', tag: '표정' },
        { id: 'charm', label: '매력', category: 'cute', tag: '감정' }
      ],
      [
        { id: 'shield', label: '방패', category: 'guard', tag: '도구' },
        { id: 'barrier', label: '보호막', category: 'guard', tag: '방어' },
        { id: 'sweet', label: '달콤함', category: 'taste', tag: '맛' }
      ],
      [
        { id: 'castle', label: '요새', category: 'place', tag: '장소' },
        { id: 'gate', label: '성문', category: 'guard', tag: '방어' },
        { id: 'ribbon', label: '리본', category: 'cute', tag: '장식' }
      ],
      [
        { id: 'sleep', label: '졸음', category: 'tired', tag: '상태' },
        { id: 'luck', label: '행운', category: 'cute', tag: '기분' },
        { id: 'guard', label: '지키다', category: 'guard', tag: '행동' }
      ]
    ]
  },
  3: {
    steps: 20,
    goals: [
      { label: '정육면체', category: 'strong', needed: 2 },
      { label: '장소 카드', category: 'place', needed: 3 }
    ],
    columns: [
      [
        { id: 'cube', label: '큐브', category: 'strong', tag: '모양' },
        { id: 'block', label: '블록', category: 'strong', tag: '모양' },
        { id: 'village', label: '마을 광장', category: 'place', tag: '장소' }
      ],
      [
        { id: 'tower', label: '카드 타워', category: 'place', tag: '장소' },
        { id: 'shop', label: '카드 상점', category: 'place', tag: '장소' },
        { id: 'soft', label: '폭신함', category: 'cute', tag: '감촉' }
      ],
      [
        { id: 'fort', label: '요새', category: 'guard', tag: '장소' },
        { id: 'home', label: '작은 집', category: 'place', tag: '장소' },
        { id: 'hard', label: '단단함', category: 'strong', tag: '성질' }
      ],
      [
        { id: 'grave', label: '지하 묘지', category: 'place', tag: '장소' },
        { id: 'look', label: '보다', category: 'taste', tag: '행동' },
        { id: 'square', label: '정사각형', category: 'strong', tag: '모양' }
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
  guard: '방어/보호'
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
  private boardLayer!: Phaser.GameObjects.Container;
  private goalText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private stepText!: Phaser.GameObjects.Text;
  private noteText!: Phaser.GameObjects.Text;
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
      this.columns = this.resumeState.columns.map((column) => column.map((card) => ({ ...card })));
      this.goalIndex = this.resumeState.goalIndex;
      this.stepsLeft = this.resumeState.stepsLeft;
      this.moves = this.resumeState.moves;
      this.goalProgress = 0;
    } else {
      this.columns = this.deck.columns.map((column) => column.map((card) => ({ ...card })));
      this.goalIndex = 0;
      this.goalProgress = 0;
      this.stepsLeft = this.deck.steps;
      this.moves = 0;
    }

    DrawSystem.background(this, `스테이지 ${this.stage}`);
    DrawSystem.topHud(this, profile.coins, profile.level);
    this.drawSidePanel();
    this.drawGoalArea();
    this.boardLayer = this.add.container(0, 0);
    this.noteText = this.add.text(195, 802, '위에 보이는 목표와 같은 계열의 말 카드를 골라보세요.', applyWrap(mutedText(12), 336)).setOrigin(0.5);
    this.redrawBoard();
  }

  private currentGoal(): GoalCard {
    return this.deck.goals[this.goalIndex];
  }

  private drawSidePanel(): void {
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.48);
    g.fillRoundedRect(14, 146, 92, 138, 18);
    g.lineStyle(2, 0x8fd3ff, 0.26);
    g.strokeRoundedRect(14, 146, 92, 138, 18);
    this.add.text(60, 168, '스텝', bodyText(15)).setOrigin(0.5);
    this.stepText = this.add.text(60, 218, `${this.stepsLeft}`, titleText(48)).setOrigin(0.5);
    this.add.text(60, 262, '+20', goldText(16)).setOrigin(0.5);

    this.drawLockedSlot(60, 420, '힌트');
    this.drawLockedSlot(60, 592, '셔플');
  }

  private drawLockedSlot(x: number, y: number, label: string): void {
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.38);
    g.fillRoundedRect(x - 45, y - 64, 90, 128, 18);
    g.lineStyle(1, 0xffffff, 0.14);
    g.strokeRoundedRect(x - 45, y - 64, 90, 128, 18);
    this.add.text(x, y - 38, label, mutedText(17)).setOrigin(0.5);
    this.add.text(x, y + 4, '+', titleText(38)).setOrigin(0.5).setAlpha(0.55);
    this.add.text(x, y + 42, '준비중', mutedText(11)).setOrigin(0.5);
  }

  private drawGoalArea(): void {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.08);
    g.fillRoundedRect(122, 142, 248, 204, 24);
    g.lineStyle(1, 0xffffff, 0.18);
    g.strokeRoundedRect(122, 142, 248, 204, 24);

    this.drawBackCard(320, 245, 70, 94, `${this.deck.goals.length - this.goalIndex}`);
    this.drawGoalStack();
  }

  private drawGoalStack(): void {
    const goal = this.currentGoal();
    for (let i = 2; i >= 0; i -= 1) {
      const x = 208 + i * 18;
      this.drawFaceCard(x, 228, 96, 128, i === 0 ? goal.label : '', i === 0 ? CATEGORY_LABELS[goal.category] : '', false);
    }
    this.goalText = this.add.text(210, 312, `목표 ${this.goalIndex + 1}/${this.deck.goals.length}`, goldText(14)).setOrigin(0.5);
    this.progressText = this.add.text(210, 332, `${this.goalProgress}/${goal.needed}`, bodyText(14)).setOrigin(0.5);
  }

  private redrawGoalTexts(): void {
    const goal = this.currentGoal();
    this.goalText.setText(`목표 ${this.goalIndex + 1}/${this.deck.goals.length}`);
    this.progressText.setText(`${this.goalProgress}/${goal.needed}`);
  }

  private redrawBoard(): void {
    this.boardLayer.removeAll(true);
    const xs = [150, 218, 286, 354];
    const baseY = 442;
    const cardW = 62;
    const cardH = 92;
    const gapY = 45;

    this.columns.forEach((column, colIndex) => {
      column.forEach((card, rowIndex) => {
        const x = xs[colIndex];
        const y = baseY + rowIndex * gapY;
        const isTop = rowIndex === column.length - 1;
        const view = this.createWordCard(card, x, y, cardW, cardH, isTop);
        this.boardLayer.add(view.container);
      });
      if (!column.length) {
        const empty = this.add.graphics();
        empty.lineStyle(2, 0xffffff, 0.14);
        empty.strokeRoundedRect(xs[colIndex] - cardW / 2, baseY - cardH / 2, cardW, cardH, 14);
        this.boardLayer.add(empty);
      }
    });
  }

  private createWordCard(card: WordCard, x: number, y: number, w: number, h: number, interactive: boolean): CardView {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.2);
    g.fillRoundedRect(-w / 2 + 3, -h / 2 + 5, w, h, 14);
    g.fillStyle(interactive ? 0xfffbf1 : 0xfff6df, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    g.lineStyle(3, interactive ? 0xffa320 : 0xffcc73, 1);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
    g.lineStyle(1, 0xffffff, 0.9);
    g.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 10);
    g.fillStyle(0xffa320, interactive ? 0.95 : 0.72);
    g.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w - 10, 20, 8);

    const tag = this.add.text(0, -h / 2 + 15, card.tag, cardSmallText(9)).setOrigin(0.5);
    const label = this.add.text(0, 11, card.label, applyWrap(cardText(card.label.length > 4 ? 16 : 19), w - 14)).setOrigin(0.5);
    container.add([g, tag, label]);

    if (interactive) {
      const zone = this.add.zone(0, 0, w + 8, h + 8).setOrigin(0.5).setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => this.selectCard(card));
      container.add(zone);
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
        const debug = this.add.rectangle(0, 0, w + 8, h + 8, 0x00ff66, 0.12).setStrokeStyle(1, 0x00ff66, 0.75);
        container.add(debug);
      }
    } else {
      container.setAlpha(0.82);
    }

    return { card, container };
  }

  private drawFaceCard(x: number, y: number, w: number, h: number, label: string, tag: string, shadow = true): void {
    const g = this.add.graphics();
    if (shadow) {
      g.fillStyle(0x000000, 0.18);
      g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 7, w, h, 18);
    }
    g.fillStyle(0xfffbf1, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 18);
    g.lineStyle(4, 0xffa320, 1);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 18);
    g.lineStyle(1, 0xffffff, 0.85);
    g.strokeRoundedRect(x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10, 13);
    if (label) this.add.text(x, y - 6, label, applyWrap(cardText(label.length > 4 ? 20 : 24), w - 16)).setOrigin(0.5);
    if (tag) this.add.text(x, y + 44, tag, cardSmallText(10)).setOrigin(0.5);
  }

  private drawBackCard(x: number, y: number, w: number, h: number, count: string): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.2);
    g.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 7, w, h, 16);
    g.fillStyle(0xff8a19, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    g.lineStyle(4, 0xffffff, 0.9);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    g.fillStyle(0xffb347, 0.42);
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        g.fillEllipse(x - 22 + col * 22, y - 34 + row * 18, 18, 28);
      }
    }
    this.add.text(x - 22, y + 32, count, bodyText(14)).setOrigin(0.5);
  }

  private selectCard(card: WordCard): void {
    if (this.stepsLeft <= 0) return;
    this.moves += 1;
    this.stepsLeft -= 1;
    this.stepText.setText(`${this.stepsLeft}`);

    const goal = this.currentGoal();
    const column = this.columns.find((candidate) => candidate[candidate.length - 1]?.id === card.id);
    if (!column) return;

    if (card.category === goal.category) {
      column.pop();
      this.goalProgress += 1;
      this.noteText.setText(`좋아요! ${goal.label} 계열 카드입니다.`);
      this.flash(0x58ffba);
      if (this.goalProgress >= goal.needed) {
        this.goalIndex += 1;
        this.goalProgress = 0;
        if (this.goalIndex >= this.deck.goals.length) {
          this.time.delayedCall(350, () => this.scene.start('ResultScene', { modeId: this.modeId, stage: this.stage, moves: this.moves, stepsLeft: this.stepsLeft }));
          return;
        }
        this.scene.restart({ modeId: this.modeId, stage: this.stage, continueState: { columns: this.columns, goalIndex: this.goalIndex, stepsLeft: this.stepsLeft, moves: this.moves } });
        return;
      }
      this.redrawGoalTexts();
      this.redrawBoard();
      return;
    }

    this.noteText.setText(`${card.label}은(는) ${goal.label} 계열이 아니에요.`);
    this.cameras.main.shake(110, 0.004);
    this.flash(0xff5e7a);
    this.redrawBoard();
    if (this.stepsLeft <= 0) {
      this.time.delayedCall(420, () => this.scene.start('ResultScene', { modeId: this.modeId, stage: this.stage, moves: this.moves, failed: true }));
    }
  }

  private flash(color: number): void {
    const rect = this.add.rectangle(195, 422, 390, 844, color, 0.08);
    this.tweens.add({ targets: rect, alpha: 0, duration: 180, onComplete: () => rect.destroy() });
  }
}
