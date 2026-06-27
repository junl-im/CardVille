import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.registry.set('coins', 0);
    this.registry.set('gems', 0);
    this.registry.set('stageIndex', 0);
    this.scene.start('PreloadScene');
  }
}
