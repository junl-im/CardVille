import Phaser from 'phaser';
import { goldText, titleText } from '../ui/TextStyles';
import { addCoverImage, layout } from './LayoutSystem';

export type CardVilleSceneBackdropVariant = 'village' | 'forest' | 'library' | 'lab' | 'shop' | 'palace';

export const CARDVILLE_SCENE_BACKDROP_TAG = 'scene-premium-backdrop-v155' as const;
const CARDVILLE_LEGACY_LAYOUT_TOKEN = '2.5D plaza';

const BACKDROP_BY_VARIANT: Record<CardVilleSceneBackdropVariant, { key: string; sourceW: number; sourceH: number; tint: number; overlay: number }> = {
  village: { key: 'assetVillageBg', sourceW: 780, sourceH: 1688, tint: 0x07142c, overlay: 0.20 },
  forest: { key: 'bgMemoryForestPremium', sourceW: 780, sourceH: 1688, tint: 0x082417, overlay: 0.18 },
  library: { key: 'bgLibraryGreatHallPremium', sourceW: 780, sourceH: 1688, tint: 0x07142c, overlay: 0.18 },
  lab: { key: 'bgStarMagicLabPremium', sourceW: 780, sourceH: 1688, tint: 0x111034, overlay: 0.19 },
  shop: { key: 'bgShopInteriorPremium', sourceW: 780, sourceH: 1688, tint: 0x160d1d, overlay: 0.16 },
  palace: { key: 'bgGrandPalacePremium', sourceW: 780, sourceH: 1688, tint: 0x07142c, overlay: 0.18 }
};

export class DrawSystem {
  static background(scene: Phaser.Scene, title?: string, variant: CardVilleSceneBackdropVariant = 'village'): void {
    const config = BACKDROP_BY_VARIANT[variant] ?? BACKDROP_BY_VARIANT.village;
    const fallbackKey = variant === 'forest' ? 'assetForestBg' : 'assetVillageBg';
    const l = layout(scene);
    const key = scene.textures.exists(config.key) ? config.key : fallbackKey;
    if (scene.textures.exists(key)) {
      addCoverImage(scene, key, 0.99, config.sourceW, config.sourceH)?.setName(`${CARDVILLE_SCENE_BACKDROP_TAG}:${variant}`);
      scene.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, config.tint, config.overlay);
      scene.add.rectangle(l.visibleX + l.visibleWidth / 2, 96, l.visibleWidth, 190 + l.extraY, 0x020814, 0.20);
      scene.add.rectangle(l.visibleX + l.visibleWidth / 2, 720, l.visibleWidth, 250 + l.extraY, 0x020814, 0.44);
    } else {
      const g = scene.add.graphics();
      g.fillGradientStyle(0x235aa2, 0x4b9bc5, 0x143e7b, 0x071126, 1, 1, 1, 1);
      g.fillRect(l.visibleX, l.visibleY, l.visibleWidth, l.visibleHeight);
    }

    const g = scene.add.graphics();
    g.setName(`premium-scene-frame:${CARDVILLE_SCENE_BACKDROP_TAG}`);
    g.fillStyle(0xffe4a3, 0.07);
    g.fillCircle(328, 102, 118);
    g.fillStyle(0xffffff, 0.05);
    g.fillCircle(62, 122, 72);
    g.fillStyle(0x89f2ff, 0.045);
    g.fillCircle(214, 420, 266);
    g.fillGradientStyle(0x071126, 0x071126, 0x071126, 0x071126, 0, 0, 0.18, 0.72);
    g.fillRect(l.visibleX, 548, l.visibleWidth, 296 + l.extraY);
    g.lineStyle(1, 0xffffff, 0.12);
    g.strokeRoundedRect(l.visibleX + 14, 88, l.visibleWidth - 28, 666, 32);
    g.lineStyle(1, 0xffd86f, 0.16);
    g.strokeRoundedRect(l.visibleX + 22, 96, l.visibleWidth - 44, 648, 28);

    for (let i = 0; i < 8; i += 1) {
      const x = 18 + ((i * 83) % 354);
      const y = 34 + ((i * 127) % 770);
      if (scene.textures.exists('particleStar') && i % 3 === 0) {
        scene.add.image(x, y, 'particleStar').setDisplaySize(10 + (i % 3) * 3, 10 + (i % 3) * 3).setAlpha(0.12);
      } else {
        scene.add.circle(x, y, 1.3 + (i % 3) * 0.9, 0xffffff, 0.07 + (i % 4) * 0.018);
      }
    }

    if (title) {
      const plate = scene.add.graphics();
      plate.fillStyle(0x061127, 0.88);
      plate.fillRoundedRect(26, 18, 338, 58, 24);
      plate.lineStyle(2, 0xffffff, 0.34);
      plate.strokeRoundedRect(26, 18, 338, 58, 24);
      plate.lineStyle(1, 0xffd86f, 0.32);
      plate.strokeRoundedRect(34, 25, 322, 44, 18);
      plate.fillStyle(0xffffff, 0.13);
      plate.fillRoundedRect(54, 30, 282, 12, 8);
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
