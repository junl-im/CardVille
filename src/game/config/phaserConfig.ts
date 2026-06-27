import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { CollectionScene } from '../scenes/CollectionScene';
import { HomeScene } from '../scenes/HomeScene';
import { ModeSelectScene } from '../scenes/ModeSelectScene';
import { PlayScene } from '../scenes/PlayScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { SettingsScene } from '../scenes/SettingsScene';
import { TitleScene } from '../scenes/TitleScene';

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0b1029',
  physics: {
    default: 'arcade',
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    HomeScene,
    ModeSelectScene,
    PlayScene,
    CollectionScene,
    SettingsScene,
  ],
};
