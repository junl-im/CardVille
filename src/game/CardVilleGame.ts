import Phaser from 'phaser';
import { phaserConfig } from './config/phaserConfig';

export class CardVilleGame extends Phaser.Game {
  constructor(parent: string) {
    super({ ...phaserConfig, parent });
  }
}
