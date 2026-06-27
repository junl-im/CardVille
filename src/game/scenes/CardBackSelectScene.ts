import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { CARD_BACKS, CardBackDefinition, ThemeSystem } from '../systems/ThemeSystem';
import { VisualSystem } from '../systems/VisualSystem';

export class CardBackSelectScene extends Phaser.Scene {
  private selectedId = ThemeSystem.getSelectedCardBackId();
  private layer?: Phaser.GameObjects.Container;

  constructor() {
    super('CardBackSelectScene');
  }

  create(): void {
    VisualSystem.drawSelectedWorldBackground(this, 'album');
    VisualSystem.spawnAmbientStars(this, 18);
    this.addHeader();
    new GlassPanel(this, 195, 116, 334, 98, 28, 0.15);
    this.add.text(195, 92, '카드 뒷면 선택', { fontSize: '31px', fontStyle: '900', color: '#ffffff', shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 14, fill: true } }).setOrigin(0.5);
    this.add.text(195, 126, '선택한 뒷면은 카드 연출과 앨범 미리보기에 사용돼요.', { fontSize: '13px', color: '#d9e8ff', align: 'center', wordWrap: { width: 300 } }).setOrigin(0.5);
    this.drawGrid();
    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private addHeader(): void {
    this.add.text(34, 54, '‹ 로비', { fontSize: '20px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private drawGrid(): void {
    this.layer?.destroy();
    this.layer = this.add.container(0, 0);
    CARD_BACKS.forEach((back, index) => {
      const x = 80 + (index % 3) * 115;
      const y = 226 + Math.floor(index / 3) * 148;
      this.createBackCard(back, x, y, index);
    });

    const apply = new GameButton(this, 195, 778, '선택 적용', 286, 54, 0xffd86f);
    this.layer?.add(apply);
    apply.on('pointerup', () => {
      ThemeSystem.setSelectedCardBackId(this.selectedId);
      VisualSystem.toast(this, '카드 뒷면이 적용됐어요.', 716);
      this.time.delayedCall(420, () => this.scene.start('MainLobbyScene'));
    });
  }

  private createBackCard(back: CardBackDefinition, x: number, y: number, index: number): void {
    const selected = back.id === this.selectedId;
    const box = this.add.container(x, y);
    this.layer?.add(box);
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.24);
    g.fillRoundedRect(-42, -58 + 8, 84, 128, 22);
    g.fillGradientStyle(0xffffff, 0xffffff, 0xd9efff, 0xfff0c0, selected ? 0.22 : 0.13);
    g.fillRoundedRect(-45, -64, 90, 132, 22);
    g.lineStyle(selected ? 4 : 2, selected ? 0xffd86f : 0xffffff, selected ? 0.96 : 0.28);
    g.strokeRoundedRect(-45, -64, 90, 132, 22);

    const image = this.textures.exists(back.textureKey)
      ? this.add.image(0, -8, back.textureKey).setDisplaySize(72, 102).setOrigin(0.5)
      : this.add.rectangle(0, -8, 72, 102, back.accent, 0.8);
    const label = this.add.text(0, 56, back.title, { fontSize: '12px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    const mark = selected ? this.add.text(29, -57, '✓', { fontSize: '17px', fontStyle: '900', color: '#17243c', backgroundColor: 'rgba(255,216,111,0.95)', padding: { left: 5, right: 5, top: 2, bottom: 2 } }).setOrigin(0.5) : null;
    box.add(mark ? [g, image, label, mark] : [g, image, label]);
    box.setSize(90, 132).setInteractive(new Phaser.Geom.Rectangle(-45, -64, 90, 132), Phaser.Geom.Rectangle.Contains);
    box.on('pointerup', () => { this.selectedId = back.id; this.drawGrid(); });
    box.setAlpha(0).setScale(0.92);
    this.tweens.add({ targets: box, alpha: 1, scale: 1, delay: index * 28, duration: 220, ease: 'Back.easeOut' });
  }
}
