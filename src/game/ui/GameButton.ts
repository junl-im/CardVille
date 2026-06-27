import Phaser from 'phaser';

export class GameButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, width = 280, height = 58, color = 0x8fd3ff) {
    super(scene, x, y);
    scene.add.existing(this);
    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, {
      fontSize: '18px',
      fontStyle: '900',
      color: '#14233f',
      align: 'center'
    }).setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.draw(width, height, color, false);
    this.setSize(width + 18, height + 18);
    this.setInteractive(new Phaser.Geom.Rectangle(-(width + 18) / 2, -(height + 18) / 2, width + 18, height + 18), Phaser.Geom.Rectangle.Contains);
    this.on('pointerdown', () => { this.setScale(0.97); this.draw(width, height, color, true); });
    this.on('pointerup', () => { this.setScale(1); this.draw(width, height, color, false); });
    this.on('pointerout', () => { this.setScale(1); this.draw(width, height, color, false); });
  }

  private draw(width: number, height: number, color: number, pressed: boolean): void {
    this.bg.clear();
    this.bg.fillStyle(0x000000, pressed ? 0.16 : 0.22);
    this.bg.fillRoundedRect(-width / 2 + 3, -height / 2 + 7, width, height, 20);
    this.bg.fillGradientStyle(0xffffff, 0xffffff, color, color, 1);
    this.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
    this.bg.lineStyle(2, 0xffffff, 0.5);
    this.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 20);
    this.bg.fillStyle(0xffffff, 0.25);
    this.bg.fillRoundedRect(-width / 2 + 14, -height / 2 + 8, width - 28, 12, 8);
  }
}
