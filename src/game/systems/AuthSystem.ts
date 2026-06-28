import { isSafeEmail, sanitizeText } from './SecuritySystem';
type PlayerProfile = {
  uid: string;
  provider: 'guest' | 'google' | 'email';
  nickname: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
};

type AuthMode = 'localGuest' | 'firebase' | 'none';

const PROFILE_KEY = 'cardville.profile.v105';
const GUEST_UID_KEY = 'cardville.guestUid';

const firebaseConfig = {
  apiKey: 'AIzaSyD9hJzRf_I4t9LjS7EjO9K8ZcUX39wgecE',
  authDomain: 'cardville.firebaseapp.com',
  projectId: 'cardville',
  storageBucket: 'cardville.firebasestorage.app',
  messagingSenderId: '285520270113',
  appId: '1:285520270113:web:ef33aedeaf08f4ef806460',
  measurementId: 'G-8QTT1QSPVL'
};

let firebaseApp: unknown;

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore storage failures */ }
}

function safeRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignore storage failures */ }
}

function createGuestUid(): string {
  const existing = sanitizeText(safeGet(GUEST_UID_KEY), '', 80);
  if (/^guest_[a-z0-9_:-]{4,80}$/i.test(existing)) return existing;
  const uid = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  safeSet(GUEST_UID_KEY, uid);
  return uid;
}

function defaultProfile(): PlayerProfile {
  return { uid: createGuestUid(), provider: 'guest', nickname: '게스트', level: 1, xp: 0, coins: 300, gems: 10 };
}

function loadProfile(): PlayerProfile {
  try {
    const raw = safeGet(PROFILE_KEY);
    return raw ? { ...defaultProfile(), ...JSON.parse(raw), nickname: sanitizeText(JSON.parse(raw).nickname, '게스트', 24) } : defaultProfile();
  } catch {
    return defaultProfile();
  }
}

function saveProfile(profile: PlayerProfile): void {
  safeSet(PROFILE_KEY, JSON.stringify(profile));
}

function profileToUser(profile: PlayerProfile): any {
  const now = new Date().toISOString();
  const providerId = profile.provider === 'google' ? 'google.com' : profile.provider === 'email' ? 'password' : 'local-guest';
  const info = {
    uid: profile.uid,
    displayName: profile.nickname,
    email: profile.provider === 'email' ? `${profile.nickname || 'user'}@local.cardville` : null,
    phoneNumber: null,
    photoURL: null,
    providerId
  };
  return {
    ...info,
    emailVerified: profile.provider !== 'email',
    isAnonymous: profile.provider === 'guest',
    metadata: { creationTime: now, lastSignInTime: now },
    providerData: providerId === 'local-guest' ? [] : [info],
    refreshToken: '',
    tenantId: null,
    delete: async () => undefined,
    getIdToken: async () => '',
    getIdTokenResult: async () => ({ token: '', authTime: now, issuedAtTime: now, expirationTime: now, signInProvider: providerId, signInSecondFactor: null, claims: {} }),
    reload: async () => undefined,
    toJSON: () => ({ uid: profile.uid, providerId, isAnonymous: profile.provider === 'guest' })
  };
}

function firebaseUserToAny(user: any): any {
  return user;
}

const FIREBASE_VERSION = '12.15.0';
const FIREBASE_APP_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`;
const FIREBASE_AUTH_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`;

async function getFirebaseAuth() {
  // Firebase is loaded only when Google or email login is pressed.
  // This keeps guest play and first boot fast while preserving server login paths.
  const appMod = await import(/* @vite-ignore */ FIREBASE_APP_CDN) as any;
  const authMod = await import(/* @vite-ignore */ FIREBASE_AUTH_CDN) as any;
  firebaseApp ??= appMod.initializeApp(firebaseConfig);
  return { auth: authMod.getAuth(firebaseApp as never), authMod };
}

export class AuthSystem {
  static currentUser: any = null;
  static lastAuthMode: AuthMode = 'none';
  static lastProfileSyncError: unknown = null;

  static restore(): any {
    const profile = loadProfile();
    this.currentUser = profileToUser(profile);
    this.lastAuthMode = profile.provider === 'guest' ? 'localGuest' : 'firebase';
    return this.currentUser;
  }

  static signInGuest(): PlayerProfile {
    const profile = loadProfile();
    profile.provider = 'guest';
    profile.nickname = '게스트';
    saveProfile(profile);
    this.currentUser = profileToUser(profile);
    this.lastAuthMode = 'localGuest';
    this.lastProfileSyncError = null;
    return profile;
  }

  static async signInGoogle(): Promise<PlayerProfile> {
    const { auth, authMod } = await getFirebaseAuth();
    const provider = new authMod.GoogleAuthProvider();
    const result = await authMod.signInWithPopup(auth, provider);
    const profile = loadProfile();
    profile.uid = result.user.uid;
    profile.provider = 'google';
    profile.nickname = result.user.displayName ?? 'Google 유저';
    saveProfile(profile);
    this.currentUser = firebaseUserToAny(result.user);
    this.lastAuthMode = 'firebase';
    this.lastProfileSyncError = null;
    return profile;
  }

  static async signInEmail(email: string, password: string, create = false): Promise<PlayerProfile> {
    const cleanEmail = sanitizeText(email, '', 254);
    if (!isSafeEmail(cleanEmail)) throw new Error('Invalid email format');
    if (password.length < 6 || password.length > 128) throw new Error('Invalid password length');
    const { auth, authMod } = await getFirebaseAuth();
    const result = create
      ? await authMod.createUserWithEmailAndPassword(auth, cleanEmail, password)
      : await authMod.signInWithEmailAndPassword(auth, cleanEmail, password);
    const profile = loadProfile();
    profile.uid = result.user.uid;
    profile.provider = 'email';
    profile.nickname = sanitizeText(cleanEmail.split('@')[0], '이메일 유저', 24);
    saveProfile(profile);
    this.currentUser = firebaseUserToAny(result.user);
    this.lastAuthMode = 'firebase';
    this.lastProfileSyncError = null;
    return profile;
  }

  static async createEmailAccount(email: string, password: string): Promise<PlayerProfile> {
    return await this.signInEmail(email, password, true);
  }

  static async signOut(): Promise<void> {
    if (this.lastAuthMode === 'firebase') {
      try {
        const { auth, authMod } = await getFirebaseAuth();
        await authMod.signOut(auth);
      } catch (error) {
        console.warn('[CardVille] Firebase sign-out failed. Local state will still be cleared.', error);
      }
    }
    safeRemove(PROFILE_KEY);
    this.currentUser = null;
    this.lastAuthMode = 'none';
  }

  static isLocalGuest(): boolean {
    const profile = loadProfile();
    return this.lastAuthMode === 'localGuest'
      || profile.provider === 'guest'
      || this.currentUser?.providerId === 'local-guest'
      || this.currentUser?.uid?.startsWith?.('guest_') === true
      || this.currentUser?.uid?.startsWith?.('local_guest_') === true;
  }

  static isFirebaseUser(): boolean {
    return !!this.currentUser && !this.isLocalGuest();
  }

  static getDisplayName(): string {
    return this.currentUser?.displayName ?? loadProfile().nickname ?? '카드마을 주민';
  }

  static getLoginLabel(): string {
    const profile = loadProfile();
    if (this.isLocalGuest()) return '로컬 게스트';
    if (profile.provider === 'google') return 'Google 로그인';
    if (profile.provider === 'email') return '이메일 로그인';
    return '로그인';
  }
}
