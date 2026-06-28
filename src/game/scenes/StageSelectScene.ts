import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { applyWrap, bodyText, goldText, mutedText } from '../ui/TextStyles';

const STAGES = [
  { id: 1, title: '졸림과 강함', note: '피곤함, 강한 느낌 계열을 찾아요.' },
  { id: 2, title: '럭키와 방패', note: '귀여움, 행운, 보호 계열을 찾아요.' },
  { id: 3, title: '큐브와 장소', note: '모양과 장소 계열을 정리해요.' }
];

export class StageSelectScene extends Phaser.Scene {
  private modeId = 'word';
  private title = '말 카드';
  constructor() { super('StageSelectScene'); }
  init(data: { modeId?: string; title?: string }): void { this.modeId = data.modeId ?? 'word'; this.title = data.title ?? '말 카드'; }
  create(): void {
    DrawSystem.background(this, this.title);
    this.add.text(195, 92, '스테이지를 선택하세요', goldText(21)).setOrigin(0.5);
    STAGES.forEach((stage, i) => {
      const y = 190 + i * 132;
      panel(this, 195, y, 326, 102, 26);
      this.add.text(62, y, `${stage.id}`, goldText(36)).setOrigin(0.5);
      this.add.text(110, y - 18, stage.title, bodyText(21)).setOrigin(0, 0.5);
      this.add.text(110, y + 18, stage.note, applyWrap(mutedText(13), 212, 'left')).setOrigin(0, 0.5);
      this.add.zone(195, y, 326, 102)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => this.scene.start('PlayScene', { modeId: this.modeId, stage: stage.id }));
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
        this.add.rectangle(195, y, 326, 102, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
      }
    });
    new GameButton(this, 195, 746, '게임 선택으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
  }
}
