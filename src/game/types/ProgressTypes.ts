export interface StageProgressRecord {
  stageId: string;
  stageIndex: number;
  cleared: boolean;
  stars: number;
  bestScore: number;
  bestCombo: number;
  playCount: number;
  updatedAt: string;
}

export interface ModeProgressRecord {
  modeId: string;
  currentStage: number;
  maxUnlockedStage: number;
  clearedStages: number;
  totalStars: number;
  bestScore: number;
  totalPlayCount: number;
  stages: Record<string, StageProgressRecord>;
  updatedAt: string;
}

export interface ModeProgressSummary {
  modeId: string;
  stageCount: number;
  clearedStages: number;
  totalStars: number;
  maxStars: number;
  completionRatio: number;
  bestScore: number;
}
