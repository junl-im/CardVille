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
      window.setTimeout(() => {
        markGameBooted();
      }, 240);
    });

    window.setTimeout(() => {
      if (window.__CARDVILLE_APP_STARTED__) return;
      const app = document.getElementById('app');
      const note = app?.querySelector<HTMLElement>('.cv-boot-note');
      if (note) {
        note.textContent = '게임 엔진 응답이 늦어지고 있어요. 배포된 JS 파일과 브라우저 호환성을 확인 중입니다.';
      }
    }, 4500);

    window.addEventListener('beforeunload', () => {
      game.events.emit('cardville:before-unload');
    });
  } catch (error) {
    console.error('[CardVille] Fatal boot error', error);
    showBootError(error);
  }
}

void startCardVille();
