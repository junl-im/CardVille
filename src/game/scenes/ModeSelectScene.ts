import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { bodyText, goldText, mutedText } from '../ui/TextStyles';

export const MODES = [
  { id: 'word', title: '낱말의 책', icon: '📚' },
  { id: 'math', title: '연산의 책', icon: '➕' },
  { id: 'memory', title: '기억력의 책', icon: '🧠' },
  { id: 'english', title: '영어의 책', icon: '🇬🇧' }
];

export class ModeSelectScene extends Phaser.Scene {
  constructor() { super('ModeSelectScene'); }
  create(): void {
    DrawSystem.background(this, '꿈의 서고');
    this.add.text(195, 92, '책을 선택하세요', goldText(22)).setOrigin(0.5);
    MODES.forEach((mode, i) => {
      const y = 180 + i * 118;
      panel(this, 195, y, 332, 94, 24);
      this.add.text(68, y, mode.icon, { fontSize: '34px' }).setOrigin(0.5);
      this.add.text(114, y - 14, mode.title, bodyText(22)).setOrigin(0, 0.5);
      this.add.text(114, y + 20, '기본 스테이지 3개', mutedText(13)).setOrigin(0, 0.5);
      this.add.zone(195, y, 342, 106).setInteractive({ useHandCursor: true }).on('pointerup', () => this.scene.start('StageSelectScene', { modeId: mode.id, title: mode.title }));
    });
    const back = new GameButton(this, 195, 746, '로비로', 248, 56, 0xc9f4ff);
    back.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }
}
