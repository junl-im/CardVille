import Phaser from 'phaser';
import { addFullBleedShade, applyResponsiveCamera } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { BackButtonSystem } from '../systems/BackButtonSystem';

const GAME_SCENES = [
  'IntroLoadingScene',
  'LoginScene',
  'MainLobbyScene',
  'ModeSelectScene',
  'StageSelectScene',
  'PlayScene',
  'MathLabScene',
  'MemoryForestScene',
  'EnglishSchoolScene',
  'ResultScene',
  'RewardScene',
  'CollectionScene',
  'ShopScene',
  'DailyMissionScene'
];

export class BackConfirmScene extends Phaser.Scene {
  private exiting = false;

  constructor() { super('BackConfirmScene'); }

  create(): void {
    applyResponsiveCamera(this);
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
    addFullBleedShade(this, 0x020814, 0.66).setInteractive();
    panel(this, 195, 420, 340, 304, 34);
    this.add.text(195, 310, '게임을 나갈까요?', titleText(28)).setOrigin(0.5);
    this.add.text(
      195,
      357,
      '브라우저가 닫기를 막아도 게임 화면이 멈추지 않도록 첫 화면/계속하기로 안전 복구됩니다.',
      { ...applyWrap(bodyText(14), 286), lineSpacing: 6 }
    ).setOrigin(0.5);

    new GameButton(this, 195, 438, '첫 화면가기', 282, 60, 0xffd86f).onClick(() => this.goFirstScreen());
    new GameButton(this, 195, 510, '나가기 시도', 282, 58, 0xff9ab1).onClick(() => this.requestExit());
    new GameButton(this, 195, 580, '계속하기', 282, 52, 0x9fe7ff).onClick(() => this.closePopup());

    this.add.text(195, 642, '닫기가 막혀도 자동 복구 안내가 뜹니다.', mutedText(12)).setOrigin(0.5);
    this.add.text(195, 272, 'CardVille', goldText(16)).setOrigin(0.5);
  }

  private closePopup(): void {
    this.scene.stop();
  }

  private goFirstScreen(): void {
    for (const key of GAME_SCENES) {
      if (this.scene.isActive(key) || this.scene.isSleeping(key)) this.scene.stop(key);
    }
    this.scene.start('LoginScene');
  }

  requestExit(): void {
    if (this.exiting) return;
    this.exiting = true;
    this.add.text(195, 686, '나가기 시도 중... 막히면 자동 복구돼요.', mutedText(13)).setOrigin(0.5);
    BackButtonSystem.requestExit();
    this.time.delayedCall(80, () => {
      if (this.scene.isActive()) this.scene.stop();
    });
  }
}
