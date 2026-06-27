import { firebaseConfig } from '../../firebase/firebaseConfig';
import { SaveSystem, type PlayerProfile } from './SaveSystem';

let firebaseApp: unknown;

async function getFirebaseAuth() {
  const appMod = await import('firebase/app');
  const authMod = await import('firebase/auth');
  firebaseApp ??= appMod.initializeApp(firebaseConfig);
  return { auth: authMod.getAuth(firebaseApp as never), authMod };
}

export class AuthSystem {
  static restore(): PlayerProfile | null {
    return SaveSystem.loadProfile();
  }

  static signInGuest(): PlayerProfile {
    return SaveSystem.startGuest();
  }

  static async signInGoogle(): Promise<PlayerProfile> {
    const { auth, authMod } = await getFirebaseAuth();
    const provider = new authMod.GoogleAuthProvider();
    const result = await authMod.signInWithPopup(auth, provider);
    const profile = SaveSystem.loadProfile();
    profile.uid = result.user.uid;
    profile.provider = 'google';
    profile.nickname = result.user.displayName ?? 'Google 유저';
    SaveSystem.saveProfile(profile);
    return profile;
  }

  static async signInEmail(email: string, password: string, create = false): Promise<PlayerProfile> {
    const { auth, authMod } = await getFirebaseAuth();
    const result = create
      ? await authMod.createUserWithEmailAndPassword(auth, email, password)
      : await authMod.signInWithEmailAndPassword(auth, email, password);
    const profile = SaveSystem.loadProfile();
    profile.uid = result.user.uid;
    profile.provider = 'email';
    profile.nickname = email.split('@')[0] || '이메일 유저';
    SaveSystem.saveProfile(profile);
    return profile;
  }
}
