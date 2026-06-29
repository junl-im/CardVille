import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload(): void {
    // Keep the first visit fast. Only load the opening screen assets here.
    // The intro movie and gameplay UI assets load after the player taps Game Start.
    this.load.image('loginBg', 'assets/ui/cardville_login_bg.png');
    this.load.image('assetButtonLarge', 'assets/buttons/button_large_plain_normal.png');
    this.load.image('assetButtonLargePress', 'assets/buttons/button_large_plain_press.png');
    this.load.image('assetButtonMedium', 'assets/buttons/button_medium_plain_normal.png');
    this.load.image('assetButtonMediumPress', 'assets/buttons/button_medium_plain_press.png');
    this.load.image('assetButtonSmall', 'assets/buttons/button_small_plain_normal.png');
    this.load.image('assetButtonSmallPress', 'assets/buttons/button_small_plain_press.png');
  }

  create(): void {
    NavigationSystem.safeStart(this, 'LoginScene');
  }
}
