import Phaser from 'phaser';
import { applyResponsiveCamera } from '../systems/LayoutSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { allowAmbientMotion, CardVilleQuality, getCardVilleQuality, scaledDuration } from '../systems/QualitySystem';

type ShopOffer = {
  id: 'daily_free' | 'coin_pack' | 'gem_pack';
  title: string;
  subtitle: string;
  detail: string;
  icon: string;
  cost: number;
  currency: 'free' | 'coins' | 'gems';
  stars: number;
  score: number;
  combo: number;
  color: number;
};

const SHOP_OFFERS: readonly ShopOffer[] = [
  {
    id: 'daily_free',
    title: '일일 무료팩',
    subtitle: '하루 한 번 카드팩 보상',
    detail: '무료 · 초보 수집 안정화',
    icon: '🎁',
    cost: 0,
    currency: 'free',
    stars: 1,
    score: 220,
    combo: 1,
    color: 0x8fd3ff
  },
  {
    id: 'coin_pack',
    title: '상점 실버팩',
    subtitle: '코인으로 여는 기본 카드팩',
    detail: '희귀 이상 기대치 소폭 상승',
    icon: '🪙',
    cost: 120,
    currency: 'coins',
    stars: 2,
    score: 520,
    combo: 5,
    color: 0xffd86f
  },
  {
    id: 'gem_pack',
    title: '왕관 프리미엄팩',
    subtitle: '보석으로 여는 고급 카드팩',
    detail: '영웅/전설 기대치 강화',
    icon: '👑',
    cost: 3,
    currency: 'gems',
    stars: 3,
    score: 920,
    combo: 10,
    color: 0xd7a5ff
  }
] as const;

export class ShopScene extends Phaser.Scene {
  private quality: CardVilleQuality = getCardVilleQuality();
  private purchaseLocked = false;

  constructor() { super('ShopScene'); }

  create(): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    // 품질 모드에 따라 상점 카드 하이라이트 애니메이션을 줄입니다.
    const profile = SaveSystem.loadProfile();
    const daily = SaveSystem.getDailyShopStatus();

    DrawSystem.background(this, '카드팩 상점');
    DrawSystem.topHud(this, profile.coins, profile.level);
    panel(this, 195, 420, 340, 572, 34);

    this.add.text(195, 102, '상인의 카드팩 가게', goldText(23)).setOrigin(0.5);
    this.add.text(195, 132, '무료팩, 코인팩, 보석팩을 한 화면에서 고르고 앨범으로 바로 이동합니다.', applyWrap(mutedText(11), 318)).setOrigin(0.5);
    this.drawCurrencyStrip(profile.coins, profile.gems, daily.canClaim ? '수령 가능' : this.nextDailyCopy(daily.nextResetAt));

    SHOP_OFFERS.forEach((offer, index) => this.drawOfferCard(offer, 250 + index * 118, profile, daily));

    new GameButton(this, 112, 670, '앨범 보기', 142, 50, 0xf0c7ff).onClick(() => this.scene.start('CollectionScene'));
    new GameButton(this, 278, 670, '게임관', 126, 50, 0xc9f4ff).onClick(() => this.scene.start('ModeSelectScene'));
    new GameButton(this, 195, 746, '광장으로', 248, 56, 0xc9f4ff).onClick(() => this.scene.start('MainLobbyScene'));
  }

  private drawCurrencyStrip(coins: number, gems: number, dailyText: string): void {
    this.add.rectangle(195, 174, 318, 42, 0x07142c, 0.58).setStrokeStyle(1, 0xffffff, 0.2);
    this.add.text(60, 174, `🪙 ${coins}`, goldText(12)).setOrigin(0, 0.5);
    this.add.text(156, 174, `💎 ${gems}`, goldText(12)).setOrigin(0, 0.5);
    this.add.text(324, 174, `무료팩 ${dailyText}`, mutedText(10)).setOrigin(1, 0.5);
  }

  private drawOfferCard(offer: ShopOffer, y: number, profile: { coins: number; gems: number }, daily: { canClaim: boolean }): void {
    const canBuy = this.canBuy(offer, profile, daily);
    const bg = this.add.rectangle(195, y, 316, 98, 0xfffbf1, canBuy ? 0.94 : 0.62).setStrokeStyle(3, offer.color, canBuy ? 0.94 : 0.36);
    this.add.rectangle(77, y, 64, 72, offer.color, canBuy ? 0.22 : 0.12).setStrokeStyle(1, 0xffffff, 0.34);
    this.add.text(77, y - 4, offer.icon, { fontSize: '30px' }).setOrigin(0.5).setAlpha(canBuy ? 1 : 0.55);
    this.add.text(116, y - 27, offer.title, darkText(16)).setOrigin(0, 0.5).setAlpha(canBuy ? 1 : 0.6);
    this.add.text(116, y - 3, offer.subtitle, applyWrap(bodyText(10), 150, 'left')).setOrigin(0, 0.5).setAlpha(canBuy ? 0.9 : 0.56);
    this.add.text(116, y + 25, offer.detail, applyWrap(mutedText(9), 150, 'left')).setOrigin(0, 0.5).setAlpha(canBuy ? 0.88 : 0.54);
    this.drawOfferBadge(272, y - 29, offer);

    const buttonLabel = this.offerButtonLabel(offer, canBuy, daily);
    const button = new GameButton(this, 282, y + 22, buttonLabel, 86, 38, canBuy ? offer.color : 0x9aa4ba)
      .onClick(() => this.buyOffer(offer));
    button.setDisabled(!canBuy);
    if (allowAmbientMotion(this.quality) && canBuy) {
      this.tweens.add({ targets: bg, alpha: 0.82, duration: scaledDuration(1150, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawOfferBadge(x: number, y: number, offer: ShopOffer): void {
    const label = offer.currency === 'free' ? 'DAILY' : offer.currency === 'coins' ? 'COIN' : 'GEM';
    this.add.rectangle(x, y, 58, 20, offer.color, 0.88).setStrokeStyle(1, 0xffffff, 0.38);
    this.add.text(x, y, label, darkText(8)).setOrigin(0.5);
  }

  private canBuy(offer: ShopOffer, profile: { coins: number; gems: number }, daily: { canClaim: boolean }): boolean {
    if (offer.currency === 'free') return daily.canClaim;
    if (offer.currency === 'coins') return profile.coins >= offer.cost;
    return profile.gems >= offer.cost;
  }

  private offerButtonLabel(offer: ShopOffer, canBuy: boolean, daily: { canClaim: boolean }): string {
    if (offer.currency === 'free') return daily.canClaim ? '무료' : '완료';
    if (!canBuy) return '부족';
    return offer.currency === 'coins' ? `${offer.cost}코인` : `${offer.cost}보석`;
  }

  private buyOffer(offer: ShopOffer): void {
    if (this.purchaseLocked) return;
    this.purchaseLocked = true;

    if (offer.currency === 'free') {
      const before = SaveSystem.getDailyShopStatus();
      if (!before.canClaim) {
        this.purchaseLocked = false;
        this.showShopToast('오늘 무료팩은 이미 받았어요.', this.nextDailyCopy(before.nextResetAt));
        return;
      }
      SaveSystem.claimDailyShopPack();
      this.openRewardPack(offer);
      return;
    }

    const purchase = offer.currency === 'coins' ? SaveSystem.spendCoins(offer.cost) : SaveSystem.spendGems(offer.cost);
    if (!purchase.ok) {
      this.purchaseLocked = false;
      this.showShopToast('재화가 부족해요.', '플레이 보상이나 무료팩으로 재화를 모아보세요.');
      return;
    }
    this.openRewardPack(offer);
  }

  private openRewardPack(offer: ShopOffer): void {
    this.scene.start('RewardScene', {
      modeId: 'daily',
      source: 'shop',
      packLabel: offer.title,
      stage: offer.id === 'gem_pack' ? 3 : offer.id === 'coin_pack' ? 2 : 1,
      score: offer.score,
      bestCombo: offer.combo,
      stars: offer.stars,
      stepsLeft: offer.stars * 4
    });
  }

  private nextDailyCopy(nextResetAt: number): string {
    const ms = Math.max(0, nextResetAt - Date.now());
    const hours = Math.max(1, Math.ceil(ms / 3_600_000));
    return `${hours}시간 후`;
  }

  private showShopToast(title: string, copy: string): void {
    const toast = this.add.container(195, 622).setDepth(1000);
    if (this.textures.exists('uiToast')) toast.add(this.add.image(0, 0, 'uiToast').setDisplaySize(310, 70).setAlpha(0.94));
    else toast.add(this.add.rectangle(0, 0, 310, 70, 0x07142c, 0.94).setStrokeStyle(2, 0xffd86f, 0.52));
    toast.add(this.add.text(0, -14, title, titleText(15)).setOrigin(0.5));
    toast.add(this.add.text(0, 14, copy, applyWrap(mutedText(10), 260)).setOrigin(0.5));
    toast.setScale(0.9).setAlpha(0);
    this.tweens.add({ targets: toast, scale: 1, alpha: 1, duration: 130, ease: 'Back.easeOut' });
    this.time.delayedCall(1500, () => this.tweens.add({ targets: toast, y: 600, alpha: 0, duration: 220, onComplete: () => toast.destroy() }));
  }
}
