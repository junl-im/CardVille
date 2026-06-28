import Phaser from 'phaser';
import { titleText } from '../ui/TextStyles';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string): void {
    const g = scene.add.graphics();
    g.fillGradientStyle(0x10295c, 0x245a95, 0x08203f, 0x06101f, 1);
    g.fillRect(0, 0, 390, 844);

    g.fillStyle(0x9bdcff, 0.14);
    g.fillCircle(316, 118, 152);
    g.fillStyle(0xffd86f, 0.1);
    g.fillCircle(64, 724, 184);
    g.fillStyle(0x82f3ff, 0.055);
    g.fillCircle(194, 424, 260);

    // CardVille village silhouette: soft roofs and card towers.
    g.fillStyle(0x061127, 0.38);
    for (let i = 0; i < 6; i += 1) {
      const x = 24 + i * 68;
      const h = 44 + (i % 3) * 18;
      g.fillRoundedRect(x, 662 - h, 46, h, 8);
      g.fillTriangle(x - 4, 662 - h + 6, x + 23, 662 - h - 20, x + 50, 662 - h + 6);
    }

    g.fillStyle(0xffffff, 0.045);
    g.fillRect(0, 0, 390, 844);

    for (let i = 0; i < 34; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      scene.add.circle(x, y, 1.2 + (i % 3) * 0.8, 0xffffff, 0.15 + (i % 4) * 0.035);
    }

    if (title) {
      const plate = scene.add.graphics();
      plate.fillStyle(0x061127, 0.54);
      plate.fillRoundedRect(42, 20, 306, 54, 22);
      plate.lineStyle(1, 0xffffff, 0.22);
      plate.strokeRoundedRect(42, 20, 306, 54, 22);
      scene.add.text(195, 47, title, titleText(25)).setOrigin(0.5);
    }
  }
}
