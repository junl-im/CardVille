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
    DrawSystem.background(this, '카드마을 광장');
    DrawSystem.topHud(this, profile.coins, profile.level);

    panel(this, 195, 184, 346, 144, 28);
    this.add.text(195, 140, 'CardVille', titleText(38)).setOrigin(0.5);
    this.add.text(195, 184, `${profile.nickname} 주민님`, goldText(21)).setOrigin(0.5);
    this.add.text(195, 220, '말 카드 스택을 정리하고 새 카드를 모아보세요.', applyWrap(bodyText(14), 304)).setOrigin(0.5);

    panel(this, 195, 452, 346, 330, 34);
    new GameButton(this, 195, 340, '말 카드 플레이', 298, 70, 0xffd86f).onClick(() => this.scene.start('ModeSelectScene'));
    new GameButton(this, 195, 430, '카드 앨범', 298, 62, 0x8fd3ff).onClick(() => this.scene.start('CollectionScene'));
    new GameButton(this, 195, 512, '오늘의 보상 준비중', 298, 56, 0xc9f4ff).setDisabled(true);
    new GameButton(this, 195, 588, '로컬 데이터 초기화', 298, 54, 0xf0c7ff).onClick(() => { SaveSystem.clear(); this.scene.restart(); });

    this.add.text(195, 748, '카드마을 핵심 루프: 말 카드 플레이 → 보상 → 앨범 수집', applyWrap(mutedText(12), 336)).setOrigin(0.5);
    this.add.text(195, 790, '1.0.9', mutedText(12)).setOrigin(0.5);
  }
}
