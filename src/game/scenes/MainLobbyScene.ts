import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class MainLobbyScene extends Phaser.Scene {
  constructor() { super('MainLobbyScene'); }
  create(): void {
    const profile = SaveSystem.loadProfile();
    DrawSystem.background(this, '꿈의 서고');
    panel(this, 195, 128, 346, 122, 28);
    this.add.text(42, 94, `Lv.${profile.level}`, goldText(20));
    this.add.text(42, 126, profile.nickname, bodyText(16));
    this.add.text(246, 94, `🪙 ${profile.coins}`, bodyText(16));
    this.add.text(246, 126, `💎 ${profile.gems}`, bodyText(16));

    panel(this, 195, 342, 346, 292, 34);
    this.add.text(195, 236, '카드마을', titleText(40)).setOrigin(0.5);
    this.add.text(195, 286, '책을 열고 카드를 모으는 수집형 퍼즐', applyWrap(bodyText(15), 304)).setOrigin(0.5);

    const play = new GameButton(this, 195, 376, '꿈의 서고 입장', 298, 66, 0xffd86f);
    play.on('pointerup', () => this.scene.start('ModeSelectScene'));
    const col = new GameButton(this, 195, 462, '카드 앨범', 298, 60, 0x8fd3ff);
    col.on('pointerup', () => this.scene.start('CollectionScene'));
    const reset = new GameButton(this, 195, 548, '로컬 데이터 초기화', 298, 54, 0xf0c7ff);
    reset.on('pointerup', () => { SaveSystem.clear(); this.scene.restart(); });

    this.add.text(195, 748, '로컬 게스트 우선 · 서버 대기 없음 · 안정 부팅 모드', applyWrap(mutedText(12), 336)).setOrigin(0.5);
    this.add.text(195, 790, '1.0.7', mutedText(12)).setOrigin(0.5);
  }
}
