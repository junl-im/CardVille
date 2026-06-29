import Phaser from 'phaser';

const GAME_SCENES = [
  'IntroLoadingScene',
  'LoginScene',
  'MainLobbyScene',
  'ModeSelectScene',
  'StageSelectScene',
  'PlayScene',
  'MathLabScene',
  'MemoryForestScene',
  'EnglishSchoolScene',
  'ResultScene',
  'RewardScene',
  'CollectionScene',
  'ShopScene',
  'DailyMissionScene',
  'BackConfirmScene'
];

export const CARDVILLE_EXIT_FLOW_TAG = 'exit-no-freeze-v150' as const;

export class BackButtonSystem {
  private static installed = false;
  private static game?: Phaser.Game;
  private static overlay?: HTMLDivElement;
  private static exitRequested = false;
  private static lastArmAt = 0;
  private static lastBackAt = 0;
  private static exitFallbackTimer?: number;

  static install(game: Phaser.Game): void {
    if (this.installed || typeof window === 'undefined') return;
    this.installed = true;
    this.game = game;
    this.primeHistoryGuard('install');

    const handleBack = (event?: Event) => {
      event?.preventDefault?.();
      BackButtonSystem.handleBackAttempt();
    };

    window.addEventListener('popstate', handleBack, { capture: true });
    window.addEventListener('hashchange', handleBack, { capture: true });

    const rearm = () => BackButtonSystem.primeHistoryGuard('user-gesture');
    window.addEventListener('pointerdown', rearm, { passive: true });
    window.addEventListener('touchstart', rearm, { passive: true });
    window.addEventListener('pageshow', () => BackButtonSystem.primeHistoryGuard('pageshow'));
    window.addEventListener('focus', () => BackButtonSystem.primeHistoryGuard('focus'));

    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      BackButtonSystem.handleBackAttempt();
    });
  }

  static showConfirm(): void {
    this.showOverlay();
  }

  private static handleBackAttempt(): void {
    if (BackButtonSystem.exitRequested) return;
    const now = Date.now();
    if (BackButtonSystem.overlay) {
      BackButtonSystem.requestExit();
      return;
    }
    if (now - BackButtonSystem.lastBackAt < 120) return;
    BackButtonSystem.lastBackAt = now;
    BackButtonSystem.primeHistoryGuard('before-overlay');
    BackButtonSystem.showOverlay();
  }

  private static primeHistoryGuard(reason = 'manual'): void {
    if (typeof history === 'undefined' || typeof window === 'undefined') return;
    if (this.exitRequested) return;
    const now = Date.now();
    if (now - this.lastArmAt < 280 && reason !== 'before-overlay') return;
    this.lastArmAt = now;
    try {
      const state = typeof history.state === 'object' && history.state ? history.state : {};
      history.replaceState({ ...state, cardvilleRoot: true, cardvilleBackGuard: true }, '', window.location.href);
      history.pushState({ cardvilleBackGuard: true, reason, layer: 1, t: now }, '', window.location.href);
      history.pushState({ cardvilleBackGuard: true, reason, layer: 2, t: now + 1 }, '', window.location.href);
    } catch (error) {
      console.warn('[CardVille] back guard history init failed', error);
    }
  }

  private static showOverlay(): void {
    if (typeof document === 'undefined') {
      this.launchSceneFallback();
      return;
    }
    if (this.overlay) return;

    const overlay = document.createElement('div');
    overlay.id = 'cardville-back-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('data-cardville-back-overlay-v121', 'true');
    overlay.setAttribute('data-cardville-back-overlay-v150', 'true');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(2, 8, 20, 0.76)',
      color: '#fff',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      touchAction: 'none',
      pointerEvents: 'auto',
      padding: 'max(18px, env(safe-area-inset-top)) 18px max(18px, env(safe-area-inset-bottom))',
      boxSizing: 'border-box'
    });

    const box = this.makeOverlayBox('잠깐! 게임을 나갈까요?', '첫 화면으로 돌아가거나 계속할 수 있어요. 브라우저 정책상 직접 닫기가 막히면 안전 안내로 돌아옵니다.');
    box.appendChild(this.makeOverlayButton('첫 화면가기', '#ffd86f', () => this.goFirstScreen()));
    box.appendChild(this.makeOverlayButton('계속하기', '#9fe7ff', () => this.closeOverlay()));
    box.appendChild(this.makeOverlayButton('나가기 시도', '#ff9ab1', () => this.requestExit()));

    const note = document.createElement('div');
    note.textContent = '닫기가 막혀도 화면을 막은 채 멈추지 않도록 자동 복구합니다.';
    Object.assign(note.style, { marginTop: '12px', fontSize: '11px', color: 'rgba(230,244,255,.72)', fontWeight: '800' });
    box.appendChild(note);

    overlay.appendChild(box);
    try {
      document.body.appendChild(overlay);
      this.overlay = overlay;
      this.stopSceneFallback();
      this.primeHistoryGuard('overlay-open');
    } catch (error) {
      console.warn('[CardVille] DOM back overlay failed; using scene fallback', error);
      this.launchSceneFallback();
    }
  }

  private static makeOverlayBox(titleText: string, descText: string): HTMLDivElement {
    const box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(344px, 90vw)',
      padding: '22px 18px 18px',
      borderRadius: '30px',
      background: 'linear-gradient(180deg, rgba(26, 49, 92, 0.98), rgba(9, 18, 40, 0.98))',
      border: '1px solid rgba(255,255,255,.30)',
      boxShadow: '0 28px 70px rgba(0,0,0,.50)',
      textAlign: 'center',
      boxSizing: 'border-box'
    });

    const title = document.createElement('div');
    title.textContent = titleText;
    Object.assign(title.style, { fontSize: '25px', fontWeight: '1000', letterSpacing: '-.06em', textShadow: '0 3px 10px rgba(0,0,0,.5)' });
    box.appendChild(title);

    const desc = document.createElement('div');
    desc.textContent = descText;
    Object.assign(desc.style, { margin: '12px auto 16px', maxWidth: '292px', fontSize: '14px', lineHeight: '1.45', color: 'rgba(230,244,255,.92)', fontWeight: '800' });
    box.appendChild(desc);
    return box;
  }

  private static makeOverlayButton(label: string, color: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    Object.assign(button.style, {
      width: '100%',
      height: '54px',
      margin: '5px 0',
      borderRadius: '20px',
      border: '2px solid rgba(255,255,255,.78)',
      background: `linear-gradient(180deg, #fff8d8 0%, ${color} 72%, #d8842f 100%)`,
      color: '#3f210f',
      fontSize: '17px',
      fontWeight: '1000',
      letterSpacing: '-.05em',
      boxShadow: '0 8px 0 rgba(63,31,9,.34), 0 16px 30px rgba(0,0,0,.24)',
      cursor: 'pointer'
    });
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      action();
    });
    return button;
  }

  private static launchSceneFallback(): void {
    const currentGame = this.game;
    if (!currentGame) return;
    try {
      if (!currentGame.scene.isActive('BackConfirmScene')) {
        (currentGame.scene as any).launch('BackConfirmScene');
        currentGame.scene.bringToTop('BackConfirmScene');
      }
    } catch (error) {
      console.warn('[CardVille] BackConfirmScene launch failed', error);
    }
  }

  private static stopSceneFallback(): void {
    try {
      if (this.game?.scene.isActive('BackConfirmScene')) this.game.scene.stop('BackConfirmScene');
    } catch { /* ignore */ }
  }

  private static closeOverlay(): void {
    if (this.exitFallbackTimer !== undefined) {
      window.clearTimeout(this.exitFallbackTimer);
      this.exitFallbackTimer = undefined;
    }
    this.exitRequested = false;
    this.overlay?.remove();
    this.overlay = undefined;
    this.stopSceneFallback();
    this.primeHistoryGuard('close-overlay');
  }

  private static goFirstScreen(): void {
    if (this.exitFallbackTimer !== undefined) {
      window.clearTimeout(this.exitFallbackTimer);
      this.exitFallbackTimer = undefined;
    }
    this.exitRequested = false;
    this.overlay?.remove();
    this.overlay = undefined;
    const currentGame = this.game;
    if (currentGame) {
      try {
        for (const key of GAME_SCENES) {
          if (currentGame.scene.isActive(key) || currentGame.scene.isSleeping(key)) currentGame.scene.stop(key);
        }
        currentGame.scene.start('LoginScene');
      } catch (error) {
        console.warn('[CardVille] first screen navigation failed', error);
      }
    }
    this.primeHistoryGuard('first-screen');
  }

  static requestExit(): void {
    if (this.exitRequested) return;
    this.exitRequested = true;
    this.overlay?.remove();
    this.overlay = undefined;
    this.stopSceneFallback();
    try { window.close(); } catch (error) { console.warn('[CardVille] window.close failed', error); }
    try {
      if (window.history.length > 1) window.history.back();
    } catch (error) {
      console.warn('[CardVille] history back exit failed', error);
    }
    this.exitFallbackTimer = window.setTimeout(() => this.showExitBlockedRecovery(), 900);
  }

  private static showExitBlockedRecovery(): void {
    this.exitFallbackTimer = undefined;
    if (typeof window !== 'undefined' && window.closed) return;
    this.exitRequested = false;
    this.stopSceneFallback();
    if (typeof document === 'undefined') {
      this.goFirstScreen();
      return;
    }
    this.overlay?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'cardville-back-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('data-cardville-exit-blocked-v150', 'true');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '2147483647', display: 'grid', placeItems: 'center', background: 'rgba(2, 8, 20, 0.80)', color: '#fff',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", touchAction: 'none', pointerEvents: 'auto', padding: '18px', boxSizing: 'border-box'
    });
    const box = this.makeOverlayBox('브라우저가 닫기를 막았어요', '게임은 멈춘 것이 아니에요. 첫 화면으로 돌아가거나 계속 플레이할 수 있습니다.');
    box.appendChild(this.makeOverlayButton('첫 화면가기', '#ffd86f', () => this.goFirstScreen()));
    box.appendChild(this.makeOverlayButton('계속하기', '#9fe7ff', () => this.closeOverlay()));
    box.appendChild(this.makeOverlayButton('빈 페이지로 이동', '#ff9ab1', () => {
      this.exitRequested = true;
      this.overlay?.remove();
      this.overlay = undefined;
      try { window.location.replace('about:blank'); } catch { window.location.href = 'about:blank'; }
    }));
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }
}
