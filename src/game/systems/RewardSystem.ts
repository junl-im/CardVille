import Phaser from 'phaser';
import { StageRewards } from '../types/GameData';

export type RewardResult = {
  xp: number;
  coins: number;
  cardPackWon: boolean;
};

export class RewardSystem {
  static calculate(rewards: StageRewards): RewardResult {
    return {
      xp: rewards.xp,
      coins: rewards.coins,
      cardPackWon: Math.random() < rewards.packChance,
    };
  }

  static showRewardPopup(scene: Phaser.Scene, result: RewardResult, onClose: () => void): void {
    const overlay = scene.add.rectangle(195, 422, 390, 844, 0x000000, 0.42).setInteractive();
    const panel = scene.add.graphics();
    panel.fillStyle(0xffffff, 0.14);
    panel.lineStyle(1, 0xffffff, 0.34);
    panel.fillRoundedRect(42, 250, 306, 270, 28);
    panel.strokeRoundedRect(42, 250, 306, 270, 28);

    const title = scene.add
      .text(195, 294, '스테이지 클리어!', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        fontStyle: '900',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const reward = scene.add
      .text(195, 366, `XP +${result.xp}\n코인 +${result.coins}\n${result.cardPackWon ? '카드팩 획득!' : '다음에는 카드팩을 노려봐!'}`, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        fontStyle: '800',
        align: 'center',
        color: '#ffe6a6',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const close = scene.add
      .text(195, 472, '계속하기', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '23px',
        fontStyle: '900',
        color: '#3b1d12',
        backgroundColor: '#ffd166',
        padding: { left: 22, right: 22, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const group = [overlay, panel, title, reward, close];
    close.on('pointerup', () => {
      group.forEach((object) => object.destroy());
      onClose();
    });
  }
}
