import Phaser from 'phaser';
import { goldText, titleText } from '../ui/TextStyles';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string): void {
    const g = scene.add.graphics();
    g.fillGradientStyle(0x235aa2, 0x4b9bc5, 0x143e7b, 0x071126, 1, 1, 1, 1);
    g.fillRect(0, 0, 390, 844);

    g.fillStyle(0xffe4a3, 0.18);
    g.fillCircle(328, 102, 118);
    g.fillStyle(0xffffff, 0.09);
    g.fillCircle(62, 122, 72);
    g.fillStyle(0x89f2ff, 0.07);
    g.fillCircle(214, 420, 266);
    g.fillStyle(0xff7fc7, 0.06);
    g.fillCircle(44, 726, 184);

    // Soft 2.5D CardVille hills.
    g.fillStyle(0x0d2a57, 0.35);
    g.fillEllipse(190, 716, 520, 160);
    g.fillStyle(0x173d78, 0.42);
    g.fillEllipse(92, 724, 290, 120);
    g.fillEllipse(314, 724, 300, 128);

    // Card-shaped houses and tiny roofs. Pure Phaser graphics; no SVG.
    const houses = [
      { x: 24, y: 650, w: 44, h: 58, c: 0xffd86f },
      { x: 82, y: 632, w: 52, h: 78, c: 0xff8dc7 },
      { x: 151, y: 642, w: 50, h: 68, c: 0x8fd3ff },
      { x: 214, y: 626, w: 58, h: 86, c: 0x7cf2bd },
      { x: 291, y: 646, w: 52, h: 64, c: 0xf0c7ff },
      { x: 350, y: 636, w: 42, h: 74, c: 0xffb24f }
    ];
    for (const house of houses) {
      g.fillStyle(0x000000, 0.18);
      g.fillRoundedRect(house.x + 4, house.y + 7, house.w, house.h, 10);
      g.fillStyle(house.c, 0.38);
      g.fillRoundedRect(house.x, house.y, house.w, house.h, 10);
      g.lineStyle(2, 0xffffff, 0.3);
      g.strokeRoundedRect(house.x, house.y, house.w, house.h, 10);
      g.fillStyle(0x071126, 0.24);
      g.fillTriangle(house.x - 5, house.y + 8, house.x + house.w / 2, house.y - 18, house.x + house.w + 5, house.y + 8);
      g.fillStyle(0xffffff, 0.18);
      g.fillRoundedRect(house.x + house.w * 0.32, house.y + house.h * 0.42, house.w * 0.32, house.h * 0.32, 4);
    }

    // Floating mini cards for depth.
    for (let i = 0; i < 13; i += 1) {
      const x = 28 + ((i * 91) % 336);
      const y = 98 + ((i * 137) % 520);
      const rot = ((i % 5) - 2) * 0.08;
      g.fillStyle(0xffffff, 0.055 + (i % 3) * 0.012);
      g.fillRoundedRect(x, y, 24, 32, 6);
      g.lineStyle(1, 0xffffff, 0.08);
      g.strokeRoundedRect(x, y, 24, 32, 6);
      if (rot) {
        // Graphics cannot rotate a single previous rect cheaply, so small static cards are kept simple.
      }
    }

    for (let i = 0; i < 34; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      scene.add.circle(x, y, 1.2 + (i % 3) * 0.8, 0xffffff, 0.12 + (i % 4) * 0.03);
    }

    if (title) {
      const plate = scene.add.graphics();
      plate.fillStyle(0x061127, 0.64);
      plate.fillRoundedRect(40, 20, 310, 56, 24);
      plate.lineStyle(1, 0xffffff, 0.24);
      plate.strokeRoundedRect(40, 20, 310, 56, 24);
      plate.fillStyle(0xffffff, 0.1);
      plate.fillRoundedRect(58, 30, 274, 12, 8);
      scene.add.text(195, 48, title, titleText(25)).setOrigin(0.5);
    }
  }

  static topHud(scene: Phaser.Scene, coins: number, level: number): void {
    const g = scene.add.graphics();
    g.fillStyle(0x07142c, 0.62);
    g.fillRoundedRect(18, 82, 122, 44, 19);
    g.lineStyle(1, 0xffffff, 0.2);
    g.strokeRoundedRect(18, 82, 122, 44, 19);
    scene.add.circle(41, 104, 18, 0xffd34f, 1).setStrokeStyle(3, 0xfff0a2, 1);
    scene.add.text(41, 104, 'C', goldText(14)).setOrigin(0.5);
    scene.add.text(64, 104, `${coins}`, goldText(20)).setOrigin(0, 0.5);

    g.fillStyle(0x07142c, 0.44);
    g.fillRoundedRect(154, 82, 96, 44, 19);
    g.lineStyle(1, 0xffffff, 0.16);
    g.strokeRoundedRect(154, 82, 96, 44, 19);
    scene.add.text(202, 104, `Lv.${level}`, goldText(17)).setOrigin(0.5);

    g.fillStyle(0xffffff, 0.92);
    g.fillCircle(340, 104, 21);
    g.fillStyle(0x102854, 1);
    for (let i = 0; i < 8; i += 1) {
      const a = (Math.PI * 2 * i) / 8;
      g.fillCircle(340 + Math.cos(a) * 15, 104 + Math.sin(a) * 15, 4);
    }
    g.fillCircle(340, 104, 8);
  }
}
