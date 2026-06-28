import Phaser from 'phaser';
import { titleText } from '../ui/TextStyles';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string): void {
    const g = scene.add.graphics();
    g.fillGradientStyle(0x0d2a58, 0x174d86, 0x07152f, 0x030711, 1);
    g.fillRect(0, 0, 390, 844);

    g.fillStyle(0x8fd3ff, 0.12);
    g.fillCircle(320, 112, 150);
    g.fillStyle(0xffd86f, 0.08);
    g.fillCircle(58, 734, 190);
    g.fillStyle(0xffffff, 0.045);
    g.fillRect(0, 0, 390, 844);

    for (let i = 0; i < 34; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      scene.add.circle(x, y, 1.2 + (i % 3) * 0.8, 0xffffff, 0.15 + (i % 4) * 0.035);
    }

    if (title) {
      const plate = scene.add.graphics();
      plate.fillStyle(0x061127, 0.44);
      plate.fillRoundedRect(42, 20, 306, 54, 22);
      plate.lineStyle(1, 0xffffff, 0.18);
      plate.strokeRoundedRect(42, 20, 306, 54, 22);
      scene.add.text(195, 47, title, titleText(26)).setOrigin(0.5);
    }
  }
}
