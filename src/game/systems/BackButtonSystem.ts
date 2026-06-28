import Phaser from 'phaser';

export class BackButtonSystem {
  private static installed = false;
  private static game?: Phaser.Game;

  static install(game: Phaser.Game): void {
    if (this.installed || typeof window === 'undefined') return;
    this.installed = true;
    this.game = game;

    try {
      const state = typeof history.state === 'object' && history.state ? history.state : {};
      history.replaceState({ ...state, cardvilleRoot: true }, '', window.location.href);
      history.pushState({ cardvilleBackGuard: true }, '', window.location.href);
    } catch (error) {
      console.warn('[CardVille] back guard history init failed', error);
    }

    window.addEventListener('popstate', () => {
      const currentGame = BackButtonSystem.game;
      if (!currentGame) return;

      const confirmScene = currentGame.scene.getScene('BackConfirmScene') as unknown as { requestExit?: () => void };
      if (currentGame.scene.isActive('BackConfirmScene')) {
        confirmScene.requestExit?.();
        return;
      }

      try {
        history.pushState({ cardvilleBackGuard: true }, '', window.location.href);
      } catch (error) {
        console.warn('[CardVille] back guard repush failed', error);
      }

      (currentGame.scene as any).launch('BackConfirmScene');
      currentGame.scene.bringToTop('BackConfirmScene');
    });
  }
}
