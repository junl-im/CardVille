import Phaser from 'phaser';
import './styles/index.css';
import { phaserConfig } from './game/config/phaserConfig';
import { prepareRuntimeCache, registerServiceWorker } from './pwa/registerServiceWorker';
import { installGlobalErrorReporter, installStartupGuard, markGameBooted, showBootError } from './diagnostics/startupGuard';

window.__CARDVILLE_APP_STARTED__ = true;
window.__CARDVILLE_MARK_HTML_BOOTED__?.();
installGlobalErrorReporter();
installStartupGuard();

async function startCardVille(): Promise<void> {
  try {
    await prepareRuntimeCache();

    registerServiceWorker();

    const game = new Phaser.Game(phaserConfig);

    game.events.once(Phaser.Core.Events.READY, () => {
      window.setTimeout(() => {
        markGameBooted();
        window.__CARDVILLE_MARK_HTML_BOOTED__?.();
      }, 240);
    });

    window.setTimeout(() => {
      markGameBooted();
      window.__CARDVILLE_MARK_HTML_BOOTED__?.();
    }, 1800);

    window.addEventListener('beforeunload', () => {
      game.events.emit('cardville:before-unload');
    });
  } catch (error) {
    console.error('[CardVille] Fatal boot error', error);
    showBootError(error);
  }
}

void startCardVille();
