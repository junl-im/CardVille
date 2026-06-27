export type BrowserFamily = 'kakao' | 'naver' | 'safari-ios' | 'chrome-android' | 'desktop' | 'unknown';

export interface BrowserRuntimeInfo {
  userAgent: string;
  family: BrowserFamily;
  isKakao: boolean;
  isInAppBrowser: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  supportsServiceWorker: boolean;
  supportsCacheStorage: boolean;
  supportsLocalStorage: boolean;
  shouldSkipServiceWorker: boolean;
  shouldSkipDomVideo: boolean;
}

function getUserAgent(): string {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent || '';
}

function canUseLocalStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = '__cardville_storage_probe__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getBrowserRuntimeInfo(): BrowserRuntimeInfo {
  const userAgent = getUserAgent();
  const lower = userAgent.toLowerCase();
  const isKakao = lower.includes('kakaotalk') || lower.includes('kakaostory') || lower.includes('kakao');
  const isNaver = lower.includes('naver');
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isSafariIOS = isIOS && /safari/i.test(userAgent) && !/crios|fxios|edgios/i.test(userAgent);
  const isChromeAndroid = isAndroid && /chrome/i.test(userAgent);
  const isInAppBrowser = isKakao || isNaver || lower.includes('fbav') || lower.includes('instagram');

  let family: BrowserFamily = 'unknown';
  if (isKakao) family = 'kakao';
  else if (isNaver) family = 'naver';
  else if (isSafariIOS) family = 'safari-ios';
  else if (isChromeAndroid) family = 'chrome-android';
  else if (!isIOS && !isAndroid) family = 'desktop';

  return {
    userAgent,
    family,
    isKakao,
    isInAppBrowser,
    isIOS,
    isAndroid,
    supportsServiceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    supportsCacheStorage: typeof window !== 'undefined' && 'caches' in window,
    supportsLocalStorage: canUseLocalStorage(),
    shouldSkipServiceWorker: isInAppBrowser,
    shouldSkipDomVideo: isInAppBrowser || isIOS
  };
}

export function isKakaoBrowser(): boolean {
  return getBrowserRuntimeInfo().isKakao;
}

export function safeSetStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Kakao/iOS private mode can reject storage writes. The game must keep running.
  }
}

export function safeGetStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeRemoveStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
}
