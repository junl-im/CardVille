import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { VisualSystem } from '../systems/VisualSystem';

export class LoginScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;
  private emailPanel?: Phaser.GameObjects.DOMElement;
  private busy = false;

  constructor() {
    super('LoginScene');
  }

  async create(): Promise<void> {
    this.drawBackground();
    this.createBrandHero();
    this.createActionPanel();

    try {
      const user = await AuthSystem.restore();
      if (user) {
        this.setStatus(AuthSystem.isLocalGuest()
          ? '로컬 게스트 진행도를 확인했어요. 바로 입장합니다.'
          : '기존 로그인 확인 완료. 메인 로비로 이동합니다.');
        this.time.delayedCall(380, () => this.scene.start('MainLobbyScene'));
      } else {
        this.setStatus('게스트로 바로 시작할 수 있어요. Firebase가 막혀도 로컬 게스트로 입장합니다.');
      }
    } catch (error) {
      this.setStatus('로그인 상태 확인 중 문제가 있었지만, 게스트 시작은 계속 사용할 수 있어요.');
      console.warn(error);
    }
  }

  private createBrandHero(): void {
    new GlassPanel(this, 195, 184, 334, 236, 34, 0.13);

    const halo = this.add.graphics();
    halo.fillStyle(0x8fd3ff, 0.18);
    halo.fillCircle(195, 130, 82);
    halo.fillStyle(0xffd86f, 0.12);
    halo.fillCircle(195, 130, 52);
    this.tweens.add({ targets: halo, scale: 1.06, alpha: 0.86, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(195, 128, 'CardVille', {
      fontFamily: 'Georgia, serif',
      fontSize: '42px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 18, fill: true }
    }).setOrigin(0.5);

    this.add.text(195, 176, '카드마을 · 꿈의 서고', {
      fontSize: '22px',
      fontStyle: '900',
      color: '#ffe8a6'
    }).setOrigin(0.5);

    this.add.text(195, 222, '그림과 단서를 맞추고\n카드팩을 열어 앨범을 완성하세요.', {
      fontSize: '15px',
      color: '#d9e8ff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);
  }

  private createActionPanel(): void {
    new GlassPanel(this, 195, 518, 342, 504, 34, 0.15);

    const guest = new GameButton(this, 195, 330, '게스트로 바로 시작', 286, 60, 0xffd86f);
    guest.on('pointerup', () => this.signInGuest());

    const google = new GameButton(this, 195, 404, 'Google로 계속하기', 286, 56, 0x8fd3ff);
    google.on('pointerup', () => this.signInGoogle());

    this.add.text(195, 456, '게스트 저장은 기기 안에 보관되고, 나중에 계정 연결을 할 수 있어요.', {
      fontSize: '12px',
      color: '#b9ceef',
      align: 'center',
      wordWrap: { width: 286 }
    }).setOrigin(0.5);

    this.createEmailForm();

    this.statusText = this.add.text(195, 732, '로그인 상태 확인 중...', {
      fontSize: '13px',
      fontStyle: '800',
      color: '#d5e8ff',
      align: 'center',
      wordWrap: { width: 304 }
    }).setOrigin(0.5);

    this.add.text(195, 790, 'v0.9 · Firebase + Local Guest Safety', {
      fontSize: '11px',
      color: '#8da9d8'
    }).setOrigin(0.5);
  }

  private createEmailForm(): void {
    const html = `
      <div class="cardville-login-form compact">
        <div class="cv-form-title">이메일 계정 연결</div>
        <input name="email" type="email" placeholder="email@example.com" autocomplete="email" />
        <input name="password" type="password" placeholder="비밀번호 6자 이상" autocomplete="current-password" />
        <div class="cv-form-row">
          <button type="button" data-action="email-login">로그인</button>
          <button type="button" data-action="email-create">가입/연결</button>
        </div>
      </div>
    `;

    this.emailPanel = this.add.dom(195, 594).createFromHTML(html);
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
    this.setStatus('게스트 입장 준비 중...');
    try {
      await AuthSystem.signInGuest();
      this.setStatus(AuthSystem.isLocalGuest()
        ? 'Firebase 익명 로그인이 막혀 로컬 게스트로 입장합니다. 게임은 바로 플레이할 수 있어요.'
        : 'Firebase 게스트 로그인 완료. 꿈의 서고로 이동합니다.');
      this.time.delayedCall(360, () => this.scene.start('MainLobbyScene'));
    } catch (error) {
      this.setStatus('게스트 입장에 실패했어요. 새로고침 후 다시 시도해 주세요.');
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
    this.statusText?.setText(message);
  }

  private drawBackground(): void {
    VisualSystem.drawPremiumBackground(this, 'library');
    VisualSystem.spawnAmbientStars(this, 38);

    const floor = this.add.graphics();
    floor.fillStyle(0x000000, 0.14);
    floor.fillRoundedRect(18, 70, 354, 738, 36);
    floor.lineStyle(1, 0xffffff, 0.09);
    floor.strokeRoundedRect(18, 70, 354, 738, 36);
  }
}
