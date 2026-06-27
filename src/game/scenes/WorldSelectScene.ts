import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { ThemeSystem, WORLD_THEMES, WorldThemeDefinition } from '../systems/ThemeSystem';
import { VisualSystem } from '../systems/VisualSystem';

export class WorldSelectScene extends Phaser.Scene {
  private selectedId = ThemeSystem.getSelectedWorldId();
  private previewLayer?: Phaser.GameObjects.Container;

  constructor() {
    super('WorldSelectScene');
  }

  create(): void {
    VisualSystem.drawSelectedWorldBackground(this, 'settings');
    VisualSystem.spawnAmbientStars(this, 18);
    this.addHeader();
    this.add.text(195, 100, '월드 배경 선택', { fontSize: '32px', fontStyle: '900', color: '#ffffff', shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 14, fill: true } }).setOrigin(0.5);
    this.add.text(195, 134, '꿈의 서고 분위기를 바꾸면 로비와 주요 화면에 적용돼요.', { fontSize: '13px', color: '#d9e8ff', align: 'center', wordWrap: { width: 318 } }).setOrigin(0.5);
    this.drawWorldGrid();
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private drawWorldGrid(): void {
    this.previewLayer?.destroy();
    this.previewLayer = this.add.container(0, 0);

    WORLD_THEMES.forEach((world, index) => {
      const x = 104 + (index % 2) * 182;
      const y = 224 + Math.floor(index / 2) * 138;
      this.createWorldTile(world, x, y, index);
    });

    const apply = new GameButton(this, 195, 778, '선택 적용하고 로비로', 286, 54, 0xffd86f);
    this.previewLayer?.add(apply);
    apply.on('pointerup', () => {
      ThemeSystem.setSelectedWorldId(this.selectedId);
      VisualSystem.toast(this, '월드 배경이 적용됐어요.', 716);
      this.time.delayedCall(420, () => this.scene.start('MainLobbyScene'));
    });
  }

  private createWorldTile(world: WorldThemeDefinition, x: number, y: number, index: number): void {
    const selected = world.id === this.selectedId;
    const box = this.add.container(x, y);
    this.previewLayer?.add(box);

    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.24);
    g.fillRoundedRect(-73, -54 + 8, 146, 118, 24);
    g.fillGradientStyle(0xffffff, 0xffffff, 0xc9edff, 0xffffff, selected ? 0.22 : 0.14);
    g.fillRoundedRect(-76, -58, 152, 122, 24);
    g.lineStyle(selected ? 4 : 2, selected ? 0xffd86f : 0xffffff, selected ? 0.95 : 0.28);
    g.strokeRoundedRect(-76, -58, 152, 122, 24);

    const thumb = this.textures.exists(world.textureKey)
      ? this.add.image(0, -18, world.textureKey).setDisplaySize(128, 62).setOrigin(0.5)
      : this.add.rectangle(0, -18, 128, 62, world.accent, 0.55);
    const maskShape = this.add.graphics();
    maskShape.fillStyle(0xffffff, 1);
    maskShape.fillRoundedRect(x - 64, y - 49, 128, 62, 18);
    const mask = maskShape.createGeometryMask();
    thumb.setMask(mask);
    maskShape.setVisible(false);

    const title = this.add.text(0, 28, world.title, { fontSize: '15px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    const sub = this.add.text(0, 49, selected ? '선택됨' : '터치해서 선택', { fontSize: '10px', fontStyle: '800', color: selected ? '#ffe4a3' : '#cfe8ff' }).setOrigin(0.5);
    box.add([g, thumb, title, sub]);
    box.setSize(152, 122).setInteractive(new Phaser.Geom.Rectangle(-76, -58, 152, 122), Phaser.Geom.Rectangle.Contains);
    box.on('pointerup', () => {
      this.selectedId = world.id;
      this.drawWorldGrid();
    });
    box.setAlpha(0).setScale(0.92);
    this.tweens.add({ targets: box, alpha: 1, scale: 1, delay: index * 28, duration: 220, ease: 'Back.easeOut' });
  }
}
