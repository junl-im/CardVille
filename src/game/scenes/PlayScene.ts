import Phaser from 'phaser';
import { auth } from '../../firebase/firebaseApp';
import { addReward, saveModeProgress } from '../../firebase/firestore';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/phaserConfig';
import { HapticSystem } from '../systems/HapticSystem';
import { ModeSystem } from '../systems/ModeSystem';
import { RewardSystem } from '../systems/RewardSystem';
import { GameCardData, ModeData, StageData } from '../types/GameData';
import { addGlassPanel, addTopBar, drawWorldBackground } from '../ui/SceneHelpers';
import { CardView } from '../ui/CardView';

type PlaySceneData = {
  modeId?: string;
};

export class PlayScene extends Phaser.Scene {
  private mode?: ModeData;
  private stage?: StageData;
  private stageIndex = 0;
  private selectedCards: CardView[] = [];
  private matchedPairs = 0;
  private moves = 0;
  private inputLocked = false;
  private alive = false;

  constructor() {
    super('PlayScene');
  }

  create(data: PlaySceneData): void {
    this.alive = true;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.alive = false;
    });

    const modeId = data.modeId ?? 'word_ko_basic';
    void this.startStage(modeId);
  }

  private async startStage(modeId: string): Promise<void> {
    drawWorldBackground(this);
    addTopBar(this, '로딩 중...');

    try {
      this.mode = await ModeSystem.loadMode(modeId);
      if (!this.alive) return;
      this.stageIndex = this.registry.get('stageIndex') ?? 0;
      this.stage = ModeSystem.getStage(this.mode, this.stageIndex);
      this.renderStage();
    } catch (error) {
      console.error(error);
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '모드 데이터를 불러오지 못했습니다.', {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '20px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
    }
  }

  private renderStage(): void {
    if (!this.mode || !this.stage) return;

    this.children.removeAll(true);
    drawWorldBackground(this);
    addTopBar(this, this.mode.title);

    this.add
      .text(28, 112, '← 모드', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '19px',
        fontStyle: '800',
        color: '#ffffff',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('ModeSelectScene'));

    this.add
      .text(GAME_WIDTH / 2, 122, this.stage.title, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        fontStyle: '900',
        color: '#ffd166',
      })
      .setOrigin(0.5);

    addGlassPanel(this, 22, 152, GAME_WIDTH - 44, 54, 18);
    this.add
      .text(GAME_WIDTH / 2, 179, '같은 짝 카드를 찾아보세요', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '17px',
        fontStyle: '800',
        color: '#eaf0ff',
      })
      .setOrigin(0.5);

    this.selectedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.inputLocked = false;

    const cards = Phaser.Utils.Array.Shuffle([...this.stage.cards]);
    this.layoutCards(cards);
  }

  private layoutCards(cards: GameCardData[]): void {
    const cardWidth = 145;
    const cardHeight = 108;
    const gapX = 24;
    const gapY = 22;
    const columns = 2;
    const totalWidth = columns * cardWidth + (columns - 1) * gapX;
    const startX = (GAME_WIDTH - totalWidth) / 2 + cardWidth / 2;
    const startY = 264;

    cards.forEach((cardData, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + col * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY);
      const card = new CardView(this, x, y, cardWidth, cardHeight, cardData);
      card.on('pointerup', () => void this.handleCardClick(card));
    });
  }

  private async handleCardClick(card: CardView): Promise<void> {
    if (this.inputLocked || card.isLocked() || card.isFaceUp()) return;

    HapticSystem.light();
    card.bounceSelected();
    await card.flipUp();
    this.selectedCards.push(card);

    if (this.selectedCards.length < 2) return;

    this.moves += 1;
    this.inputLocked = true;
    const [first, second] = this.selectedCards;
    const matched = first.data.answerKey === second.data.answerKey && first.data.id !== second.data.id;

    if (matched) {
      this.handleMatch(first, second);
      return;
    }

    HapticSystem.error();
    first.shake();
    second.shake();
    this.time.delayedCall(620, () => {
      void Promise.all([first.flipDown(), second.flipDown()]).then(() => {
        this.selectedCards = [];
        this.inputLocked = false;
      });
    });
  }

  private handleMatch(first: CardView, second: CardView): void {
    HapticSystem.success();
    this.createMatchBurst((first.x + second.x) / 2, (first.y + second.y) / 2);
    first.markMatched();
    second.markMatched();
    this.selectedCards = [];
    this.matchedPairs += 1;
    this.inputLocked = false;

    if (this.stage && this.matchedPairs >= this.stage.goal.targetCount) {
      this.time.delayedCall(560, () => void this.completeStage());
    }
  }

  private createMatchBurst(x: number, y: number): void {
    for (let i = 0; i < 18; i += 1) {
      const star = this.add.text(x, y, '✦', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: `${Phaser.Math.Between(12, 24)}px`,
        color: '#ffd166',
      });
      star.setOrigin(0.5);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(32, 96);
      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(500, 850),
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy(),
      });
    }
  }

  private async completeStage(): Promise<void> {
    if (!this.stage || !this.mode) return;

    const result = RewardSystem.calculate(this.stage.rewards);
    const score = Math.max(1000 - this.moves * 35, 100) + result.coins;
    const user = auth.currentUser;

    if (user) {
      await Promise.allSettled([
        saveModeProgress({
          uid: user.uid,
          modeId: this.mode.modeId,
          currentStage: this.stageIndex + 1,
          bestScore: score,
        }),
        addReward({ uid: user.uid, xp: result.xp, coins: result.coins }),
      ]);
    }

    RewardSystem.showRewardPopup(this, result, () => {
      const nextIndex = this.stageIndex + 1;
      if (this.mode && nextIndex < this.mode.stages.length) {
        this.registry.set('stageIndex', nextIndex);
        this.scene.restart({ modeId: this.mode.modeId });
        return;
      }
      this.registry.set('stageIndex', 0);
      this.scene.start('HomeScene');
    });
  }
}
