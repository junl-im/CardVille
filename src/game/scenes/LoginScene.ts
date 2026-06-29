import Phaser from 'phaser';
import { addCoverImage, applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { DrawSystem } from '../systems/DrawSystem';
import { AuthSystem } from '../systems/AuthSystem';
import { applyWrap, bodyText, mutedText, titleText } from '../ui/TextStyles';
import { LOGIN_CONTROL_RECTS, LOGIN_LAYOUT_GUARDS, LOGIN_LAYOUT_PLAN_VERSION, LOGIN_PANEL } from '../data/loginLayoutPlan';

const LOGIN_VERSION = '1.0.32';
const LOGIN_ACTION_START_Y = LOGIN_CONTROL_RECTS.find((rect) => rect.id === 'guest')?.y ?? 640;
const LOGIN_ACTION_GOOGLE_Y = LOGIN_CONTROL_RECTS.find((rect) => rect.id === 'google')?.y ?? 708;
const LOGIN_ACTION_SECONDARY_Y = LOGIN_CONTROL_RECTS.find((rect) => rect.id === 'email')?.y ?? 766;
const LOGIN_STATUS_Y = LOGIN_CONTROL_RECTS.find((rect) => rect.id === 'status')?.y ?? 590;
const LOGIN_PANEL_COMPACT = true;

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

    // One compact plate behind all login controls. No fake pre-start button and no
    // separated gap line between buttons.
    shade.fillStyle(0x07142c, 0.64);
    shade.fillRoundedRect(LOGIN_PANEL.x - LOGIN_PANEL.width / 2, LOGIN_PANEL.top, LOGIN_PANEL.width, LOGIN_PANEL.height, 34);
    shade.lineStyle(1, 0xffffff, 0.16);
    shade.strokeRoundedRect(LOGIN_PANEL.x - LOGIN_PANEL.width / 2, LOGIN_PANEL.top, LOGIN_PANEL.width, LOGIN_PANEL.height, 34);
    shade.fillStyle(0xffffff, 0.06);
    shade.fillRoundedRect(46, 536, 298, 22, 11);
    shade.fillStyle(0xffd86f, 0.055);
    shade.fillRoundedRect(43, 606, 304, 188, 26);

    this.add.text(195, 546, '카드를 모아 마을을 완성하세요!', titleText(17)).setOrigin(0.5);
    this.add.text(195, 568, `시작 UI 안전 배치 · ${LOGIN_LAYOUT_PLAN_VERSION}`, mutedText(10)).setOrigin(0.5).setAlpha(0.88);
  }

  private drawStartControls(): void {
    new GameButton(this, 195, LOGIN_ACTION_START_Y, '게임 시작', 316, 58, 0xffd86f).onClick(() => this.guest());
    new GameButton(this, 195, LOGIN_ACTION_GOOGLE_Y, 'Google 로그인', 300, 50, 0x8fd3ff).onClick(() => void this.google());
    new GameButton(this, 118, LOGIN_ACTION_SECONDARY_Y, '이메일', 144, 46, 0xc9f4ff).onClick(() => void this.email(false));
    new GameButton(this, 272, LOGIN_ACTION_SECONDARY_Y, '가입', 144, 46, 0xf0c7ff).onClick(() => void this.email(true));

    this.status = this.add.text(
      195,
      LOGIN_STATUS_Y,
      LOGIN_PANEL_COMPACT ? '겹침 없이 시작 방식을 선택하세요.' : '원하는 방식으로 시작하세요.',
      { ...applyWrap(bodyText(12), 316), lineSpacing: 4 }
    ).setOrigin(0.5).setAlpha(0.96);

    this.add.text(195, 812, LOGIN_LAYOUT_GUARDS.slice(0, 2).join(' · '), applyWrap(mutedText(9), 322)).setOrigin(0.5).setAlpha(0.70);
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
