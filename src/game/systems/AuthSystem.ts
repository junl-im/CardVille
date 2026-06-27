import { User } from 'firebase/auth';
import { ensureAnonymousUser, loginWithEmail, loginWithGoogle, logout, observeAuth, registerWithEmail } from '../../firebase/auth';
import { ensureUserProfile } from '../../firebase/firestore';

const LOCAL_GUEST_UID_KEY = 'cardville.localGuest.uid.v1';
const AUTH_TIMEOUT_MS = 8500;

function getStoredLocalGuestUid(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(LOCAL_GUEST_UID_KEY);
}

function getOrCreateLocalGuestUid(): string {
  if (typeof window === 'undefined') return `local_guest_${Date.now()}`;
  const stored = window.localStorage.getItem(LOCAL_GUEST_UID_KEY);
  if (stored) return stored;
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 18)
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const uid = `local_guest_${randomPart}`;
  window.localStorage.setItem(LOCAL_GUEST_UID_KEY, uid);
  return uid;
}

function clearLocalGuestUid(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LOCAL_GUEST_UID_KEY);
}

function createLocalGuestUser(): User {
  const uid = getOrCreateLocalGuestUid();
  const now = new Date().toISOString();
  return {
    uid,
    displayName: '여행자',
    email: null,
    emailVerified: false,
    isAnonymous: true,
    metadata: { creationTime: now, lastSignInTime: now },
    phoneNumber: null,
    photoURL: null,
    providerData: [],
    providerId: 'local-guest',
    refreshToken: '',
    tenantId: null,
    delete: async () => undefined,
    getIdToken: async () => '',
    getIdTokenResult: async () => ({
      token: '',
      authTime: now,
      issuedAtTime: now,
      expirationTime: now,
      signInProvider: 'local-guest',
      signInSecondFactor: null,
      claims: {}
    }),
    reload: async () => undefined,
    toJSON: () => ({ uid, isAnonymous: true, providerId: 'local-guest' })
  } as unknown as User;
}

async function withTimeout<T>(promise: Promise<T>, ms = AUTH_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Firebase Auth timed out after ${ms}ms`)), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export class AuthSystem {
  static currentUser: User | null = null;
  static lastProfileSyncError: unknown = null;
  static lastAuthMode: 'firebase' | 'localGuest' | 'none' = 'none';
  private static initialized = false;

  static async restore(): Promise<User | null> {
    if (this.initialized) return this.currentUser;

    let unsubscribe = (): void => undefined;
    const user = await new Promise<User | null>((resolve) => {
      unsubscribe = observeAuth((authUser) => {
        unsubscribe();
        resolve(authUser);
      });
    });

    if (user) {
      this.initialized = true;
      this.currentUser = user;
      this.lastAuthMode = 'firebase';
      await this.trySyncProfile(user);
      return user;
    }

    if (getStoredLocalGuestUid()) {
      const localUser = createLocalGuestUser();
      this.initialized = true;
      this.currentUser = localUser;
      this.lastAuthMode = 'localGuest';
      return localUser;
    }

    this.initialized = true;
    this.currentUser = null;
    this.lastAuthMode = 'none';
    return null;
  }

  static async signInGuest(): Promise<User> {
    try {
      const user = await withTimeout(ensureAnonymousUser());
      await this.trySyncProfile(user);
      this.initialized = true;
      this.currentUser = user;
      this.lastAuthMode = 'firebase';
      return user;
    } catch (error) {
      console.warn('[CardVille] Firebase anonymous sign-in failed. Local guest fallback will be used.', error);
      const localUser = createLocalGuestUser();
      this.initialized = true;
      this.currentUser = localUser;
      this.lastAuthMode = 'localGuest';
      this.lastProfileSyncError = error;
      return localUser;
    }
  }

  static async signInEmail(email: string, password: string): Promise<User> {
    const user = await withTimeout(loginWithEmail(email, password));
    await this.trySyncProfile(user);
    this.initialized = true;
    this.currentUser = user;
    this.lastAuthMode = 'firebase';
    clearLocalGuestUid();
    return user;
  }

  static async createEmailAccount(email: string, password: string): Promise<User> {
    const user = await withTimeout(registerWithEmail(email, password));
    await this.trySyncProfile(user);
    this.initialized = true;
    this.currentUser = user;
    this.lastAuthMode = 'firebase';
    clearLocalGuestUid();
    return user;
  }

  static async signInGoogle(): Promise<User> {
    const user = await withTimeout(loginWithGoogle(), 15000);
    await this.trySyncProfile(user);
    this.initialized = true;
    this.currentUser = user;
    this.lastAuthMode = 'firebase';
    clearLocalGuestUid();
    return user;
  }

  static async signOut(): Promise<void> {
    if (this.lastAuthMode === 'firebase') {
      try {
        await logout();
      } catch (error) {
        console.warn('[CardVille] Firebase sign-out failed.', error);
      }
    }
    clearLocalGuestUid();
    this.currentUser = null;
    this.initialized = false;
    this.lastAuthMode = 'none';
  }

  static isLocalGuest(): boolean {
    return this.lastAuthMode === 'localGuest' || this.currentUser?.providerId === 'local-guest';
  }

  static getDisplayName(): string {
    const user = this.currentUser;
    if (!user) return '카드마을 주민';
    if (this.isLocalGuest()) return '로컬 여행자';
    if (user.isAnonymous) return '여행자';
    return user.displayName || user.email?.split('@')[0] || '카드마을 주민';
  }

  static getLoginLabel(): string {
    const user = this.currentUser;
    if (!user) return '로그인 필요';
    if (this.isLocalGuest()) return '로컬 게스트';
    if (user.isAnonymous) return 'Firebase 게스트';
    const provider = user.providerData[0]?.providerId;
    if (provider === 'google.com') return 'Google 로그인';
    if (provider === 'password') return '이메일 로그인';
    return 'Firebase 로그인';
  }

  private static async trySyncProfile(user: User): Promise<void> {
    this.lastProfileSyncError = null;
    try {
      await ensureUserProfile(user);
    } catch (error) {
      this.lastProfileSyncError = error;
      console.warn('[CardVille] Profile sync failed. Local cache will keep the game playable.', error);
    }
  }
}
