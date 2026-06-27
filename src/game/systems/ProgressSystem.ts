import { AuthSystem } from './AuthSystem';
import { MissionSystem } from './MissionSystem';
import { ModeData, PlayResultData } from '../types/ModeTypes';
import { ModeProgressRecord, ModeProgressSummary, StageProgressRecord } from '../types/ProgressTypes';

const STORAGE_PREFIX = 'cardville.progress.v2.';

function nowIso(): string {
  return new Date().toISOString();
}

function getStorageKey(modeId: string): string {
  const uid = AuthSystem.currentUser?.uid ?? 'guest';
  return `${STORAGE_PREFIX}${uid}.${modeId}`;
}

function createDefaultProgress(modeId: string): ModeProgressRecord {
  return {
    modeId,
    currentStage: 0,
    maxUnlockedStage: 0,
    clearedStages: 0,
    totalStars: 0,
    bestScore: 0,
    totalPlayCount: 0,
    stages: {},
    updatedAt: nowIso()
  };
}

function normalizeProgress(modeId: string, raw: Partial<ModeProgressRecord> | null | undefined): ModeProgressRecord {
  const base = createDefaultProgress(modeId);
  if (!raw || raw.modeId !== modeId) return base;
  const stages = raw.stages && typeof raw.stages === 'object' ? raw.stages : {};
  return {
    ...base,
    ...raw,
    modeId,
    currentStage: Math.max(0, Math.floor(raw.currentStage ?? 0)),
    maxUnlockedStage: Math.max(0, Math.floor(raw.maxUnlockedStage ?? 0)),
    clearedStages: Math.max(0, Math.floor(raw.clearedStages ?? 0)),
    totalStars: Math.max(0, Math.floor(raw.totalStars ?? 0)),
    bestScore: Math.max(0, Math.floor(raw.bestScore ?? 0)),
    totalPlayCount: Math.max(0, Math.floor(raw.totalPlayCount ?? 0)),
    stages
  };
}

export class ProgressSystem {
  static loadLocal(modeId: string): ModeProgressRecord {
    if (typeof window === 'undefined') return createDefaultProgress(modeId);
    try {
      const raw = window.localStorage.getItem(getStorageKey(modeId));
      return normalizeProgress(modeId, raw ? JSON.parse(raw) as ModeProgressRecord : null);
    } catch (error) {
      console.warn('[CardVille] Failed to read progress cache.', error);
      return createDefaultProgress(modeId);
    }
  }

  static saveLocal(progress: ModeProgressRecord): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getStorageKey(progress.modeId), JSON.stringify(progress));
  }

  static async load(modeId: string): Promise<ModeProgressRecord> {
    const local = this.loadLocal(modeId);
    const user = AuthSystem.currentUser;
    if (!user || AuthSystem.isLocalGuest()) return local;

    try {
      const { getModeProgress } = await import('../../firebase/firestore');
      const remote = await getModeProgress(user.uid, modeId);
      if (!remote) return local;
      const merged = this.mergeProgress(local, normalizeProgress(modeId, remote));
      this.saveLocal(merged);
      return merged;
    } catch (error) {
      console.warn('[CardVille] Remote progress load failed. Local progress will be used.', error);
      return local;
    }
  }

  static isStageUnlocked(progress: ModeProgressRecord, stageIndex: number): boolean {
    return stageIndex <= progress.maxUnlockedStage;
  }

  static getStage(progress: ModeProgressRecord, stageId: string): StageProgressRecord | undefined {
    return progress.stages[stageId];
  }

  static getStars(progress: ModeProgressRecord, stageId: string): number {
    return this.getStage(progress, stageId)?.stars ?? 0;
  }

  static calculateStars(score: number, combo: number, targetPairs: number): number {
    const cleanScore = Math.max(0, score);
    const baseTarget = Math.max(1, targetPairs) * 125;
    if (cleanScore >= baseTarget && combo >= Math.max(2, targetPairs - 1)) return 3;
    if (cleanScore >= Math.floor(baseTarget * 0.72)) return 2;
    return 1;
  }

  static async recordClear(mode: ModeData, result: PlayResultData): Promise<ModeProgressRecord> {
    const progress = this.loadLocal(mode.modeId);
    const stage = mode.stages[result.stageIndex];
    if (!stage) return progress;

    const previous = progress.stages[stage.stageId];
    const stars = this.calculateStars(result.score, result.combo, stage.goal.targetCount);
    const record: StageProgressRecord = {
      stageId: stage.stageId,
      stageIndex: result.stageIndex,
      cleared: true,
      stars: Math.max(previous?.stars ?? 0, stars),
      bestScore: Math.max(previous?.bestScore ?? 0, result.score),
      bestCombo: Math.max(previous?.bestCombo ?? 0, result.combo),
      playCount: (previous?.playCount ?? 0) + 1,
      updatedAt: nowIso()
    };

    progress.stages[stage.stageId] = record;
    progress.currentStage = result.stageIndex;
    progress.maxUnlockedStage = Math.min(mode.stages.length - 1, Math.max(progress.maxUnlockedStage, result.stageIndex + 1));
    progress.clearedStages = Object.values(progress.stages).filter((item) => item.cleared).length;
    progress.totalStars = Object.values(progress.stages).reduce((sum, item) => sum + Math.max(0, item.stars), 0);
    progress.bestScore = Math.max(progress.bestScore, result.score);
    progress.totalPlayCount += 1;
    progress.updatedAt = nowIso();

    this.saveLocal(progress);
    MissionSystem.record('clear_stage');

    const user = AuthSystem.currentUser;
    if (user && !AuthSystem.isLocalGuest()) {
      try {
        const { saveModeProgress } = await import('../../firebase/firestore');
        await saveModeProgress(user.uid, progress);
      } catch (error) {
        console.warn('[CardVille] Remote progress save failed.', error);
      }
    }

    return progress;
  }

  static getSummary(mode: ModeData, progress: ModeProgressRecord): ModeProgressSummary {
    const stageCount = mode.stages.length;
    const maxStars = stageCount * 3;
    const totalStars = mode.stages.reduce((sum, stage) => sum + this.getStars(progress, stage.stageId), 0);
    const clearedStages = mode.stages.filter((stage) => (progress.stages[stage.stageId]?.cleared ?? false)).length;
    return {
      modeId: mode.modeId,
      stageCount,
      clearedStages,
      totalStars,
      maxStars,
      completionRatio: stageCount > 0 ? clearedStages / stageCount : 0,
      bestScore: progress.bestScore
    };
  }

  private static mergeProgress(a: ModeProgressRecord, b: ModeProgressRecord): ModeProgressRecord {
    const stages: Record<string, StageProgressRecord> = { ...a.stages };
    Object.entries(b.stages).forEach(([stageId, remote]) => {
      const local = stages[stageId];
      if (!local) {
        stages[stageId] = remote;
        return;
      }
      stages[stageId] = {
        ...local,
        ...remote,
        stars: Math.max(local.stars, remote.stars),
        bestScore: Math.max(local.bestScore, remote.bestScore),
        bestCombo: Math.max(local.bestCombo, remote.bestCombo),
        playCount: Math.max(local.playCount, remote.playCount),
        updatedAt: local.updatedAt > remote.updatedAt ? local.updatedAt : remote.updatedAt
      };
    });

    const merged = normalizeProgress(a.modeId, {
      ...a,
      ...b,
      stages,
      maxUnlockedStage: Math.max(a.maxUnlockedStage, b.maxUnlockedStage),
      currentStage: Math.max(a.currentStage, b.currentStage),
      bestScore: Math.max(a.bestScore, b.bestScore),
      totalPlayCount: Math.max(a.totalPlayCount, b.totalPlayCount)
    });
    merged.clearedStages = Object.values(merged.stages).filter((item) => item.cleared).length;
    merged.totalStars = Object.values(merged.stages).reduce((sum, item) => sum + Math.max(0, item.stars), 0);
    return merged;
  }
}
