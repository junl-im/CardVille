import Phaser from 'phaser';
import { AuthSystem } from '../systems/AuthSystem';
import { KakaoBrowserSystem } from '../systems/KakaoBrowserSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    KakaoBrowserSystem.install(() => {
      this.game.events.emit('cardville:back-button');
    });

    AuthSystem.boot().finally(() => {
      this.scene.start('PreloadScene');
    });
  }
}
