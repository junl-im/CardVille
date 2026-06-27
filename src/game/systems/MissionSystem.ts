import { UserDataSystem } from './UserDataSystem';

export type MissionType = 'clear_stage' | 'open_pack' | 'collect_card';

export interface DailyMissionRecord {
  missionId: string;
  title: string;
  description: string;
  type: MissionType;
  target: number;
  progress: number;
  rewardCoins: number;
  rewardXp: number;
  claimed: boolean;
}

export interface AttendanceRecord {
  date: string;
  streak: number;
  claimed: boolean;
}

export interface DailyMissionState {
  date: string;
  missions: DailyMissionRecord[];
  attendance: AttendanceRecord;
}

const STORAGE_KEY = 'cardville.dailyMissions.v1';

function getTodayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = `${now.getMonth() + 1}`.padStart(2, '0');
  const dd = `${now.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function createDefaultState(): DailyMissionState {
  const today = getTodayKey();
  const previous = MissionSystem.readRawState();
  const previousStreak = previous?.attendance.streak ?? 0;
  const isNewDayAfterPrevious = previous?.date && previous.date !== today;

  return {
    date: today,
    attendance: {
      date: today,
      streak: isNewDayAfterPrevious ? previousStreak + 1 : Math.max(1, previousStreak || 1),
      claimed: false
    },
    missions: [
      {
        missionId: 'daily_clear_1',
        title: '오늘의 첫 장',
        description: '아무 스테이지나 1회 클리어',
        type: 'clear_stage',
        target: 1,
        progress: 0,
        rewardCoins: 40,
        rewardXp: 10,
        claimed: false
      },
      {
        missionId: 'daily_pack_1',
        title: '마법 카드팩',
        description: '카드팩 1회 오픈',
        type: 'open_pack',
        target: 1,
        progress: 0,
        rewardCoins: 60,
        rewardXp: 15,
        claimed: false
      },
      {
        missionId: 'daily_collect_3',
        title: '서고 수집가',
        description: '카드 3장 획득',
        type: 'collect_card',
        target: 3,
        progress: 0,
        rewardCoins: 80,
        rewardXp: 20,
        claimed: false
      }
    ]
  };
}

export class MissionSystem {
  static readRawState(): DailyMissionState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as DailyMissionState;
      if (!parsed || !Array.isArray(parsed.missions)) return null;
      return parsed;
    } catch (error) {
      console.warn('[CardVille] Failed to parse daily missions.', error);
      return null;
    }
  }

  static getState(): DailyMissionState {
    const today = getTodayKey();
    const existing = this.readRawState();
    if (existing?.date === today) return existing;
    const state = createDefaultState();
    this.saveState(state);
    return state;
  }

  static saveState(state: DailyMissionState): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  static record(type: MissionType, amount = 1): void {
    const state = this.getState();
    let changed = false;
    state.missions = state.missions.map((mission) => {
      if (mission.type !== type || mission.claimed) return mission;
      changed = true;
      return { ...mission, progress: Math.min(mission.target, mission.progress + Math.max(1, amount)) };
    });
    if (changed) this.saveState(state);
  }

  static async claimMission(missionId: string): Promise<{ ok: boolean; message: string }> {
    const state = this.getState();
    const index = state.missions.findIndex((mission) => mission.missionId === missionId);
    if (index < 0) return { ok: false, message: '미션을 찾을 수 없어요.' };

    const mission = state.missions[index];
    if (mission.claimed) return { ok: false, message: '이미 받은 보상이에요.' };
    if (mission.progress < mission.target) return { ok: false, message: '아직 미션이 완료되지 않았어요.' };

    await UserDataSystem.applyReward(mission.rewardXp, mission.rewardCoins);
    state.missions[index] = { ...mission, claimed: true };
    this.saveState(state);
    return { ok: true, message: `${mission.title} 보상 획득!` };
  }

  static async claimAttendance(): Promise<{ ok: boolean; message: string }> {
    const state = this.getState();
    if (state.attendance.claimed) return { ok: false, message: '오늘 출석 보상은 이미 받았어요.' };

    const bonusCoins = 30 + Math.min(70, state.attendance.streak * 5);
    const bonusXp = 8 + Math.min(22, state.attendance.streak * 2);
    await UserDataSystem.applyReward(bonusXp, bonusCoins);
    state.attendance.claimed = true;
    this.saveState(state);
    return { ok: true, message: `출석 ${state.attendance.streak}일차 보상 획득!` };
  }
}
