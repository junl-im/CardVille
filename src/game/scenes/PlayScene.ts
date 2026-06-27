import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';

type Card = { id: string; label: string; pair: string; flipped: boolean; matched: boolean; rect?: Phaser.GameObjects.Rectangle; text?: Phaser.GameObjects.Text };

const STAGE_CARDS: Card[] = [
  { id: 'apple_a', label: '🍎\n사과', pair: 'apple', flipped: false, matched: false },
  { id: 'apple_b', label: '빨간\n과일', pair: 'apple', flipped: false, matched: false },
  { id: 'cat_a', label: '🐱\n고양이', pair: 'cat', flipped: false, matched: false },
  { id: 'cat_b', label: '야옹\n친구', pair: 'cat', flipped: false, matched: false }
];

export class PlayScene extends Phaser.Scene {
  private cards: Card[] = [];
  private selected: Card[] = [];
  private moves = 0;
  private matched = 0;
  private modeId = 'word';
  private stage = 1;
  constructor() { super('PlayScene'); }
  init(data: { modeId?: string; stage?: number }): void { this.modeId = data.modeId ?? 'word'; this.stage = data.stage ?? 1; }
  create(): void {
    DrawSystem.background(this, `스테이지 ${this.stage}`);
    this.add.text(195, 96, '같은 의미의 카드 2쌍을 맞춰보세요', { fontSize: '15px', color: '#d8ebff' }).setOrigin(0.5);
    this.cards = Phaser.Utils.Array.Shuffle(STAGE_CARDS.map((c) => ({ ...c, flipped: false, matched: false })));
    const positions = [{x:116,y:276},{x:274,y:276},{x:116,y:468},{x:274,y:468}];
    this.cards.forEach((card, index) => this.createCard(card, positions[index].x, positions[index].y));
    this.add.text(195, 750, '뒤로가기: 스테이지 선택', { fontSize: '13px', color: '#9fbbe5' }).setOrigin(0.5).setInteractive().on('pointerup', () => this.scene.start('StageSelectScene', { modeId: this.modeId }));
  }

  private createCard(card: Card, x: number, y: number): void {
    const rect = this.add.rectangle(x, y, 126, 166, 0xffffff, 0.92).setStrokeStyle(3, 0x8fd3ff, 0.9).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, '?', { fontSize: '28px', fontStyle: '900', color: '#1b2a4b', align: 'center' }).setOrigin(0.5);
    rect.on('pointerup', () => this.flip(card));
    card.rect = rect;
    card.text = text;
  }

  private flip(card: Card): void {
    if (card.matched || card.flipped || this.selected.length >= 2) return;
    card.flipped = true;
    card.rect?.setFillStyle(0xfff5d6, 1);
    card.text?.setText(card.label);
    this.tweens.add({ targets: [card.rect, card.text], y: '-=8', duration: 90, yoyo: true });
    this.selected.push(card);
    if (this.selected.length === 2) this.checkPair();
  }

  private checkPair(): void {
    this.moves += 1;
    const [a, b] = this.selected;
    if (a.pair === b.pair) {
      a.matched = true; b.matched = true; this.matched += 2;
      this.tweens.add({ targets: [a.rect, a.text, b.rect, b.text], alpha: 0.35, scale: 0.96, duration: 220 });
      this.selected = [];
      if (this.matched >= this.cards.length) {
        this.time.delayedCall(420, () => this.scene.start('ResultScene', { modeId: this.modeId, stage: this.stage, moves: this.moves }));
      }
    } else {
      this.time.delayedCall(520, () => {
        this.selected.forEach((card) => {
          card.flipped = false;
          card.rect?.setFillStyle(0xffffff, 0.92);
          card.text?.setText('?');
        });
        this.selected = [];
      });
    }
  }
}
