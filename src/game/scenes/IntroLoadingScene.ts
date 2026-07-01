import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { addCoverImage, applyResponsiveCamera, layout } from '../systems/LayoutSystem';
import { ASSET_MANIFEST, CARDVILLE_ASSET_VERSION, LOBBY_CRITICAL_PNG_ASSET_KEY_SET, LOBBY_CRITICAL_PNG_RUNTIME_TAG, LOBBY_FORCE_LOAD_GATE_TAG } from '../data/assetManifest';

export const CARDVILLE_WEBP_RUNTIME_TAG = 'webp-asset-runtime-v152' as const;
export const CARDVILLE_LOBBY_BOOT_HARDENING_TAG = 'lobby-boot-asset-hardening-v154' as const;
export const CARDVILLE_SILENT_INTRO_VIDEO_TAG = 'silent-intro-video-loop-v163' as const;
export const CARDVILLE_INTRO_VIDEO_LIFECYCLE_TAG = 'intro-video-lifecycle-cleanup-v164' as const;
export const CARDVILLE_INTRO_VIDEO_RESTORE_TAG = 'intro-video-restore-v167' as const;
export const CARDVILLE_INTRO_MIN_VIDEO_TAG = 'intro-min-3s-video-v168' as const;
export const CARDVILLE_VIDEO_ONLY_LOADING_TAG = 'video-only-loading-v168' as const;
export const CARDVILLE_INTRO_TOUCH_PRIME_TAG = 'intro-touch-prime-v169' as const;
export const CARDVILLE_INTRO_STARTED_AT_GUARD_TAG = 'intro-started-at-zero-guard-v169' as const;
export const CARDVILLE_INTRO_HARD_VISIBLE_TAG = 'intro-hard-visible-v170' as const;
export const CARDVILLE_INTRO_NO_NATIVE_UI_TAG = 'intro-no-native-video-ui-v171' as const;
export const CARDVILLE_INTRO_PLAYMARK_SHIELD_TAG = 'intro-playmark-shield-v171' as const;
export const CARDVILLE_INTRO_NO_LOADING_SURFACE_TAG = 'intro-no-loading-surface-v171' as const;
export const CARDVILLE_INTRO_PREPLAY_SHIELD_TAG = 'intro-preplay-shield-v172' as const;
export const CARDVILLE_INTRO_NO_PROGRESS_SURFACE_TAG = 'intro-no-progress-surface-v172' as const;
export const CARDVILLE_LEGACY_LOADING_QUARANTINE_TAG = 'legacy-loading-code-quarantine-v172' as const;
const MIN_INTRO_VIDEO_MS = 3000;

declare global {
  interface Window {
    __CARDVILLE_INTRO_VIDEO_PRIME__?: () => HTMLVideoElement | null;
    __CARDVILLE_INTRO_VIDEO_PREPARE__?: () => HTMLVideoElement | null;
    __CARDVILLE_INTRO_VIDEO_DONE__?: () => void;
    __CARDVILLE_INTRO_VIDEO_STARTED_AT__?: number;
    __CARDVILLE_INTRO_VIDEO_HIDE_SHIELD__?: () => void;
    __CARDVILLE_INTRO_VIDEO_KEEP_SHIELD__?: (video?: HTMLVideoElement | null) => void;
    __CARDVILLE_INTRO_VIDEO_REVEAL__?: (video?: HTMLVideoElement | null) => void;
  }
}

export class IntroLoadingScene extends Phaser.Scene {
  private readyToContinue = false;
  private minIntroDone = false;
  private finished = false;
  private videoEl?: HTMLVideoElement;
  private minIntroTimer?: Phaser.Time.TimerEvent;
  private progressBar?: Phaser.GameObjects.Rectangle;
  private nextScene = 'MainLobbyScene';
  private queuedKeys = new Set<string>();
  private preferWebp = false;

  constructor() { super('IntroLoadingScene'); }

  init(data: { nextScene?: string } = {}): void {
    this.nextScene = data.nextScene ?? 'MainLobbyScene';
    this.readyToContinue = false;
    this.minIntroDone = false;
    this.finished = false;
    this.minIntroTimer?.remove(false);
    this.minIntroTimer = undefined;
    this.queuedKeys.clear();
    this.preferWebp = this.detectWebpSupport();
  }

  create(): void {
    applyResponsiveCamera(this);
    this.drawLoadingStage();
    this.mountOpeningVideo();
    this.armMinimumIntroHold();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.removeOpeningVideo());
    this.queueGameAssets();

    this.load.on('progress', (value: number) => {
      this.updateProgressBar(value);
    });
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn('[CardVille] asset load failed', file.key, file.url, CARDVILLE_ASSET_VERSION);
    });
    this.load.once('complete', () => {
      this.readyToContinue = true;
      this.updateProgressBar(1);
      this.tryFinish();
    });

    // 1.0.72: the opening video is the only startup loading surface. Native video
    // controls/play marks and Phaser loading bars are explicitly suppressed.
    // legacy-loading-code-quarantine-v172 keeps old loading bars/copy from returning.

    if (this.load.totalToLoad > 0) this.load.start();
    else {
      this.readyToContinue = true;
      this.tryFinish();
    }
  }

  private drawLoadingStage(): void {
    const l = layout(this);
    if (this.textures.exists('loginBg')) addCoverImage(this, 'loginBg', 1, 390, 844)?.setAlpha(0.22);
    else this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x071126);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x020814, 0.18)
      .setName(CARDVILLE_INTRO_NO_LOADING_SURFACE_TAG);
    this.progressBar = undefined;
  }

  private updateProgressBar(_value: number): void {
    // 1.0.72: no Phaser startup loading bar. The intro video plus shield is the full loading surface.
    this.progressBar = undefined;
  }

  private armMinimumIntroHold(): void {
    const rawStarted = typeof window !== 'undefined' && typeof window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__ === 'number'
      ? window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__
      : 0;
    const started = rawStarted > 0 ? rawStarted : Date.now();
    if (typeof window !== 'undefined') window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__ = started;
    const elapsed = Date.now() - started;
    const remaining = Math.max(0, MIN_INTRO_VIDEO_MS - elapsed);
    this.minIntroDone = false;
    this.minIntroTimer?.remove(false);
    this.minIntroTimer = this.time.delayedCall(remaining, () => {
      this.minIntroDone = true;
      if (this.videoEl) this.tryReplayVideo(this.videoEl);
      this.tryFinish();
    });
  }

  private mountOpeningVideo(): void {
    if (typeof document === 'undefined') return;
    const prepared = typeof window !== 'undefined' ? window.__CARDVILLE_INTRO_VIDEO_PREPARE__?.() : undefined;
    const video = prepared ?? document.createElement('video');
    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const expectedSrc = `${normalizedBase}assets/video/cardville_intro_loading.mp4?v=${CARDVILLE_ASSET_VERSION}`;
    const expectedPoster = `${normalizedBase}assets/video/cardville_intro_poster.jpg?v=${CARDVILLE_ASSET_VERSION}`;
    if (!prepared) {
      video.id = 'cardville-intro-video';
      video.src = expectedSrc;
      document.body.appendChild(video);
    } else if (!(video.getAttribute('src') ?? video.currentSrc ?? '').includes(`cardville_intro_loading.mp4?v=${CARDVILLE_ASSET_VERSION}`)) {
      video.src = expectedSrc;
    }
    if (typeof window !== 'undefined' && (!window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__ || window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__ <= 0)) window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__ = Date.now();
    video.poster = expectedPoster;
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.loop = true;
    video.controls = false;
    video.removeAttribute('controls');
    video.disablePictureInPicture = true;
    try { video.disableRemotePlayback = true; } catch { /* ignore */ }
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback nofullscreen');
    video.setAttribute('x-webkit-airplay', 'deny');
    video.setAttribute('data-cardville-silent-intro-video-v167', CARDVILLE_INTRO_VIDEO_RESTORE_TAG);
    video.setAttribute('data-cardville-min-intro-ms-v168', String(MIN_INTRO_VIDEO_MS));
    video.setAttribute('data-cardville-video-only-loading-v168', CARDVILLE_VIDEO_ONLY_LOADING_TAG);
    video.setAttribute('data-cardville-intro-touch-prime-v169', CARDVILLE_INTRO_TOUCH_PRIME_TAG);
    video.setAttribute('data-cardville-started-at-zero-guard-v169', CARDVILLE_INTRO_STARTED_AT_GUARD_TAG);
    video.setAttribute('data-cardville-intro-hard-visible-v170', CARDVILLE_INTRO_HARD_VISIBLE_TAG);
    video.setAttribute('data-cardville-no-native-video-ui-v171', CARDVILLE_INTRO_NO_NATIVE_UI_TAG);
    video.setAttribute('data-cardville-intro-playmark-shield-v171', CARDVILLE_INTRO_PLAYMARK_SHIELD_TAG);
    video.setAttribute('data-cardville-no-loading-surface-v171', CARDVILLE_INTRO_NO_LOADING_SURFACE_TAG);
    video.setAttribute('data-cardville-intro-preplay-shield-v172', CARDVILLE_INTRO_PREPLAY_SHIELD_TAG);
    video.setAttribute('data-cardville-no-progress-surface-v172', CARDVILLE_INTRO_NO_PROGRESS_SURFACE_TAG);
    video.setAttribute('data-cardville-legacy-loading-quarantine-v172', CARDVILLE_LEGACY_LOADING_QUARANTINE_TAG);
    video.setAttribute('data-cardville-video-playing-v172', 'false');
    video.setAttribute('data-cardville-hidden-until-playing', 'true');
    video.style.position = 'fixed';
    video.style.inset = '0';
    video.style.width = '100vw';
    video.style.height = '100dvh';
    video.style.minHeight = '100vh';
    video.style.objectFit = 'cover';
    video.style.zIndex = '2147482000';
    video.style.pointerEvents = 'none';
    video.style.background = '#071126';
    video.style.opacity = '1';
    video.style.display = 'block';
    video.style.visibility = 'visible';
    video.style.transition = 'opacity 120ms ease';
    video.style.border = '0';
    video.style.outline = '0';
    video.style.setProperty('-webkit-appearance', 'none');
    if (typeof document !== 'undefined') document.documentElement.classList.add(CARDVILLE_INTRO_HARD_VISIBLE_TAG, CARDVILLE_INTRO_NO_NATIVE_UI_TAG, CARDVILLE_INTRO_PLAYMARK_SHIELD_TAG, CARDVILLE_INTRO_PREPLAY_SHIELD_TAG, CARDVILLE_INTRO_NO_PROGRESS_SURFACE_TAG);
    this.videoEl = video;

    const keepShielded = () => {
      if (this.videoEl === video) {
        video.setAttribute('data-cardville-video-playing-v172', 'false');
        video.style.display = 'block';
        window.__CARDVILLE_INTRO_VIDEO_KEEP_SHIELD__?.(video);
      }
    };
    const revealVideo = () => {
      if (this.videoEl === video) {
        video.setAttribute('data-cardville-video-playing-v172', 'true');
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.opacity = '1';
        window.__CARDVILLE_INTRO_VIDEO_REVEAL__?.(video);
      }
    };
    const keepSilentFallback = () => {
      // Do not remove the surface on mobile autoplay errors; keep the silent video layer
      // or its first frame/dark poster until asset loading completes.
      keepShielded();
      this.tryReplayVideo(video);
    };
    video.addEventListener('loadeddata', keepShielded, { once: true });
    video.addEventListener('canplay', keepShielded, { once: true });
    video.addEventListener('playing', () => { revealVideo(); window.__CARDVILLE_INTRO_VIDEO_HIDE_SHIELD__?.(); }, { once: true });
    video.addEventListener('error', keepSilentFallback, { once: true });
    this.time.delayedCall(90, keepShielded);
    this.tryReplayVideo(video);
    void video.play().then(() => { revealVideo(); window.__CARDVILLE_INTRO_VIDEO_HIDE_SHIELD__?.(); }).catch(() => {
      try { video.load(); } catch { /* ignore */ }
      keepSilentFallback();
    });
  }

  private tryReplayVideo(video: HTMLVideoElement): void {
    try {
      video.muted = true;
      video.play().catch(() => { /* keep the visible video surface even if playback waits for the browser */ });
    } catch { /* ignore */ }
  }

  private queueImage(key: string, url: string): void {
    if (this.textures.exists(key) || this.queuedKeys.has(key)) return;
    this.queuedKeys.add(key);
    this.load.image(key, this.resolveAssetUrl(this.preferredAssetPath(key, url)));
  }


  private detectWebpSupport(): boolean {
    if (typeof document === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').startsWith('data:image/webp');
    } catch {
      return false;
    }
  }

  private preferredAssetPath(key: string, url: string): string {
    // 1.0.54: Do not swap the one-screen village background/buildings into WebP at runtime.
    // Several mobile/deploy combinations can report WebP support but still fail a specific WebP request,
    // which leaves the lobby with fallback cards instead of visible buildings. PNG is the stable source.
    if (LOBBY_CRITICAL_PNG_ASSET_KEY_SET.has(key)) return url;
    if (!this.preferWebp || !url.endsWith('.png')) return url;
    if (!url.startsWith('assets/')) return url;
    return url.replace(/\.png$/, '.webp');
  }

  private resolveAssetUrl(url: string): string {
    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${normalizedBase}${cleanUrl}${separator}v=${CARDVILLE_ASSET_VERSION}`;
  }

  private queueGameAssets(): void {
    for (const asset of ASSET_MANIFEST) {
      this.queueImage(asset.key, asset.path);
    }
    console.info('[CardVille] lobby critical assets use PNG source', LOBBY_CRITICAL_PNG_RUNTIME_TAG, CARDVILLE_LOBBY_BOOT_HARDENING_TAG, CARDVILLE_SILENT_INTRO_VIDEO_TAG, CARDVILLE_INTRO_VIDEO_LIFECYCLE_TAG, CARDVILLE_INTRO_VIDEO_RESTORE_TAG, CARDVILLE_INTRO_NO_NATIVE_UI_TAG, CARDVILLE_INTRO_NO_LOADING_SURFACE_TAG, CARDVILLE_INTRO_PREPLAY_SHIELD_TAG, CARDVILLE_INTRO_NO_PROGRESS_SURFACE_TAG, CARDVILLE_LEGACY_LOADING_QUARANTINE_TAG);

    this.queueImage('assetVillageBg', 'assets/backgrounds/cherry_blossom_day.png');

    // One-screen CardVille diorama lobby assets. The lobby stays fixed-camera and
    // uses individual PNG building/object layers instead of an SVG or scrolling tile map.
    console.info('[CardVille] lobby force-load gate active', LOBBY_FORCE_LOAD_GATE_TAG);
    this.queueImage('dioramaBg', 'assets/diorama/diorama_bg.png');
    this.queueImage('dioramaCastle', 'assets/diorama/building_castle.png');
    this.queueImage('dioramaLibrary', 'assets/diorama/building_library.png');
    this.queueImage('dioramaLab', 'assets/diorama/building_lab.png');
    this.queueImage('dioramaShop', 'assets/diorama/building_shop.png');
    this.queueImage('dioramaSchool', 'assets/diorama/building_school.png');
    this.queueImage('dioramaForest', 'assets/diorama/building_forest.png');
    this.queueImage('dioramaEvent', 'assets/diorama/building_event.png');
    this.queueImage('dioramaHarbor', 'assets/diorama/building_harbor.png');
    this.queueImage('dioramaPlaza', 'assets/diorama/building_plaza.png');
    this.queueImage('dioramaHero', 'assets/diorama/character_boy_token.png');
    this.queueImage('dioramaCat', 'assets/diorama/mascot_black_cat_token.png');
    this.queueImage('dioramaFloatingCard', 'assets/diorama/ambient_floating_card.png');
    this.queueImage('dioramaButterfly', 'assets/diorama/ambient_butterfly.png');
    this.queueImage('dioramaCloud', 'assets/diorama/ambient_cloud_01.png');
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

  private removeOpeningVideo(): void {
    try { window.__CARDVILLE_INTRO_VIDEO_DONE__?.(); } catch { /* ignore */ }
    if (!this.videoEl) return;
    try {
      this.videoEl.pause();
      this.videoEl.remove();
    } catch { /* ignore */ }
    this.videoEl = undefined;
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.minIntroTimer?.remove(false);
    this.minIntroTimer = undefined;
    this.removeOpeningVideo();
    NavigationSystem.safeStart(this, this.nextScene);
  }
}
