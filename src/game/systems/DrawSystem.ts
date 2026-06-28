import Phaser from 'phaser';
import { goldText, titleText } from '../ui/TextStyles';

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string, variant: 'village' | 'forest' = 'village'): void {
    const bgKey = variant === 'forest' ? 'assetForestBg' : 'assetVillageBg';
    if (scene.textures.exists(bgKey)) {
      scene.add.image(195, 422, bgKey).setDisplaySize(844, 844).setAlpha(0.98);
      // Comfort overlay: keep color, reduce visual noise behind cards.
      scene.add.rectangle(195, 422, 390, 844, 0x08142c, 0.22);
      scene.add.rectangle(195, 422, 390, 844, 0x123b73, 0.10);
    } else {
      const g = scene.add.graphics();
      g.fillGradientStyle(0x235aa2, 0x4b9bc5, 0x143e7b, 0x071126, 1, 1, 1, 1);
      g.fillRect(0, 0, 390, 844);
    }

    const g = scene.add.graphics();
    g.fillStyle(0xffe4a3, 0.10);
    g.fillCircle(328, 102, 118);
    g.fillStyle(0xffffff, 0.06);
    g.fillCircle(62, 122, 72);
    g.fillStyle(0x89f2ff, 0.06);
    g.fillCircle(214, 420, 266);

    // Solid 2.5D plaza silhouettes and readable bottom vignette.
    g.fillGradientStyle(0x071126, 0x071126, 0x071126, 0x071126, 0, 0, 0.52, 0.86);
    g.fillRect(0, 500, 390, 344);
    g.fillStyle(0x102452, 0.52);
    g.fillRoundedRect(-24, 690, 162, 72, 28);
    g.fillRoundedRect(248, 690, 168, 72, 28);
    g.fillStyle(0xffcf6f, 0.22);
    g.fillTriangle(18, 690, 78, 640, 138, 690);
    g.fillTriangle(262, 690, 326, 638, 390, 690);
    g.fillStyle(0xffffff, 0.13);
    g.fillRoundedRect(34, 704, 46, 34, 12);
    g.fillRoundedRect(304, 704, 46, 34, 12);

    for (let i = 0; i < 10; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      if (scene.textures.exists('particleStar') && i % 4 === 0) {
        scene.add.image(x, y, 'particleStar').setDisplaySize(10 + (i % 3) * 3, 10 + (i % 3) * 3).setAlpha(0.13);
      } else {
        scene.add.circle(x, y, 1.3 + (i % 3) * 0.9, 0xffffff, 0.08 + (i % 4) * 0.025);
      }
    }

    if (title) {
      const plate = scene.add.graphics();
      plate.fillStyle(0x061127, 0.86);
      plate.fillRoundedRect(28, 18, 334, 58, 24);
      plate.lineStyle(2, 0xffffff, 0.30);
      plate.strokeRoundedRect(28, 18, 334, 58, 24);
      plate.fillStyle(0xffffff, 0.13);
      plate.fillRoundedRect(52, 30, 286, 12, 8);
      scene.add.text(195, 48, title, titleText(24)).setOrigin(0.5);
    }
  }

  static topHud(scene: Phaser.Scene, coins: number, level: number): void {
    const g = scene.add.graphics();
    g.fillStyle(0x07142c, 0.82);
    g.fillRoundedRect(14, 82, 134, 44, 19);
    g.lineStyle(2, 0xffffff, 0.28);
    g.strokeRoundedRect(14, 82, 134, 44, 19);
    if (scene.textures.exists('assetCoin')) {
      scene.add.image(40, 104, 'assetCoin').setDisplaySize(34, 34);
    } else {
      scene.add.circle(41, 104, 18, 0xffd34f, 1).setStrokeStyle(3, 0xfff0a2, 1);
      scene.add.text(41, 104, 'C', goldText(14)).setOrigin(0.5);
    }
    scene.add.text(64, 104, `${coins}`, goldText(20)).setOrigin(0, 0.5);

    g.fillStyle(0x07142c, 0.76);
    g.fillRoundedRect(156, 82, 100, 44, 19);
    g.lineStyle(2, 0xffffff, 0.22);
    g.strokeRoundedRect(156, 82, 100, 44, 19);
    if (scene.textures.exists('assetStar')) scene.add.image(178, 104, 'assetStar').setDisplaySize(28, 28);
    scene.add.text(218, 104, `Lv.${level}`, goldText(17)).setOrigin(0.5);

    g.fillStyle(0x07142c, 0.76);
    g.fillRoundedRect(314, 82, 48, 44, 19);
    g.lineStyle(2, 0xffffff, 0.22);
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
