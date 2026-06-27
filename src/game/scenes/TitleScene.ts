import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/phaserConfig';
import { addButton, addGlassPanel, drawWorldBackground } from '../ui/SceneHelpers';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    drawWorldBackground(this);

    this.add
      .text(GAME_WIDTH / 2, 146, '카드마을', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
        fontStyle: '900',
        color: '#ffffff',
        stroke: '#19214b',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 192, 'CardVille', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '25px',
        fontStyle: '800',
        color: '#ffd166',
      })
      .setOrigin(0.5);

    addGlassPanel(this, 48, 250, 294, 250, 32);

    this.createHeroCards();

    this.add
      .text(GAME_WIDTH / 2, 546, '수집형 카드 퍼즐 게임', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        fontStyle: '800',
        color: '#f7f1d0',
      })
      .setOrigin(0.5);

    addButton(this, GAME_WIDTH / 2, 632, 260, 64, '게임 시작', () => {
      this.scene.start('HomeScene');
    });

    this.add
      .text(GAME_WIDTH / 2, 720, 'Phaser 3 + Firebase + GitHub Pages', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#9fb0e6',
      })
      .setOrigin(0.5);
  }

  private createHeroCards(): void {
    const centers = [128, 195, 262];
    centers.forEach((x, index) => {
      const card = this.add.graphics();
      const y = 376 + Math.sin(index) * 6;
      card.fillStyle(0x000000, 0.22);
      card.fillRoundedRect(x - 40 + 5, y - 62 + 8, 80, 124, 18);
      card.fillGradientStyle(0xfffbef, 0xfff4d7, 0xf6d28a, 0xf2a84c, 1);
      card.lineStyle(3, index === 2 ? 0xffd166 : 0xffffff, 0.85);
      card.fillRoundedRect(x - 40, y - 62, 80, 124, 18);
      card.strokeRoundedRect(x - 40, y - 62, 80, 124, 18);
      const text = this.add
        .text(x, y, ['낱말', '연산', '기억'][index], {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '19px',
          fontStyle: '900',
          color: '#4a2732',
        })
        .setOrigin(0.5);
      this.tweens.add({ targets: [card, text], y: y - 10, duration: 1600 + index * 220, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
  }
}
