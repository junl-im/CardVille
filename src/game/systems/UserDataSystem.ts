import Phaser from 'phaser';
import { User } from 'firebase/auth';
import {
  RewardApplyResult,
  UserGrowthSnapshot,
  UserProfileDoc,
  addUserReward,
  createLocalProfileFromUser,
  getLevelFromXp,
  getUserProfile
} from '../../firebase/firestore';
import { AuthSystem } from './AuthSystem';

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

const PROFILE_STORAGE_PREFIX = 'cardville.userProfile.v1.';
const XP_PER_LEVEL = 100;

function getStorageKey(uid: string): string {
  return `${PROFILE_STORAGE_PREFIX}${uid}`;
}

function safeParseProfile(uid: string): UserProfileDoc | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfileDoc;
    if (!parsed || parsed.uid !== uid) return null;
    return {
      ...parsed,
      level: Math.max(1, getLevelFromXp(parsed.xp ?? 0)),
      xp: Math.max(0, parsed.xp ?? 0),
      coins: Math.max(0, parsed.coins ?? 0),
      gems: Math.max(0, parsed.gems ?? 0)
    };
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

    try {
      const remoteProfile = await getUserProfile(user.uid);
      this.profile = remoteProfile ?? createLocalProfileFromUser(user);
      this.saveLocalProfile(this.profile);
      return this.profile;
    } catch (error) {
      console.warn('[CardVille] Firestore profile load failed. Using local profile fallback.', error);
      const cached = safeParseProfile(user.uid);
      this.profile = cached ?? createLocalProfileFromUser(user);
      this.saveLocalProfile(this.profile);
      return this.profile;
    }
  }

  static async applyReward(xp: number, coins: number, gems = 0): Promise<GrowthApplyResult> {
    const user = AuthSystem.currentUser ?? await AuthSystem.restore();
    if (!user) throw new Error('No signed-in user.');

    try {
      const result = await addUserReward(user.uid, xp, coins, gems);
      this.profile = {
        ...(this.profile ?? createLocalProfileFromUser(user)),
        level: result.after.level,
        xp: result.after.xp,
        coins: result.after.coins,
        gems: result.after.gems
      };
      this.saveLocalProfile(this.profile);
      return result;
    } catch (error) {
      console.warn('[CardVille] Firestore reward save failed. Applying local fallback.', error);
      const profile = this.profile ?? safeParseProfile(user.uid) ?? createLocalProfileFromUser(user);
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
        level: getLevelFromXp(before.xp + addedXp)
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
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(getStorageKey(profile.uid), JSON.stringify(profile));
    } catch (error) {
      console.warn('[CardVille] Failed to cache user profile.', error);
    }
  }

  static createLocalProfile(user: User): UserProfileDoc {
    return createLocalProfileFromUser(user);
  }
}
