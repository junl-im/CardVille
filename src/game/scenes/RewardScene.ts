import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, cardText, titleText } from '../ui/TextStyles';

const rewardPool = [
  { id: '피곤함 카드', icon: '😴' },
  { id: '럭키 카드', icon: '🍀' },
  { id: '큐브 카드', icon: '🧊' },
  { id: '방패 카드', icon: '🛡️' },
  { id: '동물 친구 카드', icon: '🐾' },
  { id: '카드마을 주민증', icon: '🏘️' }
];

export class RewardScene extends Phaser.Scene {
  private score = 0;
  private bestCombo = 0;
  private stars = 1;

  constructor() { super('RewardScene'); }

  init(data: { score?: number; bestCombo?: number; stars?: number }): void {
    this.score = data.score ?? 0;
    this.bestCombo = data.bestCombo ?? 0;
    this.stars = data.stars ?? 1;
  }

  create(): void {
    const reward = Phaser.Utils.Array.GetRandom(rewardPool);
    const xp = 30 + this.stars * 10 + this.bestCombo * 2;
    const coins = 45 + this.stars * 20 + Math.floor(this.score / 60);
    const profile = SaveSystem.addReward(xp, coins);
    const count = SaveSystem.addCard(reward.id);

    DrawSystem.background(this, '보상');
    panel(this, 195, 332, 336, 404, 34);
    this.add.text(195, 188, '말 카드팩 보상', titleText(31)).setOrigin(0.5);
    this.add.rectangle(195, 332, 156, 204, 0xfffbf1, 1).setStrokeStyle(5, 0xffa320, 1);
    this.add.rectangle(195, 250, 132, 26, 0xffa320, 0.95);
    this.add.text(195, 316, reward.icon, { fontSize: '54px' }).setOrigin(0.5);
    this.add.text(195, 390, `${reward.id}\n보유 ${count}장`, { ...cardText(16), align: 'center' }).setOrigin(0.5);
    this.add.text(
      195,
      512,
      `+${xp} XP  +${coins} 코인\n별 ${this.stars}개 · 최고 콤보 ${this.bestCombo}\n현재 Lv.${profile.level} · 🪙 ${profile.coins}`,
      { ...applyWrap(bodyText(15), 300), lineSpacing: 7 }
    ).setOrigin(0.5);

    const lobby = new GameButton(this, 195, 656, '카드마을 광장으로', 276, 62, 0xffd86f);
    lobby.onClick(() => this.scene.start('MainLobbyScene'));
  }
}
