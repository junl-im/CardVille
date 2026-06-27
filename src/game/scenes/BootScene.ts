import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create(): void {
    window.__CARDVILLE_BOOT_OK__?.();
    this.scene.start('LoginScene');
  }
}
