import Phaser from 'phaser';
import { ModeData } from '../types/ModeTypes';
import { ModeSystem } from '../systems/ModeSystem';
import { CardView } from '../ui/CardView';
import { GlassPanel } from '../ui/GlassPanel';
import { HapticSystem } from '../systems/HapticSystem';
import { AuthSystem } from '../systems/AuthSystem';
import { saveModeProgress } from '../../firebase/firestore';

export class PlayScene extends Phaser.Scene {
  private mode!: ModeData;
  private selected: CardView[] = [];
  private remainingPairs = 0;
  private score = 0;

  constructor() {
    super('PlayScene');
  }

  async create(data: { modeId: string }): Promise<void> {
    this.drawBackground();
    this.createHud('불러오는 중...');

    this.mode = await ModeSystem.loadMode(data.modeId ?? 'word_ko_basic');
    this.children.removeAll();
    this.drawBackground();
    this.createHud(this.mode.title);
    this.createStage();

    this.game.events.on('cardville:back-button', this.pauseToHome, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('cardville:back-button', this.pauseToHome, this);
    });
  }

  private createHud(title: string): void {
    new GlassPanel(this, 195, 54, 350, 70, 22);
    this.add.text(34, 54, '‹ 홈', { fontSize: '20px', fontStyle: '800', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('HomeScene'));
    this.add.text(195, 54, title, { fontSize: '23px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(326, 54, '점수', { fontSize: '16px', color: '#cbd8ff' }).setOrigin(0.5, 0.2);
  }

  private createStage(): void {
    const stage = this.mode.stages[0];
    this.remainingPairs = stage.goal.targetCount;
    this.score = 0;

    this.add.text(195, 116, '같은 뜻의 카드를 선택하세요', {
      fontSize: '20px',
      fontStyle: '800',
      color: '#ffe4a3'
    }).setOrigin(0.5);

    const positions = [
      [112, 220], [278, 220],
      [112, 406], [278, 406],
      [112, 592], [278, 592]
    ];

    stage.cards.forEach((card, index) => {
      const [x, y] = positions[index];
      const view = new CardView(this, x, y, card);
      view.on('pointerdown', () => this.selectCard(view));
    });
  }

  private selectCard(card: CardView): void {
    if (this.selected.includes(card) || this.selected.length >= 2) return;

    HapticSystem.light();
    card.setSelected(true);
    this.selected.push(card);

    if (this.selected.length === 2) {
      this.time.delayedCall(240, () => this.judgeSelected());
    }
  }

  private judgeSelected(): void {
    const [a, b] = this.selected;
    const correct = a.dataRef.answerKey === b.dataRef.answerKey && a.dataRef.id !== b.dataRef.id;

    if (correct) {
      HapticSystem.success();
      this.score += 100;
      this.remainingPairs -= 1;
      this.createSuccessParticles((a.x + b.x) / 2, (a.y + b.y) / 2);
      a.playCorrect();
      b.playCorrect();
      if (this.remainingPairs <= 0) this.time.delayedCall(520, () => this.clearStage());
    } else {
      HapticSystem.wrong();
      a.playWrong();
      b.playWrong();
      a.setSelected(false);
      b.setSelected(false);
    }

    this.selected = [];
  }

  private async clearStage(): Promise<void> {
    new GlassPanel(this, 195, 422, 320, 280, 30);
    this.add.text(195, 360, '스테이지 클리어!', {
      fontSize: '32px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(195, 418, `점수 ${this.score}\n보상 🪙 20  ⭐ 카드팩 조각`, {
      fontSize: '21px',
      fontStyle: '800',
      color: '#ffe4a3',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(195, 512, '홈으로', {
      fontSize: '22px',
      fontStyle: '900',
      color: '#22152c',
      backgroundColor: '#ffd86f',
      padding: { left: 34, right: 34, top: 13, bottom: 13 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('HomeScene'));

    const uid = AuthSystem.currentUser?.uid;
    if (uid) {
      await saveModeProgress(uid, this.mode.modeId, 2, this.score).catch((error) => {
        console.warn('[CardVille] Progress save failed.', error);
      });
    }
  }

  private pauseToHome(): void {
    const goHome = window.confirm('게임을 멈추고 홈으로 돌아갈까요?');
    if (goHome) this.scene.start('HomeScene');
  }

  private createSuccessParticles(x: number, y: number): void {
    for (let i = 0; i < 18; i += 1) {
      const star = this.add.text(x, y, '✦', { fontSize: '20px', color: '#ffe4a3' }).setOrigin(0.5);
      this.tweens.add({
        targets: star,
        x: x + Phaser.Math.Between(-100, 100),
        y: y + Phaser.Math.Between(-90, 90),
        alpha: 0,
        scale: 0.2,
        duration: 600,
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
