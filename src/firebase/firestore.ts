import { DocumentData, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebaseApp';
import { OwnedCardRecord } from '../game/types/CollectionTypes';

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

export async function saveModeProgress(uid: string, modeId: string, currentStage: number, bestScore: number): Promise<void> {
  const progressRef = doc(db, 'users', uid, 'progress', modeId);
  const snap = await getDoc(progressRef);
  const before = snap.exists() ? snap.data() : {};
  const previousBest = typeof before.bestScore === 'number' ? before.bestScore : 0;
  const previousPlayCount = typeof before.totalPlayCount === 'number' ? before.totalPlayCount : 0;

  await setDoc(
    progressRef,
    {
      modeId,
      currentStage,
      clearedStages: Math.max(0, currentStage - 1),
      bestScore: Math.max(previousBest, bestScore),
      totalPlayCount: previousPlayCount + 1,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function addUserReward(uid: string, xp: number, coins: number): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const currentXp = typeof data.xp === 'number' ? data.xp : 0;
  const currentCoins = typeof data.coins === 'number' ? data.coins : 0;
  const nextXp = currentXp + Math.max(0, xp);
  const nextCoins = currentCoins + Math.max(0, coins);
  const nextLevel = Math.max(1, Math.floor(nextXp / 100) + 1);

  await updateDoc(userRef, {
    xp: nextXp,
    coins: nextCoins,
    level: nextLevel,
    updatedAt: serverTimestamp()
  });
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
