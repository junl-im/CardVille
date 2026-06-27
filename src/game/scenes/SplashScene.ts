import Phaser from 'phaser';

export class SplashScene extends Phaser.Scene {
  constructor() {
    super('SplashScene');
  }

  create(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x173b70, 0x173b70, 0x0b1534, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);

    const orb = this.add.graphics();
    orb.fillStyle(0x8fd3ff, 0.23);
    orb.fillCircle(0, 0, 96);
    orb.lineStyle(3, 0xffffff, 0.45);
    orb.strokeCircle(0, 0, 96);
    orb.setPosition(195, 350);

    this.add.text(195, 346, 'CV', {
      fontFamily: 'Georgia, serif',
      fontSize: '66px',
      fontStyle: '900',
      color: '#ffffff',
      stroke: '#21436d',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(195, 482, '카드마을', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '44px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(195, 528, '< CardVille >', {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: '#ffe4a3'
    }).setOrigin(0.5);

    this.tweens.add({ targets: orb, scale: 1.06, alpha: 0.82, yoyo: true, repeat: -1, duration: 850 });
    this.time.delayedCall(1000, () => this.scene.start('LoadingScene'));
  }
}
