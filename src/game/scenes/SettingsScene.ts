import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';
import { GameButton } from '../ui/GameButton';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { CardVilleSettings, SettingsSystem } from '../systems/SettingsSystem';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create(): void {
    this.render();
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private render(message?: string): void {
    this.children.removeAll();
    this.drawBackground();
    this.addHeader();
    const settings = SettingsSystem.get();

    this.add.text(195, 108, '설정', {
      fontSize: '36px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 14, fill: true }
    }).setOrigin(0.5);
    this.add.text(195, 150, '사운드 · 진동 · 성능 옵션', { fontSize: '15px', color: '#d9e8ff' }).setOrigin(0.5);

    new GlassPanel(this, 195, 376, 334, 386, 30, 0.14);
    this.createToggle('배경음', 'bgm', settings, 238);
    this.createToggle('효과음', 'sfx', settings, 306);
    this.createToggle('진동', 'haptic', settings, 374);
    this.createToggle('절전 연출', 'reducedMotion', settings, 442);
    this.createToggle('데이터 절약', 'dataSaver', settings, 510);

    const reset = new GameButton(this, 195, 604, '설정 초기화', 250, 54, 0xf5aacb);
    reset.on('pointerup', () => {
      SettingsSystem.reset();
      this.render('설정을 초기화했어요.');
    });

    this.add.text(195, 688, '실제 음원 파일은 public/assets/audio/sfx, bgm 폴더에 추가하면 연결할 수 있어요.', {
      fontSize: '12px',
      color: '#aebfe6',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);

    if (message) this.showToast(message);
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createToggle(label: string, key: keyof CardVilleSettings, settings: CardVilleSettings, y: number): void {
    const enabled = settings[key];
    this.add.text(64, y, label, { fontSize: '19px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(64, y + 23, this.getDescription(key), { fontSize: '12px', color: '#cbd8ff' }).setOrigin(0, 0.5);
    const button = new GameButton(this, 286, y + 9, enabled ? 'ON' : 'OFF', 96, 44, enabled ? 0xffd86f : 0x8ba0c6);
    button.on('pointerup', () => {
      SettingsSystem.toggle(key);
      this.render(`${label} 설정을 변경했어요.`);
    });
  }

  private getDescription(key: keyof CardVilleSettings): string {
    const map: Record<keyof CardVilleSettings, string> = {
      bgm: '향후 BGM 파일 연결용',
      sfx: '버튼, 카드, 보상 효과음',
      haptic: '모바일 진동 피드백',
      reducedMotion: '낮은 사양 기기 연출 완화',
      dataSaver: '대용량 에셋 로딩 최소화'
    };
    return map[key];
  }

  private showToast(message: string): void {
    const toast = this.add.text(195, 766, message, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(12, 18, 38, 0.82)',
      padding: { left: 16, right: 16, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: toast, y: 744, alpha: 0, delay: 1000, duration: 420, onComplete: () => toast.destroy() });
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x163964, 0x163964, 0x0c1734, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x8fd3ff, 0.07);
    g.fillCircle(320, 174, 142);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(74, 740, 176);
  }
}
