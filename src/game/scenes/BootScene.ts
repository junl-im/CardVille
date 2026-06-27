import Phaser from 'phaser';
import { KakaoBrowserSystem } from '../systems/KakaoBrowserSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    KakaoBrowserSystem.install(() => {
      this.game.events.emit('cardville:back-button');
    });

    this.scene.start('SplashScene');
  }
}
