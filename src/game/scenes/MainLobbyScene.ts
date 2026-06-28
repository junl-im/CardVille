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

    panel(this, 195, 184, 356, 152, 30);
    if (this.textures.exists('assetPack')) this.add.image(60, 156, 'assetPack').setDisplaySize(48, 48);
    if (this.textures.exists('assetAlbum')) this.add.image(330, 156, 'assetAlbum').setDisplaySize(48, 48);
    this.add.text(195, 138, 'CardVille', titleText(38)).setOrigin(0.5);
    this.add.text(195, 181, `${profile.nickname} 주민님`, goldText(20)).setOrigin(0.5);
    this.add.text(195, 218, `스테이지 ${cleared}/${WORD_STAGES.length} · 보유 카드 ${cards}장`, applyWrap(bodyText(14), 324)).setOrigin(0.5);

    panel(this, 195, 454, 356, 338, 34);
    new GameButton(this, 195, 320, `이어하기 · ${nextStage}스테이지`, 320, 66, 0xffd86f).onClick(() => this.scene.start('PlayScene', { modeId: 'word', stage: nextStage }));
    new GameButton(this, 195, 402, '말 카드 스테이지', 320, 60, 0x8fd3ff).onClick(() => this.scene.start('StageSelectScene', { modeId: 'word', title: '말 카드' }));
    new GameButton(this, 195, 480, '카드 앨범', 320, 58, 0xf0c7ff).onClick(() => this.scene.start('CollectionScene'));
    new GameButton(this, 195, 556, '카드마을 게임관', 320, 56, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
    new GameButton(this, 195, 632, '로컬 데이터 초기화', 320, 52, 0xffc6d5).onClick(() => { SaveSystem.clear(); this.scene.restart(); });

    this.add.text(195, 740, '말 카드 스택 → 별 기록 → 카드팩 보상 → 앨범 수집', applyWrap(mutedText(12), 336)).setOrigin(0.5);
    this.add.text(195, 790, '1.0.16', mutedText(12)).setOrigin(0.5);
  }
}
