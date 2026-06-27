import Phaser from 'phaser';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string): void {
    const g = scene.add.graphics();
    g.fillGradientStyle(0x1a4d82, 0x2f6fa3, 0x10224b, 0x070b1c, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0x8fd3ff, 0.08); g.fillCircle(318, 120, 142);
    g.fillStyle(0xffd86f, 0.06); g.fillCircle(66, 732, 180);
    for (let i = 0; i < 26; i += 1) {
      const x = 24 + ((i * 83) % 344);
      const y = 40 + ((i * 127) % 760);
      scene.add.circle(x, y, 1.4 + (i % 3), 0xffffff, 0.12 + (i % 4) * 0.04);
    }
    if (title) {
      scene.add.text(195, 46, title, { fontSize: '28px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    }
  }
}
