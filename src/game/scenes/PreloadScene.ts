import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    this.add.text(195, 380, 'CardVille', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '38px',
      fontStyle: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(195, 430, '카드마을로 이동 중...', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#cbd8ff'
    }).setOrigin(0.5);

    this.time.delayedCall(450, () => this.scene.start('TitleScene'));
  }
}
