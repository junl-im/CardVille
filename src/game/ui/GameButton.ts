import Phaser from 'phaser';

export class GameButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private readonly widthValue: number;
  private readonly heightValue: number;
  private readonly color: number;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, width = 240, height = 58, color = 0xffd86f) {
    super(scene, x, y);
    this.widthValue = width;
    this.heightValue = height;
    this.color = color;
    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      fontStyle: '900',
      color: '#23172d'
    }).setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.setSize(width, height);
    this.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    this.draw(1);
    this.on('pointerover', () => this.draw(1.06));
    this.on('pointerout', () => this.draw(1));
    this.on('pointerdown', () => this.scene.tweens.add({ targets: this, scale: 0.96, yoyo: true, duration: 90 }));
    scene.add.existing(this);
  }

  private draw(brightness: number): void {
    const w = this.widthValue;
    const h = this.heightValue;
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.22);
    this.bg.fillRoundedRect(-w / 2 + 2, -h / 2 + 7, w, h, 18);
    this.bg.fillStyle(this.color, brightness > 1 ? 1 : 0.96);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 18);
    this.bg.lineStyle(2, 0xffffff, 0.58);
    this.bg.strokeRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 15);
    this.bg.fillStyle(0xffffff, 0.22);
    this.bg.fillRoundedRect(-w / 2 + 12, -h / 2 + 7, w - 24, 18, 10);
  }
}
