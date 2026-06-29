import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { applyResponsiveCamera, hasTouchDebug } from '../systems/LayoutSystem';
import { GAME_MODES, GameMode, GameModeId, getModeById } from '../data/modeCatalog';
import { MATH_STAGES } from '../data/mathStages';
import { MEMORY_STAGES } from '../data/memoryStages';
import { WORD_STAGES } from '../data/wordStages';
import { ENGLISH_STAGES } from '../data/englishStages';
import { SaveSystem } from '../systems/SaveSystem';

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
    this.add.text(195, 146, '열린 모드: 도서관 · 학교 · 연구소 · 기억의 숲 · 오늘의 미션', mutedText(10)).setOrigin(0.5);
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
    const summary = this.modeProgressSummary(mode);
    this.add.text(305, y + 25, open ? summary.badge : '준비중', open ? goldText(10) : mutedText(10)).setOrigin(0.5);
    this.add.text(114, y + 34, open ? summary.copy : mode.nextWork, applyWrap(mutedText(9), 170, 'left')).setOrigin(0, 0.5).setAlpha(open ? 0.88 : 0.52);

    const zone = this.add.zone(195, y, 334, 86).setInteractive({ useHandCursor: true });
    zone.on('pointerup', () => {
      if (open) this.startMode(mode);
      else this.showPlannedToast(mode);
    });
    if (hasTouchDebug()) this.add.rectangle(195, y, 334, 86, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
  }

  private modeProgressSummary(mode: GameMode): { badge: string; copy: string } {
    if (mode.id === 'math') {
      const next = SaveSystem.nextPlayableModeStage('math', MATH_STAGES.length);
      const cleared = MATH_STAGES.filter((stage) => SaveSystem.getModeStageRecord('math', stage.id)?.cleared).length;
      return { badge: `${cleared}/${MATH_STAGES.length}`, copy: `다음 ${next}단계 · 문제팩 선택` };
    }
    if (mode.id === 'memory') {
      const next = SaveSystem.nextPlayableModeStage('memory', MEMORY_STAGES.length);
      const cleared = MEMORY_STAGES.filter((stage) => SaveSystem.getModeStageRecord('memory', stage.id)?.cleared).length;
      return { badge: `${cleared}/${MEMORY_STAGES.length}`, copy: `다음 ${next}단계 · 숲 카드 선택` };
    }
    if (mode.id === 'word') {
      const next = SaveSystem.nextPlayableStage(WORD_STAGES.length);
      return { badge: `${next}단계`, copy: '도서관 스테이지 선택' };
    }
    if (mode.id === 'english') {
      const next = SaveSystem.nextPlayableModeStage('english', ENGLISH_STAGES.length);
      const cleared = ENGLISH_STAGES.filter((stage) => SaveSystem.getModeStageRecord('english', stage.id)?.cleared).length;
      return { badge: `${cleared}/${ENGLISH_STAGES.length}`, copy: `다음 ${next}교시 · 뜻 카드 연결` };
    }
    if (mode.id === 'daily') return { badge: 'DAILY', copy: '출석 · 미션 · 카드팩 보상' };
    return { badge: 'PLAN', copy: mode.nextWork };
  }

  private startMode(mode: GameMode): void {
    if (mode.routeScene === 'MathLabScene') {
      this.scene.start('StageSelectScene', { modeId: 'math', title: mode.title, recommendedStage: SaveSystem.nextPlayableModeStage('math', MATH_STAGES.length) });
      return;
    }
    if (mode.routeScene === 'MemoryForestScene') {
      this.scene.start('StageSelectScene', { modeId: 'memory', title: mode.title, recommendedStage: SaveSystem.nextPlayableModeStage('memory', MEMORY_STAGES.length) });
      return;
    }
    if (mode.routeScene === 'EnglishSchoolScene') {
      this.scene.start('StageSelectScene', { modeId: 'english', title: mode.title, recommendedStage: SaveSystem.nextPlayableModeStage('english', ENGLISH_STAGES.length) });
      return;
    }
    if (mode.routeScene === 'DailyMissionScene') {
      this.scene.start('DailyMissionScene');
      return;
    }
    this.scene.start('StageSelectScene', { modeId: mode.id, title: mode.title });
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
