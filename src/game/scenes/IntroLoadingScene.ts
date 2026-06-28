import Phaser from 'phaser';
import { addCoverImage, applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class IntroLoadingScene extends Phaser.Scene {
  private readyToContinue = false;
  private minIntroDone = false;
  private finished = false;
  private videoEl?: HTMLVideoElement;
  private progressText?: Phaser.GameObjects.Text;
  private nextScene = 'MainLobbyScene';

  constructor() { super('IntroLoadingScene'); }

  init(data: { nextScene?: string } = {}): void {
    this.nextScene = data.nextScene ?? 'MainLobbyScene';
    this.readyToContinue = false;
    this.minIntroDone = false;
    this.finished = false;
  }

  create(): void {
    applyResponsiveCamera(this);
    this.drawLoadingStage();
    this.mountOpeningVideo();
    this.queueGameAssets();

    this.load.on('progress', (value: number) => {
      this.progressText?.setText(`게임 준비 중... ${Math.round(value * 100)}%`);
    });
    this.load.once('complete', () => {
      this.readyToContinue = true;
      this.progressText?.setText('카드마을 입장 준비 완료!');
      this.tryFinish();
    });

    this.input.once('pointerdown', () => {
      this.minIntroDone = true;
      this.tryFinish();
    });
    this.time.delayedCall(2400, () => {
      this.minIntroDone = true;
      this.tryFinish();
    });
    this.time.delayedCall(4200, () => this.finish());

    if (this.load.totalToLoad > 0) this.load.start();
    else {
      this.readyToContinue = true;
      this.tryFinish();
    }
  }

  private drawLoadingStage(): void {
    const l = layout(this);
    if (this.textures.exists('loginBg')) addCoverImage(this, 'loginBg', 1, 390, 844);
    else this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x071126);

    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x020814, 0.24);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, 724, l.visibleWidth, 240 + l.extraY, 0x020814, 0.42);
    this.add.text(195, 72, 'CardVille', titleText(31)).setOrigin(0.5);
    this.add.text(195, 112, '오프닝과 함께 게임을 준비하고 있어요', goldText(16)).setOrigin(0.5);
    this.progressText = this.add.text(195, 754, '게임 준비 중... 0%', goldText(18)).setOrigin(0.5);
    this.add.text(195, 792, '화면을 터치하면 빠르게 넘어갈 수 있어요.', applyWrap(mutedText(12), 340)).setOrigin(0.5);
  }

  private mountOpeningVideo(): void {
    if (typeof document === 'undefined') return;
    const app = document.getElementById('app');
    if (!app) return;
    const video = document.createElement('video');
    const base = import.meta.env.BASE_URL || '/';
    video.src = `${base}assets/video/cardville_intro_loading.mp4`;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.controls = false;
    video.disablePictureInPicture = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    video.setAttribute('data-cardville-hidden-until-playing', 'true');
    video.style.position = 'fixed';
    video.style.inset = '0';
    video.style.width = '100vw';
    video.style.height = '100dvh';
    video.style.minHeight = '100vh';
    video.style.objectFit = 'cover';
    video.style.zIndex = '5';
    video.style.pointerEvents = 'none';
    video.style.background = '#071126';
    // Keep the video hidden until it actually plays. This prevents the mobile
    // browser's native play triangle/placeholder from flashing before the intro.
    video.style.opacity = '0';
    video.style.transition = 'opacity 180ms ease';
    app.appendChild(video);
    this.videoEl = video;

    const revealVideo = () => {
      if (this.videoEl === video) video.style.opacity = '1';
    };
    const onVideoDone = () => {
      this.minIntroDone = true;
      this.tryFinish();
    };
    const onVideoBlocked = () => {
      if (this.videoEl === video) {
        video.pause();
        video.remove();
        this.videoEl = undefined;
      }
      onVideoDone();
    };
    video.addEventListener('playing', revealVideo, { once: true });
    video.addEventListener('canplay', () => { if (!video.paused) revealVideo(); }, { once: true });
    video.addEventListener('ended', onVideoDone, { once: true });
    video.addEventListener('error', onVideoBlocked, { once: true });
    void video.play().catch(() => onVideoBlocked());
  }

  private queueImage(key: string, url: string): void {
    if (!this.textures.exists(key)) this.load.image(key, url);
  }

  private queueGameAssets(): void {
    this.queueImage('assetVillageBg', 'assets/backgrounds/cherry_blossom_day.png');
    this.queueImage('assetForestBg', 'assets/backgrounds/forest_day.png');
    this.queueImage('assetCoin', 'assets/icons/icon_game_coin.png');
    this.queueImage('assetGem', 'assets/icons/icon_game_gem.png');
    this.queueImage('assetStar', 'assets/icons/icon_mode_star.png');
    this.queueImage('assetWord', 'assets/icons/icon_mode_word.png');
    this.queueImage('assetAlbum', 'assets/icons/icon_menu_album.png');
    this.queueImage('assetPack', 'assets/icons/icon_mode_cardpack.png');
    this.queueImage('assetSettings', 'assets/icons/icon_mode_settings.png');
    this.queueImage('assetTrophy', 'assets/icons/icon_game_trophy.png');
    this.queueImage('assetCombo', 'assets/icons/icon_game_combo.png');
    this.queueImage('assetHome', 'assets/icons/icon_game_home.png');
    this.queueImage('assetShop', 'assets/icons/icon_game_shop.png');
    this.queueImage('assetGift', 'assets/icons/icon_game_gift.png');
    this.queueImage('assetCardBackStar', 'assets/cards/backs/card_back_star.png');
    this.queueImage('assetCardBackHeart', 'assets/cards/backs/card_back_heart.png');
    this.queueImage('assetCardBackCrown', 'assets/cards/backs/card_back_crown.png');
    this.queueImage('assetFrameRare', 'assets/cards/frames/frame_rare_gold_normal.png');
    this.queueImage('assetFrameEpic', 'assets/cards/frames/frame_epic_purple_normal.png');
    this.queueImage('assetFrameLegendary', 'assets/cards/frames/frame_legendary_gold_normal.png');
    for (const rarity of ['common', 'rare', 'epic', 'legendary']) {
      this.queueImage(`assetPack${this.cap(rarity)}Closed`, `assets/packs/pack_${rarity}_closed.png`);
      this.queueImage(`assetPack${this.cap(rarity)}Opening1`, `assets/packs/pack_${rarity}_opening_01.png`);
      this.queueImage(`assetPack${this.cap(rarity)}Opening2`, `assets/packs/pack_${rarity}_opening_02.png`);
      this.queueImage(`assetPack${this.cap(rarity)}Open`, `assets/packs/pack_${rarity}_open.png`);
    }
    this.queueImage('effectCorrect', 'assets/effects/effect_correct_01.png');
    this.queueImage('effectWrong', 'assets/effects/effect_wrong_01.png');
    this.queueImage('effectShine', 'assets/effects/effect_shine_01.png');
    this.queueImage('effectAura', 'assets/effects/effect_aura_01.png');
    this.queueImage('particleStar', 'assets/particles/particle_star_01.png');
    this.queueImage('particleSparkle', 'assets/particles/particle_sparkle_01.png');
    this.queueImage('badgeNew', 'assets/badges/badge_new.png');
    this.queueImage('badgeOpen', 'assets/badges/badge_open.png');
  }

  private cap(text: string): string {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  }

  private tryFinish(): void {
    if (this.readyToContinue && this.minIntroDone) this.finish();
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.remove();
      this.videoEl = undefined;
    }
    this.scene.start(this.nextScene);
  }
}
