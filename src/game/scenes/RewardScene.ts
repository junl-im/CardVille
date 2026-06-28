import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem, PlayerProfile } from '../systems/SaveSystem';
import { RARITY_META, RewardCard, pickRewardCard } from '../data/rewardCards';
import { applyWrap, bodyText, cardSmallText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class RewardScene extends Phaser.Scene {
  private score = 0;
  private bestCombo = 0;
  private stars = 1;
  private reward!: RewardCard;
  private opened = false;
  private rewardGroup?: Phaser.GameObjects.Container;

  constructor() { super('RewardScene'); }

  init(data: { score?: number; bestCombo?: number; stars?: number }): void {
    this.score = data.score ?? 0;
    this.bestCombo = data.bestCombo ?? 0;
    this.stars = data.stars ?? 1;
    this.opened = false;
  }

  create(): void {
    this.reward = pickRewardCard(this.stars, this.bestCombo);
    DrawSystem.background(this, '카드팩 보상');
    panel(this, 195, 390, 342, 518, 34);
    this.add.text(195, 150, '말 카드팩 도착!', titleText(30)).setOrigin(0.5);
    this.add.text(195, 190, '카드팩을 터치해서 열어보세요.', applyWrap(goldText(15), 300)).setOrigin(0.5);
    this.drawPackClosed();
    new GameButton(this, 195, 718, '광장으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }

  private packPrefix(): string {
    if (this.reward.rarity === 'legendary') return 'assetPackLegendary';
    if (this.reward.rarity === 'epic') return 'assetPackEpic';
    if (this.reward.rarity === 'rare') return 'assetPackRare';
    return 'assetPackCommon';
  }

  private drawPackClosed(): void {
    const prefix = this.packPrefix();
    const group = this.add.container(195, 382);
    this.rewardGroup = group;
    const glow = this.add.circle(0, 16, 122, RARITY_META[this.reward.rarity].color, 0.16);
    group.add(glow);
    if (this.textures.exists(`${prefix}Closed`)) {
      group.add(this.add.image(0, 0, `${prefix}Closed`).setDisplaySize(210, 210));
    } else {
      group.add(this.add.rectangle(0, 0, 190, 190, 0xffd86f, 0.92).setStrokeStyle(5, 0xffffff, 0.84));
      group.add(this.add.text(0, 0, 'CARD\nPACK', { ...titleText(28), align: 'center' }).setOrigin(0.5));
    }
    const badge = this.textures.exists('badgeOpen') ? this.add.image(74, -78, 'badgeOpen').setDisplaySize(76, 42) : null;
    if (badge) group.add(badge);
    const hint = this.add.text(0, 140, '터치해서 열기', goldText(18)).setOrigin(0.5);
    group.add(hint);

    const zone = this.add.zone(0, 0, 240, 280).setOrigin(0.5).setInteractive({ useHandCursor: true });
    group.add(zone);
    zone.on('pointerup', () => this.openPack());
    this.tweens.add({ targets: group, y: 370, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: glow, scale: 1.08, alpha: 0.08, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private openPack(): void {
    if (this.opened) return;
    this.opened = true;
    const group = this.rewardGroup;
    if (!group) return;
    this.tweens.killTweensOf(group);
    group.y = 382;
    const prefix = this.packPrefix();
    const opening1 = `${prefix}Opening1`;
    const opening2 = `${prefix}Opening2`;
    const open = `${prefix}Open`;
    const image = group.list.find((obj) => obj instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image | undefined;
    if (image && this.textures.exists(opening1)) image.setTexture(opening1);
    this.flashReward(RARITY_META[this.reward.rarity].color);
    this.time.delayedCall(160, () => { if (image && this.textures.exists(opening2)) image.setTexture(opening2); });
    this.time.delayedCall(320, () => { if (image && this.textures.exists(open)) image.setTexture(open); });
    this.time.delayedCall(460, () => {
      group.destroy(true);
      this.revealReward();
    });
  }

  private revealReward(): void {
    const meta = RARITY_META[this.reward.rarity];
    const xp = 30 + this.stars * 10 + this.bestCombo * 2;
    const coins = 45 + this.stars * 20 + Math.floor(this.score / 60);
    const gems = this.reward.rarity === 'legendary' ? 1 : 0;
    const profile = SaveSystem.addReward(xp, coins, gems);
    const count = SaveSystem.addCard(this.reward.id);

    this.add.text(195, 210, `${meta.label} 카드 획득!`, goldText(18)).setOrigin(0.5);
    this.drawRewardCard(195, 372, 174, 226, this.reward.icon, this.reward.id, meta.color, meta.label, this.reward.rarity);
    this.add.text(
      195,
      548,
      `+${xp} XP  +${coins} 코인${gems ? `  +${gems} 보석` : ''}\n별 ${this.stars}개 · 최고 콤보 ${this.bestCombo}\n현재 Lv.${profile.level} · 🪙 ${profile.coins} · 보유 ${count}장`,
      { ...applyWrap(bodyText(14), 318), lineSpacing: 7 }
    ).setOrigin(0.5);
    this.add.text(195, 636, '좋은 카드일수록 앨범 프레임이 더 화려해져요.', applyWrap(mutedText(12), 306)).setOrigin(0.5);
    new GameButton(this, 195, 658, '카드 앨범 보기', 248, 52, 0xf0c7ff).onClick(() => this.scene.start('CollectionScene'));
    this.spawnSparkles(meta.color);
  }

  private drawRewardCard(x: number, y: number, w: number, h: number, icon: string, name: string, color: number, rarity: string, rarityKey: string): void {
    this.add.rectangle(x + 5, y + 8, w, h, 0x000000, 0.24).setOrigin(0.5);
    const frameKey = rarityKey === 'legendary' ? 'assetFrameLegendary' : rarityKey === 'epic' ? 'assetFrameEpic' : 'assetFrameRare';
    if (this.textures.exists(frameKey)) this.add.image(x, y, frameKey).setDisplaySize(w + 36, h + 36).setAlpha(0.86);
    this.add.rectangle(x, y, w, h, 0xfffbf1, 0.94).setStrokeStyle(6, color, 1);
    this.add.rectangle(x, y - h / 2 + 20, w - 20, 28, color, 0.95);
    this.add.text(x, y - h / 2 + 20, rarity, cardSmallText(12)).setOrigin(0.5);
    if (this.textures.exists('effectAura')) this.add.image(x, y - 18, 'effectAura').setDisplaySize(122, 122).setAlpha(0.22);
    this.add.text(x, y - 22, icon, { fontSize: '58px' }).setOrigin(0.5);
    this.add.text(x, y + 66, name, { ...cardText(16), align: 'center', wordWrap: { width: w - 22, useAdvancedWrap: true } }).setOrigin(0.5);
    const glow = this.add.rectangle(x, y, w + 20, h + 20, color, 0.08).setStrokeStyle(2, color, 0.55);
    this.tweens.add({ targets: glow, scale: 1.06, alpha: 0, duration: 1100, repeat: -1 });
  }

  private flashReward(color: number): void {
    const rect = this.add.rectangle(195, 422, 390, 844, color, 0.12);
    this.tweens.add({ targets: rect, alpha: 0, duration: 320, onComplete: () => rect.destroy() });
  }

  private spawnSparkles(color: number): void {
    const texture = this.textures.exists('particleSparkle') ? 'particleSparkle' : undefined;
    for (let i = 0; i < 18; i += 1) {
      const x = 195 + Phaser.Math.Between(-132, 132);
      const y = 390 + Phaser.Math.Between(-128, 110);
      const obj = texture ? this.add.image(x, y, texture).setDisplaySize(22, 22) : this.add.circle(x, y, 5, color, 0.8);
      obj.setAlpha(0);
      this.tweens.add({ targets: obj, alpha: { from: 0, to: 0.82 }, scale: { from: 0.3, to: 1.1 }, y: y - Phaser.Math.Between(18, 58), duration: 520, delay: i * 24, yoyo: true, onComplete: () => obj.destroy() });
    }
  }
}
