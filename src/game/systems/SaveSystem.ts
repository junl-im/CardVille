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
};

const PROFILE_KEY = 'cardville.profile.v105';
const COLLECTION_KEY = 'cardville.collection.v105';
const PROGRESS_KEY = 'cardville.progress.v110';

function defaultProfile(): PlayerProfile {
  const uid = localStorage.getItem('cardville.guestUid') ?? `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('cardville.guestUid', uid);
  return { uid, provider: 'guest', nickname: '게스트', level: 1, xp: 0, coins: 300, gems: 10 };
}

export class SaveSystem {
  static loadProfile(): PlayerProfile {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? { ...defaultProfile(), ...JSON.parse(raw) } : defaultProfile();
    } catch {
      return defaultProfile();
    }
  }

  static saveProfile(profile: PlayerProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
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
    profile.xp += xp;
    profile.coins += coins;
    profile.gems += gems;
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
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    return collection[cardId];
  }

  static loadCollection(): Record<string, number> {
    try {
      return JSON.parse(localStorage.getItem(COLLECTION_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  static loadProgress(): Record<string, StageRecord> {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  static getStageRecord(stage: number): StageRecord | null {
    return this.loadProgress()[`word:${stage}`] ?? null;
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
      bestStepsLeft: Math.max(previous?.bestStepsLeft ?? 0, stepsLeft)
    };
    progress[key] = next;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return next;
  }

  static clear(): void {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(COLLECTION_KEY);
    localStorage.removeItem(PROGRESS_KEY);
  }
}
