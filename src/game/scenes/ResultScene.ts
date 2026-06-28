import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { bodyText, goldText, titleText } from '../ui/TextStyles';

export class ResultScene extends Phaser.Scene {
  private moves = 0; private modeId = 'word'; private stage = 1;
  constructor() { super('ResultScene'); }
  init(data: { moves?: number; modeId?: string; stage?: number }): void { this.moves = data.moves ?? 0; this.modeId = data.modeId ?? 'word'; this.stage = data.stage ?? 1; }
  create(): void {
    DrawSystem.background(this, '클리어');
    panel(this, 195, 310, 336, 324, 34);
    this.add.text(195, 220, '🎉 성공!', titleText(42)).setOrigin(0.5);
    const stars = this.moves <= 2 ? '★★★' : this.moves <= 4 ? '★★☆' : '★☆☆';
    this.add.text(195, 292, stars, goldText(46)).setOrigin(0.5);
    this.add.text(195, 356, `이동 수: ${this.moves}`, bodyText(20)).setOrigin(0.5);
    const reward = new GameButton(this, 195, 482, '보상 받기', 276, 64, 0xffd86f);
    reward.on('pointerup', () => this.scene.start('RewardScene', { modeId: this.modeId, stage: this.stage }));
    const retry = new GameButton(this, 195, 566, '다시 하기', 276, 56, 0x8fd3ff);
    retry.on('pointerup', () => this.scene.start('PlayScene', { modeId: this.modeId, stage: this.stage }));
  }
}
