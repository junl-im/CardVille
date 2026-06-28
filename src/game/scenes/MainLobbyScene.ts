import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class MainLobbyScene extends Phaser.Scene {
  constructor() { super('MainLobbyScene'); }

  create(): void {
    const profile = SaveSystem.loadProfile();
    const nextStage = SaveSystem.nextPlayableStage(WORD_STAGES.length);
    const progress = SaveSystem.loadProgress();
    const cleared = Object.values(progress).filter((record) => record.cleared).length;
    const cards = Object.values(SaveSystem.loadCollection()).reduce((sum, count) => sum + count, 0);

    DrawSystem.background(this, '카드마을 광장');
    DrawSystem.topHud(this, profile.coins, profile.level);

    panel(this, 195, 184, 346, 148, 30);
    this.add.text(195, 138, 'CardVille', titleText(38)).setOrigin(0.5);
    this.add.text(195, 181, `${profile.nickname} 주민님`, goldText(20)).setOrigin(0.5);
    this.add.text(195, 218, `스테이지 ${cleared}/${WORD_STAGES.length} · 보유 카드 ${cards}장`, applyWrap(bodyText(14), 304)).setOrigin(0.5);

    panel(this, 195, 454, 346, 338, 34);
    new GameButton(this, 195, 320, `이어하기 · ${nextStage}스테이지`, 300, 66, 0xffd86f).onClick(() => this.scene.start('PlayScene', { modeId: 'word', stage: nextStage }));
    new GameButton(this, 195, 402, '말 카드 스테이지', 300, 60, 0x8fd3ff).onClick(() => this.scene.start('StageSelectScene', { modeId: 'word', title: '말 카드' }));
    new GameButton(this, 195, 480, '카드 앨범', 300, 58, 0xf0c7ff).onClick(() => this.scene.start('CollectionScene'));
    new GameButton(this, 195, 556, '카드마을 게임관', 300, 56, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
    new GameButton(this, 195, 632, '로컬 데이터 초기화', 300, 52, 0xffc6d5).onClick(() => { SaveSystem.clear(); this.scene.restart(); });

    this.add.text(195, 740, '말 카드 스택 → 별 기록 → 카드팩 보상 → 앨범 수집', applyWrap(mutedText(12), 336)).setOrigin(0.5);
    this.add.text(195, 790, '1.0.11', mutedText(12)).setOrigin(0.5);
  }
}
