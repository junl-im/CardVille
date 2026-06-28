import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { applyWrap, bodyText, goldText, mutedText } from '../ui/TextStyles';

export const MODES = [
  { id: 'word', title: '말 카드', icon: '🃏', note: '단어 계열을 찾아 스택을 정리하는 기본 모드', open: true },
  { id: 'combo', title: '콤보 카드', icon: '✨', note: '연속 정답으로 보너스를 얻는 모드', open: false },
  { id: 'memory', title: '기억 카드', icon: '🧠', note: '위치와 단어를 함께 기억하는 모드', open: false },
  { id: 'daily', title: '오늘의 카드', icon: '🎁', note: '매일 다른 카드 퍼즐 도전', open: false }
];

export class ModeSelectScene extends Phaser.Scene {
  constructor() { super('ModeSelectScene'); }
  create(): void {
    DrawSystem.background(this, '게임 선택');
    this.add.text(195, 92, '카드마을 게임관', goldText(22)).setOrigin(0.5);
    this.add.text(195, 122, '지금은 말 카드 모드부터 안정화합니다.', applyWrap(mutedText(12), 320)).setOrigin(0.5);
    MODES.forEach((mode, i) => {
      const y = 190 + i * 118;
      panel(this, 195, y, 332, 94, 24);
      this.add.text(68, y, mode.icon, { fontSize: '34px' }).setOrigin(0.5);
      this.add.text(114, y - 16, mode.title, bodyText(22)).setOrigin(0, 0.5);
      this.add.text(114, y + 20, mode.note, applyWrap(mutedText(12), 214, 'left')).setOrigin(0, 0.5);
      const zone = this.add.zone(195, y, 332, 94).setInteractive({ useHandCursor: mode.open });
      zone.on('pointerup', () => {
        if (mode.open) this.scene.start('StageSelectScene', { modeId: mode.id, title: mode.title });
      });
      if (!mode.open) this.add.text(315, y - 27, '준비중', goldText(11)).setOrigin(0.5);
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
        this.add.rectangle(195, y, 332, 94, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
      }
    });
    new GameButton(this, 195, 746, '광장으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }
}
