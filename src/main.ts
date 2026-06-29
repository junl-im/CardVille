import Phaser from 'phaser';
import './styles/index.css';
import { preventBrowserGestures } from './game/systems/LayoutSystem';
import { BackButtonSystem } from './game/systems/BackButtonSystem';
import { BootScene } from './game/scenes/BootScene';
import { IntroLoadingScene } from './game/scenes/IntroLoadingScene';
import { LoginScene } from './game/scenes/LoginScene';
import { MainLobbyScene } from './game/scenes/MainLobbyScene';
import { ModeSelectScene } from './game/scenes/ModeSelectScene';
import { StageSelectScene } from './game/scenes/StageSelectScene';
import { PlayScene } from './game/scenes/PlayScene';
import { MathLabScene } from './game/scenes/MathLabScene';
import { MemoryForestScene } from './game/scenes/MemoryForestScene';
import { ResultScene } from './game/scenes/ResultScene';
import { RewardScene } from './game/scenes/RewardScene';
import { CollectionScene } from './game/scenes/CollectionScene';
import { ShopScene } from './game/scenes/ShopScene';
import { BackConfirmScene } from './game/scenes/BackConfirmScene';

declare global {
  interface Window {
    __CARDVILLE_BOOT_OK__?: () => void;
    __CARDVILLE_READY__?: boolean;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 390,
  height: 844,
  backgroundColor: '#071126',
  scale: {
    mode: Phaser.Scale.EXPAND,
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
  scene: [
    BootScene,
    IntroLoadingScene,
    LoginScene,
    MainLobbyScene,
    ModeSelectScene,
    StageSelectScene,
    PlayScene,
    MathLabScene,
    MemoryForestScene,
    ResultScene,
    RewardScene,
    CollectionScene,
    ShopScene,
    BackConfirmScene
  ]
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

preventBrowserGestures();
const game = new Phaser.Game(config);
BackButtonSystem.install(game);
console.info('[CardVille] Phaser instance created 1.0.37 content scale reward UX / 1.0.36 shop offer cooldown UX / word combo recovery coach / backconfirm scene cleanup / start-ui polish / shop economy hub / content engine / quality audit engine / polish audit engine', game.isBooted);
