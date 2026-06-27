import Phaser from 'phaser';
import { GlassPanel } from '../ui/GlassPanel';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    this.drawMagicLibraryBackground();
    new GlassPanel(this, 195, 422, 320, 360, 28);

    this.add.text(195, 302, '카드마을', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '50px',
      fontStyle: '900',
      color: '#ffffff',
      stroke: '#2b3767',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(195, 354, '< CardVille >', {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: '#ffe4a3'
    }).setOrigin(0.5);

    const start = this.add.text(195, 498, '게임 시작', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '25px',
      fontStyle: '800',
      color: '#22152c',
      backgroundColor: '#ffd86f',
      padding: { left: 38, right: 38, top: 16, bottom: 16 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    start.on('pointerdown', () => this.scene.start('HomeScene'));

    this.tweens.add({
      targets: start,
      scale: 1.04,
      yoyo: true,
      repeat: -1,
      duration: 900,
      ease: 'Sine.easeInOut'
    });
  }

  private drawMagicLibraryBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x18264b, 0x18264b, 0x0c132d, 0x070b1b, 1);
    g.fillRect(0, 0, 390, 844);

    for (let i = 0; i < 70; i += 1) {
      const x = Phaser.Math.Between(0, 390);
      const y = Phaser.Math.Between(0, 844);
      const a = Phaser.Math.FloatBetween(0.08, 0.35);
      g.fillStyle(0xffe5a3, a);
      g.fillCircle(x, y, Phaser.Math.FloatBetween(1, 2.5));
    }
  }
}
