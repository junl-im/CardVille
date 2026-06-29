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

export type ProgressModeId = 'word' | 'math' | 'memory' | 'daily' | 'english';

export type DailyShopStatus = {
  token: string;
  claimed: boolean;
  canClaim: boolean;
  nextResetAt: number;
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
const PROGRESS_KEY = 'cardville.progress.v131';
const DAILY_SHOP_PACK_KEY = 'cardville.shop.dailyPack.v134';
const SHOP_LAST_OFFER_KEY = 'cardville.shop.lastOffer.v136';
const LEGACY_PROGRESS_KEYS = ['cardville.progress.v111', 'cardville.progress.v110'];
const PROVIDERS = new Set(['guest', 'google', 'email']);
const PROGRESS_MODES = new Set(['word', 'math', 'memory', 'daily', 'english']);

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

function cleanMode(modeId: string | undefined): ProgressModeId {
  const mode = String(modeId ?? 'word');
  return (PROGRESS_MODES.has(mode) ? mode : 'word') as ProgressModeId;
}

function progressKey(modeId: string | undefined, stage: number): string {
  const mode = cleanMode(modeId);
  const cleanStage = clampInt(stage, 1, 999, 1);
  return `${mode}:${cleanStage}`;
}

function dailyToken(now: number): string {
  const d = new Date(now);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nextUtcMidnight(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
}

function calcStars(stepsLeft: number, failed: boolean, starsOverride?: number): number {
  if (typeof starsOverride === 'number') return clampInt(starsOverride, 0, 3, failed ? 0 : 1);
  if (failed) return 0;
  const safeStepsLeft = clampInt(stepsLeft, 0, 999, 0);
  return safeStepsLeft >= 12 ? 3 : safeStepsLeft >= 6 ? 2 : 1;
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

  static spendCoins(amount: number): { ok: boolean; profile: PlayerProfile } {
    const profile = this.loadProfile();
    const cost = clampInt(amount, 0, 99_999_999, 0);
    if (profile.coins < cost) return { ok: false, profile };
    profile.coins = clampInt(profile.coins - cost, 0, 99_999_999, profile.coins);
    this.saveProfile(profile);
    return { ok: true, profile };
  }

  static spendGems(amount: number): { ok: boolean; profile: PlayerProfile } {
    const profile = this.loadProfile();
    const cost = clampInt(amount, 0, 999_999, 0);
    if (profile.gems < cost) return { ok: false, profile };
    profile.gems = clampInt(profile.gems - cost, 0, 999_999, profile.gems);
    this.saveProfile(profile);
    return { ok: true, profile };
  }

  static getDailyShopStatus(now = Date.now()): DailyShopStatus {
    const token = dailyToken(now);
    const claimedToken = safeId(safeGet(DAILY_SHOP_PACK_KEY), '');
    const claimed = claimedToken === token;
    return { token, claimed, canClaim: !claimed, nextResetAt: nextUtcMidnight(now) };
  }

  static claimDailyShopPack(now = Date.now()): DailyShopStatus {
    const status = this.getDailyShopStatus(now);
    if (status.canClaim) safeSet(DAILY_SHOP_PACK_KEY, status.token);
    return this.getDailyShopStatus(now);
  }

  static recordShopOffer(offerId: string): void {
    safeSet(SHOP_LAST_OFFER_KEY, safeId(offerId, 'unknown_offer'));
  }

  static getLastShopOffer(): string {
    return safeId(safeGet(SHOP_LAST_OFFER_KEY), 'none');
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
      const legacyWordMatch = /^word:\d{1,3}$/.test(key);
      const modeMatch = /^(word|math|memory|daily|english):\d{1,3}$/.test(key);
      if (!legacyWordMatch && !modeMatch) continue;
      const record = normalizeRecord(value as Partial<StageRecord>);
      if (record) normalized[key] = record;
    }
    if (!safeGet(PROGRESS_KEY) && Object.keys(normalized).length) safeSet(PROGRESS_KEY, JSON.stringify(normalized));
    return normalized;
  }

  static getModeStageRecord(modeId: string | undefined, stage: number): StageRecord | null {
    return this.loadProgress()[progressKey(modeId, stage)] ?? null;
  }

  static getStageRecord(stage: number): StageRecord | null {
    return this.getModeStageRecord('word', stage);
  }

  static isModeStageUnlocked(modeId: string | undefined, stage: number): boolean {
    const mode = cleanMode(modeId);
    if (stage <= 1 || mode === 'daily') return true;
    return this.getModeStageRecord(mode, stage - 1)?.cleared === true;
  }

  static isStageUnlocked(stage: number): boolean {
    return this.isModeStageUnlocked('word', stage);
  }

  static nextPlayableModeStage(modeId: string | undefined, maxStage: number): number {
    const safeMax = clampInt(maxStage, 1, 999, 1);
    for (let stage = 1; stage <= safeMax; stage += 1) {
      const record = this.getModeStageRecord(modeId, stage);
      if (!record?.cleared) return stage;
    }
    return safeMax;
  }

  static nextPlayableStage(maxStage: number): number {
    return this.nextPlayableModeStage('word', maxStage);
  }

  static saveModeStageResult(modeId: string | undefined, stage: number, score: number, bestCombo: number, stepsLeft: number, failed = false, starsOverride?: number): StageRecord {
    const progress = this.loadProgress();
    const key = progressKey(modeId, stage);
    const previous = progress[key];
    const safeStepsLeft = clampInt(stepsLeft, 0, 999, 0);
    const stars = calcStars(safeStepsLeft, failed, starsOverride);
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

  static saveStageResult(stage: number, score: number, bestCombo: number, stepsLeft: number, failed = false): StageRecord {
    return this.saveModeStageResult('word', stage, score, bestCombo, stepsLeft, failed);
  }

  static clear(): void {
    safeRemove(PROFILE_KEY);
    safeRemove(COLLECTION_KEY);
    safeRemove(PROGRESS_KEY);
    safeRemove(DAILY_SHOP_PACK_KEY);
    safeRemove(SHOP_LAST_OFFER_KEY);
    for (const key of LEGACY_PROGRESS_KEYS) safeRemove(key);
  }
}
