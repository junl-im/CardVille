import Phaser from 'phaser';
import { goldText, titleText } from '../ui/TextStyles';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string, variant: 'village' | 'forest' = 'village'): void {
    const bgKey = variant === 'forest' ? 'assetForestBg' : 'assetVillageBg';
    if (scene.textures.exists(bgKey)) {
      scene.add.image(195, 422, bgKey).setDisplaySize(844, 844).setAlpha(0.92);
      scene.add.rectangle(195, 422, 390, 844, 0x071126, 0.18);
      scene.add.rectangle(195, 422, 390, 844, 0x235aa2, 0.10);
    } else {
      const g = scene.add.graphics();
      g.fillGradientStyle(0x235aa2, 0x4b9bc5, 0x143e7b, 0x071126, 1, 1, 1, 1);
      g.fillRect(0, 0, 390, 844);
    }

    const g = scene.add.graphics();
    g.fillStyle(0xffe4a3, 0.12);
    g.fillCircle(328, 102, 118);
    g.fillStyle(0xffffff, 0.08);
    g.fillCircle(62, 122, 72);
    g.fillStyle(0x89f2ff, 0.08);
    g.fillCircle(214, 420, 266);
    g.fillStyle(0xff7fc7, 0.05);
    g.fillCircle(44, 726, 184);

    // Bottom readable vignette, keeping the 2.5D illustration visible but not noisy.
    g.fillGradientStyle(0x071126, 0x071126, 0x071126, 0x071126, 0, 0, 0.36, 0.74);
    g.fillRect(0, 520, 390, 324);

    // Cute floating card sparkles. Pure Phaser graphics; no SVG.
    for (let i = 0; i < 13; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      scene.add.circle(x, y, 1.3 + (i % 3) * 0.9, 0xffffff, 0.12 + (i % 4) * 0.035);
    }

    if (title) {
      const plate = scene.add.graphics();
      plate.fillStyle(0x061127, 0.72);
      plate.fillRoundedRect(32, 20, 326, 56, 24);
      plate.lineStyle(1, 0xffffff, 0.26);
      plate.strokeRoundedRect(32, 20, 326, 56, 24);
      plate.fillStyle(0xffffff, 0.11);
      plate.fillRoundedRect(52, 30, 286, 12, 8);
      scene.add.text(195, 48, title, titleText(24)).setOrigin(0.5);
    }
  }

  static topHud(scene: Phaser.Scene, coins: number, level: number): void {
    const g = scene.add.graphics();
    g.fillStyle(0x07142c, 0.68);
    g.fillRoundedRect(14, 82, 134, 44, 19);
    g.lineStyle(1, 0xffffff, 0.24);
    g.strokeRoundedRect(14, 82, 134, 44, 19);
    if (scene.textures.exists('assetCoin')) {
      scene.add.image(40, 104, 'assetCoin').setDisplaySize(34, 34);
    } else {
      scene.add.circle(41, 104, 18, 0xffd34f, 1).setStrokeStyle(3, 0xfff0a2, 1);
      scene.add.text(41, 104, 'C', goldText(14)).setOrigin(0.5);
    }
    scene.add.text(64, 104, `${coins}`, goldText(20)).setOrigin(0, 0.5);

    g.fillStyle(0x07142c, 0.54);
    g.fillRoundedRect(156, 82, 100, 44, 19);
    g.lineStyle(1, 0xffffff, 0.18);
    g.strokeRoundedRect(156, 82, 100, 44, 19);
    if (scene.textures.exists('assetStar')) scene.add.image(178, 104, 'assetStar').setDisplaySize(28, 28);
    scene.add.text(218, 104, `Lv.${level}`, goldText(17)).setOrigin(0.5);

    g.fillStyle(0x07142c, 0.54);
    g.fillRoundedRect(314, 82, 48, 44, 19);
    g.lineStyle(1, 0xffffff, 0.18);
    g.strokeRoundedRect(314, 82, 48, 44, 19);
    if (scene.textures.exists('assetSettings')) {
      scene.add.image(338, 104, 'assetSettings').setDisplaySize(32, 32);
    } else {
      scene.add.text(338, 104, '⚙', { fontSize: '27px' }).setOrigin(0.5);
    }
  }

  static assetIcon(scene: Phaser.Scene, key: string, x: number, y: number, size = 40, alpha = 1): Phaser.GameObjects.Image | null {
    if (!scene.textures.exists(key)) return null;
    return scene.add.image(x, y, key).setDisplaySize(size, size).setAlpha(alpha);
  }
}
