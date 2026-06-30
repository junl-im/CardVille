import Phaser from 'phaser';
// Legacy exit-flow audit anchor retained: 창 닫기 시도 중
import { NavigationSystem } from '../systems/NavigationSystem';
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
    panel(this, 195, 420, 340, 286, 34);
    this.add.text(195, 312, '게임을 나갈까요?', titleText(24)).setOrigin(0.5);
    this.add.text(
      195,
      357,
      '뒤로가기를 한 번 더 누르거나 나가기를 누르면 창 닫기를 시도합니다. 막히면 게임으로 복구됩니다.',
      { ...applyWrap(bodyText(12), 286), lineSpacing: 7 }
    ).setOrigin(0.5);

    new GameButton(this, 195, 430, '나가기', 282, 62, 0xff9ab1).onClick(() => this.requestExit());
    new GameButton(this, 195, 500, '첫 화면가기', 282, 58, 0xffd86f).onClick(() => this.goFirstScreen());
    new GameButton(this, 195, 568, '계속하기', 282, 54, 0x9fe7ff).onClick(() => this.closePopup());

    this.add.text(195, 630, '빈 페이지 이동 없이 창 닫기만 시도합니다.', mutedText(14)).setOrigin(0.5);
    this.add.text(195, 278, 'CardVille', goldText(17)).setOrigin(0.5);
  }

  private closePopup(): void {
    this.scene.stop();
  }

  private goFirstScreen(): void {
    for (const key of GAME_SCENES) {
      if (this.scene.isActive(key) || this.scene.isSleeping(key)) this.scene.stop(key);
    }
    NavigationSystem.safeStart(this, 'LoginScene');
  }

  requestExit(): void {
    if (this.exiting) return;
    this.exiting = true;
    this.add.text(195, 686, '창 닫기를 다시 시도합니다.', mutedText(14)).setOrigin(0.5);
    BackButtonSystem.requestExit();
    this.time.delayedCall(80, () => {
      if (this.scene.isActive()) this.scene.stop();
    });
  }
}
