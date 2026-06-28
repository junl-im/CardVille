import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { hasTouchDebug } from '../systems/LayoutSystem';

const PAGE_SIZE = 4;

export class StageSelectScene extends Phaser.Scene {
  private modeId = 'word';
  private title = '말 카드';
  private page = 0;

  constructor() { super('StageSelectScene'); }

  init(data: { modeId?: string; title?: string; page?: number }): void {
    this.modeId = data.modeId ?? 'word';
    this.title = data.title ?? '말 카드';
    this.page = data.page ?? 0;
  }

  create(): void {
    const maxPage = Math.max(0, Math.ceil(WORD_STAGES.length / PAGE_SIZE) - 1);
    this.page = Phaser.Math.Clamp(this.page, 0, maxPage);
    const start = this.page * PAGE_SIZE;
    const stages = WORD_STAGES.slice(start, start + PAGE_SIZE);

    DrawSystem.background(this, this.title);
    this.add.text(195, 92, '스테이지를 선택하세요', goldText(21)).setOrigin(0.5);
    this.add.text(195, 120, `${this.page + 1}/${maxPage + 1} 구역 · 클리어하면 다음 스테이지가 열려요`, applyWrap(mutedText(11), 320)).setOrigin(0.5);

    stages.forEach((stage, i) => {
      const y = 184 + i * 116;
      const record = SaveSystem.getStageRecord(stage.id);
      const unlocked = SaveSystem.isStageUnlocked(stage.id);
      panel(this, 195, y, 330, 94, 26);
      this.drawStageBadge(62, y, stage.id, unlocked);
      this.add.text(108, y - 24, stage.title, bodyText(18)).setOrigin(0, 0.5).setAlpha(unlocked ? 1 : 0.62);
      this.add.text(108, y + 5, stage.note, applyWrap(mutedText(11), 206, 'left')).setOrigin(0, 0.5).setAlpha(unlocked ? 1 : 0.62);
      this.add.text(306, y - 24, stage.difficulty, goldText(10)).setOrigin(0.5).setAlpha(unlocked ? 1 : 0.62);
      this.add.text(300, y + 30, record ? '★'.repeat(record.stars).padEnd(3, '☆') : '☆☆☆', goldText(12)).setOrigin(0.5);
      if (record?.bestScore) this.add.text(124, y + 34, `최고 ${record.bestScore} · 콤보 ${record.bestCombo}`, mutedText(10)).setOrigin(0, 0.5);
      if (!unlocked) this.add.text(302, y + 5, '잠김', mutedText(12)).setOrigin(0.5);

      const zone = this.add.zone(195, y, 330, 94).setInteractive({ useHandCursor: unlocked });
      zone.on('pointerup', () => {
        if (unlocked) this.scene.start('PlayScene', { modeId: this.modeId, stage: stage.id });
      });
      if (hasTouchDebug()) this.add.rectangle(195, y, 330, 94, 0x00ff66, 0.09).setStrokeStyle(1, 0x00ff66, 0.7);
    });

    const prev = new GameButton(this, 94, 690, '이전', 116, 52, 0xc9f4ff).onClick(() => this.scene.restart({ modeId: this.modeId, title: this.title, page: this.page - 1 }));
    const next = new GameButton(this, 296, 690, '다음', 116, 52, 0xffd86f).onClick(() => this.scene.restart({ modeId: this.modeId, title: this.title, page: this.page + 1 }));
    prev.setDisabled(this.page <= 0);
    next.setDisabled(this.page >= maxPage);
    new GameButton(this, 195, 758, '게임 선택으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
  }

  private drawStageBadge(x: number, y: number, id: number, unlocked: boolean): void {
    const g = this.add.graphics();
    g.fillStyle(unlocked ? 0xffd86f : 0x65708a, 1);
    g.fillRoundedRect(x - 26, y - 30, 52, 60, 16);
    g.lineStyle(3, 0xffffff, 0.74);
    g.strokeRoundedRect(x - 26, y - 30, 52, 60, 16);
    g.fillStyle(0xffffff, 0.18);
    g.fillRoundedRect(x - 19, y - 23, 38, 12, 8);
    this.add.text(x, y + 1, unlocked ? `${id}` : '🔒', unlocked ? titleText(28) : { fontSize: '24px' }).setOrigin(0.5);
  }
}
