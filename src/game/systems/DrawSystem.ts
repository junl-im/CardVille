import Phaser from 'phaser';
import { goldText, titleText } from '../ui/TextStyles';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string): void {
    const g = scene.add.graphics();
    g.fillGradientStyle(0x17386f, 0x2f71aa, 0x0e2b59, 0x061126, 1);
    g.fillRect(0, 0, 390, 844);

    g.fillStyle(0x9bdcff, 0.11);
    g.fillCircle(318, 116, 150);
    g.fillStyle(0xffd86f, 0.09);
    g.fillCircle(64, 724, 184);
    g.fillStyle(0x82f3ff, 0.05);
    g.fillCircle(194, 424, 260);

    // CardVille village: card-shaped houses, roof silhouettes, and soft board-game depth.
    g.fillStyle(0x061127, 0.34);
    for (let i = 0; i < 6; i += 1) {
      const x = 18 + i * 69;
      const h = 42 + (i % 3) * 18;
      g.fillRoundedRect(x, 666 - h, 48, h, 8);
      g.fillTriangle(x - 5, 666 - h + 5, x + 24, 666 - h - 20, x + 53, 666 - h + 5);
      g.fillStyle(0xffffff, 0.05);
      g.fillRoundedRect(x + 13, 666 - h + 18, 16, 22, 4);
      g.fillStyle(0x061127, 0.34);
    }

    g.fillStyle(0xffffff, 0.045);
    g.fillRect(0, 0, 390, 844);

    for (let i = 0; i < 34; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      scene.add.circle(x, y, 1.2 + (i % 3) * 0.8, 0xffffff, 0.13 + (i % 4) * 0.032);
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

  static topHud(scene: Phaser.Scene, coins: number, level: number): void {
    const g = scene.add.graphics();
    g.fillStyle(0x07142c, 0.58);
    g.fillRoundedRect(18, 82, 118, 42, 18);
    g.lineStyle(1, 0xffffff, 0.18);
    g.strokeRoundedRect(18, 82, 118, 42, 18);
    scene.add.circle(40, 103, 17, 0xffd34f, 1).setStrokeStyle(3, 0xfff0a2, 1);
    scene.add.text(59, 103, `${coins}`, goldText(21)).setOrigin(0, 0.5);

    g.fillStyle(0x07142c, 0.28);
    g.fillRoundedRect(152, 82, 92, 42, 18);
    scene.add.text(198, 103, `Lv.${level}`, goldText(18)).setOrigin(0.5);

    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(340, 102, 20);
    g.fillStyle(0x102854, 1);
    for (let i = 0; i < 8; i += 1) {
      const a = (Math.PI * 2 * i) / 8;
      g.fillCircle(340 + Math.cos(a) * 15, 102 + Math.sin(a) * 15, 4);
    }
    g.fillCircle(340, 102, 8);
  }
}
