import { User } from 'firebase/auth';
import {
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebaseApp';

export type UserProfile = {
  uid: string;
  nickname: string;
  provider: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  selectedWorld: string;
  selectedCardBack: string;
};

export async function createOrUpdateUserProfile(user: User): Promise<void> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const provider = user.isAnonymous ? 'anonymous' : user.providerData[0]?.providerId ?? 'unknown';

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      nickname: user.displayName || '여행자',
      provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      level: 1,
      xp: 0,
      coins: 0,
      gems: 0,
      selectedWorld: 'magic_library',
      selectedCardBack: 'default_orange',
    });
    return;
  }

  await updateDoc(ref, {
    provider,
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
}

export async function saveModeProgress(params: {
  uid: string;
  modeId: string;
  currentStage: number;
  bestScore: number;
}): Promise<void> {
  const ref = doc(db, 'users', params.uid, 'progress', params.modeId);
  await setDoc(
    ref,
    {
      modeId: params.modeId,
      currentStage: params.currentStage,
      clearedStages: params.currentStage,
      bestScore: params.bestScore,
      totalPlayCount: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function addReward(params: { uid: string; xp: number; coins: number; gems?: number }): Promise<void> {
  const ref = doc(db, 'users', params.uid);
  await updateDoc(ref, {
    xp: increment(params.xp),
    coins: increment(params.coins),
    gems: increment(params.gems ?? 0),
    updatedAt: serverTimestamp(),
  });
}

export async function addCollectionCard(params: {
  uid: string;
  cardId: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}): Promise<void> {
  const ref = doc(db, 'users', params.uid, 'collections', params.cardId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      cardId: params.cardId,
      rarity: params.rarity,
      count: 1,
      firstObtainedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await updateDoc(ref, {
    count: increment(1),
    updatedAt: serverTimestamp(),
  });
}
