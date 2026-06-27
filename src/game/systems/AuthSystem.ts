import { User } from 'firebase/auth';
import { ensureAnonymousUser, loginWithEmail, loginWithGoogle, observeAuth, registerWithEmail } from '../../firebase/auth';
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
}
