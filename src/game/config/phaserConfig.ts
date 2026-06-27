import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { TitleScene } from '../scenes/TitleScene';
import { HomeScene } from '../scenes/HomeScene';
import { PlayScene } from '../scenes/PlayScene';
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
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  },
  scene: [BootScene, PreloadScene, TitleScene, HomeScene, PlayScene, CollectionScene]
};
