import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';

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
    this.add.text(195, 92, '책을 선택하세요', { fontSize: '20px', fontStyle: '900', color: '#ffe8a6' }).setOrigin(0.5);
    MODES.forEach((mode, i) => {
      const y = 180 + i * 118;
      panel(this, 195, y, 326, 92, 24);
      this.add.text(68, y, mode.icon, { fontSize: '34px' }).setOrigin(0.5);
      this.add.text(114, y - 12, mode.title, { fontSize: '22px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
      this.add.text(114, y + 18, '기본 스테이지 3개', { fontSize: '13px', color: '#bcd6ff' }).setOrigin(0, 0.5);
      this.add.zone(195, y, 326, 98).setInteractive().on('pointerup', () => this.scene.start('StageSelectScene', { modeId: mode.id, title: mode.title }));
    });
    const back = new GameButton(this, 195, 746, '로비로', 240, 54, 0xc9f4ff);
    back.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }
}
