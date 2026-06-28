import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class ResultScene extends Phaser.Scene {
  private moves = 0;
  private modeId = 'word';
  private stage = 1;
  private failed = false;
  private stepsLeft = 0;
  private score = 0;
  private bestCombo = 0;

  constructor() { super('ResultScene'); }

  init(data: { moves?: number; modeId?: string; stage?: number; failed?: boolean; stepsLeft?: number; score?: number; bestCombo?: number }): void {
    this.moves = data.moves ?? 0;
    this.modeId = data.modeId ?? 'word';
    this.stage = data.stage ?? 1;
    this.failed = data.failed ?? false;
    this.stepsLeft = data.stepsLeft ?? 0;
    this.score = data.score ?? 0;
    this.bestCombo = data.bestCombo ?? 0;
  }

  create(): void {
    const record = SaveSystem.saveStageResult(this.stage, this.score, this.bestCombo, this.stepsLeft, this.failed);
    DrawSystem.background(this, this.failed ? '아쉬워요' : '클리어');
    panel(this, 195, 322, 336, 360, 34);
    this.add.text(195, 210, this.failed ? '다시 도전!' : '카드 정리 성공!', titleText(this.failed ? 34 : 31)).setOrigin(0.5);
    const stars = this.failed ? '☆☆☆' : '★'.repeat(record.stars).padEnd(3, '☆');
    this.add.text(195, 280, stars, goldText(46)).setOrigin(0.5);
    this.add.text(195, 334, `점수 ${this.score} · 최고 콤보 ${this.bestCombo}`, bodyText(17)).setOrigin(0.5);
    this.add.text(195, 368, `선택 ${this.moves}회 · 남은 스텝 ${this.stepsLeft}`, mutedText(14)).setOrigin(0.5);
    this.add.text(
      195,
      414,
      this.failed ? '맨 위 카드 중 목표 계열을 먼저 찾아보세요. 힌트와 셔플을 아끼지 않아도 됩니다.' : '말 카드 스택을 정리했어요. 보상 카드팩에서 새 카드를 얻을 수 있습니다.',
      applyWrap(mutedText(14), 292)
    ).setOrigin(0.5);

    const reward = new GameButton(this, 195, 510, this.failed ? '다시 하기' : '보상 받기', 276, 64, 0xffd86f);
    reward.onClick(() => {
      if (this.failed) this.scene.start('PlayScene', { modeId: this.modeId, stage: this.stage });
      else this.scene.start('RewardScene', { modeId: this.modeId, stage: this.stage, score: this.score, bestCombo: this.bestCombo, stars: record.stars });
    });

    const back = new GameButton(this, 195, 598, '스테이지 선택', 276, 56, 0x8fd3ff);
    back.onClick(() => this.scene.start('StageSelectScene', { modeId: this.modeId }));
  }
}
