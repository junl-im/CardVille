import { User } from 'firebase/auth';
import { ensureAnonymousUser } from '../../firebase/auth';
import { ensureUserProfile } from '../../firebase/firestore';

export class AuthSystem {
  static currentUser: User | null = null;

  static async boot(): Promise<User | null> {
    try {
      const user = await ensureAnonymousUser();
      await ensureUserProfile(user);
      AuthSystem.currentUser = user;
      return user;
    } catch (error) {
      console.warn('[CardVille] Auth boot failed. Game continues offline.', error);
      return null;
    }
  }
}
