import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { ProgressModeId, SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { MATH_STAGES } from '../data/mathStages';
import { MEMORY_STAGES } from '../data/memoryStages';
import { ENGLISH_STAGES } from '../data/englishStages';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { applyResponsiveCamera, hasTouchDebug } from '../systems/LayoutSystem';
import { getModeById } from '../data/modeCatalog';

const PAGE_SIZE = 4;

type StageCardEntry = {
  id: number;
  title: string;
  note: string;
  difficulty: string;
  metric: string;
  rewardPreview: string;
  routeScene: 'PlayScene' | 'MathLabScene' | 'MemoryForestScene' | 'EnglishSchoolScene';
};

function modeTitle(modeId: ProgressModeId, fallback: string): string {
  return getModeById(modeId)?.title ?? fallback;
}

export class StageSelectScene extends Phaser.Scene {
  private modeId: ProgressModeId = 'word';
  private title = '말 카드';
  private page = 0;

  constructor() { super('StageSelectScene'); }

  init(data: { modeId?: ProgressModeId; title?: string; page?: number } = {}): void {
    this.modeId = data.modeId ?? 'word';
    this.title = data.title ?? modeTitle(this.modeId, '말 카드');
    this.page = data.page ?? 0;
  }

  create(): void {
    applyResponsiveCamera(this);
    const entries = this.stageEntries();
    const maxPage = Math.max(0, Math.ceil(entries.length / PAGE_SIZE) - 1);
    this.page = Phaser.Math.Clamp(this.page, 0, maxPage);
    const start = this.page * PAGE_SIZE;
    const stages = entries.slice(start, start + PAGE_SIZE);

    DrawSystem.background(this, this.title, this.modeId === 'memory' ? 'forest' : 'village');
    this.drawHeader(entries.length, maxPage);
    this.drawProgressStrip(entries);

    stages.forEach((stage, i) => {
      const y = 226 + i * 106;
      const record = SaveSystem.getModeStageRecord(this.modeId, stage.id);
      const unlocked = SaveSystem.isModeStageUnlocked(this.modeId, stage.id);
      const recommended = unlocked && (!record?.cleared || stage.id === SaveSystem.nextPlayableModeStage(this.modeId, entries.length));
      panel(this, 195, y, 332, 90, 26);
      if (recommended) this.add.rectangle(195, y, 338, 96, 0xffd86f, 0.09).setStrokeStyle(2, 0xffd86f, 0.54);
      this.drawStageBadge(62, y, stage.id, unlocked, recommended);
      this.add.text(108, y - 25, stage.title, bodyText(17)).setOrigin(0, 0.5).setAlpha(unlocked ? 1 : 0.62);
      this.add.text(108, y + 3, stage.note, applyWrap(mutedText(10), 198, 'left')).setOrigin(0, 0.5).setAlpha(unlocked ? 1 : 0.62);
      this.add.text(306, y - 27, stage.difficulty, goldText(10)).setOrigin(0.5).setAlpha(unlocked ? 1 : 0.62);
      this.add.text(306, y - 6, stage.metric, mutedText(9)).setOrigin(0.5).setAlpha(unlocked ? 1 : 0.55);
      this.add.text(300, y + 31, record ? '★'.repeat(record.stars).padEnd(3, '☆') : '☆☆☆', goldText(12)).setOrigin(0.5);
      if (record?.bestScore) this.add.text(124, y + 31, `최고 ${record.bestScore} · 콤보 ${record.bestCombo}`, mutedText(9)).setOrigin(0, 0.5);
      else this.add.text(124, y + 31, stage.rewardPreview, mutedText(9)).setOrigin(0, 0.5).setAlpha(unlocked ? 0.72 : 0.38);
      if (!unlocked) this.add.text(302, y + 11, '잠김', mutedText(12)).setOrigin(0.5);
      if (recommended) this.add.text(286, y + 12, 'NEXT', darkText(9)).setOrigin(0.5).setAlpha(0.9);

      const zone = this.add.zone(195, y, 332, 90).setInteractive({ useHandCursor: unlocked });
      zone.on('pointerup', () => {
        if (unlocked) this.startStage(stage);
        else this.showLockedHint(stage.id);
      });
      if (hasTouchDebug()) this.add.rectangle(195, y, 332, 90, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
    });

    const prev = new GameButton(this, 94, 690, '이전', 116, 52, 0xc9f4ff).onClick(() => this.scene.restart({ modeId: this.modeId, title: this.title, page: this.page - 1 }));
    const next = new GameButton(this, 296, 690, '다음', 116, 52, 0xffd86f).onClick(() => this.scene.restart({ modeId: this.modeId, title: this.title, page: this.page + 1 }));
    prev.setDisabled(this.page <= 0);
    next.setDisabled(this.page >= maxPage);
    new GameButton(this, 195, 758, '게임 선택으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene', { focusModeId: this.modeId }));
  }

  private drawHeader(totalStages: number, maxPage: number): void {
    const mode = getModeById(this.modeId);
    const subtitle = this.modeId === 'word'
      ? '카드 계열을 읽고 정리하는 도서관 수업'
      : this.modeId === 'math'
        ? '문제팩을 골라 연산 콤보를 쌓는 연구소 훈련'
        : this.modeId === 'english'
          ? '영단어와 뜻 카드를 연결하는 학교 첫 수업'
          : '프리뷰 시간을 보고 같은 그림을 찾는 숲속 기억 훈련';
    this.add.text(195, 84, `${mode?.fallbackIcon ?? '🎴'} ${this.title}`, goldText(23)).setOrigin(0.5);
    this.add.text(195, 116, subtitle, applyWrap(mutedText(12), 320)).setOrigin(0.5);
    this.add.text(195, 144, `${this.page + 1}/${maxPage + 1} 구역 · 전체 ${totalStages}단계 · 클리어하면 다음 단계가 열려요`, applyWrap(mutedText(10), 320)).setOrigin(0.5);
  }

  private drawProgressStrip(entries: StageCardEntry[]): void {
    const cleared = entries.filter((stage) => SaveSystem.getModeStageRecord(this.modeId, stage.id)?.cleared).length;
    const totalStars = entries.reduce((sum, stage) => sum + (SaveSystem.getModeStageRecord(this.modeId, stage.id)?.stars ?? 0), 0);
    const next = SaveSystem.nextPlayableModeStage(this.modeId, entries.length);
    this.add.rectangle(195, 174, 324, 38, 0x07142c, 0.58).setStrokeStyle(1, 0xffffff, 0.18);
    this.add.text(72, 174, `클리어 ${cleared}/${entries.length}`, mutedText(10)).setOrigin(0, 0.5);
    this.add.text(195, 174, `별 ${totalStars}/${entries.length * 3}`, goldText(10)).setOrigin(0.5);
    this.add.text(318, 174, `다음 ${next}단계`, mutedText(10)).setOrigin(1, 0.5);
  }

  private stageEntries(): StageCardEntry[] {
    if (this.modeId === 'math') {
      return MATH_STAGES.map((stage) => ({
        id: stage.id,
        title: stage.title,
        note: stage.subtitle,
        difficulty: stage.difficulty,
        metric: `${stage.problems.length}문제`,
        rewardPreview: `${stage.difficulty} 보상 +${stage.id}`,
        routeScene: 'MathLabScene'
      }));
    }
    if (this.modeId === 'memory') {
      return MEMORY_STAGES.map((stage) => ({
        id: stage.id,
        title: stage.title,
        note: stage.subtitle,
        difficulty: `${stage.previewSeconds}초 프리뷰`,
        metric: `${stage.pairs.length}쌍`,
        rewardPreview: `기억 보상 +${stage.id}`,
        routeScene: 'MemoryForestScene'
      }));
    }
    if (this.modeId === 'english') {
      return ENGLISH_STAGES.map((stage) => ({
        id: stage.id,
        title: stage.title,
        note: stage.subtitle,
        difficulty: stage.difficulty,
        metric: `${stage.cards.length}단어`,
        rewardPreview: `영어 보상 +${stage.id}`,
        routeScene: 'EnglishSchoolScene'
      }));
    }
    return WORD_STAGES.map((stage) => ({
      id: stage.id,
      title: stage.title,
      note: stage.note,
      difficulty: stage.difficulty,
      metric: `${stage.goals.length}목표`,
      rewardPreview: `단어 보상 +${stage.id}`,
      routeScene: 'PlayScene'
    }));
  }

  private startStage(stage: StageCardEntry): void {
    this.scene.start(stage.routeScene, { modeId: this.modeId, stage: stage.id });
  }

  private showLockedHint(stageId: number): void {
    const toast = this.add.container(195, 630).setDepth(1000);
    if (this.textures.exists('uiToast')) toast.add(this.add.image(0, 0, 'uiToast').setDisplaySize(284, 64).setAlpha(0.94));
    else toast.add(this.add.rectangle(0, 0, 284, 64, 0x07142c, 0.94).setStrokeStyle(2, 0xffd86f, 0.48));
    toast.add(this.add.text(0, -10, `${stageId - 1}단계를 먼저 클리어하세요`, goldText(14)).setOrigin(0.5));
    toast.add(this.add.text(0, 14, '진행 기록은 모드별로 따로 저장됩니다.', mutedText(10)).setOrigin(0.5));
    toast.setAlpha(0).setScale(0.92);
    this.tweens.add({ targets: toast, alpha: 1, scale: 1, duration: 120, ease: 'Back.easeOut' });
    this.time.delayedCall(1300, () => this.tweens.add({ targets: toast, alpha: 0, y: 610, duration: 220, onComplete: () => toast.destroy() }));
  }

  private drawStageBadge(x: number, y: number, id: number, unlocked: boolean, recommended: boolean): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.22);
    g.fillRoundedRect(x - 24, y - 28, 52, 60, 16);
    if (unlocked && this.textures.exists('assetCardBackCrown')) {
      this.add.image(x, y, 'assetCardBackCrown').setDisplaySize(58, 66).setAlpha(recommended ? 1 : 0.9);
    } else {
      g.fillStyle(unlocked ? 0xffd86f : 0x65708a, 1);
      g.fillRoundedRect(x - 26, y - 30, 52, 60, 16);
      g.lineStyle(3, recommended ? 0xfff3c2 : 0xffffff, recommended ? 0.95 : 0.74);
      g.strokeRoundedRect(x - 26, y - 30, 52, 60, 16);
      g.fillStyle(0xffffff, 0.18);
      g.fillRoundedRect(x - 19, y - 23, 38, 12, 8);
    }
    this.add.text(x, y + 1, unlocked ? `${id}` : '🔒', unlocked ? titleText(28) : { fontSize: '24px' }).setOrigin(0.5);
  }
}
