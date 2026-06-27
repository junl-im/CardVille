import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/phaserConfig';
import { MODE_LIST } from '../systems/ModeSystem';
import { addGlassPanel, addTopBar, drawWorldBackground } from '../ui/SceneHelpers';

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super('ModeSelectScene');
  }

  create(): void {
    drawWorldBackground(this);
    addTopBar(this, '게임 모드');

    this.add
      .text(30, 112, '← 홈', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        fontStyle: '800',
        color: '#ffffff',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('HomeScene'));

    MODE_LIST.forEach((mode, index) => {
      const y = 174 + index * 142;
      addGlassPanel(this, 28, y, GAME_WIDTH - 56, 116, 24);
      this.add.text(54, y + 32, mode.emoji, { fontSize: '36px' }).setOrigin(0, 0.5);
      this.add
        .text(108, y + 32, mode.title, {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '25px',
          fontStyle: '900',
          color: '#ffffff',
        })
        .setOrigin(0, 0.5);
      this.add
        .text(108, y + 72, mode.description, {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '15px',
          color: '#dbe3ff',
        })
        .setOrigin(0, 0.5);
      const hit = this.add.rectangle(GAME_WIDTH / 2, y + 58, GAME_WIDTH - 56, 116, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
      hit.on('pointerup', () => this.scene.start('PlayScene', { modeId: mode.modeId }));
    });
  }
}
