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
  missions: DailyMissionEntry[];
  readyCount: number;
  claimedCount: number;
  completionRatio: number;
};

type DailyMissionState = {
  token: string;
  attendanceClaimed: boolean;
  progress: Partial<Record<DailyMissionId, number>>;
  claimed: Partial<Record<DailyMissionId, boolean>>;
};

const DAILY_MISSION_KEY = 'cardville.dailyMission.v141';

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

function nextUtcMidnight(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
}

function blankState(token: string): DailyMissionState {
  return { token, attendanceClaimed: false, progress: {}, claimed: {} };
}

function normalizeState(raw: Record<string, unknown>, token: string): DailyMissionState {
  if (safeId(raw.token, '') !== token) return blankState(token);
  const parsedProgress = safeJsonRecord(JSON.stringify(raw.progress ?? {}));
  const parsedClaimed = safeJsonRecord(JSON.stringify(raw.claimed ?? {}));
  const progress: Partial<Record<DailyMissionId, number>> = {};
  const claimed: Partial<Record<DailyMissionId, boolean>> = {};
  for (const mission of DAILY_MISSIONS) {
    progress[mission.id] = clampInt(parsedProgress[mission.id], 0, mission.target, 0);
    claimed[mission.id] = parsedClaimed[mission.id] === true;
  }
  return {
    token,
    attendanceClaimed: raw.attendanceClaimed === true,
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
  const raw = safeJsonRecord(safeGet(DAILY_MISSION_KEY));
  return Object.keys(raw).length ? normalizeState(raw, token) : blankState(token);
}

function saveState(state: DailyMissionState): void {
  safeSet(DAILY_MISSION_KEY, JSON.stringify(state));
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
    return {
      token: state.token,
      nextResetAt: nextUtcMidnight(now),
      attendanceClaimed: state.attendanceClaimed,
      attendanceReady: !state.attendanceClaimed,
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
    state.attendanceClaimed = true;
    saveState(state);
    const profile = SaveSystem.addReward(20, 50, 0);
    return { ok: true, board: this.getBoard(), rewardText: `출석 보상 +20XP/+50코인 · 현재 Lv.${profile.level}` };
  }

  static claimMissionReward(missionId: DailyMissionId): { ok: boolean; board: DailyMissionBoard; rewardText: string } {
    const state = loadState();
    const mission = DAILY_MISSIONS.find((entry) => entry.id === missionId);
    if (!mission) return { ok: false, board: this.getBoard(), rewardText: '알 수 없는 미션입니다.' };
    const progress = clampInt(state.progress[mission.id], 0, mission.target, 0);
    if (state.claimed[mission.id]) return { ok: false, board: this.getBoard(), rewardText: '이미 받은 미션 보상입니다.' };
    if (progress < mission.target) return { ok: false, board: this.getBoard(), rewardText: '아직 완료되지 않은 미션입니다.' };
    state.claimed[mission.id] = true;
    saveState(state);
    const profile = SaveSystem.addReward(mission.rewardXp, mission.rewardCoins, mission.rewardGems);
    const gemText = mission.rewardGems > 0 ? `/+${mission.rewardGems}보석` : '';
    return { ok: true, board: this.getBoard(), rewardText: `${mission.title} 보상 +${mission.rewardXp}XP/+${mission.rewardCoins}코인${gemText} · 현재 Lv.${profile.level}` };
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
