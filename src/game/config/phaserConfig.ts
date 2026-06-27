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
import { MissionScene } from '../scenes/MissionScene';
import { SettingsScene } from '../scenes/SettingsScene';
import { AssetGalleryScene } from '../scenes/AssetGalleryScene';
import { WorldSelectScene } from '../scenes/WorldSelectScene';
import { CardBackSelectScene } from '../scenes/CardBackSelectScene';
import { PackInfoScene } from '../scenes/PackInfoScene';
import { CardDetailScene } from '../scenes/CardDetailScene';

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
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
    SplashScene,
    LoadingScene,
    LoginScene,
    MainLobbyScene,
    ModeSelectScene,
    StageSelectScene,
    PlayScene,
    ResultScene,
    RewardScene,
    CollectionScene,
    MissionScene,
    SettingsScene,
    AssetGalleryScene,
    WorldSelectScene,
    CardBackSelectScene,
    PackInfoScene,
    CardDetailScene
  ]
};
