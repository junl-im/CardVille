import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';

export class LoginScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('LoginScene');
  }

  async create(): Promise<void> {
    this.drawBackground();
    new GlassPanel(this, 195, 426, 326, 430, 30, 0.15);

    this.add.text(195, 238, '카드마을 입장', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '36px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(195, 286, '첫 접속 때만 로그인하면\n다음부터는 자동으로 이어서 플레이해요.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#d9e8ff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    this.statusText = this.add.text(195, 628, '로그인 상태 확인 중...', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#bdd6ff',
      align: 'center'
    }).setOrigin(0.5);

    const guest = new GameButton(this, 195, 382, '게스트로 시작', 250, 58, 0xffd86f);
    guest.on('pointerup', () => this.signInGuest());

    const google = new GameButton(this, 195, 462, 'Google 로그인', 250, 58, 0x8fd3ff);
    google.on('pointerup', () => this.signInGoogle());

    const email = new GameButton(this, 195, 542, '이메일 로그인 준비 중', 250, 58, 0xc59bff);
    email.on('pointerup', () => this.setStatus('이메일 로그인 UI는 v0.3에서 입력창과 함께 연결합니다.'));

    try {
      const user = await AuthSystem.restore();
      if (user) {
        this.setStatus('기존 로그인 확인 완료. 메인 로비로 이동합니다.');
        this.time.delayedCall(300, () => this.scene.start('MainLobbyScene'));
      } else {
        this.setStatus('로그인 방법을 선택하세요.');
      }
    } catch (error) {
      this.setStatus('오프라인 상태일 수 있어요. 게스트 로그인을 다시 시도해 주세요.');
      console.warn(error);
    }
  }

  private async signInGuest(): Promise<void> {
    this.setStatus('게스트 로그인 중...');
    try {
      await AuthSystem.signInGuest();
      this.scene.start('MainLobbyScene');
    } catch (error) {
      this.setStatus('게스트 로그인 실패. Firebase Auth 설정을 확인하세요.');
      console.warn(error);
    }
  }

  private async signInGoogle(): Promise<void> {
    this.setStatus('Google 로그인 창을 여는 중...');
    try {
      await AuthSystem.signInGoogle();
      this.scene.start('MainLobbyScene');
    } catch (error) {
      this.setStatus('Google 로그인 실패 또는 취소됨. 도메인 승인 설정을 확인하세요.');
      console.warn(error);
    }
  }

  private setStatus(message: string): void {
    this.statusText.setText(message);
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x173b70, 0x173b70, 0x0b1534, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x8fd3ff, 0.08);
    g.fillCircle(315, 172, 130);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(62, 724, 170);
  }
}
