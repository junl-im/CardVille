import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { UserDataSystem } from '../systems/UserDataSystem';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { UserProfileDoc } from '../../firebase/firestore';
import { VisualSystem } from '../systems/VisualSystem';
import { ThemeSystem } from '../systems/ThemeSystem';

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
      this.createPrimaryActions();
      this.createSystemDock();
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
    this.add.text(195, 372, '레벨 · 재화 · 선택 월드를 불러오고 있어요.', { fontSize: '15px', color: '#d9e8ff', align: 'center', wordWrap: { width: 280 } }).setOrigin(0.5);
    const glow = this.add.graphics();
    glow.fillStyle(ThemeSystem.getSelectedWorld().accent, 0.18);
    glow.fillCircle(195, 454, 22);
    this.tweens.add({ targets: glow, alpha: 0.35, scale: 1.35, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private createTopBar(profile: UserProfileDoc): void {
    new GlassPanel(this, 195, 54, 350, 72, 22, 0.12);
    this.createChip(82, 54, `COIN ${profile.coins.toLocaleString('ko-KR')}`, '#fff7ce');
    this.createChip(190, 54, `GEM ${profile.gems.toLocaleString('ko-KR')}`, '#d5fbff');
    this.createChip(292, 54, `Lv.${profile.level}`, '#ffffff');
    this.add.text(344, 54, '⚙', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerup', () => this.scene.start('SettingsScene'));
  }

  private createChip(x: number, y: number, label: string, color: string): void {
    this.add.text(x, y, label, { fontSize: '14px', fontStyle: '900', color }).setOrigin(0.5);
  }

  private createHeroPanel(profile: UserProfileDoc): void {
    new GlassPanel(this, 195, 220, 334, 236, 34, 0.14);
    const loginLabel = UserDataSystem.getLoginStateLabel(profile);
    const progress = UserDataSystem.getLevelProgress(profile);
    const world = ThemeSystem.getSelectedWorld();
    const back = ThemeSystem.getSelectedCardBack();

    this.add.text(48, 112, 'CardVille', { fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: '900', color: '#ffffff', shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 12, fill: true } }).setOrigin(0, 0.5);
    this.add.text(48, 146, `${profile.nickname} · ${loginLabel}`, { fontSize: '14px', fontStyle: '800', color: AuthSystem.isLocalGuest() ? '#ffc9d6' : '#d9e8ff' }).setOrigin(0, 0.5);
    this.add.text(48, 180, `월드 · ${world.title}`, { fontSize: '13px', fontStyle: '900', color: '#ffe4a3' }).setOrigin(0, 0.5);
    this.add.text(48, 204, `카드 뒷면 · ${back.title}`, { fontSize: '12px', color: '#cfe8ff' }).setOrigin(0, 0.5);

    this.add.text(48, 242, `레벨 ${profile.level}`, { fontSize: '17px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.createXpBar(48, 263, 218, 17, progress.ratio);
    this.add.text(48, 292, `XP ${progress.currentLevelXp}/${progress.requiredXp} · 다음 레벨 ${progress.nextLevel}`, { fontSize: '12px', color: '#cfe8ff' }).setOrigin(0, 0.5);

    this.drawSelectedBackPreview(306, 220);
  }

  private drawSelectedBackPreview(x: number, y: number): void {
    const back = ThemeSystem.getSelectedCardBack();
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.24);
    shadow.fillRoundedRect(x - 39, y - 52 + 8, 78, 112, 20);
    if (this.textures.exists(back.textureKey)) {
      this.add.image(x, y, back.textureKey).setDisplaySize(76, 106).setAngle(-4);
    } else {
      const g = this.add.graphics();
      g.fillStyle(back.accent, 0.92);
      g.fillRoundedRect(x - 38, y - 54, 76, 108, 20);
    }
    this.add.text(x, y + 78, 'MY CARD', { fontSize: '10px', fontStyle: '900', color: '#dff7ff' }).setOrigin(0.5);
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

  private createPrimaryActions(): void {
    const play = new GameButton(this, 195, 384, '꿈의 서고 입장', 316, 60, 0xffd86f);
    play.on('pointerup', () => this.scene.start('ModeSelectScene'));

    this.createTile(105, 464, '앨범', '수집 카드', 0x8fd3ff, () => this.scene.start('CollectionScene'));
    this.createTile(285, 464, '도감', '5,000장', 0xb7ffd8, () => this.scene.start('AssetGalleryScene'));
    this.createTile(105, 558, '미션', '출석/보상', 0xc59bff, () => this.scene.start('MissionScene'));
    this.createTile(285, 558, '팩 확률', '보상표', 0xffd86f, () => this.scene.start('PackInfoScene'));
  }

  private createTile(x: number, y: number, title: string, subtitle: string, color: number, callback: () => void): void {
    const tile = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.22);
    g.fillRoundedRect(-76, -38 + 8, 152, 82, 24);
    g.fillGradientStyle(0xffffff, 0xffffff, color, color, 0.20);
    g.fillRoundedRect(-78, -42, 156, 84, 24);
    g.lineStyle(2, 0xffffff, 0.34);
    g.strokeRoundedRect(-78, -42, 156, 84, 24);
    g.fillStyle(color, 0.18);
    g.fillCircle(51, -16, 30);
    const t = this.add.text(-54, -12, title, { fontSize: '21px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    const s = this.add.text(-54, 16, subtitle, { fontSize: '12px', fontStyle: '800', color: '#d9e8ff' }).setOrigin(0, 0.5);
    tile.add([g, t, s]);
    tile.setSize(156, 84).setInteractive(new Phaser.Geom.Rectangle(-78, -42, 156, 84), Phaser.Geom.Rectangle.Contains);
    tile.on('pointerup', callback);
    tile.on('pointerover', () => this.tweens.add({ targets: tile, scale: 1.025, duration: 100 }));
    tile.on('pointerout', () => this.tweens.add({ targets: tile, scale: 1, duration: 100 }));
  }

  private createSystemDock(): void {
    new GlassPanel(this, 195, 686, 334, 92, 30, 0.12);
    const world = new GameButton(this, 105, 666, '월드', 144, 44, 0x8fd3ff);
    world.on('pointerup', () => this.scene.start('WorldSelectScene'));
    const back = new GameButton(this, 285, 666, '뒷면', 144, 44, 0xb7ffd8);
    back.on('pointerup', () => this.scene.start('CardBackSelectScene'));
    const settings = new GameButton(this, 105, 720, '설정', 144, 44, 0xc59bff);
    settings.on('pointerup', () => this.scene.start('SettingsScene'));
    const account = new GameButton(this, 285, 720, '계정', 144, 44, 0xf5aacb);
    account.on('pointerup', () => this.signOut());

    new GlassPanel(this, 195, 794, 314, 46, 22, 0.10);
    this.add.text(195, 784, 'Aqua Glass · Cute Premium · 2.5D', { fontSize: '12px', fontStyle: '900', color: '#dff7ff' }).setOrigin(0.5);
    this.add.text(195, 804, 'v1.0-rc · UI/Engine Quality Pass', { fontSize: '10px', color: '#9fb8e9' }).setOrigin(0.5);
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
    VisualSystem.drawSelectedWorldBackground(this, 'library');
    VisualSystem.spawnAmbientStars(this, 26);
  }
}
