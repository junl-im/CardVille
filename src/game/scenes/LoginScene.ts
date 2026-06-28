import Phaser from 'phaser';
import { addCoverImage, applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { DrawSystem } from '../systems/DrawSystem';
import { AuthSystem } from '../systems/AuthSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

const LOGIN_VERSION = '1.0.19';
const LOGIN_INFO_CARD_Y = 502;
const LOGIN_ACTION_START_Y = 634;
const LOGIN_ACTION_GOOGLE_Y = LOGIN_ACTION_START_Y + 66;
const LOGIN_ACTION_SECONDARY_Y = LOGIN_ACTION_START_Y + 120;
const LOGIN_STATUS_Y = LOGIN_ACTION_START_Y - 50;

export class LoginScene extends Phaser.Scene {
  private status!: Phaser.GameObjects.Text;
  private busy = false;
  constructor() { super('LoginScene'); }

  create(): void {
    applyResponsiveCamera(this);
    this.drawFullscreenHero();
    this.drawStartControls();
    this.add.text(342, 28, LOGIN_VERSION, mutedText(11)).setOrigin(0.5).setAlpha(0.86);
    window.__CARDVILLE_BOOT_OK__?.();
  }

  private drawFullscreenHero(): void {
    if (this.textures.exists('loginBg')) {
      addCoverImage(this, 'loginBg', 1, 390, 844);
    } else {
      DrawSystem.background(this, '카드마을');
    }

    const shade = this.add.graphics();
    const l = layout(this);
    // Keep the key art full screen, but gently calm the lower gameplay CTA area.
    shade.fillGradientStyle(0x020814, 0x020814, 0x020814, 0x020814, 0.03, 0.035, 0.18, 0.60);
    shade.fillRect(l.visibleX, l.visibleY, l.visibleWidth, l.visibleHeight);
    shade.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.12, 0.50);
    shade.fillRect(l.visibleX, 474, l.visibleWidth, 370 + l.extraY);

    shade.fillStyle(0xffffff, 0.12);
    shade.fillRoundedRect(26, LOGIN_INFO_CARD_Y, 338, 86, 28);
    shade.lineStyle(1, 0xffffff, 0.24);
    shade.strokeRoundedRect(26, LOGIN_INFO_CARD_Y, 338, 86, 28);
    shade.fillStyle(0x081329, 0.48);
    shade.fillRoundedRect(36, LOGIN_INFO_CARD_Y + 9, 318, 66, 22);

    this.add.text(195, LOGIN_INFO_CARD_Y + 24, '카드를 모아 마을을 완성하세요!', titleText(20)).setOrigin(0.5);
    this.add.text(195, LOGIN_INFO_CARD_Y + 56, '말 카드 스택 퍼즐 · 바로 시작 가능', goldText(13)).setOrigin(0.5);
  }

  private drawStartControls(): void {
    new GameButton(this, 195, LOGIN_ACTION_START_Y, '게임 시작', 322, 70, 0xffd86f).onClick(() => this.guest());
    new GameButton(this, 195, LOGIN_ACTION_GOOGLE_Y, 'Google 로그인', 298, 50, 0x8fd3ff).onClick(() => void this.google());
    new GameButton(this, 118, LOGIN_ACTION_SECONDARY_Y, '이메일', 134, 40, 0xc9f4ff).onClick(() => void this.email(false));
    new GameButton(this, 272, LOGIN_ACTION_SECONDARY_Y, '가입', 134, 40, 0xf0c7ff).onClick(() => void this.email(true));

    this.status = this.add.text(
      195,
      LOGIN_STATUS_Y,
      '게임 시작을 누르면 오프닝과 함께 입장해요.',
      { ...applyWrap(bodyText(13), 330), lineSpacing: 5 }
    ).setOrigin(0.5).setAlpha(0.96);
  }

  private guest(): void {
    if (this.busy) return;
    this.busy = true;
    AuthSystem.signInGuest();
    this.status.setText('오프닝 영상과 함께 게임을 준비합니다.');
    this.time.delayedCall(80, () => this.scene.start('IntroLoadingScene', { nextScene: 'MainLobbyScene' }));
  }

  private async google(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.status.setText('Google 로그인 연결 중...');
    try { await AuthSystem.signInGoogle(); this.scene.start('IntroLoadingScene', { nextScene: 'MainLobbyScene' }); }
    catch (e) { console.warn(e); this.status.setText('Google 로그인이 취소되었거나 실패했어요. 게임 시작은 계속 가능합니다.'); this.busy = false; }
  }

  private async email(create: boolean): Promise<void> {
    if (this.busy) return;
    const email = window.prompt('이메일을 입력하세요')?.trim();
    if (!email) return;
    const password = window.prompt('비밀번호 6자 이상을 입력하세요') ?? '';
    if (password.length < 6) { this.status.setText('비밀번호는 6자 이상이어야 해요.'); return; }
    this.busy = true;
    this.status.setText(create ? '이메일 가입 중...' : '이메일 로그인 중...');
    try { await AuthSystem.signInEmail(email, password, create); this.scene.start('IntroLoadingScene', { nextScene: 'MainLobbyScene' }); }
    catch (e) { console.warn(e); this.status.setText('이메일 처리 실패. 계정 정보를 확인해 주세요.'); this.busy = false; }
  }
}
