export type PlayerProfile = {
  uid: string;
  provider: 'guest' | 'google' | 'email';
  nickname: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
};

export type StageRecord = {
  cleared: boolean;
  stars: number;
  bestScore: number;
  bestCombo: number;
  bestStepsLeft: number;
  plays: number;
};

const PROFILE_KEY = 'cardville.profile.v105';
const COLLECTION_KEY = 'cardville.collection.v105';
const PROGRESS_KEY = 'cardville.progress.v111';
const LEGACY_PROGRESS_KEYS = ['cardville.progress.v110'];

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage may be unavailable in private browsers */ }
}

function safeRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

function defaultProfile(): PlayerProfile {
  const uid = safeGet('cardville.guestUid') ?? `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  safeSet('cardville.guestUid', uid);
  return { uid, provider: 'guest', nickname: '게스트', level: 1, xp: 0, coins: 300, gems: 10 };
}

function normalizeRecord(record: Partial<StageRecord> | undefined): StageRecord | null {
  if (!record) return null;
  return {
    cleared: record.cleared === true,
    stars: Math.max(0, Math.min(3, Number(record.stars ?? 0))),
    bestScore: Number(record.bestScore ?? 0),
    bestCombo: Number(record.bestCombo ?? 0),
    bestStepsLeft: Number(record.bestStepsLeft ?? 0),
    plays: Number(record.plays ?? 0)
  };
}

export class SaveSystem {
  static loadProfile(): PlayerProfile {
    try {
      const raw = safeGet(PROFILE_KEY);
      return raw ? { ...defaultProfile(), ...JSON.parse(raw) } : defaultProfile();
    } catch {
      return defaultProfile();
    }
  }

  static saveProfile(profile: PlayerProfile): void {
    safeSet(PROFILE_KEY, JSON.stringify(profile));
  }

  static startGuest(): PlayerProfile {
    const profile = this.loadProfile();
    profile.provider = 'guest';
    profile.nickname = '게스트';
    this.saveProfile(profile);
    return profile;
  }

  static addReward(xp: number, coins: number, gems = 0): PlayerProfile {
    const profile = this.loadProfile();
    profile.xp += Math.max(0, Math.round(xp));
    profile.coins += Math.max(0, Math.round(coins));
    profile.gems += Math.max(0, Math.round(gems));
    while (profile.xp >= profile.level * 100) {
      profile.xp -= profile.level * 100;
      profile.level += 1;
      profile.gems += 1;
    }
    this.saveProfile(profile);
    return profile;
  }

  static addCard(cardId: string): number {
    const collection = this.loadCollection();
    collection[cardId] = (collection[cardId] ?? 0) + 1;
    safeSet(COLLECTION_KEY, JSON.stringify(collection));
    return collection[cardId];
  }

  static loadCollection(): Record<string, number> {
    try {
      return JSON.parse(safeGet(COLLECTION_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  static loadProgress(): Record<string, StageRecord> {
    try {
      const raw = safeGet(PROGRESS_KEY) ?? LEGACY_PROGRESS_KEYS.map((key) => safeGet(key)).find(Boolean) ?? '{}';
      const parsed = JSON.parse(raw) as Record<string, Partial<StageRecord>>;
      const normalized: Record<string, StageRecord> = {};
      for (const [key, value] of Object.entries(parsed)) {
        const record = normalizeRecord(value);
        if (record) normalized[key] = record;
      }
      if (!safeGet(PROGRESS_KEY) && Object.keys(normalized).length) safeSet(PROGRESS_KEY, JSON.stringify(normalized));
      return normalized;
    } catch {
      return {};
    }
  }

  static getStageRecord(stage: number): StageRecord | null {
    return this.loadProgress()[`word:${stage}`] ?? null;
  }

  static isStageUnlocked(stage: number): boolean {
    if (stage <= 1) return true;
    return this.getStageRecord(stage - 1)?.cleared === true;
  }

  static nextPlayableStage(maxStage: number): number {
    for (let stage = 1; stage <= maxStage; stage += 1) {
      const record = this.getStageRecord(stage);
      if (!record?.cleared) return stage;
    }
    return maxStage;
  }

  static saveStageResult(stage: number, score: number, bestCombo: number, stepsLeft: number, failed = false): StageRecord {
    const progress = this.loadProgress();
    const key = `word:${stage}`;
    const previous = progress[key];
    const stars = failed ? 0 : stepsLeft >= 12 ? 3 : stepsLeft >= 6 ? 2 : 1;
    const next: StageRecord = {
      cleared: !failed || previous?.cleared === true,
      stars: Math.max(previous?.stars ?? 0, stars),
      bestScore: Math.max(previous?.bestScore ?? 0, score),
      bestCombo: Math.max(previous?.bestCombo ?? 0, bestCombo),
      bestStepsLeft: Math.max(previous?.bestStepsLeft ?? 0, stepsLeft),
      plays: (previous?.plays ?? 0) + 1
    };
    progress[key] = next;
    safeSet(PROGRESS_KEY, JSON.stringify(progress));
    return next;
  }

  static clear(): void {
    safeRemove(PROFILE_KEY);
    safeRemove(COLLECTION_KEY);
    safeRemove(PROGRESS_KEY);
    for (const key of LEGACY_PROGRESS_KEYS) safeRemove(key);
  }
}
