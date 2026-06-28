import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { applyResponsiveCamera, hasTouchDebug } from '../systems/LayoutSystem';
import { GAME_MODES, GameMode, GameModeId, getModeById } from '../data/modeCatalog';

export const MODES = GAME_MODES;

export class ModeSelectScene extends Phaser.Scene {
  private focusModeId?: GameModeId;
  private title = '게임 선택';

  constructor() { super('ModeSelectScene'); }

  init(data: { focusModeId?: GameModeId; title?: string } = {}): void {
    this.focusModeId = data.focusModeId;
    this.title = data.title ?? '게임 선택';
  }

  create(): void {
    applyResponsiveCamera(this);
    const focus = getModeById(this.focusModeId);
    DrawSystem.background(this, this.title);
    this.drawHeader(focus);

    GAME_MODES.forEach((mode, i) => this.drawModeCard(mode, 188 + i * 104, mode.id === focus?.id));

    new GameButton(this, 195, 746, '광장으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }

  private drawHeader(focus?: GameMode): void {
    this.add.text(195, 84, focus ? focus.title : '카드마을 게임관', goldText(22)).setOrigin(0.5);
    const copy = focus
      ? `${focus.note} · ${focus.status === 'open' ? '바로 입장 가능' : '다음 작업: ' + focus.nextWork}`
      : '건물별 콘텐츠를 한 곳에서 확인하고, 열린 모드부터 안정적으로 확장합니다.';
    this.add.text(195, 118, copy, applyWrap(mutedText(12), 322)).setOrigin(0.5);
  }

  private drawModeCard(mode: GameMode, y: number, focused: boolean): void {
    panel(this, 195, y, 334, 86, 24);
    if (focused) {
      this.add.rectangle(195, y, 342, 94, 0xffd86f, 0.10).setStrokeStyle(2, 0xffd86f, 0.64);
      this.add.text(304, y - 28, '추천', goldText(10)).setOrigin(0.5);
    }
    const open = mode.status === 'open';
    if (this.textures.exists(mode.iconKey)) this.add.image(68, y, mode.iconKey).setDisplaySize(44, 44).setAlpha(open ? 1 : 0.58);
    else this.add.text(68, y, mode.fallbackIcon, { fontSize: '34px' }).setOrigin(0.5).setAlpha(open ? 1 : 0.58);
    this.add.text(114, y - 17, mode.title, bodyText(20)).setOrigin(0, 0.5).setAlpha(open ? 1 : 0.62);
    this.add.text(114, y + 15, mode.note, applyWrap(mutedText(10), 212, 'left')).setOrigin(0, 0.5).setAlpha(open ? 1 : 0.62);
    this.add.text(305, y + 29, open ? 'OPEN' : '준비중', open ? goldText(10) : mutedText(10)).setOrigin(0.5);

    const zone = this.add.zone(195, y, 334, 86).setInteractive({ useHandCursor: true });
    zone.on('pointerup', () => {
      if (open) this.scene.start('StageSelectScene', { modeId: mode.id, title: mode.title });
      else this.showPlannedToast(mode);
    });
    if (hasTouchDebug()) this.add.rectangle(195, y, 334, 86, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
  }

  private showPlannedToast(mode: GameMode): void {
    const toast = this.add.container(195, 642).setDepth(1000);
    if (this.textures.exists('uiToast')) toast.add(this.add.image(0, 0, 'uiToast').setDisplaySize(300, 70).setAlpha(0.94));
    else toast.add(this.add.rectangle(0, 0, 300, 70, 0x07142c, 0.94).setStrokeStyle(2, 0xffd86f, 0.52));
    toast.add(this.add.text(0, -13, `${mode.title} 준비중`, titleText(16)).setOrigin(0.5));
    toast.add(this.add.text(0, 15, mode.nextWork, applyWrap(mutedText(11), 250)).setOrigin(0.5));
    toast.setScale(0.9).setAlpha(0);
    this.tweens.add({ targets: toast, scale: 1, alpha: 1, duration: 120, ease: 'Back.easeOut' });
    this.time.delayedCall(1800, () => this.tweens.add({ targets: toast, y: 620, alpha: 0, duration: 220, onComplete: () => toast.destroy() }));
  }
}
