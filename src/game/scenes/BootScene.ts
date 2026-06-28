import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload(): void {
    this.load.image('loginBg', 'assets/ui/cardville_login_bg.png');
    this.load.video('introVideo', 'assets/video/cardville_intro_loading.mp4', true);

    // Safe, small PNG assets from the AquaGlass pack. No SVG, no forced massive catalog load.
    this.load.image('assetVillageBg', 'assets/backgrounds/cherry_blossom_day.png');
    this.load.image('assetForestBg', 'assets/backgrounds/forest_day.png');
    this.load.image('assetCoin', 'assets/icons/icon_game_coin.png');
    this.load.image('assetGem', 'assets/icons/icon_game_gem.png');
    this.load.image('assetStar', 'assets/icons/icon_mode_star.png');
    this.load.image('assetWord', 'assets/icons/icon_mode_word.png');
    this.load.image('assetAlbum', 'assets/icons/icon_menu_album.png');
    this.load.image('assetPack', 'assets/icons/icon_mode_cardpack.png');
    this.load.image('assetSettings', 'assets/icons/icon_mode_settings.png');
    this.load.image('assetCardBackStar', 'assets/cards/backs/card_back_star.png');
    this.load.image('assetCardBackHeart', 'assets/cards/backs/card_back_heart.png');
    this.load.image('assetCardBackCrown', 'assets/cards/backs/card_back_crown.png');
    this.load.image('assetFrameRare', 'assets/cards/frames/frame_rare_gold_normal.png');
    this.load.image('assetFrameEpic', 'assets/cards/frames/frame_epic_purple_normal.png');
    this.load.image('assetFrameLegendary', 'assets/cards/frames/frame_legendary_gold_normal.png');
  }

  create(): void {
    window.__CARDVILLE_BOOT_OK__?.();
    this.scene.start('IntroLoadingScene');
  }
}
