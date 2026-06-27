import Phaser from 'phaser';
import { PlayResultData } from '../types/ModeTypes';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';

export class RewardScene extends Phaser.Scene {
  constructor() {
    super('RewardScene');
  }

  create(data: PlayResultData): void {
    this.drawBackground();
    new GlassPanel(this, 195, 398, 326, 468, 32, 0.16);

    this.add.text(195, 224, '보상 획득', { fontSize: '36px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 298, `⭐ 경험치 +${data.rewards.xp}`, { fontSize: '24px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 346, `🪙 코인 +${data.rewards.coins}`, { fontSize: '24px', fontStyle: '900', color: '#fff0b8' }).setOrigin(0.5);

    const hasPack = Math.random() < data.rewards.packChance;
    this.add.text(195, 412, hasPack ? '🎁 카드팩 발견!' : '카드팩은 다음 기회에!', {
      fontSize: '22px',
      fontStyle: '900',
      color: hasPack ? '#ffe4a3' : '#cfe3ff'
    }).setOrigin(0.5);

    if (hasPack) this.spawnPackSparkles();

    const next = new GameButton(this, 195, 548, '스테이지 선택', 250, 58, 0xffd86f);
    next.on('pointerup', () => this.scene.start('StageSelectScene', { modeId: data.modeId }));

    const lobby = new GameButton(this, 195, 628, '메인 로비', 250, 58, 0x8fd3ff);
    lobby.on('pointerup', () => this.scene.start('MainLobbyScene'));

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private spawnPackSparkles(): void {
    for (let i = 0; i < 22; i += 1) {
      const star = this.add.text(195, 412, '✦', { fontSize: `${Phaser.Math.Between(14, 30)}px`, color: '#ffe4a3' }).setOrigin(0.5);
      this.tweens.add({
        targets: star,
        x: 195 + Phaser.Math.Between(-145, 145),
        y: 412 + Phaser.Math.Between(-120, 120),
        alpha: 0,
        scale: 0.2,
        duration: 850,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x214d78, 0x214d78, 0x0d1735, 0x060918, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(0xffd86f, 0.08);
    g.fillCircle(195, 406, 210);
  }
}
