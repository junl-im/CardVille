import Phaser from 'phaser';
import './styles/index.css';
import { BootScene } from './game/scenes/BootScene';
import { LoginScene } from './game/scenes/LoginScene';
import { MainLobbyScene } from './game/scenes/MainLobbyScene';
import { ModeSelectScene } from './game/scenes/ModeSelectScene';
import { StageSelectScene } from './game/scenes/StageSelectScene';
import { PlayScene } from './game/scenes/PlayScene';
import { ResultScene } from './game/scenes/ResultScene';
import { RewardScene } from './game/scenes/RewardScene';
import { CollectionScene } from './game/scenes/CollectionScene';

declare global {
  interface Window {
    __CARDVILLE_BOOT_OK__?: () => void;
    __CARDVILLE_READY__?: boolean;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: 'app',
  width: 390,
  height: 844,
  backgroundColor: '#101a35',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  },
  scene: [BootScene, LoginScene, MainLobbyScene, ModeSelectScene, StageSelectScene, PlayScene, ResultScene, RewardScene, CollectionScene]
};

window.addEventListener('error', (event) => {
  const note = document.getElementById('boot-note');
  if (note) note.textContent = `실행 오류: ${event.message}`;
  console.error('[CardVille error]', event.error ?? event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  const note = document.getElementById('boot-note');
  if (note) note.textContent = '비동기 실행 오류가 발생했어요. 콘솔 로그를 확인해 주세요.';
  console.error('[CardVille promise]', event.reason);
});

new Phaser.Game(config);
