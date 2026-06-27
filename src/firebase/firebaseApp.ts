import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyD9hJzRf_I4t9LjS7EjO9K8ZcUX39wgecE',
  authDomain: 'cardville.firebaseapp.com',
  projectId: 'cardville',
  storageBucket: 'cardville.firebasestorage.app',
  messagingSenderId: '285520270113',
  appId: '1:285520270113:web:ef33aedeaf08f4ef806460',
  measurementId: 'G-8QTT1QSPVL'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function initializeFirebaseRuntime(): Promise<void> {
  try {
    const supported = await isSupported();
    if (supported) {
      getAnalytics(app);
    }
  } catch (error) {
    console.warn('[CardVille] Firebase Analytics disabled in this browser.', error);
  }
}
