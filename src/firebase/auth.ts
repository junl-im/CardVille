import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseApp';
import { createOrUpdateUserProfile } from './firestore';

export function waitForAuthUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function ensureAnonymousSession(): Promise<User> {
  const existing = await waitForAuthUser();
  if (existing) {
    await createOrUpdateUserProfile(existing);
    return existing;
  }

  const result = await signInAnonymously(auth);
  await createOrUpdateUserProfile(result.user);
  return result.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await createOrUpdateUserProfile(result.user);
  return result.user;
}

export async function registerWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await createOrUpdateUserProfile(result.user);
  return result.user;
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  await createOrUpdateUserProfile(result.user);
  return result.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
