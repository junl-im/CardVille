import Phaser from 'phaser';
import { applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { ProgressModeId, SaveSystem } from '../systems/SaveSystem';
import { DailyMissionSystem } from '../systems/DailyMissionSystem';
import { RARITY_META, RewardCard, pickRewardCard } from '../data/rewardCards';
import { allowAmbientMotion, ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, scaledDuration } from '../systems/QualitySystem';
import { applyWrap, bodyText, cardSmallText, cardText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class RewardScene extends Phaser.Scene {
  private score = 0;
  private bestCombo = 0;
  private stars = 1;
  private reward!: RewardCard;
  private modeId: ProgressModeId = 'daily';
  private stage = 1;
  private stepsLeft = 0;
  private opened = false;
  private source: 'game' | 'shop' = 'game';
  private packLabel = '';
  private rewardGroup?: Phaser.GameObjects.Container;
  private lobbyButton?: GameButton;
  private quality: CardVilleQuality = getCardVilleQuality();

  constructor() { super('RewardScene'); }

  init(data: { modeId?: ProgressModeId; stage?: number; score?: number; bestCombo?: number; stars?: number; stepsLeft?: number; source?: 'game' | 'shop'; packLabel?: string }): void {
    this.modeId = data.modeId ?? 'daily';
    this.stage = data.stage ?? 1;
    this.score = data.score ?? 0;
    this.bestCombo = data.bestCombo ?? 0;
    this.stars = data.stars ?? 1;
    this.stepsLeft = data.stepsLeft ?? this.stars * 4;
    this.opened = false;
    this.source = data.source ?? 'game';
    this.packLabel = data.packLabel ?? '';
  }

  create(): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    this.reward = pickRewardCard(this.stars, this.bestCombo);
    DrawSystem.background(this, '카드팩 보상');
    this.drawRewardShowcase();
    this.drawPackClosed();
    this.lobbyButton = new GameButton(this, 195, 736, '광장으로', 238, 52, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }

  private drawRewardShowcase(): void {
    panel(this, 195, 408, 342, 548, 34);
    this.add.rectangle(195, 124, 304, 48, 0xffffff, 0.08).setStrokeStyle(1, 0xffd86f, 0.32);
    this.add.text(195, 116, this.rewardTitle(), titleText(28)).setOrigin(0.5);
    this.add.text(195, 146, this.packFlavor(), applyWrap(mutedText(11), 292)).setOrigin(0.5);
    this.drawPackQualityBar();
    this.add.text(195, 214, '카드팩을 터치해서 열어보세요.', applyWrap(goldText(15), 300)).setOrigin(0.5);
  }

  private rewardTitle(): string {
    if (this.source === 'shop') return `${this.packLabel || '상점 카드팩'} 개봉!`;
    if (this.modeId === 'math') return '연산 카드팩 도착!';
    if (this.modeId === 'memory') return '숲속 카드팩 도착!';
    if (this.modeId === 'word') return '말 카드팩 도착!';
    if (this.modeId === 'english') return '영어 카드팩 도착!';
    return '오늘의 카드팩 도착!';
  }

  private packFlavor(): string {
    if (this.source === 'shop') return `상점 카드팩 · 별 ${this.stars}개 기대치 · 카드와 XP 중심 보상`;
    if (this.modeId === 'math') return `점수 ${this.score} · 콤보 ${this.bestCombo} · ${this.stage}단계 실험 보상`;
    if (this.modeId === 'memory') return `점수 ${this.score} · 기억력 ${this.bestCombo} · ${this.stage}단계 숲 보상`;
    if (this.modeId === 'word') return `점수 ${this.score} · 콤보 ${this.bestCombo} · ${this.stage}단계 도서관 보상`;
    if (this.modeId === 'english') return `점수 ${this.score} · 콤보 ${this.bestCombo} · ${this.stage}교시 영어 학교 보상`;
    return `별 ${this.stars}개 · 오늘의 보너스 카드팩`;
  }

  private drawPackQualityBar(): void {
    const labels = ['COMMON', 'RARE', 'EPIC', 'LEGEND'];
    const colors = [RARITY_META.common.color, RARITY_META.rare.color, RARITY_META.epic.color, RARITY_META.legendary.color];
    this.add.text(68, 174, '팩 기대치', mutedText(10)).setOrigin(0, 0.5);
    labels.forEach((label, index) => {
      const x = 138 + index * 54;
      const active = this.expectedRarityIndex() >= index;
      this.add.rectangle(x, 174, 48, 18, active ? colors[index] : 0x26334f, active ? 0.82 : 0.52).setStrokeStyle(1, 0xffffff, active ? 0.42 : 0.16);
      this.add.text(x, 174, label, active ? { fontFamily: 'system-ui, sans-serif', fontSize: '7px', color: '#301b0c', fontStyle: '900' } : mutedText(7)).setOrigin(0.5);
    });
  }

  private expectedRarityIndex(): number {
    if (this.stars >= 3 || this.bestCombo >= 8) return 3;
    if (this.stars >= 2 || this.bestCombo >= 5) return 2;
    if (this.bestCombo >= 2) return 1;
    return 0;
  }

  private packPrefix(): string {
    if (this.reward.rarity === 'legendary') return 'assetPackLegendary';
    if (this.reward.rarity === 'epic') return 'assetPackEpic';
    if (this.reward.rarity === 'rare') return 'assetPackRare';
    return 'assetPackCommon';
  }

  private chestKey(): string {
    if (this.reward.rarity === 'legendary') return 'chestLegendaryPremium';
    if (this.reward.rarity === 'epic') return 'chestEpicPremium';
    if (this.reward.rarity === 'rare') return 'chestRarePremium';
    return 'chestCommonPremium';
  }

  private packBurstKey(): string {
    if (this.reward.rarity === 'legendary') return 'effectPackBurstLegendary';
    if (this.reward.rarity === 'epic') return 'effectPackBurstEpic';
    if (this.reward.rarity === 'rare') return 'effectPackBurstRare';
    return 'effectPackBurstCommon';
  }

  private drawPackClosed(): void {
    const prefix = this.packPrefix();
    const group = this.add.container(195, 404);
    this.rewardGroup = group;
    const glow = this.add.circle(0, 16, 122, RARITY_META[this.reward.rarity].color, 0.16);
    const burstKey = this.packBurstKey();
    const burst = this.textures.exists(burstKey) ? this.add.image(0, 8, burstKey).setDisplaySize(248, 248).setAlpha(0.32) : null;
    group.add(glow);
    if (burst) group.add(burst);
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
    if (allowAmbientMotion(this.quality)) {
      this.tweens.add({ targets: group, y: 392, duration: scaledDuration(850, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: glow, scale: 1.08, alpha: 0.08, duration: scaledDuration(650, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private openPack(): void {
    if (this.opened) return;
    this.opened = true;
    const group = this.rewardGroup;
    if (!group) return;
    this.tweens.killTweensOf(group);
    group.y = 404;
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
    const baseXp = 30 + this.stars * 10 + this.bestCombo * 2;
    const baseCoins = 45 + this.stars * 20 + Math.floor(this.score / 60);
    const baseGems = this.reward.rarity === 'legendary' ? 1 : 0;
    const progressionBonus = this.progressionRewardBonus();
    const xp = this.source === 'shop' ? Math.max(18, Math.floor(baseXp * 0.62)) : baseXp + progressionBonus.xp;
    const coins = this.source === 'shop' ? 0 : baseCoins + progressionBonus.coins;
    const gems = this.source === 'shop' ? 0 : baseGems;
    const profile = SaveSystem.addReward(xp, coins, gems);
    const record = SaveSystem.saveModeStageResult(this.modeId, this.stage, this.score, this.bestCombo, this.stepsLeft, false, this.stars);
    const count = SaveSystem.addCard(this.reward.id);
    DailyMissionSystem.recordPackOpen();
    if (this.source === 'game') DailyMissionSystem.recordModeClear(this.modeId);

    if (this.textures.exists('uiResultRibbon')) this.add.image(195, 196, 'uiResultRibbon').setDisplaySize(236, 66).setAlpha(0.82);
    if (this.textures.exists('uiResultStars')) this.add.image(195, 350, 'uiResultStars').setDisplaySize(300, 150).setAlpha(0.16);
    this.add.text(195, 210, `${meta.label} 카드 획득!`, goldText(18)).setOrigin(0.5);
    const chestKey = this.chestKey();
    if (this.textures.exists(chestKey)) this.add.image(308, 220, chestKey).setDisplaySize(58, 48).setAlpha(0.82);
    const burstKey = this.packBurstKey();
    if (this.textures.exists(burstKey)) this.add.image(195, 356, burstKey).setDisplaySize(254, 254).setAlpha(0.38);
    this.drawRewardCard(195, 356, 172, 206, this.reward.icon, this.reward.id, meta.color, meta.label, this.reward.rarity);
    this.add.text(
      195,
      526,
      `${this.rewardLine(xp, coins, gems)}${progressionBonus.label ? `\n${progressionBonus.label}` : ''}\n별 ${record.stars}개 · 최고 콤보 ${record.bestCombo} · 플레이 ${record.plays}회\n현재 Lv.${profile.level} · 🪙 ${profile.coins} · 보유 ${count}장`,
      { ...applyWrap(bodyText(13), 318), lineSpacing: 6 }
    ).setOrigin(0.5);
    this.add.text(195, 612, '획득 카드는 앨범에서 희귀도 프레임과 함께 다시 볼 수 있어요.', applyWrap(mutedText(11), 306)).setOrigin(0.5);
    if (this.source === 'shop') {
      new GameButton(this, 122, 668, '상점으로', 116, 50, 0xffd86f).onClick(() => this.scene.start('ShopScene'));
      new GameButton(this, 268, 668, '앨범 보기', 116, 50, 0xf0c7ff).onClick(() => this.scene.start('CollectionScene'));
    } else {
      new GameButton(this, 195, 668, '카드 앨범 보기', 238, 50, 0xf0c7ff).onClick(() => this.scene.start('CollectionScene'));
    }
    this.lobbyButton?.setPosition(195, 742).setLabel('광장으로 돌아가기');
    this.spawnSparkles(meta.color);
  }

  private progressionRewardBonus(): { xp: number; coins: number; label: string } {
    if (this.source === 'shop') return { xp: 0, coins: 0, label: '' };
    const stageTierBonus = Math.max(0, this.stage - 1);
    const modeBonus = this.modeId === 'math' ? 12 : this.modeId === 'memory' ? 14 : this.modeId === 'english' ? 11 : this.modeId === 'word' ? 10 : 6;
    const starBonus = this.stars * 6;
    const xp = stageTierBonus * modeBonus + starBonus;
    const coins = stageTierBonus * 18 + this.stars * 8;
    const modeLabel = this.modeId === 'math' ? '연구소 난이도 보너스' : this.modeId === 'memory' ? '숲 기억력 보너스' : this.modeId === 'english' ? '영어 학교 수업 보너스' : this.modeId === 'word' ? '도서관 숙련 보너스' : '일일 보너스';
    return { xp, coins, label: `${modeLabel} +${xp}XP/+${coins}코인` };
  }

  private rewardLine(xp: number, coins: number, gems: number): string {
    const parts = [`+${xp} XP`];
    if (coins > 0) parts.push(`+${coins} 코인`);
    if (gems > 0) parts.push(`+${gems} 보석`);
    if (this.source === 'shop') parts.push('상점 구매팩');
    return parts.join('  ');
  }

  private drawRewardCard(x: number, y: number, w: number, h: number, icon: string, name: string, color: number, rarity: string, rarityKey: string): void {
    this.add.rectangle(x + 5, y + 8, w, h, 0x000000, 0.24).setOrigin(0.5);
    const frameKey = rarityKey === 'legendary' ? 'assetFrameLegendary' : rarityKey === 'epic' ? 'assetFrameEpic' : 'assetFrameRare';
    if (this.textures.exists(frameKey)) this.add.image(x, y, frameKey).setDisplaySize(w + 36, h + 36).setAlpha(0.86);
    this.add.rectangle(x, y, w, h, 0xfffbf1, 0.94).setStrokeStyle(6, color, 1);
    this.add.rectangle(x, y - h / 2 + 20, w - 20, 28, color, 0.95);
    this.add.text(x, y - h / 2 + 20, rarity, cardSmallText(12)).setOrigin(0.5);
    if (this.textures.exists('effectAura')) this.add.image(x, y - 18, 'effectAura').setDisplaySize(122, 122).setAlpha(0.22);
    this.add.text(x, y - 22, icon, { fontSize: '56px' }).setOrigin(0.5);
    this.add.text(x, y + 58, name, { ...cardText(15), align: 'center', wordWrap: { width: w - 22, useAdvancedWrap: true } }).setOrigin(0.5);
    const glow = this.add.rectangle(x, y, w + 20, h + 20, color, 0.08).setStrokeStyle(2, color, 0.55);
    if (isMotionEnabled(this.quality)) this.tweens.add({ targets: glow, scale: 1.06, alpha: 0, duration: scaledDuration(1100, this.quality), repeat: -1 });
  }

  private flashReward(color: number): void {
    const l = layout(this);
    const rect = this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, color, 0.12);
    this.tweens.add({ targets: rect, alpha: 0, duration: 320, onComplete: () => rect.destroy() });
  }

  private spawnSparkles(color: number): void {
    const texture = this.textures.exists('particleSparkle') ? 'particleSparkle' : undefined;
    const count = ambientCount(18, this.quality, 6);
    for (let i = 0; i < count; i += 1) {
      const x = 195 + Phaser.Math.Between(-132, 132);
      const y = 374 + Phaser.Math.Between(-118, 108);
      const obj = texture ? this.add.image(x, y, texture).setDisplaySize(22, 22) : this.add.circle(x, y, 5, color, 0.8);
      obj.setAlpha(0);
      this.tweens.add({ targets: obj, alpha: { from: 0, to: 0.82 }, scale: { from: 0.3, to: 1.1 }, y: y - Phaser.Math.Between(18, 58), duration: scaledDuration(520, this.quality), delay: i * 24, yoyo: true, onComplete: () => obj.destroy() });
    }
  }
}
