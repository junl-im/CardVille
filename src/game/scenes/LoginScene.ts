import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { addCoverImage, applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { DrawSystem } from '../systems/DrawSystem';
import { AuthSystem } from '../systems/AuthSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

const LOGIN_VERSION = '1.0.51';
const LOGIN_PANEL_Y = 546;
const LOGIN_PANEL_H = 254;
const LOGIN_TITLE_Y = LOGIN_PANEL_Y + 28;
const LOGIN_STATUS_Y = LOGIN_PANEL_Y + 58;
const LOGIN_ACTION_START_Y = LOGIN_PANEL_Y + 98;
const LOGIN_ACTION_GOOGLE_Y = LOGIN_ACTION_START_Y + 58;
const LOGIN_ACTION_SECONDARY_Y = LOGIN_ACTION_START_Y + 110;
const LOGIN_PANEL_COMPACT = true;
const LOGIN_CTA_BUTTON_STYLE = { skin: false, shine: false, debounceMs: 520 } as const;

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
    // Keep the key art full screen, but calm only the compact CTA area.
    shade.fillGradientStyle(0x020814, 0x020814, 0x020814, 0x020814, 0.02, 0.025, 0.13, 0.42);
    shade.fillRect(l.visibleX, l.visibleY, l.visibleWidth, l.visibleHeight);
    shade.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.08, 0.34);
    shade.fillRect(l.visibleX, 512, l.visibleWidth, 332 + l.extraY);

    // One compact plate behind all login controls. The previous thin highlight
    // strip could look like an unwanted line above each start/login button, so
    // 1.0.40 uses a soft matte plate and line-free CTA buttons instead.
    shade.fillStyle(0x07142c, 0.66);
    shade.fillRoundedRect(28, LOGIN_PANEL_Y, 334, LOGIN_PANEL_H, 32);
    shade.lineStyle(1, 0xffffff, 0.12);
    shade.strokeRoundedRect(28, LOGIN_PANEL_Y, 334, LOGIN_PANEL_H, 32);
    shade.fillStyle(0xffd86f, 0.09);
    shade.fillCircle(72, LOGIN_PANEL_Y + 36, 30);
    shade.fillStyle(0x8fd3ff, 0.08);
    shade.fillCircle(322, LOGIN_PANEL_Y + 58, 38);

    this.add.text(195, LOGIN_TITLE_Y, '카드를 모아 마을을 완성하세요!', titleText(17)).setOrigin(0.5);
  }

  private drawStartControls(): void {
    new GameButton(this, 195, LOGIN_ACTION_START_Y, '게임 시작', 316, 60, 0xffd86f, LOGIN_CTA_BUTTON_STYLE).onClick(() => this.guest());
    new GameButton(this, 195, LOGIN_ACTION_GOOGLE_Y, 'Google 로그인', 292, 44, 0x8fd3ff, LOGIN_CTA_BUTTON_STYLE).onClick(() => void this.google());
    new GameButton(this, 121, LOGIN_ACTION_SECONDARY_Y, '이메일', 138, 42, 0xc9f4ff, LOGIN_CTA_BUTTON_STYLE).onClick(() => void this.email(false));
    new GameButton(this, 269, LOGIN_ACTION_SECONDARY_Y, '가입', 138, 42, 0xf0c7ff, LOGIN_CTA_BUTTON_STYLE).onClick(() => void this.email(true));

    this.status = this.add.text(
      195,
      LOGIN_STATUS_Y,
      LOGIN_PANEL_COMPACT ? '시작 방식을 선택하세요.' : '원하는 방식으로 시작하세요.',
      { ...applyWrap(bodyText(13), 330), lineSpacing: 5 }
    ).setOrigin(0.5).setAlpha(0.96);
  }

  private guest(): void {
    if (this.busy) return;
    this.busy = true;
    AuthSystem.signInGuest();
    this.status.setText('오프닝 영상과 함께 게임을 준비합니다.');
    this.time.delayedCall(80, () => NavigationSystem.safeStart(this, 'IntroLoadingScene', { nextScene: 'MainLobbyScene' }));
  }

  private async google(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.status.setText('Google 로그인 연결 중...');
    try { await AuthSystem.signInGoogle(); NavigationSystem.safeStart(this, 'IntroLoadingScene', { nextScene: 'MainLobbyScene' }); }
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
    try { await AuthSystem.signInEmail(email, password, create); NavigationSystem.safeStart(this, 'IntroLoadingScene', { nextScene: 'MainLobbyScene' }); }
    catch (e) { console.warn(e); this.status.setText('이메일 처리 실패. 계정 정보를 확인해 주세요.'); this.busy = false; }
  }
}
