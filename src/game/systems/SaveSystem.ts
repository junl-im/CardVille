import { clampInt, safeId, safeJsonRecord, sanitizeText } from './SecuritySystem';

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
const PROVIDERS = new Set(['guest', 'google', 'email']);

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
  const storedUid = safeId(safeGet('cardville.guestUid'), '');
  const uid = storedUid || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  safeSet('cardville.guestUid', uid);
  return { uid, provider: 'guest', nickname: '게스트', level: 1, xp: 0, coins: 300, gems: 10 };
}

function normalizeProfile(raw: Record<string, unknown>): PlayerProfile {
  const base = defaultProfile();
  const provider = PROVIDERS.has(String(raw.provider)) ? raw.provider as PlayerProfile['provider'] : base.provider;
  return {
    uid: safeId(raw.uid, base.uid),
    provider,
    nickname: sanitizeText(raw.nickname, provider === 'guest' ? '게스트' : '카드마을 주민', 24),
    level: clampInt(raw.level, 1, 999, base.level),
    xp: clampInt(raw.xp, 0, 99_999_999, base.xp),
    coins: clampInt(raw.coins, 0, 99_999_999, base.coins),
    gems: clampInt(raw.gems, 0, 999_999, base.gems)
  };
}

function normalizeRecord(record: Partial<StageRecord> | undefined): StageRecord | null {
  if (!record || typeof record !== 'object') return null;
  return {
    cleared: record.cleared === true,
    stars: clampInt(record.stars, 0, 3, 0),
    bestScore: clampInt(record.bestScore, 0, 99_999_999, 0),
    bestCombo: clampInt(record.bestCombo, 0, 999, 0),
    bestStepsLeft: clampInt(record.bestStepsLeft, 0, 999, 0),
    plays: clampInt(record.plays, 0, 99_999, 0)
  };
}

export class SaveSystem {
  static loadProfile(): PlayerProfile {
    const raw = safeJsonRecord(safeGet(PROFILE_KEY));
    return Object.keys(raw).length ? normalizeProfile(raw) : defaultProfile();
  }

  static saveProfile(profile: PlayerProfile): void {
    safeSet(PROFILE_KEY, JSON.stringify(normalizeProfile(profile as unknown as Record<string, unknown>)));
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
    profile.xp = clampInt(profile.xp + Math.max(0, Math.round(xp)), 0, 99_999_999, profile.xp);
    profile.coins = clampInt(profile.coins + Math.max(0, Math.round(coins)), 0, 99_999_999, profile.coins);
    profile.gems = clampInt(profile.gems + Math.max(0, Math.round(gems)), 0, 999_999, profile.gems);
    while (profile.xp >= profile.level * 100 && profile.level < 999) {
      profile.xp -= profile.level * 100;
      profile.level += 1;
      profile.gems = clampInt(profile.gems + 1, 0, 999_999, profile.gems);
    }
    this.saveProfile(profile);
    return profile;
  }

  static addCard(cardId: string): number {
    const cleanId = safeId(cardId, 'unknown_card');
    const collection = this.loadCollection();
    collection[cleanId] = clampInt((collection[cleanId] ?? 0) + 1, 0, 9999, 1);
    safeSet(COLLECTION_KEY, JSON.stringify(collection));
    return collection[cleanId];
  }

  static loadCollection(): Record<string, number> {
    const parsed = safeJsonRecord(safeGet(COLLECTION_KEY));
    const collection: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const cleanKey = safeId(key, '');
      if (!cleanKey) continue;
      collection[cleanKey] = clampInt(value, 0, 9999, 0);
    }
    return collection;
  }

  static loadProgress(): Record<string, StageRecord> {
    const raw = safeGet(PROGRESS_KEY) ?? LEGACY_PROGRESS_KEYS.map((key) => safeGet(key)).find(Boolean) ?? '{}';
    const parsed = safeJsonRecord(raw);
    const normalized: Record<string, StageRecord> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!/^word:\d{1,3}$/.test(key)) continue;
      const record = normalizeRecord(value as Partial<StageRecord>);
      if (record) normalized[key] = record;
    }
    if (!safeGet(PROGRESS_KEY) && Object.keys(normalized).length) safeSet(PROGRESS_KEY, JSON.stringify(normalized));
    return normalized;
  }

  static getStageRecord(stage: number): StageRecord | null {
    const cleanStage = clampInt(stage, 1, 999, 1);
    return this.loadProgress()[`word:${cleanStage}`] ?? null;
  }

  static isStageUnlocked(stage: number): boolean {
    if (stage <= 1) return true;
    return this.getStageRecord(stage - 1)?.cleared === true;
  }

  static nextPlayableStage(maxStage: number): number {
    const safeMax = clampInt(maxStage, 1, 999, 1);
    for (let stage = 1; stage <= safeMax; stage += 1) {
      const record = this.getStageRecord(stage);
      if (!record?.cleared) return stage;
    }
    return safeMax;
  }

  static saveStageResult(stage: number, score: number, bestCombo: number, stepsLeft: number, failed = false): StageRecord {
    const progress = this.loadProgress();
    const cleanStage = clampInt(stage, 1, 999, 1);
    const key = `word:${cleanStage}`;
    const previous = progress[key];
    const safeStepsLeft = clampInt(stepsLeft, 0, 999, 0);
    const stars = failed ? 0 : safeStepsLeft >= 12 ? 3 : safeStepsLeft >= 6 ? 2 : 1;
    const next: StageRecord = {
      cleared: !failed || previous?.cleared === true,
      stars: Math.max(previous?.stars ?? 0, stars),
      bestScore: Math.max(previous?.bestScore ?? 0, clampInt(score, 0, 99_999_999, 0)),
      bestCombo: Math.max(previous?.bestCombo ?? 0, clampInt(bestCombo, 0, 999, 0)),
      bestStepsLeft: Math.max(previous?.bestStepsLeft ?? 0, safeStepsLeft),
      plays: clampInt((previous?.plays ?? 0) + 1, 0, 99_999, 1)
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
