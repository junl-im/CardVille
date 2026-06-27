import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from './firebaseApp';

function hasAuthCode(error: unknown, code: string): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: string }).code === code;
}

export function observeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function ensureAnonymousUser(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email: string, password: string): Promise<User> {
  const credential = EmailAuthProvider.credential(email, password);

  if (auth.currentUser?.isAnonymous) {
    try {
      const linked = await linkWithCredential(auth.currentUser, credential);
      return linked.user;
    } catch (error) {
      if (hasAuthCode(error, 'auth/email-already-in-use') || hasAuthCode(error, 'auth/credential-already-in-use')) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
      }
      throw error;
    }
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  if (auth.currentUser?.isAnonymous) {
    try {
      const linked = await linkWithPopup(auth.currentUser, provider);
      return linked.user;
    } catch (error) {
      if (hasAuthCode(error, 'auth/credential-already-in-use') || hasAuthCode(error, 'auth/provider-already-linked')) {
        const result = await signInWithPopup(auth, provider);
        return result.user;
      }
      throw error;
    }
  }

  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
