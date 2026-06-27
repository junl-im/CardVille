import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { SplashScene } from '../scenes/SplashScene';
import { LoadingScene } from '../scenes/LoadingScene';
import { LoginScene } from '../scenes/LoginScene';
import { MainLobbyScene } from '../scenes/MainLobbyScene';
import { ModeSelectScene } from '../scenes/ModeSelectScene';
import { StageSelectScene } from '../scenes/StageSelectScene';
import { PlayScene } from '../scenes/PlayScene';
import { ResultScene } from '../scenes/ResultScene';
import { RewardScene } from '../scenes/RewardScene';
import { CollectionScene } from '../scenes/CollectionScene';

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#101a35',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  dom: {
    createContainer: true
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  },
  scene: [
    BootScene,
    SplashScene,
    LoadingScene,
    LoginScene,
    MainLobbyScene,
    ModeSelectScene,
    StageSelectScene,
    PlayScene,
    ResultScene,
    RewardScene,
    CollectionScene
  ]
};
