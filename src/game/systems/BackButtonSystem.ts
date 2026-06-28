import Phaser from 'phaser';

const GAME_SCENES = [
  'IntroLoadingScene',
  'LoginScene',
  'MainLobbyScene',
  'ModeSelectScene',
  'StageSelectScene',
  'PlayScene',
  'ResultScene',
  'RewardScene',
  'CollectionScene',
  'BackConfirmScene'
];

export class BackButtonSystem {
  private static installed = false;
  private static game?: Phaser.Game;
  private static overlay?: HTMLDivElement;
  private static exitRequested = false;
  private static guardDepth = 0;

  static install(game: Phaser.Game): void {
    if (this.installed || typeof window === 'undefined') return;
    this.installed = true;
    this.game = game;
    this.primeHistoryGuard();

    window.addEventListener('popstate', () => {
      if (BackButtonSystem.exitRequested) return;
      if (BackButtonSystem.overlay) {
        BackButtonSystem.requestExit();
        return;
      }
      BackButtonSystem.primeHistoryGuard();
      BackButtonSystem.showOverlay();
    });

    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      if (BackButtonSystem.overlay) BackButtonSystem.requestExit();
      else BackButtonSystem.showOverlay();
    });
  }

  private static primeHistoryGuard(): void {
    if (typeof history === 'undefined' || typeof window === 'undefined') return;
    try {
      const state = typeof history.state === 'object' && history.state ? history.state : {};
      history.replaceState({ ...state, cardvilleRoot: true }, '', window.location.href);
      // Two guard entries make Android/Kakao hardware back more likely to hit popstate
      // before closing the webview.
      while (this.guardDepth < 2) {
        history.pushState({ cardvilleBackGuard: true, depth: this.guardDepth + 1 }, '', window.location.href);
        this.guardDepth += 1;
      }
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
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '999998',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(2, 8, 20, 0.72)',
      color: '#fff',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      touchAction: 'none',
      pointerEvents: 'auto'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(340px, 88vw)',
      padding: '22px 18px 18px',
      borderRadius: '30px',
      background: 'linear-gradient(180deg, rgba(22, 44, 88, 0.96), rgba(9, 18, 40, 0.96))',
      border: '1px solid rgba(255,255,255,.28)',
      boxShadow: '0 28px 70px rgba(0,0,0,.45)',
      textAlign: 'center',
      boxSizing: 'border-box'
    });

    const title = document.createElement('div');
    title.textContent = '게임을 나갈까요?';
    Object.assign(title.style, { fontSize: '26px', fontWeight: '1000', letterSpacing: '-.06em', textShadow: '0 3px 10px rgba(0,0,0,.5)' });
    box.appendChild(title);

    const desc = document.createElement('div');
    desc.textContent = '첫 화면으로 돌아가거나, 나가기를 시도할 수 있어요. 뒤로가기를 한 번 더 누르면 나가기를 시도합니다.';
    Object.assign(desc.style, { margin: '12px auto 16px', maxWidth: '286px', fontSize: '14px', lineHeight: '1.45', color: 'rgba(230,244,255,.92)', fontWeight: '800' });
    box.appendChild(desc);

    box.appendChild(this.makeOverlayButton('첫 화면가기', '#ffd86f', () => this.goFirstScreen()));
    box.appendChild(this.makeOverlayButton('나가기', '#ff9ab1', () => this.requestExit()));
    box.appendChild(this.makeOverlayButton('계속하기', '#9fe7ff', () => this.closeOverlay()));

    const note = document.createElement('div');
    note.textContent = '브라우저 정책상 창 닫기가 막히면 이전 페이지로 이동합니다.';
    Object.assign(note.style, { marginTop: '12px', fontSize: '11px', color: 'rgba(230,244,255,.70)', fontWeight: '800' });
    box.appendChild(note);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    this.overlay = overlay;

    // Phaser scene fallback stays available behind the DOM overlay for platforms that
    // block fixed DOM layers in webviews.
    this.launchSceneFallback();
  }

  private static makeOverlayButton(label: string, color: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    Object.assign(button.style, {
      width: '100%',
      height: '54px',
      margin: '6px 0',
      borderRadius: '20px',
      border: '2px solid rgba(255,255,255,.72)',
      background: `linear-gradient(180deg, #fff8d8, ${color})`,
      color: '#3f210f',
      fontSize: '17px',
      fontWeight: '1000',
      letterSpacing: '-.05em',
      boxShadow: '0 8px 0 rgba(63,31,9,.38)',
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

  private static closeOverlay(): void {
    this.overlay?.remove();
    this.overlay = undefined;
    try {
      if (this.game?.scene.isActive('BackConfirmScene')) this.game.scene.stop('BackConfirmScene');
    } catch { /* ignore */ }
    this.primeHistoryGuard();
  }

  private static goFirstScreen(): void {
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
    this.primeHistoryGuard();
  }

  static requestExit(): void {
    if (this.exitRequested) return;
    this.exitRequested = true;
    this.overlay?.remove();
    this.overlay = undefined;
    try { window.close(); } catch (error) { console.warn('[CardVille] window.close failed', error); }
    window.setTimeout(() => {
      try {
        if (window.closed) return;
        if (window.history.length > 1) window.history.go(-Math.min(3, window.history.length - 1));
        else window.location.href = 'about:blank';
      } catch (error) {
        console.warn('[CardVille] fallback exit failed', error);
        window.location.href = 'about:blank';
      }
    }, 160);
  }
}
