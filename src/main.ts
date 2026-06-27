import Phaser from 'phaser';
import './styles/index.css';
import { phaserConfig } from './game/config/phaserConfig';
import { initializeFirebaseRuntime } from './firebase/firebaseApp';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import { installGlobalErrorReporter, installStartupGuard, markGameBooted, showBootError } from './diagnostics/startupGuard';

installGlobalErrorReporter();
installStartupGuard();

async function startCardVille(): Promise<void> {
  try {
    initializeFirebaseRuntime().catch((error) => {
      console.warn('[CardVille] Firebase runtime init skipped.', error);
    });

    registerServiceWorker();

    const game = new Phaser.Game(phaserConfig);

    game.events.once(Phaser.Core.Events.READY, () => {
      window.setTimeout(markGameBooted, 240);
    });

    window.addEventListener('beforeunload', () => {
      game.events.emit('cardville:before-unload');
    });
  } catch (error) {
    console.error('[CardVille] Fatal boot error', error);
    showBootError(error);
  }
}

void startCardVille();
