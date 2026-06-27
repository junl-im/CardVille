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
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: height <= 48 ? '16px' : height <= 54 ? '18px' : '20px',
      fontStyle: '900',
      color: '#17223b'
    }).setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.setSize(width, height);
    this.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    this.draw(1);
    this.on('pointerover', () => this.draw(1.05));
    this.on('pointerout', () => this.draw(1));
    this.on('pointerdown', () => this.scene.tweens.add({ targets: this, scale: 0.965, duration: 70, ease: 'Sine.easeOut' }));
    this.on('pointerup', () => this.scene.tweens.add({ targets: this, scale: 1, duration: 120, ease: 'Back.easeOut' }));
    scene.add.existing(this);
  }

  private draw(brightness: number): void {
    const w = this.widthValue;
    const h = this.heightValue;
    const c = Phaser.Display.Color.IntegerToColor(this.color);
    const top = Phaser.Display.Color.GetColor(
      Math.min(255, Math.round(c.red * brightness + 24)),
      Math.min(255, Math.round(c.green * brightness + 24)),
      Math.min(255, Math.round(c.blue * brightness + 24))
    );

    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.25);
    this.bg.fillRoundedRect(-w / 2 + 3, -h / 2 + 8, w, h, 20);
    this.bg.fillGradientStyle(top, top, this.color, this.color, 0.98);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 20);
    this.bg.lineStyle(2, 0xffffff, 0.58);
    this.bg.strokeRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 17);
    this.bg.fillStyle(0xffffff, 0.24);
    this.bg.fillRoundedRect(-w / 2 + 14, -h / 2 + 8, w - 28, Math.max(14, h * 0.28), 12);
    this.bg.fillStyle(0xffffff, 0.10);
    this.bg.fillCircle(w / 2 - 34, -h / 2 + 22, 18);
  }
}
