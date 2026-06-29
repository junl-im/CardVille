import Phaser from 'phaser';
import { DrawSystem } from '../systems/DrawSystem';
import { DailyMissionEntry, DailyMissionId, DailyMissionSystem } from '../systems/DailyMissionSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyResponsiveCamera } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';
import { RewardPopupSystem, RewardPopupTone } from '../systems/RewardPopupSystem';

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
    this.add.text(195, 115, '출석, 수업 클리어, 카드팩 개봉을 주간 목표까지 연결해 보상 루프를 안정화합니다.', applyWrap(mutedText(11), 318)).setOrigin(0.5);
    this.drawNextAction(board.nextActionTitle, board.nextActionCopy);
    this.drawProgressMeter(board.completionRatio, board.readyCount, board.claimedCount);
    this.drawStreakWeekly(board.streakDays, board.bestStreakDays, board.weeklyProgress, board.weeklyTarget, board.weeklyReady, board.weeklyClaimed, board.weeklyCompletionRatio);
    this.drawAttendance(board.attendanceReady, board.attendanceClaimed, board.attendanceRewardCoins);
    board.missions.forEach((mission, index) => this.drawMissionRow(mission, 344 + index * 58));

    new GameButton(this, 108, 704, '게임 선택', 132, 50, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
    new GameButton(this, 282, 704, '상점', 132, 50, 0xffd86f).onClick(() => this.scene.start('ShopScene'));
    new GameButton(this, 195, 766, '광장으로', 236, 52, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
    if (message) this.showToast(message);
    this.showMissionCoach(board.readyCount > 0 || board.attendanceReady);
  }

  private drawNextAction(title: string, copy: string): void {
    this.add.rectangle(195, 144, 316, 34, 0xfffbf1, 0.92).setStrokeStyle(1, 0xffd86f, 0.52);
    this.add.text(62, 137, title, darkText(11)).setOrigin(0, 0.5);
    this.add.text(62, 151, copy, applyWrap(bodyText(8), 266, 'left')).setOrigin(0, 0.5);
  }

  private drawProgressMeter(ratio: number, readyCount: number, claimedCount: number): void {
    this.add.rectangle(195, 180, 316, 42, 0x07142c, 0.58).setStrokeStyle(1, 0xffffff, 0.18);
    this.add.text(62, 170, '오늘 진행도', mutedText(10)).setOrigin(0, 0.5);
    this.add.text(328, 170, `받을 보상 ${readyCount}개`, goldText(10)).setOrigin(1, 0.5);
    this.add.rectangle(195, 190, 250, 10, 0x26334f, 0.78);
    this.add.rectangle(70, 190, Math.max(10, 250 * Phaser.Math.Clamp(ratio, 0, 1)), 10, 0xffd86f, 0.96).setOrigin(0, 0.5);
    this.add.text(195, 207, `미션 보상 수령 ${claimedCount}/5 · 자정 UTC에 새로고침`, mutedText(9)).setOrigin(0.5);
  }

  private drawStreakWeekly(streakDays: number, bestStreakDays: number, weeklyProgress: number, weeklyTarget: number, weeklyReady: boolean, weeklyClaimed: boolean, weeklyRatio: number): void {
    this.add.rectangle(195, 220, 316, 64, weeklyReady ? 0xfffbf1 : 0x07142c, weeklyReady ? 0.94 : 0.58).setStrokeStyle(2, weeklyReady ? 0xffd86f : 0x8fd3ff, weeklyReady ? 0.78 : 0.32);
    this.add.text(62, 203, `연속 출석 ${streakDays}일`, weeklyReady ? darkText(13) : goldText(13)).setOrigin(0, 0.5);
    this.add.text(328, 203, `최고 ${bestStreakDays}일`, weeklyReady ? bodyText(9) : mutedText(9)).setOrigin(1, 0.5);
    this.add.rectangle(195, 226, 214, 9, 0x26334f, 0.74);
    this.add.rectangle(88, 226, Math.max(10, 214 * Phaser.Math.Clamp(weeklyRatio, 0, 1)), 9, weeklyReady ? 0xffd86f : 0x8fd3ff, 0.96).setOrigin(0, 0.5);
    this.add.text(62, 246, weeklyClaimed ? '이번 주 보상 수령 완료' : `주간 보상 ${weeklyProgress}/${weeklyTarget} · 출석/미션 수령으로 채워요`, weeklyReady ? bodyText(9) : mutedText(9)).setOrigin(0, 0.5);
    const button = new GameButton(this, 286, 237, weeklyClaimed ? '완료' : weeklyReady ? '주간 수령' : '주간', 82, 34, weeklyReady ? 0xffd86f : 0x9aa4ba)
      .onClick(() => this.claimWeekly());
    button.setDisabled(!weeklyReady);
  }

  private drawAttendance(attendanceReady: boolean, attendanceClaimed: boolean, attendanceRewardCoins: number): void {
    this.add.rectangle(195, 292, 316, 58, attendanceReady ? 0xfffbf1 : 0x26334f, attendanceReady ? 0.94 : 0.64).setStrokeStyle(2, attendanceReady ? 0xffd86f : 0x8fd3ff, attendanceReady ? 0.74 : 0.36);
    this.add.text(62, 277, attendanceReady ? '출석 보상 READY' : '출석 완료', attendanceReady ? darkText(14) : goldText(14)).setOrigin(0, 0.5);
    this.add.text(62, 300, attendanceClaimed ? '내일 연속 출석을 이어가요.' : `+20XP/+${attendanceRewardCoins}코인 · 연속 출석 보너스`, attendanceReady ? bodyText(10) : mutedText(10)).setOrigin(0, 0.5);
    const button = new GameButton(this, 286, 292, attendanceReady ? '받기' : '완료', 82, 36, attendanceReady ? 0xffd86f : 0x9aa4ba)
      .onClick(() => this.claimAttendance());
    button.setDisabled(!attendanceReady);
  }

  private drawMissionRow(mission: DailyMissionEntry, y: number): void {
    const color = ACCENT_COLORS[mission.accent];
    const alpha = mission.claimed ? 0.58 : mission.ready ? 0.96 : 0.82;
    this.add.rectangle(195, y, 316, 50, mission.ready ? 0xfffbf1 : 0x07142c, mission.ready ? 0.94 : 0.52).setStrokeStyle(mission.ready ? 2 : 1, color, alpha);
    this.add.circle(66, y, 16, color, mission.claimed ? 0.28 : 0.78).setStrokeStyle(1, 0xffffff, 0.35);
    this.add.text(66, y, mission.claimed ? '✓' : `${mission.progress}/${mission.target}`, mission.ready || mission.claimed ? darkText(10) : goldText(10)).setOrigin(0.5);
    this.add.text(92, y - 12, mission.title, mission.ready ? darkText(13) : goldText(13)).setOrigin(0, 0.5).setAlpha(alpha);
    this.add.text(92, y + 4, mission.body, applyWrap(mission.ready ? bodyText(9) : mutedText(9), 142, 'left')).setOrigin(0, 0.5).setAlpha(alpha);
    this.add.text(92, y + 18, `+${mission.rewardXp}XP / +${mission.rewardCoins}코인${mission.rewardGems ? ` / +${mission.rewardGems}보석` : ''}`, mutedText(8)).setOrigin(0, 0.5).setAlpha(alpha);
    const label = mission.claimed ? '완료' : mission.ready ? '수령' : '진행중';
    const button = new GameButton(this, 288, y, label, 78, 34, mission.ready ? color : 0x9aa4ba).onClick(() => this.claimMission(mission.id));
    button.setDisabled(!mission.ready);
  }

  private claimAttendance(): void {
    const result = DailyMissionSystem.claimAttendanceReward();
    this.drawBoard();
    this.showRewardPopup('출석 보상 수령', result.rewardText, 'gold');
  }

  private claimMission(id: DailyMissionId): void {
    const result = DailyMissionSystem.claimMissionReward(id);
    const mission = DailyMissionSystem.getBoard().missions.find((entry) => entry.id === id);
    this.drawBoard();
    this.showRewardPopup(mission ? `${mission.title} 완료` : '미션 보상 수령', result.rewardText, mission?.accent ?? 'blue');
  }

  private claimWeekly(): void {
    const result = DailyMissionSystem.claimWeeklyReward();
    this.drawBoard();
    this.showRewardPopup('주간 미션 완성', result.rewardText, 'purple');
  }

  private showRewardPopup(title: string, message: string, tone: RewardPopupTone): void {
    RewardPopupSystem.show(this, {
      title,
      message,
      tone,
      primaryLabel: '계속',
      secondaryLabel: '상점 보기',
      onSecondary: () => this.scene.start('ShopScene')
    });
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
      id: 'daily_mission_board_v142',
      title: '오늘의 미션 팁',
      body: hasReadyReward ? 'READY 보상은 바로 수령해도 좋아요. 출석과 미션 수령이 주간 보상 게이지까지 함께 채워집니다.' : '각 모드에서 한 번씩 클리어하고 카드팩을 열면 오늘 목표와 주간 목표가 같이 쌓여요. 에셋이 오기 전에도 이벤트 건물이 실제 루프 보드로 작동합니다.',
      x: 195,
      y: 620,
      width: 326,
      tone: hasReadyReward ? 'gold' : 'blue',
      anchorX: 278,
      anchorY: 224
    });
  }
}
