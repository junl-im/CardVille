import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { UserDataSystem } from '../systems/UserDataSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { UserProfileDoc } from '../../firebase/firestore';
import { VisualSystem } from '../systems/VisualSystem';

export class MainLobbyScene extends Phaser.Scene {
  constructor() {
    super('MainLobbyScene');
  }

  create(): void {
    this.renderLoadingLobby();
    this.loadAndRenderLobby();

    SceneBackSystem.bind(this, () => {
      const confirmExit = window.confirm('카드마을을 종료할까요?');
      if (confirmExit) window.close();
    });
  }

  private async loadAndRenderLobby(): Promise<void> {
    try {
      const profile = await UserDataSystem.loadCurrentProfile();
      if (!profile) {
        this.scene.start('LoginScene');
        return;
      }

      this.children.removeAll();
      this.drawBackground();
      this.createTopBar(profile);
      this.createHeroPanel(profile);
      this.createMenu();
    } catch (error) {
      console.warn('[CardVille] Lobby profile load failed.', error);
      this.children.removeAll();
      this.drawBackground();
      new GlassPanel(this, 195, 380, 326, 300, 30, 0.15);
      this.add.text(195, 314, '유저 데이터를 불러오지 못했어요.', {
        fontSize: '22px',
        fontStyle: '900',
        color: '#ffffff'
      }).setOrigin(0.5);
      this.add.text(195, 360, '네트워크 또는 Firestore Rules를 확인해 주세요.', {
        fontSize: '15px',
        color: '#d9e8ff',
        align: 'center',
        wordWrap: { width: 280 }
      }).setOrigin(0.5);
      const retry = new GameButton(this, 195, 444, '다시 불러오기', 250, 58, 0xffd86f);
      retry.on('pointerup', () => this.scene.restart());
    }
  }

  private renderLoadingLobby(): void {
    this.children.removeAll();
    this.drawBackground();
    new GlassPanel(this, 195, 386, 320, 270, 30, 0.14);
    this.add.text(195, 320, '꿈의 서고 입장 준비 중', {
      fontSize: '25px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(195, 372, '레벨 · 코인 · 보석 정보를 불러오고 있어요.', {
      fontSize: '15px',
      color: '#d9e8ff',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);

    const glow = this.add.graphics();
    glow.fillStyle(0x8fd3ff, 0.18);
    glow.fillCircle(195, 454, 22);
    this.tweens.add({ targets: glow, alpha: 0.35, scale: 1.35, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private createTopBar(profile: UserProfileDoc): void {
    new GlassPanel(this, 195, 54, 350, 72, 22, 0.12);
    this.add.text(42, 54, `🪙 ${profile.coins.toLocaleString('ko-KR')}`, {
      fontSize: '20px',
      fontStyle: '900',
      color: '#fff7ce'
    }).setOrigin(0, 0.5);
    this.add.text(164, 54, `💎 ${profile.gems.toLocaleString('ko-KR')}`, {
      fontSize: '20px',
      fontStyle: '900',
      color: '#d5fbff'
    }).setOrigin(0, 0.5);
    this.add.text(292, 54, `Lv.${profile.level}`, {
      fontSize: '18px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(338, 54, '⚙️', { fontSize: '24px' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerup', () => this.scene.start('SettingsScene'));
  }

  private createHeroPanel(profile: UserProfileDoc): void {
    new GlassPanel(this, 195, 236, 334, 260, 30, 0.14);
    const loginLabel = UserDataSystem.getLoginStateLabel(profile);
    const progress = UserDataSystem.getLevelProgress(profile);

    this.add.text(48, 126, `환영해요, ${profile.nickname}!`, {
      fontSize: '22px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    this.add.text(48, 162, `${loginLabel} · 꿈의 서고 주민`, {
      fontSize: '14px',
      color: '#ffe4a3'
    }).setOrigin(0, 0.5);

    this.add.text(48, 202, `레벨 ${profile.level}`, {
      fontSize: '19px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    this.createXpBar(48, 226, 220, 18, progress.ratio);
    this.add.text(48, 258, `XP ${progress.currentLevelXp}/${progress.requiredXp} · 다음 레벨 ${progress.nextLevel}`, {
      fontSize: '13px',
      color: '#cfe8ff'
    }).setOrigin(0, 0.5);

    this.add.text(48, 306, '오늘은 꿈의 서고에서\n새로운 마법서를 펼쳐볼까요?', {
      fontSize: '17px',
      color: '#d9e8ff',
      lineSpacing: 5
    }).setOrigin(0, 0.5);
    this.add.text(300, 250, '📚', { fontSize: '74px' }).setOrigin(0.5);
  }

  private createXpBar(x: number, y: number, width: number, height: number, ratio: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.22);
    g.fillRoundedRect(x, y, width, height, height / 2);
    g.fillGradientStyle(0x8fd3ff, 0xdff7ff, 0xffd86f, 0xfff2b8, 1);
    g.fillRoundedRect(x + 2, y + 2, Math.max(8, (width - 4) * ratio), height - 4, (height - 4) / 2);
    g.lineStyle(1, 0xffffff, 0.35);
    g.strokeRoundedRect(x, y, width, height, height / 2);
  }

  private createMenu(): void {
    const play = new GameButton(this, 195, 430, '꿈의 서고 입장', 300, 64, 0xffd86f);
    play.on('pointerup', () => this.scene.start('ModeSelectScene'));

    const collection = new GameButton(this, 195, 512, '카드 컬렉션', 300, 64, 0x8fd3ff);
    collection.on('pointerup', () => this.scene.start('CollectionScene'));

    const mission = new GameButton(this, 195, 594, '오늘의 미션', 300, 64, 0xc59bff);
    mission.on('pointerup', () => this.scene.start('MissionScene'));

    const settings = new GameButton(this, 195, 676, '설정', 300, 54, 0xb7ffd8);
    settings.on('pointerup', () => this.scene.start('SettingsScene'));

    const logout = new GameButton(this, 195, 742, '로그아웃 / 계정 변경', 300, 48, 0xf5aacb);
    logout.on('pointerup', () => this.signOut());

    this.add.text(195, 806, 'Aqua Glass + Cute Premium + 2.5D · v0.8', {
      fontSize: '13px',
      color: '#9fb8e9'
    }).setOrigin(0.5);
  }

  private async signOut(): Promise<void> {
    const ok = window.confirm('로그아웃하고 로그인 화면으로 이동할까요?');
    if (!ok) return;

    try {
      await AuthSystem.signOut();
      this.scene.start('LoginScene');
    } catch (error) {
      console.warn(error);
    }
  }

  private drawBackground(): void {
    VisualSystem.drawPremiumBackground(this, 'library');
    VisualSystem.spawnAmbientStars(this, 34);
  }
}
