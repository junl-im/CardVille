import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class ResultScene extends Phaser.Scene {
  private moves = 0;
  private modeId = 'word';
  private stage = 1;
  private failed = false;
  private stepsLeft = 0;

  constructor() { super('ResultScene'); }

  init(data: { moves?: number; modeId?: string; stage?: number; failed?: boolean; stepsLeft?: number }): void {
    this.moves = data.moves ?? 0;
    this.modeId = data.modeId ?? 'word';
    this.stage = data.stage ?? 1;
    this.failed = data.failed ?? false;
    this.stepsLeft = data.stepsLeft ?? 0;
  }

  create(): void {
    DrawSystem.background(this, this.failed ? '아쉬워요' : '클리어');
    panel(this, 195, 316, 336, 340, 34);
    this.add.text(195, 220, this.failed ? '다시 도전!' : '카드 정리 성공!', titleText(this.failed ? 34 : 31)).setOrigin(0.5);
    const stars = this.failed ? '☆☆☆' : this.stepsLeft >= 12 ? '★★★' : this.stepsLeft >= 6 ? '★★☆' : '★☆☆';
    this.add.text(195, 292, stars, goldText(46)).setOrigin(0.5);
    this.add.text(195, 352, `선택 수: ${this.moves} · 남은 스텝: ${this.stepsLeft}`, bodyText(18)).setOrigin(0.5);
    this.add.text(
      195,
      398,
      this.failed ? '목표와 같은 말 계열을 먼저 찾아보세요.' : '말 카드 스택을 정리하고 보상을 얻었어요.',
      applyWrap(mutedText(14), 292)
    ).setOrigin(0.5);

    const reward = new GameButton(this, 195, 492, this.failed ? '다시 하기' : '보상 받기', 276, 64, 0xffd86f);
    reward.onClick(() => {
      if (this.failed) this.scene.start('PlayScene', { modeId: this.modeId, stage: this.stage });
      else this.scene.start('RewardScene', { modeId: this.modeId, stage: this.stage });
    });

    const back = new GameButton(this, 195, 578, '스테이지 선택', 276, 56, 0x8fd3ff);
    back.onClick(() => this.scene.start('StageSelectScene', { modeId: this.modeId }));
  }
}
