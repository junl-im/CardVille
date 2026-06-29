import { safeJsonRecord } from './SecuritySystem';

export type AccessibilityPrefs = {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
};

const ACCESSIBILITY_KEY = 'cardville.accessibility.v143';

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* private browsers can block storage */ }
}

function normalizePrefs(raw: Record<string, unknown>): AccessibilityPrefs {
  return {
    reduceMotion: raw.reduceMotion === true,
    highContrast: raw.highContrast === true,
    largeText: raw.largeText === true
  };
}

export class AccessibilitySystem {
  static readonly storageKey = ACCESSIBILITY_KEY;

  static getPrefs(): AccessibilityPrefs {
    return normalizePrefs(safeJsonRecord(safeGet(ACCESSIBILITY_KEY)));
  }

  static savePrefs(prefs: AccessibilityPrefs): AccessibilityPrefs {
    const normalized = normalizePrefs(prefs as unknown as Record<string, unknown>);
    safeSet(ACCESSIBILITY_KEY, JSON.stringify({ ...normalized, schema: 'v143-accessibility' }));
    return normalized;
  }

  static toggleReduceMotion(): AccessibilityPrefs {
    const prefs = this.getPrefs();
    return this.savePrefs({ ...prefs, reduceMotion: !prefs.reduceMotion });
  }

  static toggleHighContrast(): AccessibilityPrefs {
    const prefs = this.getPrefs();
    return this.savePrefs({ ...prefs, highContrast: !prefs.highContrast });
  }

  static toggleLargeText(): AccessibilityPrefs {
    const prefs = this.getPrefs();
    return this.savePrefs({ ...prefs, largeText: !prefs.largeText });
  }

  static reset(): AccessibilityPrefs {
    return this.savePrefs({ reduceMotion: false, highContrast: false, largeText: false });
  }

  static summary(): string {
    const prefs = this.getPrefs();
    const parts = [
      prefs.reduceMotion ? '모션 줄임 ON' : '모션 기본',
      prefs.highContrast ? '고대비 ON' : '명암 기본',
      prefs.largeText ? '큰 안내 ON' : '글자 기본'
    ];
    return parts.join(' · ');
  }
}
