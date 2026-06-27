import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';

export class LoginScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;
  private emailPanel?: Phaser.GameObjects.DOMElement;
  private busy = false;

  constructor() {
    super('LoginScene');
  }

  async create(): Promise<void> {
    this.drawBackground();
    new GlassPanel(this, 195, 426, 342, 558, 30, 0.15);

    this.add.text(195, 176, '카드마을 입장', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '34px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(195, 222, '꿈의 서고에 오신 것을 환영해요.\n게스트로 바로 시작하거나 계정을 연결하세요.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      color: '#d9e8ff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    const guest = new GameButton(this, 195, 296, '게스트로 바로 시작', 270, 54, 0xffd86f);
    guest.on('pointerup', () => this.signInGuest());

    const google = new GameButton(this, 195, 366, 'Google로 계속하기', 270, 54, 0x8fd3ff);
    google.on('pointerup', () => this.signInGoogle());

    this.createEmailForm();

    this.statusText = this.add.text(195, 706, '로그인 상태 확인 중...', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#bdd6ff',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);

    this.add.text(195, 760, '게스트 진행도는 나중에 이메일/Google 계정으로 연결할 수 있어요.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      color: '#8fb1df',
      align: 'center',
      wordWrap: { width: 310 }
    }).setOrigin(0.5);

    try {
      const user = await AuthSystem.restore();
      if (user) {
        this.setStatus('기존 로그인 확인 완료. 메인 로비로 이동합니다.');
        this.time.delayedCall(300, () => this.scene.start('MainLobbyScene'));
      } else {
        this.setStatus('로그인 방법을 선택하세요.');
      }
    } catch (error) {
      this.setStatus('로그인 상태 확인 실패. Firebase 설정과 네트워크를 확인해 주세요.');
      console.warn(error);
    }
  }

  private createEmailForm(): void {
    const html = `
      <div class="cardville-login-form">
        <div class="cv-form-title">이메일 계정</div>
        <input name="email" type="email" placeholder="email@example.com" autocomplete="email" />
        <input name="password" type="password" placeholder="비밀번호 6자 이상" autocomplete="current-password" />
        <div class="cv-form-row">
          <button type="button" data-action="email-login">로그인</button>
          <button type="button" data-action="email-create">가입/연결</button>
        </div>
      </div>
    `;

    this.emailPanel = this.add.dom(195, 530).createFromHTML(html);
    const root = this.emailPanel.node as HTMLElement;
    root.querySelector<HTMLButtonElement>('[data-action="email-login"]')?.addEventListener('click', () => this.signInEmail());
    root.querySelector<HTMLButtonElement>('[data-action="email-create"]')?.addEventListener('click', () => this.createEmailAccount());
  }

  private readEmailForm(): { email: string; password: string } | null {
    const root = this.emailPanel?.node as HTMLElement | undefined;
    const email = root?.querySelector<HTMLInputElement>('input[name="email"]')?.value.trim() ?? '';
    const password = root?.querySelector<HTMLInputElement>('input[name="password"]')?.value ?? '';

    if (!email.includes('@') || !email.includes('.')) {
      this.setStatus('이메일 주소를 정확히 입력해 주세요.');
      return null;
    }

    if (password.length < 6) {
      this.setStatus('비밀번호는 6자 이상이어야 해요.');
      return null;
    }

    return { email, password };
  }

  private async signInGuest(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.setStatus('게스트 로그인 중...');
    try {
      await AuthSystem.signInGuest();
      this.scene.start('MainLobbyScene');
    } catch (error) {
      this.setStatus('게스트 로그인 실패. Firebase Auth의 익명 로그인을 확인하세요.');
      console.warn(error);
    } finally {
      this.busy = false;
    }
  }

  private async signInGoogle(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.setStatus('Google 로그인 창을 여는 중...');
    try {
      await AuthSystem.signInGoogle();
      this.scene.start('MainLobbyScene');
    } catch (error) {
      this.setStatus('Google 로그인 실패 또는 취소됨. Firebase 승인 도메인에 junl-im.github.io를 추가했는지 확인하세요.');
      console.warn(error);
    } finally {
      this.busy = false;
    }
  }

  private async signInEmail(): Promise<void> {
    if (this.busy) return;
    const credentials = this.readEmailForm();
    if (!credentials) return;

    this.busy = true;
    this.setStatus('이메일 로그인 중...');
    try {
      await AuthSystem.signInEmail(credentials.email, credentials.password);
      this.scene.start('MainLobbyScene');
    } catch (error) {
      this.setStatus('이메일 로그인 실패. 계정이 없다면 가입/연결을 눌러 주세요.');
      console.warn(error);
    } finally {
      this.busy = false;
    }
  }

  private async createEmailAccount(): Promise<void> {
    if (this.busy) return;
    const credentials = this.readEmailForm();
    if (!credentials) return;

    this.busy = true;
    this.setStatus('이메일 계정 생성 또는 게스트 계정 연결 중...');
    try {
      await AuthSystem.createEmailAccount(credentials.email, credentials.password);
      this.scene.start('MainLobbyScene');
    } catch (error) {
      this.setStatus('가입/연결 실패. 이미 가입된 이메일이면 로그인 버튼을 사용하세요.');
      console.warn(error);
    } finally {
      this.busy = false;
    }
  }

  private setStatus(message: string): void {
    this.statusText.setText(message);
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x173b70, 0x173b70, 0x0b1534, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);

    for (let i = 0; i < 54; i += 1) {
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.05, 0.16));
      g.fillCircle(Phaser.Math.Between(0, 390), Phaser.Math.Between(0, 844), Phaser.Math.FloatBetween(1, 2.3));
    }

    g.fillStyle(0x8fd3ff, 0.08);
    g.fillCircle(315, 172, 130);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(62, 724, 170);
  }
}
