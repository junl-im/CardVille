import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { AuthSystem } from '../systems/AuthSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class LoginScene extends Phaser.Scene {
  private status!: Phaser.GameObjects.Text;
  private busy = false;
  constructor() { super('LoginScene'); }

  create(): void {
    DrawSystem.background(this);
    panel(this, 195, 188, 340, 260, 32);
    this.add.text(195, 112, 'CardVille', titleText(44)).setOrigin(0.5);
    this.add.text(195, 160, '카드마을 · 꿈의 서고', goldText(22)).setOrigin(0.5);
    this.add.text(
      195,
      220,
      '게스트는 서버 없이 바로 시작합니다.\nGoogle/이메일은 선택할 때만 연결합니다.',
      { ...applyWrap(bodyText(15), 302), lineSpacing: 7 }
    ).setOrigin(0.5);

    panel(this, 195, 530, 348, 470, 34);
    const guest = new GameButton(this, 195, 330, '게스트로 바로 시작', 312, 74, 0xffd86f);
    guest.on('pointerup', () => this.guest());
    const google = new GameButton(this, 195, 430, 'Google 로그인', 312, 60, 0x8fd3ff);
    google.on('pointerup', () => this.google());
    const emailLogin = new GameButton(this, 121, 506, '이메일 로그인', 142, 54, 0xc9f4ff);
    emailLogin.on('pointerup', () => this.email(false));
    const emailCreate = new GameButton(this, 269, 506, '가입', 142, 54, 0xf0c7ff);
    emailCreate.on('pointerup', () => this.email(true));

    this.status = this.add.text(
      195,
      624,
      '게스트 버튼을 누르면 바로 로비로 이동합니다.',
      { ...applyWrap(mutedText(14), 316), lineSpacing: 6 }
    ).setOrigin(0.5);
    this.add.text(195, 790, '1.0.7', mutedText(12)).setOrigin(0.5);
  }

  private guest(): void {
    if (this.busy) return;
    this.busy = true;
    AuthSystem.signInGuest();
    this.status.setText('게스트 입장 완료. 로비로 이동합니다.');
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
