import { ProgressModeId, SaveSystem } from './SaveSystem';
import { clampInt, safeId, safeJsonRecord } from './SecuritySystem';

export type DailyMissionId = 'clear_word' | 'clear_english' | 'clear_math' | 'clear_memory' | 'open_pack';

export type DailyMissionDefinition = {
  id: DailyMissionId;
  title: string;
  body: string;
  target: number;
  rewardXp: number;
  rewardCoins: number;
  rewardGems: number;
  accent: 'gold' | 'blue' | 'purple' | 'green' | 'coral';
};

export type DailyMissionEntry = DailyMissionDefinition & {
  progress: number;
  ready: boolean;
  claimed: boolean;
};

export type DailyMissionBoard = {
  token: string;
  nextResetAt: number;
  attendanceClaimed: boolean;
  attendanceReady: boolean;
  streakDays: number;
  bestStreakDays: number;
  attendanceRewardCoins: number;
  weeklyToken: string;
  weeklyProgress: number;
  weeklyTarget: number;
  weeklyReady: boolean;
  weeklyClaimed: boolean;
  weeklyCompletionRatio: number;
  dailyCompletionReady: boolean;
  dailyCompletionClaimed: boolean;
  dailyCompletionRewardText: string;
  rewardReadyCount: number;
  lobbyBadgeLabel: string;
  lobbyBadgeTone: 'gold' | 'blue' | 'purple' | 'green' | 'coral';
  shouldPrioritizeEvent: boolean;
  nextActionTitle: string;
  nextActionCopy: string;
  missions: DailyMissionEntry[];
  readyCount: number;
  claimedCount: number;
  completionRatio: number;
};

type DailyMissionState = {
  token: string;
  attendanceClaimed: boolean;
  lastAttendanceToken: string;
  streakDays: number;
  bestStreakDays: number;
  weeklyToken: string;
  weeklyProgress: number;
  weeklyClaimed: boolean;
  dailyCompletionClaimed: boolean;
  progress: Partial<Record<DailyMissionId, number>>;
  claimed: Partial<Record<DailyMissionId, boolean>>;
};

const DAILY_MISSION_KEY = 'cardville.dailyMission.v141';
const DAILY_MISSION_STREAK_VERSION = 'v144-perfect-day-lobby-route';
const WEEKLY_TARGET = 7;
const DAILY_COMPLETION_REWARD = { xp: 60, coins: 120, gems: 1 } as const;
const DAY_MS = 86_400_000;

export const DAILY_MISSIONS: readonly DailyMissionDefinition[] = [
  {
    id: 'clear_word',
    title: '도서관 정리',
    body: '낱말 카드 스테이지를 1회 클리어',
    target: 1,
    rewardXp: 18,
    rewardCoins: 35,
    rewardGems: 0,
    accent: 'gold'
  },
  {
    id: 'clear_english',
    title: '영어 수업 출석',
    body: '영어 학교 스테이지를 1회 클리어',
    target: 1,
    rewardXp: 20,
    rewardCoins: 36,
    rewardGems: 0,
    accent: 'blue'
  },
  {
    id: 'clear_math',
    title: '연구소 실험',
    body: '연산 연구소 문제팩을 1회 클리어',
    target: 1,
    rewardXp: 22,
    rewardCoins: 42,
    rewardGems: 0,
    accent: 'purple'
  },
  {
    id: 'clear_memory',
    title: '숲속 기억 훈련',
    body: '기억의 숲 스테이지를 1회 클리어',
    target: 1,
    rewardXp: 22,
    rewardCoins: 42,
    rewardGems: 0,
    accent: 'green'
  },
  {
    id: 'open_pack',
    title: '카드팩 개봉',
    body: '게임 보상 또는 상점 카드팩을 1회 열기',
    target: 1,
    rewardXp: 16,
    rewardCoins: 30,
    rewardGems: 1,
    accent: 'coral'
  }
] as const;

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage can be blocked in private browsers */ }
}

function dailyToken(now: number): string {
  const d = new Date(now);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function dayIndexFromToken(token: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(token);
  if (!match) return null;
  const time = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isFinite(time) ? Math.floor(time / DAY_MS) : null;
}

function nextUtcMidnight(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
}

function weekToken(now: number): string {
  const d = new Date(now);
  const utcDay = d.getUTCDay() || 7;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - utcDay + 1));
  return `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, '0')}-${String(monday.getUTCDate()).padStart(2, '0')}-week`;
}

function currentAttendanceCoins(streakDays: number): number {
  return 50 + Math.min(Math.max(0, streakDays), 6) * 5;
}

function blankState(token: string, weeklyToken: string): DailyMissionState {
  return {
    token,
    attendanceClaimed: false,
    lastAttendanceToken: '',
    streakDays: 0,
    bestStreakDays: 0,
    weeklyToken,
    weeklyProgress: 0,
    weeklyClaimed: false,
    dailyCompletionClaimed: false,
    progress: {},
    claimed: {}
  };
}

function normalizeState(raw: Record<string, unknown>, token: string, weeklyToken: string): DailyMissionState {
  const previousToken = safeId(raw.token, '');
  const sameDay = previousToken === token;
  const parsedProgress = sameDay ? safeJsonRecord(JSON.stringify(raw.progress ?? {})) : {};
  const parsedClaimed = sameDay ? safeJsonRecord(JSON.stringify(raw.claimed ?? {})) : {};
  const progress: Partial<Record<DailyMissionId, number>> = {};
  const claimed: Partial<Record<DailyMissionId, boolean>> = {};
  for (const mission of DAILY_MISSIONS) {
    progress[mission.id] = clampInt(parsedProgress[mission.id], 0, mission.target, 0);
    claimed[mission.id] = parsedClaimed[mission.id] === true;
  }

  const lastAttendanceToken = safeId(raw.lastAttendanceToken, sameDay && raw.attendanceClaimed === true ? token : '');
  const currentDay = dayIndexFromToken(token);
  const lastAttendanceDay = dayIndexFromToken(lastAttendanceToken);
  const streakStillCurrent = currentDay !== null && lastAttendanceDay !== null && currentDay - lastAttendanceDay <= 1;
  const streakDays = streakStillCurrent ? clampInt(raw.streakDays, 0, 3650, 0) : 0;
  const bestStreakDays = Math.max(streakDays, clampInt(raw.bestStreakDays, 0, 3650, streakDays));
  const rawWeeklyToken = safeId(raw.weeklyToken, weeklyToken);
  const sameWeek = rawWeeklyToken === weeklyToken;

  return {
    token,
    attendanceClaimed: sameDay && raw.attendanceClaimed === true,
    lastAttendanceToken,
    streakDays,
    bestStreakDays,
    weeklyToken,
    weeklyProgress: sameWeek ? clampInt(raw.weeklyProgress, 0, WEEKLY_TARGET, 0) : 0,
    weeklyClaimed: sameWeek && raw.weeklyClaimed === true,
    dailyCompletionClaimed: sameDay && raw.dailyCompletionClaimed === true,
    progress,
    claimed
  };
}

function missionForMode(modeId: string | undefined): DailyMissionId | null {
  if (modeId === 'word') return 'clear_word';
  if (modeId === 'english') return 'clear_english';
  if (modeId === 'math') return 'clear_math';
  if (modeId === 'memory') return 'clear_memory';
  return null;
}

function loadState(now = Date.now()): DailyMissionState {
  const token = dailyToken(now);
  const weekly = weekToken(now);
  const raw = safeJsonRecord(safeGet(DAILY_MISSION_KEY));
  return Object.keys(raw).length ? normalizeState(raw, token, weekly) : blankState(token, weekly);
}

function saveState(state: DailyMissionState): void {
  safeSet(DAILY_MISSION_KEY, JSON.stringify({ ...state, schema: DAILY_MISSION_STREAK_VERSION }));
}

function addWeeklyProgress(state: DailyMissionState, amount = 1): void {
  if (state.weeklyClaimed) return;
  state.weeklyProgress = clampInt(state.weeklyProgress + Math.max(0, amount), 0, WEEKLY_TARGET, state.weeklyProgress);
}

function nextActionForBoard(missions: DailyMissionEntry[], attendanceReady: boolean, weeklyReady: boolean, weeklyClaimed: boolean, dailyCompletionReady: boolean): { title: string; copy: string } {
  if (weeklyReady) return { title: '주간 보상 준비 완료', copy: '주간 수령 버튼으로 큰 보상을 받고 다음 루프를 준비하세요.' };
  if (dailyCompletionReady) return { title: '오늘 완주 보상 준비', copy: '일일 미션을 모두 수령했어요. 완주 보상까지 받아 루프를 마무리하세요.' };
  if (attendanceReady) return { title: '출석 보상부터 받기', copy: '출석 보상을 받으면 연속 출석과 주간 게이지가 함께 오릅니다.' };
  const ready = missions.find((mission) => mission.ready);
  if (ready) return { title: `${ready.title} 보상 수령`, copy: '완료된 미션 보상을 받으면 주간 목표도 같이 채워집니다.' };
  const next = missions.find((mission) => !mission.claimed);
  if (next) return { title: next.title, copy: `${next.body} · 진행도 ${next.progress}/${next.target}` };
  if (!weeklyClaimed) return { title: '주간 게이지 마무리', copy: '내일 출석이나 미션 보상을 더 받아 주간 목표를 완성하세요.' };
  return { title: '오늘 루프 완료', copy: '오늘 받을 보상은 모두 정리됐어요. 내일 새 미션을 이어가면 됩니다.' };
}

function dailyCompletionRewardText(): string {
  return `+${DAILY_COMPLETION_REWARD.xp}XP/+${DAILY_COMPLETION_REWARD.coins}코인/+${DAILY_COMPLETION_REWARD.gems}보석`;
}

export class DailyMissionSystem {
  static getBoard(now = Date.now()): DailyMissionBoard {
    const state = loadState(now);
    const missions = DAILY_MISSIONS.map((mission) => {
      const progress = clampInt(state.progress[mission.id], 0, mission.target, 0);
      const claimed = state.claimed[mission.id] === true;
      return { ...mission, progress, ready: progress >= mission.target && !claimed, claimed };
    });
    const readyCount = missions.filter((mission) => mission.ready).length;
    const claimedCount = missions.filter((mission) => mission.claimed).length;
    const progressSum = missions.reduce((sum, mission) => sum + Math.min(mission.progress, mission.target), 0);
    const targetSum = missions.reduce((sum, mission) => sum + mission.target, 0);
    const weeklyReady = state.weeklyProgress >= WEEKLY_TARGET && !state.weeklyClaimed;
    const allMissionsClaimed = missions.every((mission) => mission.claimed);
    const dailyCompletionReady = allMissionsClaimed && !state.dailyCompletionClaimed;
    const attendanceReady = !state.attendanceClaimed;
    const rewardReadyCount = readyCount + (attendanceReady ? 1 : 0) + (weeklyReady ? 1 : 0) + (dailyCompletionReady ? 1 : 0);
    const nextAction = nextActionForBoard(missions, attendanceReady, weeklyReady, state.weeklyClaimed, dailyCompletionReady);
    return {
      token: state.token,
      nextResetAt: nextUtcMidnight(now),
      attendanceClaimed: state.attendanceClaimed,
      attendanceReady,
      streakDays: state.streakDays,
      bestStreakDays: state.bestStreakDays,
      attendanceRewardCoins: currentAttendanceCoins(state.streakDays),
      weeklyToken: state.weeklyToken,
      weeklyProgress: state.weeklyProgress,
      weeklyTarget: WEEKLY_TARGET,
      weeklyReady,
      weeklyClaimed: state.weeklyClaimed,
      weeklyCompletionRatio: WEEKLY_TARGET > 0 ? state.weeklyProgress / WEEKLY_TARGET : 0,
      dailyCompletionReady,
      dailyCompletionClaimed: state.dailyCompletionClaimed,
      dailyCompletionRewardText: dailyCompletionRewardText(),
      rewardReadyCount,
      lobbyBadgeLabel: rewardReadyCount > 0 ? `READY ${rewardReadyCount}` : allMissionsClaimed ? 'DONE' : 'MISSION',
      lobbyBadgeTone: weeklyReady ? 'purple' : dailyCompletionReady ? 'gold' : attendanceReady ? 'blue' : readyCount > 0 ? 'coral' : 'green',
      shouldPrioritizeEvent: rewardReadyCount > 0,
      nextActionTitle: nextAction.title,
      nextActionCopy: nextAction.copy,
      missions,
      readyCount,
      claimedCount,
      completionRatio: targetSum > 0 ? progressSum / targetSum : 0
    };
  }

  static recordModeClear(modeId: ProgressModeId | string | undefined): DailyMissionBoard {
    const missionId = missionForMode(modeId);
    if (!missionId) return this.getBoard();
    return this.incrementMission(missionId, 1);
  }

  static recordPackOpen(): DailyMissionBoard {
    return this.incrementMission('open_pack', 1);
  }

  static claimAttendanceReward(): { ok: boolean; board: DailyMissionBoard; rewardText: string } {
    const state = loadState();
    if (state.attendanceClaimed) return { ok: false, board: this.getBoard(), rewardText: '오늘 출석 보상은 이미 받았어요.' };
    const todayIndex = dayIndexFromToken(state.token);
    const previousIndex = dayIndexFromToken(state.lastAttendanceToken);
    const nextStreak = todayIndex !== null && previousIndex !== null && todayIndex - previousIndex === 1 ? state.streakDays + 1 : 1;
    state.attendanceClaimed = true;
    state.lastAttendanceToken = state.token;
    state.streakDays = clampInt(nextStreak, 1, 3650, 1);
    state.bestStreakDays = Math.max(state.bestStreakDays, state.streakDays);
    addWeeklyProgress(state, 1);
    saveState(state);
    const coins = currentAttendanceCoins(state.streakDays);
    const profile = SaveSystem.addReward(20, coins, 0);
    return { ok: true, board: this.getBoard(), rewardText: `출석 ${state.streakDays}일 연속 +20XP/+${coins}코인 · 주간 ${state.weeklyProgress}/${WEEKLY_TARGET} · 현재 Lv.${profile.level}` };
  }

  static claimMissionReward(missionId: DailyMissionId): { ok: boolean; board: DailyMissionBoard; rewardText: string } {
    const state = loadState();
    const mission = DAILY_MISSIONS.find((entry) => entry.id === missionId);
    if (!mission) return { ok: false, board: this.getBoard(), rewardText: '알 수 없는 미션입니다.' };
    const progress = clampInt(state.progress[mission.id], 0, mission.target, 0);
    if (state.claimed[mission.id]) return { ok: false, board: this.getBoard(), rewardText: '이미 받은 미션 보상입니다.' };
    if (progress < mission.target) return { ok: false, board: this.getBoard(), rewardText: '아직 완료되지 않은 미션입니다.' };
    state.claimed[mission.id] = true;
    addWeeklyProgress(state, 1);
    saveState(state);
    const profile = SaveSystem.addReward(mission.rewardXp, mission.rewardCoins, mission.rewardGems);
    const gemText = mission.rewardGems > 0 ? `/+${mission.rewardGems}보석` : '';
    return { ok: true, board: this.getBoard(), rewardText: `${mission.title} 보상 +${mission.rewardXp}XP/+${mission.rewardCoins}코인${gemText} · 주간 ${state.weeklyProgress}/${WEEKLY_TARGET} · 현재 Lv.${profile.level}` };
  }

  static claimWeeklyReward(): { ok: boolean; board: DailyMissionBoard; rewardText: string } {
    const state = loadState();
    if (state.weeklyClaimed) return { ok: false, board: this.getBoard(), rewardText: '이번 주 보상은 이미 받았어요.' };
    if (state.weeklyProgress < WEEKLY_TARGET) return { ok: false, board: this.getBoard(), rewardText: '주간 보상까지 아직 목표가 남았어요.' };
    state.weeklyClaimed = true;
    saveState(state);
    const profile = SaveSystem.addReward(80, 180, 2);
    return { ok: true, board: this.getBoard(), rewardText: `주간 미션 완성 +80XP/+180코인/+2보석 · 현재 Lv.${profile.level}` };
  }

  static claimDailyCompletionReward(): { ok: boolean; board: DailyMissionBoard; rewardText: string } {
    const state = loadState();
    const allClaimed = DAILY_MISSIONS.every((mission) => state.claimed[mission.id] === true);
    if (state.dailyCompletionClaimed) return { ok: false, board: this.getBoard(), rewardText: '오늘 완주 보상은 이미 받았어요.' };
    if (!allClaimed) return { ok: false, board: this.getBoard(), rewardText: '일일 미션 보상을 모두 받은 뒤 완주 보상을 받을 수 있어요.' };
    state.dailyCompletionClaimed = true;
    saveState(state);
    const profile = SaveSystem.addReward(DAILY_COMPLETION_REWARD.xp, DAILY_COMPLETION_REWARD.coins, DAILY_COMPLETION_REWARD.gems);
    return { ok: true, board: this.getBoard(), rewardText: `오늘 완주 보상 ${dailyCompletionRewardText()} · 현재 Lv.${profile.level}` };
  }

  static getLobbyStatus(): Pick<DailyMissionBoard, 'rewardReadyCount' | 'lobbyBadgeLabel' | 'lobbyBadgeTone' | 'shouldPrioritizeEvent' | 'nextActionTitle' | 'nextActionCopy'> {
    const board = this.getBoard();
    return {
      rewardReadyCount: board.rewardReadyCount,
      lobbyBadgeLabel: board.lobbyBadgeLabel,
      lobbyBadgeTone: board.lobbyBadgeTone,
      shouldPrioritizeEvent: board.shouldPrioritizeEvent,
      nextActionTitle: board.nextActionTitle,
      nextActionCopy: board.nextActionCopy
    };
  }

  private static incrementMission(missionId: DailyMissionId, amount: number): DailyMissionBoard {
    const state = loadState();
    const mission = DAILY_MISSIONS.find((entry) => entry.id === missionId);
    if (!mission) return this.getBoard();
    const current = clampInt(state.progress[missionId], 0, mission.target, 0);
    state.progress[missionId] = clampInt(current + Math.max(0, amount), 0, mission.target, current);
    saveState(state);
    return this.getBoard();
  }
}
