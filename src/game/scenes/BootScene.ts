import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload(): void {
    this.load.image('loginBg', 'assets/ui/cardville_login_bg.png');
    this.load.video('introVideo', 'assets/video/cardville_intro_loading.mp4', true);
  }

  create(): void {
    window.__CARDVILLE_BOOT_OK__?.();
    this.scene.start('IntroLoadingScene');
  }
}
