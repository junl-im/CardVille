import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { allowAmbientMotion, ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, scaledDuration } from '../systems/QualitySystem';
import { getMemoryStage, MemoryPair, MemoryStage } from '../data/memoryStages';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, cardSmallText, goldText, mutedText, titleText } from '../ui/TextStyles';

type MemoryCard = {
  uid: string;
  pair: MemoryPair;
  container: Phaser.GameObjects.Container;
  face: Phaser.GameObjects.Text;
  label: Phaser.GameObjects.Text;
  back?: Phaser.GameObjects.Image;
  revealed: boolean;
  matched: boolean;
};

export class MemoryForestScene extends Phaser.Scene {
  private stageId = 1;
  private stage!: MemoryStage;
  private cards: MemoryCard[] = [];
  private opened: MemoryCard[] = [];
  private lock = true;
  private moves = 0;
  private matchedPairs = 0;
  private score = 0;
  private statusText?: Phaser.GameObjects.Text;
  private quality: CardVilleQuality = getCardVilleQuality();

  constructor() { super('MemoryForestScene'); }

  init(data: { stage?: number } = {}): void {
    this.stageId = data.stage ?? 1;
  }

  create(): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    this.stage = getMemoryStage(this.stageId);
    this.cards = [];
    this.opened = [];
    this.lock = true;
    this.moves = 0;
    this.matchedPairs = 0;
    this.score = 0;

    DrawSystem.background(this, '기억의 숲', 'forest');
    this.drawForestDecor();
    this.add.text(195, 94, this.stage.title, goldText(25)).setOrigin(0.5);
    this.add.text(195, 124, `${this.stage.subtitle} · ${this.stage.id}단계`, applyWrap(mutedText(12), 310)).setOrigin(0.5);
    panel(this, 195, 428, 342, 518, 34);
    this.statusText = this.add.text(195, 184, '', bodyText(14)).setOrigin(0.5);
    this.drawBoard();
    this.revealPreview();
    new GameButton(this, 195, 770, '광장으로', 238, 54, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }

  private drawForestDecor(): void {
    const l = layout(this);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, 430, l.visibleWidth, 690, 0x063322, 0.12);
    if (this.textures.exists('dioramaForest')) this.add.image(68, 160, 'dioramaForest').setDisplaySize(92, 78).setAlpha(0.92);
    if (this.textures.exists('catHint')) this.add.image(318, 166, 'catHint').setDisplaySize(58, 62).setAlpha(0.96);
    for (let i = 0; i < ambientCount(18, this.quality, 5); i += 1) {
      const x = 22 + ((i * 51) % 346);
      const y = 210 + ((i * 83) % 472);
      const light = this.textures.exists('propFirefly')
        ? this.add.image(x, y, 'propFirefly').setDisplaySize(12, 12)
        : this.add.circle(x, y, 3, 0xffee8a, 0.4);
      light.setAlpha(0.28).setDepth(4);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: light, x: x + (i % 2 ? 14 : -14), y: y - 18, alpha: 0.05, duration: scaledDuration(1200 + i * 75, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawBoard(): void {
    const deck = this.shuffle(this.stage.pairs.flatMap((pair) => [pair, pair]));
    const compact = deck.length > 16;
    const cardW = compact ? 66 : 72;
    const cardH = compact ? 76 : 92;
    const gapX = compact ? 10 : 14;
    const gapY = compact ? 10 : 16;
    const startX = 195 - (cardW * 4 + gapX * 3) / 2 + cardW / 2;
    const startY = 250;

    deck.forEach((pair, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const card = this.createCard(`${pair.id}-${index}`, pair, x, y, cardW, cardH);
      this.cards.push(card);
    });
    this.refreshStatus('잠깐 외운 뒤 같은 그림을 찾아요.');
  }

  private createCard(uid: string, pair: MemoryPair, x: number, y: number, w: number, h: number): MemoryCard {
    const container = this.add.container(x, y).setDepth(y);
    const shadow = this.add.rectangle(4, 7, w, h, 0x000000, 0.24).setOrigin(0.5);
    const front = this.add.rectangle(0, 0, w, h, 0xfffbf1, 0.98).setStrokeStyle(4, 0x78d9a1, 0.95).setOrigin(0.5);
    const face = this.add.text(0, -14, pair.icon, { fontSize: '30px' }).setOrigin(0.5);
    const label = this.add.text(0, 30, pair.label, cardSmallText(10)).setOrigin(0.5);
    const back = this.textures.exists('assetCardBackCrown')
      ? this.add.image(0, 0, 'assetCardBackCrown').setDisplaySize(w + 4, h + 6)
      : undefined;
    if (back) back.setVisible(false);
    container.add([shadow, front, face, label]);
    if (back) container.add(back);
    container.setSize(w, h).setInteractive({ useHandCursor: true });
    const card: MemoryCard = { uid, pair, container, face, label, back, revealed: true, matched: false };
    container.on('pointerup', () => this.touchCard(card));
    container.on('pointerover', () => { if (!this.lock && !card.revealed && !card.matched) this.tweens.add({ targets: container, scale: 1.04, duration: 100 }); });
    container.on('pointerout', () => { if (!this.lock) this.tweens.add({ targets: container, scale: 1, duration: 100 }); });
    return card;
  }

  private revealPreview(): void {
    this.lock = true;
    this.cards.forEach((card) => this.setRevealed(card, true));
    this.time.delayedCall(this.stage.previewSeconds * 1000, () => {
      this.cards.forEach((card) => this.setRevealed(card, false));
      this.lock = false;
      this.refreshStatus('이제 짝을 찾아보세요!');
    });
  }

  private touchCard(card: MemoryCard): void {
    if (this.lock || card.revealed || card.matched) return;
    this.setRevealed(card, true);
    this.opened.push(card);
    if (this.opened.length < 2) return;
    this.moves += 1;
    this.lock = true;
    const [first, second] = this.opened;
    if (first.pair.id === second.pair.id) {
      first.matched = true;
      second.matched = true;
      this.matchedPairs += 1;
      this.score += 150 + Math.max(0, 10 - this.moves) * 10;
      this.opened = [];
      this.spawnPairText(second.container.x, second.container.y - 56, '짝 발견!');
      if (isMotionEnabled(this.quality)) this.tweens.add({ targets: [first.container, second.container], scale: 1.08, duration: 100, yoyo: true, ease: 'Back.easeOut' });
      this.time.delayedCall(360, () => {
        this.lock = false;
        if (this.matchedPairs >= this.stage.pairs.length) this.finish();
        else this.refreshStatus('좋아요. 다음 짝을 찾아요.');
      });
    } else {
      this.refreshStatus('아쉬워요. 위치를 기억해 보세요.');
      this.time.delayedCall(620, () => {
        this.setRevealed(first, false);
        this.setRevealed(second, false);
        this.opened = [];
        this.lock = false;
        this.refreshStatus('다시 선택하세요.');
      });
    }
    this.refreshStatus();
  }

  private setRevealed(card: MemoryCard, revealed: boolean): void {
    card.revealed = revealed;
    card.face.setVisible(revealed);
    card.label.setVisible(revealed);
    card.back?.setVisible(!revealed);
    if (!card.back) {
      card.container.setAlpha(revealed ? 1 : 0.72);
    }
  }

  private finish(): void {
    const efficiency = Math.max(0, 18 - this.moves);
    const stars = this.moves <= 11 ? 3 : this.moves <= 15 ? 2 : 1;
    this.scene.start('RewardScene', { modeId: 'memory', stage: this.stage.id, score: this.score + efficiency * 20, bestCombo: Math.max(1, efficiency), stars, stepsLeft: efficiency });
  }

  private refreshStatus(message?: string): void {
    this.statusText?.setText(`짝 ${this.matchedPairs}/${this.stage.pairs.length} · 선택 ${this.moves}회 · 점수 ${this.score}${message ? `\n${message}` : ''}`);
  }

  private spawnPairText(x: number, y: number, labelText: string): void {
    const text = this.add.text(x, y, labelText, titleText(17)).setOrigin(0.5).setDepth(2000);
    this.tweens.add({ targets: text, y: y - 25, alpha: 0, duration: scaledDuration(620, this.quality), ease: 'Sine.easeOut', onComplete: () => text.destroy() });
  }

  private shuffle<T>(items: readonly T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }
}
