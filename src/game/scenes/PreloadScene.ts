import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/phaserConfig';
import { drawWorldBackground } from '../ui/SceneHelpers';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    drawWorldBackground(this);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, '카드마을', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '38px',
        fontStyle: '900',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 28, '마법 카드를 준비하는 중...', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
        color: '#d8e0ff',
      })
      .setOrigin(0.5);
  }

  create(): void {
    this.time.delayedCall(450, () => this.scene.start('TitleScene'));
  }
}
