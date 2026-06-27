import Phaser from 'phaser';
import './styles/index.css';
import { phaserConfig } from './game/config/phaserConfig';
import { prepareRuntimeCache, registerServiceWorker } from './pwa/registerServiceWorker';
import { installGlobalErrorReporter, installStartupGuard, markGameBooted, showBootError } from './diagnostics/startupGuard';

installGlobalErrorReporter();
installStartupGuard();

async function startCardVille(): Promise<void> {
  try {
    await prepareRuntimeCache();

    registerServiceWorker();

    const game = new Phaser.Game(phaserConfig);

    game.events.once(Phaser.Core.Events.READY, () => {
      window.setTimeout(markGameBooted, 240);
    });

    window.setTimeout(markGameBooted, 1800);

    window.addEventListener('beforeunload', () => {
      game.events.emit('cardville:before-unload');
    });
  } catch (error) {
    console.error('[CardVille] Fatal boot error', error);
    showBootError(error);
  }
}

void startCardVille();
