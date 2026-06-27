import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';
import { GameButton } from '../ui/GameButton';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { DailyMissionRecord, MissionSystem } from '../systems/MissionSystem';

export class MissionScene extends Phaser.Scene {
  constructor() {
    super('MissionScene');
  }

  create(): void {
    this.render();
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private render(message?: string): void {
    this.children.removeAll();
    this.drawBackground();
    this.addHeader();
    const state = MissionSystem.getState();

    this.add.text(195, 106, '오늘의 미션', {
      fontSize: '34px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 14, fill: true }
    }).setOrigin(0.5);
    this.add.text(195, 146, `${state.date} · 출석 ${state.attendance.streak}일차`, { fontSize: '15px', color: '#d9e8ff' }).setOrigin(0.5);

    this.createAttendancePanel(state.attendance.claimed, state.attendance.streak);
    state.missions.forEach((mission, index) => this.createMissionCard(mission, 310 + index * 122));

    if (message) this.showToast(message);
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createAttendancePanel(claimed: boolean, streak: number): void {
    new GlassPanel(this, 195, 222, 334, 104, 26, 0.14);
    this.add.text(56, 199, '🎁 출석 보상', { fontSize: '20px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(56, 228, `연속 ${streak}일 · 코인과 XP 보상`, { fontSize: '13px', color: '#d9e8ff' }).setOrigin(0, 0.5);

    const button = new GameButton(this, 278, 224, claimed ? '수령 완료' : '받기', 116, 46, claimed ? 0x8ba0c6 : 0xffd86f);
    button.on('pointerup', async () => {
      const result = await MissionSystem.claimAttendance();
      this.render(result.message);
    });
  }

  private createMissionCard(mission: DailyMissionRecord, y: number): void {
    new GlassPanel(this, 195, y, 334, 100, 24, 0.13);
    const ratio = Phaser.Math.Clamp(mission.progress / mission.target, 0, 1);
    this.add.text(56, y - 28, mission.title, { fontSize: '19px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    this.add.text(56, y - 5, mission.description, { fontSize: '12px', color: '#d9e8ff' }).setOrigin(0, 0.5);
    this.add.text(56, y + 22, `보상 XP ${mission.rewardXp} · 🪙 ${mission.rewardCoins}`, { fontSize: '12px', color: '#ffe4a3' }).setOrigin(0, 0.5);
    this.createProgressBar(56, y + 39, 184, 12, ratio);
    this.add.text(250, y + 45, `${mission.progress}/${mission.target}`, { fontSize: '12px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);

    const ready = mission.progress >= mission.target && !mission.claimed;
    const button = new GameButton(this, 303, y + 4, mission.claimed ? '완료' : (ready ? '받기' : '진행'), 82, 42, ready ? 0xffd86f : 0x8ba0c6);
    button.on('pointerup', async () => {
      const result = await MissionSystem.claimMission(mission.missionId);
      this.render(result.message);
    });
  }

  private createProgressBar(x: number, y: number, width: number, height: number, ratio: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.24);
    g.fillRoundedRect(x, y, width, height, height / 2);
    g.fillGradientStyle(0x8fd3ff, 0xdff7ff, 0xffd86f, 0xfff2b8, 1);
    g.fillRoundedRect(x + 2, y + 2, Math.max(6, (width - 4) * ratio), height - 4, (height - 4) / 2);
  }

  private showToast(message: string): void {
    const toast = this.add.text(195, 766, message, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(12, 18, 38, 0.82)',
      padding: { left: 16, right: 16, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: toast, y: 744, alpha: 0, delay: 1100, duration: 420, onComplete: () => toast.destroy() });
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x193f70, 0x193f70, 0x0c1734, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffd86f, 0.06);
    g.fillCircle(58, 702, 160);
    g.fillStyle(0x8fd3ff, 0.07);
    g.fillCircle(320, 154, 140);
  }
}
