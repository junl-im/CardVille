import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { applyWrap, bodyText, goldText, mutedText } from '../ui/TextStyles';
import { hasTouchDebug } from '../systems/LayoutSystem';

export const MODES = [
  { id: 'word', title: '말 카드', icon: '🃏', note: '단어 계열을 찾아 카드 스택을 정리하는 기본 모드', open: true },
  { id: 'combo', title: '콤보 카드', icon: '✨', note: '연속 정답 보너스와 제한 스텝에 도전하는 예정 모드', open: false },
  { id: 'memory', title: '기억 카드', icon: '🧠', note: '잠깐 본 카드를 기억해서 고르는 예정 모드', open: false },
  { id: 'daily', title: '오늘의 카드', icon: '🎁', note: '매일 다른 카드팩 미션을 받는 예정 모드', open: false }
];

export class ModeSelectScene extends Phaser.Scene {
  constructor() { super('ModeSelectScene'); }

  create(): void {
    DrawSystem.background(this, '게임 선택');
    this.add.text(195, 92, '카드마을 게임관', goldText(22)).setOrigin(0.5);
    this.add.text(195, 122, '작동 안정화가 끝난 말 카드부터 차례대로 확장합니다.', applyWrap(mutedText(12), 320)).setOrigin(0.5);

    MODES.forEach((mode, i) => {
      const y = 188 + i * 116;
      panel(this, 195, y, 334, 92, 24);
      this.add.text(68, y, mode.icon, { fontSize: '34px' }).setOrigin(0.5).setAlpha(mode.open ? 1 : 0.58);
      this.add.text(114, y - 17, mode.title, bodyText(21)).setOrigin(0, 0.5).setAlpha(mode.open ? 1 : 0.62);
      this.add.text(114, y + 18, mode.note, applyWrap(mutedText(11), 214, 'left')).setOrigin(0, 0.5).setAlpha(mode.open ? 1 : 0.62);
      const zone = this.add.zone(195, y, 334, 92).setInteractive({ useHandCursor: mode.open });
      zone.on('pointerup', () => {
        if (mode.open) this.scene.start('StageSelectScene', { modeId: mode.id, title: mode.title });
      });
      if (!mode.open) this.add.text(315, y - 27, '준비중', goldText(10)).setOrigin(0.5);
      if (hasTouchDebug()) this.add.rectangle(195, y, 334, 92, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
    });

    new GameButton(this, 195, 746, '광장으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }
}
