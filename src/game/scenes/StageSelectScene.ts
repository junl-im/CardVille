import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';

export class StageSelectScene extends Phaser.Scene {
  private modeId = 'word';
  private title = '낱말의 책';
  constructor() { super('StageSelectScene'); }
  init(data: { modeId?: string; title?: string }): void { this.modeId = data.modeId ?? 'word'; this.title = data.title ?? '낱말의 책'; }
  create(): void {
    DrawSystem.background(this, this.title);
    [1,2,3].forEach((stage, i) => {
      const y = 190 + i * 132;
      panel(this, 195, y, 320, 100, 26);
      this.add.text(62, y, `${stage}`, { fontSize: '36px', fontStyle: '900', color: '#ffe8a6' }).setOrigin(0.5);
      this.add.text(110, y - 15, `스테이지 ${stage}`, { fontSize: '22px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
      this.add.text(110, y + 18, '카드 4장 맞추기', { fontSize: '14px', color: '#cde2ff' }).setOrigin(0, 0.5);
      this.add.zone(195, y, 320, 106).setInteractive().on('pointerup', () => this.scene.start('PlayScene', { modeId: this.modeId, stage }));
    });
    const back = new GameButton(this, 195, 746, '꿈의 서고로', 240, 54, 0xc9f4ff);
    back.on('pointerup', () => this.scene.start('ModeSelectScene'));
  }
}
