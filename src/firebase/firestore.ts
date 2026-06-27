import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebaseApp';

export async function ensureUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      nickname: user.isAnonymous ? '여행자' : user.displayName ?? '카드마을 주민',
      provider: user.isAnonymous ? 'anonymous' : 'firebase',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      level: 1,
      xp: 0,
      coins: 0,
      gems: 0,
      selectedWorld: 'magic_library',
      selectedCardBack: 'classic_orange'
    });
    return;
  }

  await updateDoc(userRef, {
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function saveModeProgress(uid: string, modeId: string, currentStage: number, bestScore: number): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'progress', modeId),
    {
      modeId,
      currentStage,
      clearedStages: Math.max(0, currentStage - 1),
      bestScore,
      totalPlayCount: 1,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
