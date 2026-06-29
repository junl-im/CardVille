import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { DailyMissionEntry, DailyMissionId, DailyMissionSystem } from '../systems/DailyMissionSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyResponsiveCamera } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';

const ACCENT_COLORS: Record<DailyMissionEntry['accent'], number> = {
  gold: 0xffd86f,
  blue: 0x8fd3ff,
  purple: 0xd7a5ff,
  green: 0xa9f5b5,
  coral: 0xffb39a
};

export class DailyMissionScene extends Phaser.Scene {
  private toast?: Phaser.GameObjects.Container;

  constructor() { super('DailyMissionScene'); }

  create(): void {
    applyResponsiveCamera(this);
    this.drawBoard();
  }

  private drawBoard(message = ''): void {
    this.children.removeAll(true);
    const profile = SaveSystem.loadProfile();
    const board = DailyMissionSystem.getBoard();
    DrawSystem.background(this, '오늘의 미션');
    DrawSystem.topHud(this, profile.coins, profile.level);
    panel(this, 195, 420, 344, 604, 34);

    this.add.text(195, 84, '이벤트 광장', goldText(24)).setOrigin(0.5);
    this.add.text(195, 115, '출석, 수업 클리어, 카드팩 개봉을 하루 목표로 묶어 보상 루프를 안정화합니다.', applyWrap(mutedText(11), 318)).setOrigin(0.5);
    this.drawProgressMeter(board.completionRatio, board.readyCount, board.claimedCount);
    this.drawAttendance(board.attendanceReady, board.attendanceClaimed);
    board.missions.forEach((mission, index) => this.drawMissionRow(mission, 286 + index * 70));

    new GameButton(this, 108, 704, '게임 선택', 132, 50, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
    new GameButton(this, 282, 704, '상점', 132, 50, 0xffd86f).onClick(() => this.scene.start('ShopScene'));
    new GameButton(this, 195, 766, '광장으로', 236, 52, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
    if (message) this.showToast(message);
    this.showMissionCoach(board.readyCount > 0 || board.attendanceReady);
  }

  private drawProgressMeter(ratio: number, readyCount: number, claimedCount: number): void {
    this.add.rectangle(195, 154, 316, 50, 0x07142c, 0.58).setStrokeStyle(1, 0xffffff, 0.18);
    this.add.text(62, 144, '오늘 진행도', mutedText(10)).setOrigin(0, 0.5);
    this.add.text(328, 144, `받을 보상 ${readyCount}개`, goldText(10)).setOrigin(1, 0.5);
    this.add.rectangle(195, 166, 250, 10, 0x26334f, 0.78);
    this.add.rectangle(70, 166, Math.max(10, 250 * Phaser.Math.Clamp(ratio, 0, 1)), 10, 0xffd86f, 0.96).setOrigin(0, 0.5);
    this.add.text(195, 185, `미션 보상 수령 ${claimedCount}/5 · 자정 UTC에 새로고침`, mutedText(9)).setOrigin(0.5);
  }

  private drawAttendance(attendanceReady: boolean, attendanceClaimed: boolean): void {
    this.add.rectangle(195, 224, 316, 64, attendanceReady ? 0xfffbf1 : 0x26334f, attendanceReady ? 0.94 : 0.64).setStrokeStyle(2, attendanceReady ? 0xffd86f : 0x8fd3ff, attendanceReady ? 0.74 : 0.36);
    this.add.text(62, 208, attendanceReady ? '출석 보상 READY' : '출석 완료', attendanceReady ? darkText(14) : goldText(14)).setOrigin(0, 0.5);
    this.add.text(62, 232, attendanceClaimed ? '내일 다시 받을 수 있어요.' : '+20XP/+50코인으로 오늘 플레이를 시작하세요.', attendanceReady ? bodyText(10) : mutedText(10)).setOrigin(0, 0.5);
    const button = new GameButton(this, 286, 224, attendanceReady ? '받기' : '완료', 82, 38, attendanceReady ? 0xffd86f : 0x9aa4ba)
      .onClick(() => this.claimAttendance());
    button.setDisabled(!attendanceReady);
  }

  private drawMissionRow(mission: DailyMissionEntry, y: number): void {
    const color = ACCENT_COLORS[mission.accent];
    const alpha = mission.claimed ? 0.58 : mission.ready ? 0.96 : 0.82;
    this.add.rectangle(195, y, 316, 58, mission.ready ? 0xfffbf1 : 0x07142c, mission.ready ? 0.94 : 0.52).setStrokeStyle(mission.ready ? 2 : 1, color, alpha);
    this.add.circle(66, y, 18, color, mission.claimed ? 0.28 : 0.78).setStrokeStyle(1, 0xffffff, 0.35);
    this.add.text(66, y, mission.claimed ? '✓' : `${mission.progress}/${mission.target}`, mission.ready || mission.claimed ? darkText(10) : goldText(10)).setOrigin(0.5);
    this.add.text(92, y - 14, mission.title, mission.ready ? darkText(13) : goldText(13)).setOrigin(0, 0.5).setAlpha(alpha);
    this.add.text(92, y + 4, mission.body, applyWrap(mission.ready ? bodyText(9) : mutedText(9), 142, 'left')).setOrigin(0, 0.5).setAlpha(alpha);
    this.add.text(92, y + 21, `+${mission.rewardXp}XP / +${mission.rewardCoins}코인${mission.rewardGems ? ` / +${mission.rewardGems}보석` : ''}`, mutedText(8)).setOrigin(0, 0.5).setAlpha(alpha);
    const label = mission.claimed ? '완료' : mission.ready ? '수령' : '진행중';
    const button = new GameButton(this, 288, y, label, 78, 36, mission.ready ? color : 0x9aa4ba).onClick(() => this.claimMission(mission.id));
    button.setDisabled(!mission.ready);
  }

  private claimAttendance(): void {
    const result = DailyMissionSystem.claimAttendanceReward();
    this.drawBoard(result.rewardText);
  }

  private claimMission(id: DailyMissionId): void {
    const result = DailyMissionSystem.claimMissionReward(id);
    this.drawBoard(result.rewardText);
  }

  private showToast(message: string): void {
    this.toast?.destroy();
    const toast = this.add.container(195, 640).setDepth(2000);
    toast.add(this.add.rectangle(0, 0, 308, 56, 0x07142c, 0.94).setStrokeStyle(2, 0xffd86f, 0.54));
    toast.add(this.add.text(0, 0, message, applyWrap(goldText(11), 278)).setOrigin(0.5));
    toast.setAlpha(0).setScale(0.96);
    this.toast = toast;
    this.tweens.add({ targets: toast, alpha: 1, scale: 1, duration: 120, ease: 'Back.easeOut' });
    this.time.delayedCall(1400, () => this.tweens.add({ targets: toast, alpha: 0, y: 624, duration: 220, onComplete: () => toast.destroy() }));
  }

  private showMissionCoach(hasReadyReward: boolean): void {
    CoachMarkSystem.showOnce(this, {
      id: 'daily_mission_board_v141',
      title: '오늘의 미션 팁',
      body: hasReadyReward ? 'READY 보상은 바로 수령해도 좋아요. 출석, 수업, 카드팩이 하루 목표로 연결돼 보상 루프가 끊기지 않습니다.' : '각 모드에서 한 번씩 클리어하고 카드팩을 열면 미션 보상이 쌓여요. 새 이미지 에셋 없이도 이벤트 건물이 실제 목표 보드로 작동합니다.',
      x: 195,
      y: 620,
      width: 326,
      tone: hasReadyReward ? 'gold' : 'blue',
      anchorX: 278,
      anchorY: 224
    });
  }
}
