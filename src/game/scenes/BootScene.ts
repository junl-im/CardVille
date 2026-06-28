import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload(): void {
    this.load.image('loginBg', 'assets/ui/cardville_login_bg.png');
    this.load.video('introVideo', 'assets/video/cardville_intro_loading.mp4', true);

    // Safe PNG/WebP-only asset preload. Keep this list curated; do not force-load the 5000-card catalog.
    this.load.image('assetVillageBg', 'assets/backgrounds/cherry_blossom_day.png');
    this.load.image('assetForestBg', 'assets/backgrounds/forest_day.png');
    this.load.image('assetCoin', 'assets/icons/icon_game_coin.png');
    this.load.image('assetGem', 'assets/icons/icon_game_gem.png');
    this.load.image('assetStar', 'assets/icons/icon_mode_star.png');
    this.load.image('assetWord', 'assets/icons/icon_mode_word.png');
    this.load.image('assetAlbum', 'assets/icons/icon_menu_album.png');
    this.load.image('assetPack', 'assets/icons/icon_mode_cardpack.png');
    this.load.image('assetSettings', 'assets/icons/icon_mode_settings.png');
    this.load.image('assetTrophy', 'assets/icons/icon_game_trophy.png');
    this.load.image('assetCombo', 'assets/icons/icon_game_combo.png');
    this.load.image('assetHome', 'assets/icons/icon_game_home.png');
    this.load.image('assetShop', 'assets/icons/icon_game_shop.png');
    this.load.image('assetGift', 'assets/icons/icon_game_gift.png');

    this.load.image('assetButtonLarge', 'assets/buttons/button_large_시작_normal.png');
    this.load.image('assetButtonLargePress', 'assets/buttons/button_large_시작_press.png');
    this.load.image('assetButtonMedium', 'assets/buttons/button_medium_확인_normal.png');
    this.load.image('assetButtonMediumPress', 'assets/buttons/button_medium_확인_press.png');
    this.load.image('assetButtonSmall', 'assets/buttons/button_small_확인_normal.png');
    this.load.image('assetButtonSmallPress', 'assets/buttons/button_small_확인_press.png');

    this.load.image('assetCardBackStar', 'assets/cards/backs/card_back_star.png');
    this.load.image('assetCardBackHeart', 'assets/cards/backs/card_back_heart.png');
    this.load.image('assetCardBackCrown', 'assets/cards/backs/card_back_crown.png');
    this.load.image('assetFrameRare', 'assets/cards/frames/frame_rare_gold_normal.png');
    this.load.image('assetFrameEpic', 'assets/cards/frames/frame_epic_purple_normal.png');
    this.load.image('assetFrameLegendary', 'assets/cards/frames/frame_legendary_gold_normal.png');

    this.load.image('assetPackCommonClosed', 'assets/packs/pack_common_closed.png');
    this.load.image('assetPackCommonOpening1', 'assets/packs/pack_common_opening_01.png');
    this.load.image('assetPackCommonOpening2', 'assets/packs/pack_common_opening_02.png');
    this.load.image('assetPackCommonOpen', 'assets/packs/pack_common_open.png');
    this.load.image('assetPackRareClosed', 'assets/packs/pack_rare_closed.png');
    this.load.image('assetPackRareOpening1', 'assets/packs/pack_rare_opening_01.png');
    this.load.image('assetPackRareOpening2', 'assets/packs/pack_rare_opening_02.png');
    this.load.image('assetPackRareOpen', 'assets/packs/pack_rare_open.png');
    this.load.image('assetPackEpicClosed', 'assets/packs/pack_epic_closed.png');
    this.load.image('assetPackEpicOpening1', 'assets/packs/pack_epic_opening_01.png');
    this.load.image('assetPackEpicOpening2', 'assets/packs/pack_epic_opening_02.png');
    this.load.image('assetPackEpicOpen', 'assets/packs/pack_epic_open.png');
    this.load.image('assetPackLegendaryClosed', 'assets/packs/pack_legendary_closed.png');
    this.load.image('assetPackLegendaryOpening1', 'assets/packs/pack_legendary_opening_01.png');
    this.load.image('assetPackLegendaryOpening2', 'assets/packs/pack_legendary_opening_02.png');
    this.load.image('assetPackLegendaryOpen', 'assets/packs/pack_legendary_open.png');

    this.load.image('effectCorrect', 'assets/effects/effect_correct_01.png');
    this.load.image('effectWrong', 'assets/effects/effect_wrong_01.png');
    this.load.image('effectShine', 'assets/effects/effect_shine_01.png');
    this.load.image('effectAura', 'assets/effects/effect_aura_01.png');
    this.load.image('particleStar', 'assets/particles/particle_star_01.png');
    this.load.image('particleSparkle', 'assets/particles/particle_sparkle_01.png');
    this.load.image('badgeNew', 'assets/badges/badge_new.png');
    this.load.image('badgeOpen', 'assets/badges/badge_open.png');
  }

  create(): void {
    window.__CARDVILLE_BOOT_OK__?.();
    this.scene.start('IntroLoadingScene');
  }
}
