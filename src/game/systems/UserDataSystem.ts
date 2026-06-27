import Phaser from 'phaser';
import type { User } from 'firebase/auth';
import type { RewardApplyResult, UserGrowthSnapshot, UserProfileDoc } from '../../firebase/firestore';
import { AuthSystem } from './AuthSystem';
import { safeGetStorage, safeSetStorage } from '../../platform/browserEnv';

export interface LevelProgressInfo {
  currentLevelXp: number;
  requiredXp: number;
  ratio: number;
  nextLevel: number;
}

export interface LocalRewardApplyResult extends Omit<RewardApplyResult, 'source'> {
  source: 'local';
}

export type GrowthApplyResult = RewardApplyResult | LocalRewardApplyResult;

const PROFILE_STORAGE_PREFIX = 'cardville.userProfile.v2.';
const LEGACY_PROFILE_STORAGE_PREFIX = 'cardville.userProfile.v1.';
const XP_PER_LEVEL = 100;

function getStorageKey(uid: string): string {
  return `${PROFILE_STORAGE_PREFIX}${uid}`;
}

function getLegacyStorageKey(uid: string): string {
  return `${LEGACY_PROFILE_STORAGE_PREFIX}${uid}`;
}

function getLevelFromXpLocal(xp: number): number {
  return Math.max(1, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1);
}

function getProviderIds(user: User): string[] {
  if (AuthSystem.isLocalGuest()) return ['local-guest'];
  if (user.isAnonymous || user.providerData.length === 0) return ['anonymous'];
  return user.providerData.map((provider) => provider.providerId);
}

function createLocalProfileFromUserLocal(user: User): UserProfileDoc {
  const providerIds = getProviderIds(user);
  const displayName = user.displayName ?? (AuthSystem.isLocalGuest() ? '로컬 여행자' : user.isAnonymous ? '여행자' : user.email?.split('@')[0] ?? '카드마을 주민');

  return {
    uid: user.uid,
    nickname: displayName,
    displayName,
    provider: providerIds[0],
    providerIds,
    isAnonymous: user.isAnonymous,
    emailVerified: user.emailVerified,
    level: 1,
    xp: 0,
    coins: 0,
    gems: 0,
    selectedWorld: 'magic_library',
    selectedCardBack: 'classic_orange'
  };
}

function normalizeCachedProfile(uid: string, parsed: UserProfileDoc): UserProfileDoc {
  return {
    ...parsed,
    uid,
    level: Math.max(1, getLevelFromXpLocal(parsed.xp ?? 0)),
    xp: Math.max(0, parsed.xp ?? 0),
    coins: Math.max(0, parsed.coins ?? 0),
    gems: Math.max(0, parsed.gems ?? 0),
    selectedWorld: parsed.selectedWorld || 'magic_library',
    selectedCardBack: parsed.selectedCardBack || 'classic_orange'
  };
}

function safeParseProfile(uid: string): UserProfileDoc | null {
  const raw = safeGetStorage(getStorageKey(uid)) ?? safeGetStorage(getLegacyStorageKey(uid));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as UserProfileDoc;
    if (!parsed || parsed.uid !== uid) return null;
    return normalizeCachedProfile(uid, parsed);
  } catch (error) {
    console.warn('[CardVille] Failed to parse cached user profile.', error);
    return null;
  }
}

export class UserDataSystem {
  private static profile: UserProfileDoc | null = null;

  static getCurrentProfile(): UserProfileDoc | null {
    return this.profile;
  }

  static async loadCurrentProfile(): Promise<UserProfileDoc | null> {
    const user = AuthSystem.currentUser ?? await AuthSystem.restore();
    if (!user) {
      this.profile = null;
      return null;
    }

    if (AuthSystem.isLocalGuest()) {
      this.profile = safeParseProfile(user.uid) ?? createLocalProfileFromUserLocal(user);
      this.saveLocalProfile(this.profile);
      return this.profile;
    }

    try {
      const storeApi = await import('../../firebase/firestore');
      const remoteProfile = await storeApi.getUserProfile(user.uid);
      this.profile = remoteProfile ?? createLocalProfileFromUserLocal(user);
      this.saveLocalProfile(this.profile);
      return this.profile;
    } catch (error) {
      console.warn('[CardVille] Firestore profile load failed. Using local profile fallback.', error);
      const cached = safeParseProfile(user.uid);
      this.profile = cached ?? createLocalProfileFromUserLocal(user);
      this.saveLocalProfile(this.profile);
      return this.profile;
    }
  }

  static async applyReward(xp: number, coins: number, gems = 0): Promise<GrowthApplyResult> {
    const user = AuthSystem.currentUser ?? await AuthSystem.restore();
    if (!user) throw new Error('No signed-in user.');

    if (!AuthSystem.isLocalGuest()) {
      try {
        const storeApi = await import('../../firebase/firestore');
        const result = await storeApi.addUserReward(user.uid, xp, coins, gems);
        this.profile = {
          ...(this.profile ?? createLocalProfileFromUserLocal(user)),
          level: result.after.level,
          xp: result.after.xp,
          coins: result.after.coins,
          gems: result.after.gems
        };
        this.saveLocalProfile(this.profile);
        return result;
      } catch (error) {
        console.warn('[CardVille] Firestore reward save failed. Applying local fallback.', error);
      }
    }

    return this.applyLocalReward(user, xp, coins, gems);
  }

  private static applyLocalReward(user: User, xp: number, coins: number, gems = 0): LocalRewardApplyResult {
    const profile = this.profile ?? safeParseProfile(user.uid) ?? createLocalProfileFromUserLocal(user);
    const addedXp = Math.max(0, Math.floor(xp));
    const addedCoins = Math.max(0, Math.floor(coins));
    const addedGems = Math.max(0, Math.floor(gems));
    const before: UserGrowthSnapshot = {
      level: profile.level,
      xp: profile.xp,
      coins: profile.coins,
      gems: profile.gems
    };
    const after: UserGrowthSnapshot = {
      xp: before.xp + addedXp,
      coins: before.coins + addedCoins,
      gems: before.gems + addedGems,
      level: getLevelFromXpLocal(before.xp + addedXp)
    };

    this.profile = {
      ...profile,
      ...after
    };
    this.saveLocalProfile(this.profile);

    return {
      source: 'local',
      addedXp,
      addedCoins,
      addedGems,
      before,
      after,
      levelUp: after.level > before.level
    };
  }

  static getLevelProgress(profile: UserProfileDoc): LevelProgressInfo {
    const baseXp = (profile.level - 1) * XP_PER_LEVEL;
    const currentLevelXp = Phaser.Math.Clamp(profile.xp - baseXp, 0, XP_PER_LEVEL);
    return {
      currentLevelXp,
      requiredXp: XP_PER_LEVEL,
      ratio: Phaser.Math.Clamp(currentLevelXp / XP_PER_LEVEL, 0, 1),
      nextLevel: profile.level + 1
    };
  }

  static getLoginStateLabel(profile: UserProfileDoc): string {
    if (AuthSystem.isLocalGuest() || profile.provider === 'local-guest') return '로컬 게스트';
    if (profile.isAnonymous) return 'Firebase 게스트';
    if (profile.providerIds.includes('google.com')) return 'Google 계정';
    if (profile.providerIds.includes('password')) return '이메일 계정';
    return 'Firebase 계정';
  }

  static saveLocalProfile(profile: UserProfileDoc): void {
    safeSetStorage(getStorageKey(profile.uid), JSON.stringify(profile));
  }

  static createLocalProfile(user: User): UserProfileDoc {
    return createLocalProfileFromUserLocal(user);
  }
}
