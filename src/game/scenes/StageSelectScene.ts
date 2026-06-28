import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { bodyText, goldText, mutedText } from '../ui/TextStyles';

export class StageSelectScene extends Phaser.Scene {
  private modeId = 'word';
  private title = '낱말의 책';
  constructor() { super('StageSelectScene'); }
  init(data: { modeId?: string; title?: string }): void { this.modeId = data.modeId ?? 'word'; this.title = data.title ?? '낱말의 책'; }
  create(): void {
    DrawSystem.background(this, this.title);
    [1,2,3].forEach((stage, i) => {
      const y = 190 + i * 132;
      panel(this, 195, y, 326, 102, 26);
      this.add.text(62, y, `${stage}`, goldText(36)).setOrigin(0.5);
      this.add.text(110, y - 16, `스테이지 ${stage}`, bodyText(22)).setOrigin(0, 0.5);
      this.add.text(110, y + 19, '카드 4장 맞추기', mutedText(14)).setOrigin(0, 0.5);
      this.add.zone(195, y, 336, 112).setInteractive({ useHandCursor: true }).on('pointerup', () => this.scene.start('PlayScene', { modeId: this.modeId, stage }));
    });
    const back = new GameButton(this, 195, 746, '꿈의 서고로', 248, 56, 0xc9f4ff);
    back.on('pointerup', () => this.scene.start('ModeSelectScene'));
  }
}
