import { User } from 'firebase/auth';
import { ensureAnonymousUser, loginWithEmail, loginWithGoogle, logout, observeAuth, registerWithEmail } from '../../firebase/auth';
import { ensureUserProfile } from '../../firebase/firestore';

export class AuthSystem {
  static currentUser: User | null = null;
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

    this.initialized = true;
    this.currentUser = user;

    if (user) {
      await ensureUserProfile(user);
    }

    return user;
  }

  static async signInGuest(): Promise<User> {
    const user = await ensureAnonymousUser();
    await ensureUserProfile(user);
    this.initialized = true;
    this.currentUser = user;
    return user;
  }

  static async signInEmail(email: string, password: string): Promise<User> {
    const user = await loginWithEmail(email, password);
    await ensureUserProfile(user);
    this.initialized = true;
    this.currentUser = user;
    return user;
  }

  static async createEmailAccount(email: string, password: string): Promise<User> {
    const user = await registerWithEmail(email, password);
    await ensureUserProfile(user);
    this.initialized = true;
    this.currentUser = user;
    return user;
  }

  static async signInGoogle(): Promise<User> {
    const user = await loginWithGoogle();
    await ensureUserProfile(user);
    this.initialized = true;
    this.currentUser = user;
    return user;
  }

  static async signOut(): Promise<void> {
    await logout();
    this.currentUser = null;
    this.initialized = false;
  }

  static getDisplayName(): string {
    const user = this.currentUser;
    if (!user) return '카드마을 주민';
    if (user.isAnonymous) return '여행자';
    return user.displayName || user.email?.split('@')[0] || '카드마을 주민';
  }

  static getLoginLabel(): string {
    const user = this.currentUser;
    if (!user) return '로그인 필요';
    if (user.isAnonymous) return '게스트 로그인';
    const provider = user.providerData[0]?.providerId;
    if (provider === 'google.com') return 'Google 로그인';
    if (provider === 'password') return '이메일 로그인';
    return 'Firebase 로그인';
  }
}
