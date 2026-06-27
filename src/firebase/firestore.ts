import { DocumentData, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebaseApp';
import { OwnedCardRecord } from '../game/types/CollectionTypes';
import { ModeProgressRecord } from '../game/types/ProgressTypes';

export interface UserProfileDoc {
  uid: string;
  nickname: string;
  displayName: string;
  provider: string;
  providerIds: string[];
  isAnonymous: boolean;
  emailVerified: boolean;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  selectedWorld: string;
  selectedCardBack: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

export interface UserGrowthSnapshot {
  level: number;
  xp: number;
  coins: number;
  gems: number;
}

export interface RewardApplyResult {
  source: 'firestore';
  addedXp: number;
  addedCoins: number;
  addedGems: number;
  before: UserGrowthSnapshot;
  after: UserGrowthSnapshot;
  levelUp: boolean;
}

function getProviderIds(user: User): string[] {
  if (user.isAnonymous || user.providerData.length === 0) return ['anonymous'];
  return user.providerData.map((provider) => provider.providerId);
}

function getProfilePatch(user: User): DocumentData {
  const providerIds = getProviderIds(user);
  const displayName = user.displayName ?? (user.isAnonymous ? '여행자' : user.email?.split('@')[0] ?? '카드마을 주민');

  return {
    nickname: displayName,
    displayName,
    provider: providerIds[0],
    providerIds,
    isAnonymous: user.isAnonymous,
    emailVerified: user.emailVerified,
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : fallback;
}

export function getLevelFromXp(xp: number): number {
  return Math.max(1, Math.floor(Math.max(0, xp) / 100) + 1);
}

export function normalizeUserProfile(uid: string, data: DocumentData): UserProfileDoc {
  const xp = toNumber(data.xp, 0);
  const level = Math.max(toNumber(data.level, getLevelFromXp(xp)), getLevelFromXp(xp));

  return {
    uid: typeof data.uid === 'string' ? data.uid : uid,
    nickname: typeof data.nickname === 'string' ? data.nickname : '카드마을 주민',
    displayName: typeof data.displayName === 'string' ? data.displayName : '카드마을 주민',
    provider: typeof data.provider === 'string' ? data.provider : 'anonymous',
    providerIds: toStringArray(data.providerIds, ['anonymous']),
    isAnonymous: typeof data.isAnonymous === 'boolean' ? data.isAnonymous : true,
    emailVerified: typeof data.emailVerified === 'boolean' ? data.emailVerified : false,
    level,
    xp,
    coins: toNumber(data.coins, 0),
    gems: toNumber(data.gems, 0),
    selectedWorld: typeof data.selectedWorld === 'string' ? data.selectedWorld : 'magic_library',
    selectedCardBack: typeof data.selectedCardBack === 'string' ? data.selectedCardBack : 'classic_orange',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastLoginAt: data.lastLoginAt
  };
}

export function createLocalProfileFromUser(user: User): UserProfileDoc {
  const providerIds = getProviderIds(user);
  const displayName = user.displayName ?? (user.isAnonymous ? '여행자' : user.email?.split('@')[0] ?? '카드마을 주민');

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

export async function ensureUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      ...getProfilePatch(user),
      createdAt: serverTimestamp(),
      level: 1,
      xp: 0,
      coins: 0,
      gems: 0,
      selectedWorld: 'magic_library',
      selectedCardBack: 'classic_orange'
    });
    return;
  }

  await updateDoc(userRef, getProfilePatch(user));
}

export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return normalizeUserProfile(uid, snap.data());
}

export async function getModeProgress(uid: string, modeId: string): Promise<ModeProgressRecord | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'progress', modeId));
  if (!snap.exists()) return null;
  return snap.data() as ModeProgressRecord;
}

export async function saveModeProgress(uid: string, progress: ModeProgressRecord): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'progress', progress.modeId),
    {
      modeId: progress.modeId,
      currentStage: progress.currentStage,
      maxUnlockedStage: progress.maxUnlockedStage,
      clearedStages: progress.clearedStages,
      totalStars: progress.totalStars,
      bestScore: progress.bestScore,
      totalPlayCount: progress.totalPlayCount,
      stages: progress.stages,
      updatedAt: serverTimestamp(),
      updatedAtClient: progress.updatedAt
    },
    { merge: true }
  );
}

export async function addUserReward(uid: string, xp: number, coins: number, gems = 0): Promise<RewardApplyResult> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error('User profile does not exist.');

  const profile = normalizeUserProfile(uid, snap.data());
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

  await updateDoc(userRef, {
    xp: after.xp,
    coins: after.coins,
    gems: after.gems,
    level: after.level,
    updatedAt: serverTimestamp()
  });

  return {
    source: 'firestore',
    addedXp,
    addedCoins,
    addedGems,
    before,
    after,
    levelUp: after.level > before.level
  };
}

export async function saveCollectedCard(uid: string, card: OwnedCardRecord): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'collections', card.cardId),
    {
      cardId: card.cardId,
      name: card.name,
      rarity: card.rarity,
      imageKey: card.imageKey,
      setId: card.setId,
      count: card.count,
      firstObtainedAt: card.firstObtainedAt,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
