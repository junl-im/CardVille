import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { DrawSystem } from '../systems/DrawSystem';
import { AuthSystem } from '../systems/AuthSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class LoginScene extends Phaser.Scene {
  private status!: Phaser.GameObjects.Text;
  private busy = false;
  constructor() { super('LoginScene'); }

  create(): void {
    this.drawHeroBackground();

    // Bottom safe login deck. The uploaded title art stays visible, buttons sit on a readable glass plate.
    const g = this.add.graphics();
    g.fillGradientStyle(0x020814, 0x020814, 0x020814, 0x020814, 0, 0, 0.88, 0.96);
    g.fillRect(0, 558, 390, 286);
    g.fillStyle(0x061127, 0.58);
    g.fillRoundedRect(18, 562, 354, 258, 32);
    g.lineStyle(2, 0xffffff, 0.28);
    g.strokeRoundedRect(18, 562, 354, 258, 32);
    g.fillStyle(0xffffff, 0.14);
    g.fillRoundedRect(42, 578, 306, 14, 8);

    this.add.text(195, 604, '카드마을에 오신 걸 환영해요', titleText(22)).setOrigin(0.5);
    this.add.text(195, 636, '말 카드를 모아 마을을 꾸미는 캐주얼 카드 퍼즐', goldText(14)).setOrigin(0.5);

    new GameButton(this, 195, 684, '게스트로 게임 시작', 316, 62, 0xffd86f).onClick(() => this.guest());
    new GameButton(this, 195, 752, 'Google 로그인', 316, 54, 0x8fd3ff).onClick(() => void this.google());
    new GameButton(this, 120, 808, '이메일', 142, 44, 0xc9f4ff).onClick(() => void this.email(false));
    new GameButton(this, 270, 808, '가입', 142, 44, 0xf0c7ff).onClick(() => void this.email(true));

    this.status = this.add.text(
      195,
      546,
      '처음 시작은 게스트로 바로 들어갈 수 있어요.',
      { ...applyWrap(bodyText(13), 330), lineSpacing: 5 }
    ).setOrigin(0.5);
    this.add.text(340, 32, '1.0.12', mutedText(12)).setOrigin(0.5);
  }

  private drawHeroBackground(): void {
    if (this.textures.exists('loginBg')) {
      this.add.image(195, 422, 'loginBg').setDisplaySize(390, 844);
      this.add.rectangle(195, 422, 390, 844, 0x000000, 0.08);
      this.add.rectangle(195, 54, 390, 108, 0x020814, 0.12);
      return;
    }
    DrawSystem.background(this, '카드마을');
  }

  private guest(): void {
    if (this.busy) return;
    this.busy = true;
    AuthSystem.signInGuest();
    this.status.setText('게스트 입장 완료. 카드마을 광장으로 이동합니다.');
    this.time.delayedCall(80, () => this.scene.start('MainLobbyScene'));
  }

  private async google(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.status.setText('Google 로그인 연결 중...');
    try { await AuthSystem.signInGoogle(); this.scene.start('MainLobbyScene'); }
    catch (e) { console.warn(e); this.status.setText('Google 로그인이 취소되었거나 실패했어요. 게스트 시작은 계속 가능합니다.'); this.busy = false; }
  }

  private async email(create: boolean): Promise<void> {
    if (this.busy) return;
    const email = window.prompt('이메일을 입력하세요')?.trim();
    if (!email) return;
    const password = window.prompt('비밀번호 6자 이상을 입력하세요') ?? '';
    if (password.length < 6) { this.status.setText('비밀번호는 6자 이상이어야 해요.'); return; }
    this.busy = true;
    this.status.setText(create ? '이메일 가입 중...' : '이메일 로그인 중...');
    try { await AuthSystem.signInEmail(email, password, create); this.scene.start('MainLobbyScene'); }
    catch (e) { console.warn(e); this.status.setText('이메일 처리 실패. 계정 정보를 확인해 주세요.'); this.busy = false; }
  }
}
