import { getBrowserRuntimeInfo } from '../../platform/browserEnv';

export class KakaoBrowserSystem {
  private static installed = false;

  static install(onBack: () => void): void {
    if (this.installed || typeof window === 'undefined') return;
    this.installed = true;

    const runtime = getBrowserRuntimeInfo();

    // Kakao in-app browser can behave unpredictably with early history.pushState.
    // Do not allow back-button support to block the first boot path.
    if (runtime.isKakao) {
      window.addEventListener('pagehide', () => {
        window.dispatchEvent(new Event('cardville:kakao-pagehide'));
      });
      return;
    }

    try {
      const current = window.location.href;
      window.history.replaceState({ cardvilleRoot: true }, '', current);
      window.history.pushState({ cardvilleGuard: true }, '', current);
    } catch (error) {
      console.warn('[CardVille] History guard setup skipped.', error);
      return;
    }

    window.addEventListener('popstate', () => {
      try {
        window.history.pushState({ cardvilleGuard: true }, '', window.location.href);
      } catch {
        // Some in-app browsers restrict history writes. Back handling should not break boot.
      }
      onBack();
    });
  }
}
