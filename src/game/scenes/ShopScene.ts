import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { applyResponsiveCamera } from '../systems/LayoutSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { allowAmbientMotion, CardVilleQuality, getCardVilleQuality, scaledDuration } from '../systems/QualitySystem';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';

type ShopOfferId = 'daily_free' | 'coin_pack' | 'gem_pack';

type ShopOffer = {
  id: ShopOfferId;
  title: string;
  subtitle: string;
  detail: string;
  valueText: string;
  ribbon: string;
  icon: string;
  cost: number;
  currency: 'free' | 'coins' | 'gems';
  stars: number;
  score: number;
  combo: number;
  color: number;
};

type ShopProfile = { coins: number; gems: number };
type ShopDaily = { canClaim: boolean; nextResetAt: number };

const SHOP_OFFERS: readonly ShopOffer[] = [
  {
    id: 'daily_free',
    title: '일일 무료팩',
    subtitle: '하루 한 번 카드팩 보상',
    detail: '무료 · 초보 수집 안정화',
    valueText: '오늘 첫 방문 추천',
    ribbon: 'DAILY',
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
    valueText: '꾸준한 수집용',
    ribbon: 'VALUE',
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
    valueText: '희귀도 집중용',
    ribbon: 'PREMIUM',
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
    const recommendedOfferId = this.recommendedOfferId(profile, daily);
    const lastOffer = SaveSystem.getLastShopOffer();

    DrawSystem.background(this, '카드팩 상점');
    this.drawShopInteriorBackdrop();
    DrawSystem.topHud(this, profile.coins, profile.level);
    panel(this, 195, 420, 340, 572, 34);
    this.drawPremiumShopAccents();

    this.add.text(195, 96, '상인의 카드팩 가게', goldText(23)).setOrigin(0.5);
    this.add.text(195, 126, '무료팩, 코인팩, 보석팩을 한 화면에서 고르고 앨범으로 바로 이동합니다.', applyWrap(mutedText(11), 286)).setOrigin(0.5);
    this.drawCurrencyStrip(profile.coins, profile.gems, daily.canClaim ? '수령 가능' : this.nextDailyCopy(daily.nextResetAt));
    this.drawDailyStatusMeter(daily, lastOffer);

    SHOP_OFFERS.forEach((offer, index) => this.drawOfferCard(offer, 258 + index * 112, profile, daily, offer.id === recommendedOfferId));

    new GameButton(this, 112, 670, '앨범 보기', 142, 50, 0xf0c7ff).onClick(() => NavigationSystem.safeStart(this, 'CollectionScene'));
    new GameButton(this, 278, 670, '게임관', 126, 50, 0xc9f4ff).onClick(() => NavigationSystem.safeStart(this, 'ModeSelectScene'));
    new GameButton(this, 195, 746, '광장으로', 248, 56, 0xc9f4ff).onClick(() => NavigationSystem.safeStart(this, 'MainLobbyScene'));
    this.showShopCoach(daily.canClaim);
  }


  private drawShopInteriorBackdrop(): void {
    if (!this.textures.exists('bgShopInteriorPremium')) return;
    const bg = this.add.image(195, 434, 'bgShopInteriorPremium').setDisplaySize(390, 292).setAlpha(0.22).setDepth(0);
    bg.setName('shop-interior-backdrop-v151');
    this.add.rectangle(195, 434, 390, 292, 0x020814, 0.28).setDepth(0);
  }

  private drawPremiumShopAccents(): void {
    if (this.textures.exists('dioramaShop')) {
      this.add.image(319, 108, 'dioramaShop').setDisplaySize(72, 72).setAlpha(0.34).setDepth(1);
    }
    const merchantKey = this.textures.exists('npcMerchant') ? 'npcMerchant' : this.textures.exists('heroTravelerPremium') ? 'heroTravelerPremium' : '';
    if (merchantKey) this.add.image(52, 127, merchantKey).setDisplaySize(42, 66).setAlpha(0.9).setDepth(2);
  }

  private showShopCoach(canClaimDaily: boolean): void {
    CoachMarkSystem.showOnce(this, {
      id: 'shop_offer_coach_v140',
      title: '상점 이용 팁',
      body: canClaimDaily ? '무료팩 READY가 보이면 먼저 받아두세요. 추천 오퍼는 현재 재화와 무료팩 상태를 보고 자동으로 강조됩니다.' : '무료팩은 하루 한 번 충전돼요. 코인팩/보석팩은 카드와 XP 중심 보상이라 코인 환급 루프 없이 수집을 늘립니다.',
      x: 195,
      y: 626,
      width: 326,
      tone: canClaimDaily ? 'gold' : 'purple',
      anchorX: 270,
      anchorY: 227
    });
  }

  private drawCurrencyStrip(coins: number, gems: number, dailyText: string): void {
    this.add.rectangle(195, 166, 318, 42, 0x07142c, 0.58).setStrokeStyle(1, 0xffffff, 0.2);
    if (this.textures.exists('iconCoinPremium')) this.add.image(60, 166, 'iconCoinPremium').setDisplaySize(23, 23);
    else this.add.text(60, 166, '🪙', goldText(12)).setOrigin(0.5);
    this.add.text(76, 166, `${coins}`, goldText(12)).setOrigin(0, 0.5);
    if (this.textures.exists('iconGemPremium')) this.add.image(156, 166, 'iconGemPremium').setDisplaySize(23, 23);
    else this.add.text(156, 166, '💎', goldText(12)).setOrigin(0.5);
    this.add.text(172, 166, `${gems}`, goldText(12)).setOrigin(0, 0.5);
    this.add.text(324, 166, `무료팩 ${dailyText}`, mutedText(10)).setOrigin(1, 0.5);
  }

  private drawDailyStatusMeter(daily: ShopDaily, lastOffer: string): void {
    const remain = Math.max(0, daily.nextResetAt - Date.now());
    const readyRatio = daily.canClaim ? 1 : Phaser.Math.Clamp(1 - remain / 86_400_000, 0, 1);
    this.add.rectangle(195, 209, 318, 36, 0xffffff, 0.075).setStrokeStyle(1, daily.canClaim ? 0xffd86f : 0x8fd3ff, daily.canClaim ? 0.48 : 0.28);
    this.add.rectangle(154, 209, 178, 8, 0x26334f, 0.74).setOrigin(0, 0.5);
    this.add.rectangle(154, 209, Math.max(8, 178 * readyRatio), 8, daily.canClaim ? 0xffd86f : 0x8fd3ff, 0.92).setOrigin(0, 0.5);
    this.add.text(58, 209, daily.canClaim ? '무료팩 READY' : '무료팩 충전', goldText(10)).setOrigin(0, 0.5);
    this.add.text(324, 209, lastOffer !== 'none' ? `최근 ${this.shortOfferName(lastOffer)}` : '첫 구매 전', mutedText(9)).setOrigin(1, 0.5);
  }

  private drawOfferCard(offer: ShopOffer, y: number, profile: ShopProfile, daily: ShopDaily, recommended: boolean): void {
    const canBuy = this.canBuy(offer, profile, daily);
    const alpha = canBuy ? 0.95 : 0.62;
    const frameKey = this.offerCardFrameKey(offer, recommended);
    const bg = this.textures.exists(frameKey)
      ? this.add.image(195, y, frameKey).setDisplaySize(324, 112).setAlpha(canBuy ? 0.94 : 0.46)
      : this.add.rectangle(195, y, 316, 94, 0xfffbf1, alpha).setStrokeStyle(recommended ? 4 : 2, recommended ? 0xfff0b3 : offer.color, canBuy ? 0.94 : 0.36);
    bg.setName('shop-offer-premium-frame-v151');
    if (recommended) this.add.rectangle(195, y, 324, 102, offer.color, 0.10).setStrokeStyle(2, offer.color, 0.55);
    this.add.rectangle(77, y, 64, 68, offer.color, canBuy ? 0.16 : 0.08).setStrokeStyle(1, 0xffffff, 0.28);
    const iconKey = this.offerIconKey(offer);
    if (iconKey && this.textures.exists(iconKey)) this.add.image(77, y - 2, iconKey).setDisplaySize(40, 40).setAlpha(canBuy ? 1 : 0.48);
    else this.add.text(77, y - 4, offer.icon, { fontSize: '30px' }).setOrigin(0.5).setAlpha(canBuy ? 1 : 0.55);
    this.add.text(116, y - 27, offer.title, darkText(15)).setOrigin(0, 0.5).setAlpha(canBuy ? 1 : 0.6);
    this.add.text(116, y - 4, offer.subtitle, applyWrap(bodyText(10), 150, 'left')).setOrigin(0, 0.5).setAlpha(canBuy ? 0.9 : 0.56);
    this.add.text(116, y + 20, offer.detail, applyWrap(mutedText(9), 150, 'left')).setOrigin(0, 0.5).setAlpha(canBuy ? 0.88 : 0.54);
    this.add.text(116, y + 37, offer.valueText, applyWrap(mutedText(8), 150, 'left')).setOrigin(0, 0.5).setAlpha(canBuy ? 0.82 : 0.48);
    this.drawOfferBadge(270, y - 31, offer, recommended);

    if (recommended) {
      this.add.rectangle(270, y - 4, 64, 18, 0xffd86f, 0.94).setStrokeStyle(1, 0xffffff, 0.42);
      this.add.text(270, y - 4, '추천', darkText(8)).setOrigin(0.5);
    }

    const buttonLabel = this.offerButtonLabel(offer, canBuy, daily);
    const button = new GameButton(this, 282, y + 27, buttonLabel, 86, 38, canBuy ? offer.color : 0x9aa4ba)
      .onClick(() => this.buyOffer(offer));
    button.setDisabled(!canBuy);
    if (allowAmbientMotion(this.quality) && canBuy && recommended) {
      this.tweens.add({ targets: bg, alpha: 0.78, duration: scaledDuration(1020, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private offerCardFrameKey(offer: ShopOffer, recommended: boolean): string {
    if (recommended && this.textures.exists('uiOfferCardFeatured')) return 'uiOfferCardFeatured';
    if (offer.id === 'daily_free') return 'uiOfferCardDaily';
    if (offer.id === 'gem_pack') return 'uiOfferCardGem';
    return 'uiOfferCardCoin';
  }

  private offerIconKey(offer: ShopOffer): string {
    if (offer.id === 'daily_free') return 'uiTreasureChestPremium';
    if (offer.id === 'gem_pack') return 'iconGemPremium';
    return 'iconCoinPremium';
  }

  private drawOfferBadge(x: number, y: number, offer: ShopOffer, recommended: boolean): void {
    const label = recommended ? 'BEST' : offer.ribbon;
    this.add.rectangle(x, y, 62, 20, offer.color, 0.88).setStrokeStyle(1, 0xffffff, 0.38);
    this.add.text(x, y, label, darkText(8)).setOrigin(0.5);
  }

  private recommendedOfferId(profile: ShopProfile, daily: ShopDaily): ShopOfferId {
    if (daily.canClaim) return 'daily_free';
    if (profile.gems >= 3) return 'gem_pack';
    return 'coin_pack';
  }

  private canBuy(offer: ShopOffer, profile: ShopProfile, daily: ShopDaily): boolean {
    if (offer.currency === 'free') return daily.canClaim;
    if (offer.currency === 'coins') return profile.coins >= offer.cost;
    return profile.gems >= offer.cost;
  }

  private offerButtonLabel(offer: ShopOffer, canBuy: boolean, daily: ShopDaily): string {
    if (offer.currency === 'free') return daily.canClaim ? '받기' : '완료';
    if (!canBuy) return offer.currency === 'coins' ? '코인부족' : '보석부족';
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
    SaveSystem.recordShopOffer(offer.id);
    this.showPurchaseTransition(offer);
    this.time.delayedCall(260, () => {
      NavigationSystem.safeStart(this, 'RewardScene', {
        modeId: 'daily',
        source: 'shop',
        packLabel: offer.title,
        stage: offer.id === 'gem_pack' ? 3 : offer.id === 'coin_pack' ? 2 : 1,
        score: offer.score,
        bestCombo: offer.combo,
        stars: offer.stars,
        stepsLeft: offer.stars * 4
      });
    });
  }

  private showPurchaseTransition(offer: ShopOffer): void {
    this.input.enabled = false;
    const overlay = this.add.container(195, 420).setDepth(2000);
    overlay.add(this.add.rectangle(0, 0, 326, 176, 0x07142c, 0.94).setStrokeStyle(2, offer.color, 0.68));
    overlay.add(this.add.circle(0, -52, 42, offer.color, 0.22).setStrokeStyle(2, offer.color, 0.58));
    overlay.add(this.add.text(0, -54, offer.icon, { fontSize: '38px' }).setOrigin(0.5));
    overlay.add(this.add.text(0, 4, `${offer.title} 준비 중`, titleText(18)).setOrigin(0.5));
    overlay.add(this.add.text(0, 36, '카드팩 보상 화면으로 이동합니다.', applyWrap(mutedText(11), 270)).setOrigin(0.5));
    overlay.setScale(0.9).setAlpha(0);
    this.tweens.add({ targets: overlay, scale: 1, alpha: 1, duration: 140, ease: 'Back.easeOut' });
  }

  private nextDailyCopy(nextResetAt: number): string {
    const ms = Math.max(0, nextResetAt - Date.now());
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.max(1, Math.ceil((ms % 3_600_000) / 60_000));
    return hours > 0 ? `${hours}시간 ${minutes}분 후` : `${minutes}분 후`;
  }

  private shortOfferName(offerId: string): string {
    const found = SHOP_OFFERS.find((offer) => offer.id === offerId);
    return found ? found.title.replace('상점 ', '').replace('왕관 ', '') : '카드팩';
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
