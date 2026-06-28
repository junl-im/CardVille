import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { RARITY_META, pickRewardCard } from '../data/rewardCards';
import { applyWrap, bodyText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';

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
    const reward = pickRewardCard(this.stars, this.bestCombo);
    const meta = RARITY_META[reward.rarity];
    const xp = 30 + this.stars * 10 + this.bestCombo * 2;
    const coins = 45 + this.stars * 20 + Math.floor(this.score / 60);
    const gems = reward.rarity === 'legendary' ? 1 : 0;
    const profile = SaveSystem.addReward(xp, coins, gems);
    const count = SaveSystem.addCard(reward.id);

    DrawSystem.background(this, '보상');
    panel(this, 195, 338, 338, 430, 34);
    this.add.text(195, 174, '말 카드팩 보상', titleText(31)).setOrigin(0.5);
    this.add.text(195, 214, `${meta.label} 카드 획득!`, goldText(16)).setOrigin(0.5);

    this.drawRewardCard(195, 340, 166, 218, reward.icon, reward.id, meta.color, meta.label, reward.rarity);
    this.add.text(
      195,
      520,
      `+${xp} XP  +${coins} 코인${gems ? `  +${gems} 보석` : ''}\n별 ${this.stars}개 · 최고 콤보 ${this.bestCombo}\n현재 Lv.${profile.level} · 🪙 ${profile.coins} · 보유 ${count}장`,
      { ...applyWrap(bodyText(14), 308), lineSpacing: 7 }
    ).setOrigin(0.5);

    this.add.text(195, 610, '희귀도는 별과 콤보가 높을수록 조금 더 좋아져요.', applyWrap(mutedText(12), 306)).setOrigin(0.5);
    new GameButton(this, 195, 682, '카드마을 광장으로', 276, 62, 0xffd86f).onClick(() => this.scene.start('MainLobbyScene'));
  }

  private drawRewardCard(x: number, y: number, w: number, h: number, icon: string, name: string, color: number, rarity: string, rarityKey: string): void {
    this.add.rectangle(x + 5, y + 8, w, h, 0x000000, 0.22).setOrigin(0.5).setScale(1, 1);
    const frameKey = rarityKey === 'legendary' ? 'assetFrameLegendary' : rarityKey === 'epic' ? 'assetFrameEpic' : 'assetFrameRare';
    if (this.textures.exists(frameKey)) this.add.image(x, y, frameKey).setDisplaySize(w + 32, h + 32).setAlpha(0.78);
    this.add.rectangle(x, y, w, h, 0xfffbf1, 0.92).setStrokeStyle(6, color, 1);
    this.add.rectangle(x, y - h / 2 + 20, w - 20, 28, color, 0.95);
    this.add.text(x, y - h / 2 + 20, rarity, cardSmallTextSafe(12)).setOrigin(0.5);
    if (this.textures.exists('assetCardBackHeart')) this.add.image(x, y - 18, 'assetCardBackHeart').setDisplaySize(70, 70).setAlpha(0.20);
    this.add.text(x, y - 22, icon, { fontSize: '56px' }).setOrigin(0.5);
    this.add.text(x, y + 62, name, { ...cardText(16), align: 'center', wordWrap: { width: w - 22, useAdvancedWrap: true } }).setOrigin(0.5);
    const glow = this.add.rectangle(x, y, w + 18, h + 18, color, 0.08).setStrokeStyle(2, color, 0.5);
    this.tweens.add({ targets: glow, scale: 1.06, alpha: 0, duration: 1100, repeat: -1, yoyo: false });
  }
}

function cardSmallTextSafe(size: number) {
  return { ...cardText(size), strokeThickness: 2 };
}
