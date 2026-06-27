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
      this.add.text(195, 314, '유저 데이터를 불러오지 못했어요.', { fontSize: '22px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(195, 360, '게스트 모드로도 플레이할 수 있어요.\n네트워크가 불안정하면 다시 시도하세요.', { fontSize: '15px', color: '#d9e8ff', align: 'center', wordWrap: { width: 280 } }).setOrigin(0.5);
      const retry = new GameButton(this, 195, 444, '다시 불러오기', 250, 58, 0xffd86f);
      retry.on('pointerup', () => this.scene.restart());
    }
  }

  private renderLoadingLobby(): void {
    this.children.removeAll();
    this.drawBackground();
    new GlassPanel(this, 195, 386, 320, 270, 30, 0.14);
    this.add.text(195, 320, '꿈의 서고 입장 준비 중', { fontSize: '25px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 372, '레벨 · 코인 · 보석 정보를 불러오고 있어요.', { fontSize: '15px', color: '#d9e8ff', align: 'center', wordWrap: { width: 280 } }).setOrigin(0.5);
    const glow = this.add.graphics();
    glow.fillStyle(0x8fd3ff, 0.18);
    glow.fillCircle(195, 454, 22);
    this.tweens.add({ targets: glow, alpha: 0.35, scale: 1.35, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private createTopBar(profile: UserProfileDoc): void {
    new GlassPanel(this, 195, 54, 350, 72, 22, 0.12);
    this.add.text(42, 54, `COIN ${profile.coins.toLocaleString('ko-KR')}`, { fontSize: '15px', fontStyle: '900', color: '#fff7ce' }).setOrigin(0, 0.5);
    this.add.text(164, 54, `GEM ${profile.gems.toLocaleString('ko-KR')}`, { fontSize: '15px', fontStyle: '900', color: '#d5fbff' }).setOrigin(0, 0.5);
    this.add.text(292, 54, `Lv.${profile.level}`, { fontSize: '18px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(340, 54, '⚙', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerup', () => this.scene.start('SettingsScene'));
  }

  private createHeroPanel(profile: UserProfileDoc): void {
    new GlassPanel(this, 195, 236, 334, 268, 34, 0.14);
    const loginLabel = UserDataSystem.getLoginStateLabel(profile);
    const progress = UserDataSystem.getLevelProgress(profile);

    this.add.text(48, 120, 'Dream Library', { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffe4a3' }).setOrigin(0, 0.5);
    this.add.text(48, 154, `환영해요, ${profile.nickname}`, { fontSize: '23px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(48, 184, `${loginLabel} · 꿈의 서고 주민`, { fontSize: '13px', color: AuthSystem.isLocalGuest() ? '#ffc9d6' : '#cfe8ff' }).setOrigin(0, 0.5);

    this.add.text(48, 226, `레벨 ${profile.level}`, { fontSize: '18px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.createXpBar(48, 250, 220, 18, progress.ratio);
    this.add.text(48, 282, `XP ${progress.currentLevelXp}/${progress.requiredXp} · 다음 레벨 ${progress.nextLevel}`, { fontSize: '12px', color: '#cfe8ff' }).setOrigin(0, 0.5);

    this.add.text(48, 326, '마법서를 펼치고 별을 모아\n카드 앨범을 완성하세요.', { fontSize: '16px', color: '#d9e8ff', lineSpacing: 5 }).setOrigin(0, 0.5);

    this.drawBookTotem(304, 245);
  }

  private drawBookTotem(x: number, y: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(x, y + 70, 104, 24);
    const colors = [0xffd86f, 0x8fd3ff, 0xc59bff];
    colors.forEach((color, i) => {
      g.fillStyle(color, 0.88);
      g.fillRoundedRect(x - 42 + i * 7, y - 56 + i * 38, 84, 32, 10);
      g.lineStyle(1, 0xffffff, 0.55);
      g.strokeRoundedRect(x - 42 + i * 7, y - 56 + i * 38, 84, 32, 10);
      g.fillStyle(0xffffff, 0.18);
      g.fillRoundedRect(x - 30 + i * 7, y - 50 + i * 38, 60, 8, 5);
    });
    this.add.text(x, y + 16, '✦', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
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
    const play = new GameButton(this, 195, 430, '꿈의 서고 입장', 306, 64, 0xffd86f);
    play.on('pointerup', () => this.scene.start('ModeSelectScene'));

    const collection = new GameButton(this, 195, 510, '카드 컬렉션', 306, 58, 0x8fd3ff);
    collection.on('pointerup', () => this.scene.start('CollectionScene'));

    const mission = new GameButton(this, 195, 582, '오늘의 미션', 306, 58, 0xc59bff);
    mission.on('pointerup', () => this.scene.start('MissionScene'));

    const settings = new GameButton(this, 112, 660, '설정', 144, 50, 0xb7ffd8);
    settings.on('pointerup', () => this.scene.start('SettingsScene'));

    const logout = new GameButton(this, 278, 660, '계정', 144, 50, 0xf5aacb);
    logout.on('pointerup', () => this.signOut());

    new GlassPanel(this, 195, 744, 314, 82, 26, 0.10);
    this.add.text(195, 728, 'Aqua Glass · Cute Premium · 2.5D', { fontSize: '13px', fontStyle: '900', color: '#dff7ff' }).setOrigin(0.5);
    this.add.text(195, 752, 'v0.9 · Intro Video + Asset Seed Pack', { fontSize: '11px', color: '#9fb8e9' }).setOrigin(0.5);
  }

  private async signOut(): Promise<void> {
    const ok = window.confirm('로그아웃하고 로그인 화면으로 이동할까요?\n로컬 게스트 진행도는 이 기기에서만 유지됩니다.');
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
