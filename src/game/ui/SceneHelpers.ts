import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/phaserConfig';

export function drawWorldBackground(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillGradientStyle(0x20336f, 0x172659, 0x0b1029, 0x070a1d, 1);
  graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  for (let i = 0; i < 38; i += 1) {
    const x = Phaser.Math.Between(10, GAME_WIDTH - 10);
    const y = Phaser.Math.Between(20, GAME_HEIGHT - 20);
    const alpha = Phaser.Math.FloatBetween(0.12, 0.42);
    const radius = Phaser.Math.FloatBetween(1, 2.4);
    const orb = scene.add.circle(x, y, radius, 0xf6d28a, alpha);
    scene.tweens.add({
      targets: orb,
      y: y - Phaser.Math.Between(12, 32),
      alpha: alpha * 0.25,
      duration: Phaser.Math.Between(1800, 3600),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}

export function addGlassPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 24,
): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0xffffff, 0.1);
  graphics.lineStyle(1, 0xffffff, 0.22);
  graphics.fillRoundedRect(x, y, width, height, radius);
  graphics.strokeRoundedRect(x, y, width, height, radius);
  return graphics;
}

export function addButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const shadow = scene.add.graphics();
  shadow.fillStyle(0x000000, 0.22);
  shadow.fillRoundedRect(-width / 2 + 3, -height / 2 + 5, width, height, 20);

  const bg = scene.add.graphics();
  bg.fillGradientStyle(0xffdf91, 0xffbb55, 0xd9842d, 0xb86420, 1);
  bg.lineStyle(2, 0xfff0c9, 0.85);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 20);

  const text = scene.add
    .text(0, 0, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      fontStyle: '800',
      color: '#3b1d12',
      align: 'center',
    })
    .setOrigin(0.5);

  container.add([shadow, bg, text]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });
  container.on('pointerover', () => scene.tweens.add({ targets: container, scale: 1.03, duration: 120 }));
  container.on('pointerout', () => scene.tweens.add({ targets: container, scale: 1, duration: 120 }));
  container.on('pointerdown', () => scene.tweens.add({ targets: container, scale: 0.96, duration: 60, yoyo: true }));
  container.on('pointerup', onClick);
  return container;
}

export function addTopBar(scene: Phaser.Scene, title: string): void {
  addGlassPanel(scene, 16, 20, GAME_WIDTH - 32, 64, 22);
  scene.add
    .text(GAME_WIDTH / 2, 52, title, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      fontStyle: '900',
      color: '#ffffff',
      stroke: '#1a2040',
      strokeThickness: 4,
    })
    .setOrigin(0.5);
}
