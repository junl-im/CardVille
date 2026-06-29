import Phaser from 'phaser';
import { addFullBleedShade, applyResponsiveCamera } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

const GAME_SCENES = [
  'IntroLoadingScene',
  'LoginScene',
  'MainLobbyScene',
  'ModeSelectScene',
  'StageSelectScene',
  'PlayScene',
  'MathLabScene',
  'MemoryForestScene',
  'ResultScene',
  'RewardScene',
  'CollectionScene',
  'ShopScene'
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
      '휴대폰 뒤로가기를 한 번 더 누르면 나가기를 시도합니다. 진행 중인 게스트 데이터는 기기에 저장돼요.',
      { ...applyWrap(bodyText(14), 286), lineSpacing: 6 }
    ).setOrigin(0.5);

    new GameButton(this, 195, 438, '첫 화면가기', 282, 60, 0xffd86f).onClick(() => this.goFirstScreen());
    new GameButton(this, 195, 510, '나가기', 282, 58, 0xff9ab1).onClick(() => this.requestExit());
    new GameButton(this, 195, 580, '계속하기', 282, 52, 0x9fe7ff).onClick(() => this.closePopup());

    this.add.text(195, 642, '브라우저 정책상 창 닫기가 막히면 이전 페이지로 이동합니다.', mutedText(12)).setOrigin(0.5);
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
    this.add.text(195, 686, '나가는 중...', mutedText(13)).setOrigin(0.5);
    try { window.close(); } catch (error) { console.warn('[CardVille] window.close failed', error); }
    this.time.delayedCall(180, () => {
      if (window.closed) return;
      try {
        if (window.history.length > 1) window.history.back();
        else window.location.href = 'about:blank';
      } catch (error) {
        console.warn('[CardVille] fallback exit failed', error);
        window.location.href = 'about:blank';
      }
    });
  }
}
