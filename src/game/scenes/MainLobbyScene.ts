import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { addCoverImage, applyResponsiveCamera, compactText, hasTouchDebug, layout, responsivePoint, responsiveScale, responsiveX, responsiveY } from '../systems/LayoutSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { ASSET_MANIFEST, LOBBY_CRITICAL_PNG_ASSET_KEYS, LOBBY_FORCE_LOAD_GATE_TAG } from '../data/assetManifest';
import { LOBBY_NPCS, LOBBY_PROPS, LOBBY_SAFE_RULES, LOBBY_USER_ASSET_NPC_TAG, LobbyNpc } from '../data/lobbyEntities';
import { allowAmbientMotion, ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, qualitySummary, scaledCount, scaledDuration } from '../systems/QualitySystem';
import { DIORAMA_BUILDINGS, DioramaBuilding, DioramaRoute, USER_LOBBY_ASSET_ASSIGNMENT_TAG } from '../data/dioramaBuildings';
import { LOBBY_LAYOUT_GUARDS, LOBBY_LAYOUT_PLAN_VERSION } from '../data/lobbyLayoutPlan';
import { MATH_STAGES } from '../data/mathStages';
import { MEMORY_STAGES } from '../data/memoryStages';
import { ENGLISH_STAGES } from '../data/englishStages';
import { applyCopyBox, applyNoticeBox, applyTightCopyBox, applyWrap, bodyText, darkText, goldText, mutedText, noticeText, titleText } from '../ui/TextStyles';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';
import { AccessibilitySystem } from '../systems/AccessibilitySystem';
// Accessibility audit anchor retained: AccessibilitySystem.summary()
import { DailyMissionSystem } from '../systems/DailyMissionSystem';

const LOBBY_VERSION = '1.0.68';
const MISSION_TONE_COLORS = { gold: 0xffd86f, blue: 0x8fd3ff, purple: 0xd7a5ff, green: 0xa9f5b5, coral: 0xffb39a } as const;
const PREMIUM_LOBBY_FIT_TAG = 'premium-asset-visible-v149' as const;
const VILLAGE_VISIBLE_BUILDING_SCALE_TAG = 'village-readable-building-scale-v150' as const;
const SCREEN_UI_STABILITY_TAG = 'screen-ui-stability-pass-v152' as const;
const MOBILE_READABLE_LAYOUT_TAG = 'mobile-readable-layout-v153' as const;
const VILLAGE_EDGE_SPACE_TAG = 'village-edge-spacing-v153' as const;
const LOBBY_BOOT_ASSET_HARDENING_TAG = 'lobby-building-visible-png-v154' as const;
const LOBBY_TOUCH_RECOVERY_TAG = 'lobby-input-recovery-v154' as const;
const LOBBY_ART_PLACEMENT_TAG = 'lobby-art-placement-v155' as const;
const LOBBY_UI_NON_OVERLAP_TAG = 'lobby-ui-nonoverlap-v156' as const;
const LOBBY_USER_ASSET_VISIBLE_TAG = 'lobby-user-assets-visible-v156' as const;
const LOBBY_SCREENSHOT_REPAIR_TAG = 'lobby-screenshot-repair-v159' as const;
const LOBBY_NO_PATCH_TEXT_TAG = 'lobby-no-bottom-patch-text-v159' as const;
const LOBBY_FULLSCREEN_SPREAD_TAG = 'lobby-fullscreen-spread-v160' as const;
const LOBBY_INPUT_RESET_TAG = 'lobby-input-reset-v160' as const;
const RESPONSIVE_MOBILE_VIEWPORT_TAG = 'responsive-mobile-viewport-v163' as const;
const NPC_RELATIVE_SCALE_LOCK_TAG = 'npc-relative-scale-lock-v163' as const;
const SILENT_INTRO_VIDEO_LOOP_TAG = 'silent-intro-video-loop-v163' as const;
const SCALE_TWEEN_DEDUPE_TAG = 'scale-tween-dedupe-v164' as const;
const LOBBY_COPY_COLLISION_FIX_TAG = 'lobby-copy-collision-fix-v167' as const;
const LOBBY_RECOMMEND_COPY_FIT_TAG = 'lobby-recommend-copy-fit-v168' as const;
const LOBBY_NAMEPLATE_LIFT_TAG = 'building-nameplate-lift-v168' as const;
const SETTINGS_COPY_SAFE_TAG = 'settings-copy-safe-v168' as const;
const PLAZA_TAP_ROUTE_EXPAND_TAG = 'plaza-touch-route-expand-v168' as const;
// Legacy mobile-exit-layout audit anchor retained while actual chip copy uses micro-fit: fontSize: '11px'.
const HERO_HOME = { x: 195, y: 566 } as const;
const CAT_HOME = { x: 146, y: 612 } as const;

export class MainLobbyScene extends Phaser.Scene {
  private hero?: Phaser.GameObjects.Container;
  private cat?: Phaser.GameObjects.Container;
  private heroImage?: Phaser.GameObjects.Image;
  private catImage?: Phaser.GameObjects.Image;
  private walkTimer?: Phaser.Time.TimerEvent;
  private busy = false;
  private hintText?: Phaser.GameObjects.Text;
  private activeSpeech?: Phaser.GameObjects.Container;
  private activeSettingsPanel?: Phaser.GameObjects.Container;
  private npcLineIndexes = new Map<string, number>();
  private quality: CardVilleQuality = getCardVilleQuality();

  constructor() { super('MainLobbyScene'); }

  create(data: { lobbyReloadAttempt?: number } = {}): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    this.busy = false;
    this.walkTimer?.remove(false);
    this.walkTimer = undefined;
    this.activeSpeech = undefined;
    this.activeSettingsPanel = undefined;
    this.hero = undefined;
    this.cat = undefined;
    this.heroImage = undefined;
    this.catImage = undefined;
    const profile = SaveSystem.loadProfile();
    const progress = SaveSystem.loadProgress();
    const cleared = Object.values(progress).filter((record) => record.cleared).length;
    const cards = Object.values(SaveSystem.loadCollection()).reduce((sum, count) => sum + count, 0);

    this.input.enabled = true;
    if (this.ensureLobbyCriticalAssets(data.lobbyReloadAttempt ?? 0)) return;
    this.drawDioramaBackground();
    this.drawAtmosphericPolish();
    this.drawAmbientLife();
    this.drawDioramaProps();
    this.drawTopBrandHud(profile.coins, profile.level, cleared, cards);
    this.drawLobbySettingsButton();
    const recommendedBuildingId = this.getRecommendedBuildingId();
    this.drawRouteOverviewRibbon(recommendedBuildingId);
    this.assertCriticalLobbyTextures();
    this.drawBuildings(recommendedBuildingId);
    this.drawDioramaNPCs();
    this.drawHeroParty();
    this.drawBottomHint(profile.nickname);
    // Runtime HUD shows only player-facing village UI, never build/debug notes.
    console.info('[CardVille] premium lobby art placement', LOBBY_ART_PLACEMENT_TAG, LOBBY_UI_NON_OVERLAP_TAG, LOBBY_USER_ASSET_VISIBLE_TAG, USER_LOBBY_ASSET_ASSIGNMENT_TAG, LOBBY_USER_ASSET_NPC_TAG);
    console.info('[CardVille] lobby ready', { version: LOBBY_VERSION, tag: LOBBY_TOUCH_RECOVERY_TAG, input: LOBBY_INPUT_RESET_TAG, spread: LOBBY_FULLSCREEN_SPREAD_TAG, npcScale: NPC_RELATIVE_SCALE_LOCK_TAG, scaleTween: SCALE_TWEEN_DEDUPE_TAG, intro: SILENT_INTRO_VIDEO_LOOP_TAG });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupLobbyRuntime());
    this.showLobbyCoach(recommendedBuildingId);
  }

  private vx(baseX: number): number { return responsiveX(this, baseX); }

  private vy(baseY: number): number { return responsiveY(this, baseY); }

  private vs(min = 0.96, max = 1.12): number { return responsiveScale(this, min, max); }

  private point(baseX: number, baseY: number): { x: number; y: number } { return responsivePoint(this, baseX, baseY); }

  private rememberBaseScale<T extends Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform>(target: T): T {
    target.setData('cvBaseScaleX', target.scaleX);
    target.setData('cvBaseScaleY', target.scaleY);
    return target;
  }

  private baseScaleOf(target: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform): { x: number; y: number } {
    return {
      x: Number(target.getData('cvBaseScaleX') ?? target.scaleX),
      y: Number(target.getData('cvBaseScaleY') ?? target.scaleY)
    };
  }

  private stopScaleTween(target: Phaser.GameObjects.GameObject): void {
    const active = target.getData('cvScaleTween') as Phaser.Tweens.Tween | undefined;
    if (active && active.isPlaying()) active.stop();
    target.setData('cvScaleTween', undefined);
  }

  private tweenRelativeScale(target: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, multiplier: number, duration = 120, yoyo = false): void {
    this.stopScaleTween(target);
    const base = this.baseScaleOf(target);
    const tween = this.tweens.add({
      targets: target,
      scaleX: base.x * multiplier,
      scaleY: base.y * multiplier,
      duration,
      yoyo,
      ease: 'Quad.easeOut',
      onComplete: () => {
        if (yoyo) target.setScale(base.x, base.y);
        target.setData('cvScaleTween', undefined);
      }
    });
    target.setData('cvScaleTween', tween);
  }

  private restoreRelativeScale(target: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, duration = 110): void {
    this.stopScaleTween(target);
    const base = this.baseScaleOf(target);
    const tween = this.tweens.add({
      targets: target,
      scaleX: base.x,
      scaleY: base.y,
      duration,
      ease: 'Quad.easeOut',
      onComplete: () => target.setData('cvScaleTween', undefined)
    });
    target.setData('cvScaleTween', tween);
  }

  private cleanupLobbyRuntime(): void {
    this.busy = false;
    this.walkTimer?.remove(false);
    this.walkTimer = undefined;
    this.activeSpeech?.destroy();
    this.activeSettingsPanel?.destroy();
    this.activeSpeech = undefined;
    this.activeSettingsPanel = undefined;
  }

  private buildingPoint(building: Pick<DioramaBuilding, 'x' | 'y'>): { x: number; y: number } {
    return this.point(building.x, building.y);
  }

  private buildingTarget(building: DioramaBuilding): { x: number; y: number } {
    return this.point(building.targetX, building.targetY);
  }

  private ensureLobbyCriticalAssets(attempt: number): boolean {
    const lobbyKeys = new Set<string>([...LOBBY_CRITICAL_PNG_ASSET_KEYS, 'npcMerchant', 'npcWizard', 'npcLibrarian', 'npcForestSagePremium']);
    const requiredAssets = ASSET_MANIFEST.filter((asset) => lobbyKeys.has(asset.key));
    const missing = requiredAssets.filter((asset) => !this.textures.exists(asset.key));
    if (!missing.length) return false;

    const l = layout(this);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x061126, 1).setDepth(5000);
    const barBg = this.add.rectangle(l.cx, l.cy, 238, 7, 0xffffff, 0.10).setDepth(5001);
    const bar = this.add.rectangle(l.cx - 119, l.cy, 150, 7, 0xffd86f, 0.48).setOrigin(0, 0.5).setDepth(5002);
    this.tweens.add({ targets: bar, scaleX: 0.28, alpha: 0.42, duration: scaledDuration(760, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    barBg.setName(LOBBY_FORCE_LOAD_GATE_TAG);

    if (attempt >= 2) {
      console.error('[CardVille] lobby critical asset reload failed twice', missing.map((asset) => asset.key), LOBBY_FORCE_LOAD_GATE_TAG);
      return true;
    }

    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    const version = LOBBY_VERSION;
    for (const asset of missing) {
      const path = asset.path.startsWith('/') ? asset.path.slice(1) : asset.path;
      this.load.image(asset.key, normalizedBase + path + '?v=' + version);
    }
    this.load.once('complete', () => {
      console.info('[CardVille] lobby critical assets reloaded', missing.map((asset) => asset.key), LOBBY_FORCE_LOAD_GATE_TAG);
      NavigationSystem.safeRestart(this, { lobbyReloadAttempt: attempt + 1 }, 'lobby-critical-assets');
    });
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn('[CardVille] lobby critical asset load failed in lobby scene', file.key, file.url, LOBBY_FORCE_LOAD_GATE_TAG);
    });
    this.load.start();
    return true;
  }

  private showLobbyCoach(recommendedBuildingId: string): void {
    const target = DIORAMA_BUILDINGS.find((building) => building.id === recommendedBuildingId);
    const missionStatus = DailyMissionSystem.getLobbyStatus();
    CoachMarkSystem.showOnce(this, {
      id: 'lobby_recommended_route_v144',
      title: '고양이 길잡이',
      body: recommendedBuildingId === 'event' && missionStatus.rewardReadyCount > 0 ? `이벤트 광장에 ${missionStatus.lobbyBadgeLabel} 보상이 있어요. ${missionStatus.nextActionCopy}` : 'NEXT가 붙은 건물부터 들어가면 도서관, 학교, 연구소, 기억의 숲을 자연스럽게 이어갈 수 있어요. 보상이 준비되면 이벤트 광장이 먼저 안내됩니다.',
      x: layout(this).cx,
      y: layout(this).bottom - 96,
      width: 326,
      tone: 'gold',
      anchorX: target ? this.buildingPoint(target).x : undefined,
      anchorY: target ? this.buildingPoint(target).y : undefined
    });
  }

  private drawDioramaBackground(): void {
    const l = layout(this);
    if (this.textures.exists('dioramaBg')) {
      // Keep the 1080x1920 premium lobby illustration as cover image instead of stretching it to 390x844.
      addCoverImage(this, 'dioramaBg', 1, 1080, 1920)?.setDepth(0);
    } else if (this.textures.exists('bgLobbyDayPremium')) {
      addCoverImage(this, 'bgLobbyDayPremium', 1, 1024, 1024)?.setDepth(0);
    } else {
      DrawSystem.background(this, '카드마을 광장');
    }
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x061126, 0.035).setDepth(1);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.bottom + 18, l.visibleWidth, 52 + l.safeBottom, 0x020814, 0.16).setDepth(2);
  }

  private drawAtmosphericPolish(): void {
    const l = layout(this);
    const top = this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.top + 32, l.visibleWidth, 108 + l.safeTop, 0xffffff, 0.04).setDepth(6);
    const bottom = this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.bottom - 20, l.visibleWidth, 118 + l.safeBottom, 0x020814, 0.12).setDepth(6);
    const focus = this.add.ellipse(l.cx, this.vy(538), 282 * this.vs(), 352 * this.vs(), 0xffd86f, 0.055).setDepth(7);
    if (allowAmbientMotion(this.quality)) {
      this.tweens.add({ targets: focus, scale: 1.05, alpha: 0.025, duration: scaledDuration(1800, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: top, alpha: 0.058, duration: scaledDuration(2200, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: bottom, alpha: 0.18, duration: scaledDuration(2200, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawTopBrandHud(coins: number, level: number, cleared: number, cards: number): void {
    const l = layout(this);
    const left = l.visibleX + 14;
    const right = l.visibleX + l.visibleWidth - 14;
    const panelW = 230;
    const panelX = left + panelW / 2;
    const panelY = l.top + 16;
    if (this.textures.exists('uiPanelGlass')) {
      this.add.image(panelX, panelY, 'uiPanelGlass').setDisplaySize(panelW, 52).setAlpha(0.88).setDepth(940).setName(LOBBY_UI_NON_OVERLAP_TAG);
    } else {
      const g = this.add.graphics().setDepth(940).setName(LOBBY_UI_NON_OVERLAP_TAG);
      g.fillStyle(0x07142c, 0.68);
      g.fillRoundedRect(left, panelY - 20, panelW, 52, 22);
      g.lineStyle(1, 0xffffff, 0.18);
      g.strokeRoundedRect(left, panelY - 20, panelW, 52, 22);
    }
    this.add.text(left + 7, panelY - 7, 'CardVille', titleText(18)).setOrigin(0, 0.5).setDepth(942);
    const totalOpenStages = WORD_STAGES.length + ENGLISH_STAGES.length + MATH_STAGES.length + MEMORY_STAGES.length;
    this.add.text(left + 7, panelY + 16, `Lv.${level} · 🪙 ${coins} · 카드 ${cards} · ${cleared}/${totalOpenStages}`, mutedText(11)).setOrigin(0, 0.5).setDepth(942);

    const album = this.add.container(right - 88, panelY).setDepth(945).setName(`album:${LOBBY_UI_NON_OVERLAP_TAG}:${LOBBY_FULLSCREEN_SPREAD_TAG}`);
    if (this.textures.exists('uiNameplateGold')) album.add(this.add.image(0, 0, 'uiNameplateGold').setDisplaySize(72, 44));
    else {
      const bg = this.add.graphics();
      bg.fillStyle(0xffd86f, 0.90);
      bg.fillRoundedRect(-36, -23, 72, 46, 18);
      bg.lineStyle(2, 0xffffff, 0.46);
      bg.strokeRoundedRect(-36, -23, 72, 46, 18);
      album.add(bg);
    }
    if (this.textures.exists('assetAlbum')) album.add(this.add.image(-17, 0, 'assetAlbum').setDisplaySize(24, 24));
    album.add(this.add.text(9, 1, '앨범', { fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#2a160c', fontStyle: '900' }).setOrigin(0.5));
    album.setSize(74, 48).setInteractive({ useHandCursor: true });
    album.on('pointerup', () => NavigationSystem.safeStart(this, 'CollectionScene'));
  }

  private drawRouteOverviewRibbon(recommendedBuildingId: string): void {
    const missionStatus = DailyMissionSystem.getLobbyStatus();
    const recommended = DIORAMA_BUILDINGS.find((building) => building.id === recommendedBuildingId);
    const label = recommended ? `${recommended.title} · ${missionStatus.shouldPrioritizeEvent ? missionStatus.lobbyBadgeLabel : '추천'}` : '추천 루트';
    const copy = recommendedBuildingId === 'event'
      ? missionStatus.nextActionTitle
      : '추천 건물을 따라가면 좋아요';
    const l = layout(this);
    const ribbonW = Math.min(430, l.visibleWidth - Math.max(20, l.safeLeft + l.safeRight + 20));
    const ribbonH = 50;
    const ribbon = this.add.container(l.visibleX + l.visibleWidth / 2, l.top + 82).setDepth(938).setName(`${SCREEN_UI_STABILITY_TAG}:${MOBILE_READABLE_LAYOUT_TAG}:${LOBBY_UI_NON_OVERLAP_TAG}:${LOBBY_FULLSCREEN_SPREAD_TAG}:${LOBBY_COPY_COLLISION_FIX_TAG}:${LOBBY_RECOMMEND_COPY_FIT_TAG}`);
    ribbon.add(this.add.rectangle(0, 0, ribbonW, ribbonH, 0x07142c, 0.70).setStrokeStyle(1, missionStatus.shouldPrioritizeEvent ? 0xffd86f : 0x8fd3ff, 0.22));
    ribbon.add(this.add.rectangle(-ribbonW / 2 + 32, -10, 42, 17, missionStatus.shouldPrioritizeEvent ? 0xffd86f : 0x8fd3ff, 0.88).setStrokeStyle(1, 0xffffff, 0.14));
    ribbon.add(this.add.text(-ribbonW / 2 + 32, -10, '추천', darkText(7)).setOrigin(0.5));
    const textX = -ribbonW / 2 + 58;
    const textW = ribbonW - 70;
    ribbon.add(this.add.text(textX, -11, compactText(label, 16), applyTightCopyBox(goldText(8), textW, 20, 'left')).setOrigin(0, 0.5));
    ribbon.add(this.add.text(textX, 12, compactText(copy, 20), applyTightCopyBox(mutedText(7), textW, 22, 'left')).setOrigin(0, 0.5));
    if (allowAmbientMotion(this.quality) && missionStatus.shouldPrioritizeEvent) {
      this.tweens.add({ targets: ribbon, alpha: 0.82, duration: scaledDuration(1100, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private getRecommendedBuildingId(): string {
    const missionStatus = DailyMissionSystem.getLobbyStatus();
    if (missionStatus.shouldPrioritizeEvent) return 'event';
    const nextWord = SaveSystem.nextPlayableStage(WORD_STAGES.length);
    const nextEnglish = SaveSystem.nextPlayableModeStage('english', ENGLISH_STAGES.length);
    const nextMath = SaveSystem.nextPlayableModeStage('math', MATH_STAGES.length);
    const nextMemory = SaveSystem.nextPlayableModeStage('memory', MEMORY_STAGES.length);
    if (!SaveSystem.getStageRecord(nextWord)?.cleared) return 'library';
    if (!SaveSystem.getModeStageRecord('english', nextEnglish)?.cleared) return 'school';
    if (!SaveSystem.getModeStageRecord('math', nextMath)?.cleared) return 'laboratory';
    if (!SaveSystem.getModeStageRecord('memory', nextMemory)?.cleared) return 'forest';
    return 'event';
  }

  private drawRecommendedTrail(building: DioramaBuilding): void {
    if (this.quality.tier === 'lite') return;
    const dots = 4;
    const hero = this.point(HERO_HOME.x, HERO_HOME.y + 34);
    const target = this.point(building.targetX, building.targetY + 30);
    for (let i = 1; i <= dots; i += 1) {
      const t = i / (dots + 1);
      const x = Phaser.Math.Linear(hero.x, target.x, t);
      const y = Phaser.Math.Linear(hero.y, target.y, t);
      const dot = this.textures.exists('propCardTrail')
        ? this.add.image(x, y, 'propCardTrail').setDisplaySize(24 * this.vs(), 20 * this.vs())
        : this.add.circle(x, y, 4, 0xffd86f, 0.42);
      dot.setDepth(735).setAlpha(0.32);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: dot, alpha: 0.08, y: y - 8, duration: scaledDuration(900 + i * 140, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawDioramaProps(): void {
    const scale = this.vs(0.94, 1.12);
    for (const prop of LOBBY_PROPS) {
      if (!this.textures.exists(prop.key)) continue;
      const x = this.vx(prop.x);
      const y = this.vy(prop.y);
      const image = this.add.image(x, y, prop.key)
        .setDisplaySize(prop.width * scale, prop.height * scale)
        .setAlpha(prop.alpha ?? 1)
        .setDepth(prop.depth ? this.vy(prop.depth) : y);
      if (prop.bob && allowAmbientMotion(this.quality)) {
        this.tweens.add({ targets: image, y: y - prop.bob * scale, duration: scaledDuration(1200 + Math.floor(prop.x) * 3, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }
  }

  private assertCriticalLobbyTextures(): void {
    const missing = DIORAMA_BUILDINGS.filter((building) => !this.textures.exists(building.assetKey)).map((building) => building.assetKey);
    if (missing.length) {
      console.warn('[CardVille] critical lobby building textures missing before draw', missing, LOBBY_BOOT_ASSET_HARDENING_TAG, LOBBY_FORCE_LOAD_GATE_TAG);
    }
  }

  private drawBuildings(recommendedBuildingId: string): void {
    for (const building of DIORAMA_BUILDINGS) {
      this.drawBuilding(building, building.id === recommendedBuildingId);
    }
  }

  private fitImageToBox(image: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number): Phaser.GameObjects.Image {
    const frame = image.texture.get();
    const sourceWidth = Math.max(1, frame.width);
    const sourceHeight = Math.max(1, frame.height);
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    image.setScale(scale);
    return image;
  }

  private drawBuilding(building: DioramaBuilding, recommended: boolean): void {
    const point = this.buildingPoint(building);
    const scale = this.vs(0.95, 1.12);
    const container = this.rememberBaseScale(this.add.container(point.x, point.y).setDepth(point.y).setName(`building:${building.id}:${LOBBY_BOOT_ASSET_HARDENING_TAG}:${LOBBY_ART_PLACEMENT_TAG}:${RESPONSIVE_MOBILE_VIEWPORT_TAG}:${SCALE_TWEEN_DEDUPE_TAG}`));
    const width = building.width * scale;
    const height = building.height * scale;
    const visualWidth = (building.visualWidth ?? building.width) * scale;
    const visualHeight = (building.visualHeight ?? building.height) * scale;
    const imageY = (building.imageY ?? 0) * scale;

    if ((building.open || recommended) && this.textures.exists('uiBuildingGlow')) {
      const glow = this.rememberBaseScale(this.add.image(0, 8 * scale, 'uiBuildingGlow').setDisplaySize(width * (recommended ? 1.72 : 1.55), height * (recommended ? 1.72 : 1.55)).setAlpha(recommended ? 0.46 : 0.35));
      container.add(glow);
      if (allowAmbientMotion(this.quality)) {
        const baseGlow = this.baseScaleOf(glow);
        this.tweens.add({ targets: glow, alpha: 0.12, scaleX: baseGlow.x * 1.08, scaleY: baseGlow.y * 1.08, duration: scaledDuration(1100 + (building.x % 3) * 150, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }

    const shadowY = (building.shadowY ?? visualHeight * 0.39) * (building.shadowY ? scale : 1);
    const baseShadow = this.add.ellipse(0, shadowY, visualWidth * 0.86, Math.max(18, visualHeight * 0.17), 0x05030a, building.open ? 0.28 : 0.19);
    container.add(baseShadow);
    const contactGlow = this.add.ellipse(0, shadowY - 4 * scale, visualWidth * 0.72, Math.max(12, visualHeight * 0.10), building.open ? 0xffd86f : 0x8fd3ff, building.open ? 0.08 : 0.04);
    container.add(contactGlow);
    const premiumStage = this.add.ellipse(0, visualHeight * 0.38, visualWidth * 0.98, Math.max(24, visualHeight * 0.19), 0xfff0c2, building.open ? 0.12 : 0.06);
    premiumStage.setStrokeStyle(1, building.open ? 0xffd86f : 0xffffff, building.open ? 0.22 : 0.10);
    container.add(premiumStage);

    const image = this.textures.exists(building.assetKey)
      ? this.fitImageToBox(this.add.image(0, imageY, building.assetKey).setName(`visible:${building.assetKey}:${LOBBY_BOOT_ASSET_HARDENING_TAG}:${LOBBY_ART_PLACEMENT_TAG}:${LOBBY_USER_ASSET_VISIBLE_TAG}:${RESPONSIVE_MOBILE_VIEWPORT_TAG}`).setAlpha(1), visualWidth, visualHeight)
      : this.drawMissingBuildingFallback(building, visualWidth, visualHeight);
    container.add(image);
    if (['dioramaCastle', 'dioramaLibrary', 'dioramaLab', 'dioramaForest'].includes(building.assetKey)) {
      image.setName(`${image.name}:${USER_LOBBY_ASSET_ASSIGNMENT_TAG}`);
    }
    if (this.textures.exists(building.assetKey)) {
      const rim = this.add.ellipse(0, imageY + visualHeight * 0.34, visualWidth * 0.86, Math.max(22, visualHeight * 0.14), 0xfff0c2, building.open ? 0.11 : 0.07);
      rim.setStrokeStyle(1, 0xffffff, 0.16);
      container.addAt(rim, Math.max(0, container.getAll().length - 1));
    }

    if (building.open && this.textures.exists('uiDoorLight')) {
      container.add(this.add.image(0, visualHeight * 0.19, 'uiDoorLight').setDisplaySize(visualWidth * 0.34, visualHeight * 0.24).setAlpha(recommended ? 0.48 : 0.24));
    }

    if (this.textures.exists(building.iconKey)) {
      container.add(this.add.image((building.iconX ?? -visualWidth * 0.31) * (building.iconX ? scale : 1), (building.iconY ?? -visualHeight * 0.31) * (building.iconY ? scale : 1), building.iconKey).setDisplaySize(25 * scale, 25 * scale).setAlpha(0.95));
    }

    if (recommended) {
      container.add(this.add.text(0, (building.recommendLabelY ?? -visualHeight * 0.47) * (building.recommendLabelY ? scale : 1), '추천', goldText(9)).setOrigin(0.5));
      this.drawRecommendedTrail(building);
    }

    const plateY = ((building.nameplateY ?? visualHeight * 0.36) - 13) * (building.nameplateY ? scale : 1);
    if (this.textures.exists('uiNameplateGold')) {
      container.add(this.add.image(0, plateY + 16 * scale, 'uiNameplateGold').setDisplaySize((building.nameplateWidth ?? 108) * 0.90 * scale, 34 * scale).setAlpha(building.open ? 0.96 : 0.72));
    } else {
      const plate = this.add.graphics();
      plate.fillStyle(0x07142c, building.open ? 0.78 : 0.58);
      plate.fillRoundedRect(-50 * scale, plateY, 100 * scale, 36 * scale, 15 * scale);
      plate.lineStyle(1, building.open ? 0xffd86f : 0xffffff, building.open ? 0.56 : 0.22);
      plate.strokeRoundedRect(-50 * scale, plateY, 100 * scale, 36 * scale, 15 * scale);
      container.add(plate);
    }
    container.add(this.add.text(0, plateY + 6 * scale, compactText(building.title, 6), goldText(10)).setOrigin(0.5).setName(LOBBY_NAMEPLATE_LIFT_TAG));
    container.add(this.add.text(0, plateY + 20 * scale, compactText(building.subtitle, 7), mutedText(7)).setOrigin(0.5));
    this.drawBuildingStatusChip(container, building, recommended, scale, visualWidth, visualHeight);

    if (!building.open) {
      if (this.textures.exists('uiLockBadge')) container.add(this.add.image((building.lockX ?? 37) * scale, (building.lockY ?? -visualHeight * 0.30) * (building.lockY ? scale : 1), 'uiLockBadge').setDisplaySize(31 * scale, 31 * scale));
      container.setAlpha(0.76);
    }

    const zoneWidth = Math.max(building.touchWidth * scale, visualWidth * (building.id === 'plaza' ? 0.92 : 0.66));
    const zoneHeight = Math.max(building.touchHeight * scale, visualHeight * (building.id === 'plaza' ? 0.82 : 0.58));
    const zone = this.add.zone(point.x, point.y + (building.touchOffsetY ?? 0) * scale, zoneWidth, zoneHeight).setInteractive({ useHandCursor: building.open });
    zone.setName(building.id === 'plaza' ? PLAZA_TAP_ROUTE_EXPAND_TAG : `building-touch:${building.id}`);
    zone.setDepth(point.y + 5);
    zone.on('pointerup', () => {
      this.spawnTouchRipple(point.x, point.y + 10 * scale);
      this.enterBuilding(building, container);
    });
    zone.on('pointerover', () => { if (!this.busy) this.tweenRelativeScale(container, 1.025, 120); });
    zone.on('pointerout', () => { if (!this.busy) this.restoreRelativeScale(container, 120); });

    if (hasTouchDebug()) {
      this.add.rectangle(point.x, point.y + (building.touchOffsetY ?? 0) * scale, zoneWidth, zoneHeight, 0x00ff66, 0.12)
        .setStrokeStyle(1, 0x00ff66, 0.8)
        .setDepth(900);
    }
  }

  private drawMissingBuildingFallback(building: DioramaBuilding, _width: number, _height: number): Phaser.GameObjects.Container {
    const fallback = this.add.container(0, 0).setAlpha(0);
    fallback.setName(`hidden-missing:${building.assetKey}:${LOBBY_FORCE_LOAD_GATE_TAG}`);
    console.warn('[CardVille] lobby building texture missing; hidden instead of showing fallback card', building.assetKey, building.title);
    return fallback;
  }

  private drawBuildingStatusChip(container: Phaser.GameObjects.Container, building: DioramaBuilding, recommended: boolean, scale = 1, fittedVisualWidth?: number, fittedVisualHeight?: number): void {
    const missionStatus = building.id === 'event' ? DailyMissionSystem.getLobbyStatus() : null;
    const hasMissionBadge = Boolean(missionStatus?.rewardReadyCount);
    if (!recommended && !hasMissionBadge) return;
    const label = hasMissionBadge && missionStatus ? missionStatus.lobbyBadgeLabel : '추천';
    const visualWidth = fittedVisualWidth ?? (building.visualWidth ?? building.width) * scale;
    const visualHeight = fittedVisualHeight ?? (building.visualHeight ?? building.height) * scale;
    const chipY = building.statusY !== undefined ? building.statusY * scale : -visualHeight * 0.45;
    const chipW = Math.max(52, [...label].length * 8 + 16);
    const color = missionStatus ? MISSION_TONE_COLORS[missionStatus.lobbyBadgeTone] : 0xffd86f;
    const chip = this.add.container(building.statusX !== undefined ? building.statusX * scale : visualWidth * 0.18, chipY);
    chip.add(this.add.rectangle(0, 0, chipW, 20, color, 0.88).setStrokeStyle(1, 0xffffff, 0.20));
    chip.add(this.add.text(0, 0, label, { fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#301b0c', fontStyle: '900' }).setOrigin(0.5));
    chip.setAlpha(0.94);
    container.add(chip);
  }

  private drawDioramaNPCs(): void {
    const scale = this.vs(0.94, 1.12);
    for (const npc of LOBBY_NPCS) {
      if (!this.textures.exists(npc.key)) continue;
      const x = this.vx(npc.x);
      const y = this.vy(npc.y);
      const width = npc.width * scale;
      const height = npc.height * scale;
      const npcImage = this.rememberBaseScale(this.fitImageToBox(this.add.image(x, y, npc.key).setName(`visible-npc:${npc.key}:${LOBBY_USER_ASSET_NPC_TAG}:${RESPONSIVE_MOBILE_VIEWPORT_TAG}:${NPC_RELATIVE_SCALE_LOCK_TAG}`), width, height))
        .setDepth(y + 3);
      if (allowAmbientMotion(this.quality)) {
        this.tweens.add({ targets: npcImage, y: y - 2 * scale, duration: scaledDuration(900, this.quality), delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.addNpcIdleGesture(npc, npcImage, x, y);
      }

      if (npc.key === 'npcMerchant' || npc.key === 'npcWizard' || npc.key === 'npcLibrarian' || npc.key === 'npcTeacher' || npc.key === 'npcForestSagePremium') {
        const marker = this.textures.exists('uiQuestMarker')
          ? this.add.image(x + 17 * scale, y - height * 0.55, 'uiQuestMarker').setDisplaySize(18 * scale, 18 * scale)
          : this.add.text(x + 17 * scale, y - height * 0.55, '!', goldText(14)).setOrigin(0.5);
        marker.setDepth(y + 5);
        if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: marker, y: marker.y - 4 * scale, alpha: 0.62, duration: scaledDuration(760, this.quality), delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }

      const zone = this.add.zone(x, y, width + 34 * scale, height + 42 * scale).setInteractive({ useHandCursor: true });
      zone.setDepth(y + 8);
      zone.on('pointerup', () => {
        if (this.busy) return;
        this.spawnTouchRipple(x, y);
        this.showNpcDialogue(npc, x, y);
        this.playNpcGesture(npc, npcImage, x, y);
      });
      zone.on('pointerover', () => { if (!this.busy) this.tweenRelativeScale(npcImage, 1.045, 120); });
      zone.on('pointerout', () => { if (!this.busy) this.restoreRelativeScale(npcImage, 120); });

      if (hasTouchDebug()) {
        this.add.rectangle(x, y, width + 34 * scale, height + 42 * scale, 0xffd86f, 0.10)
          .setStrokeStyle(1, 0xffd86f, 0.75)
          .setDepth(901);
      }
    }
  }

  private drawLobbySettingsButton(): void {
    const l = layout(this);
    const buttonX = l.visibleX + l.visibleWidth - Math.max(39, l.safeRight + 39);
    const buttonY = l.top + 16;
    const button = this.add.container(buttonX, buttonY).setDepth(946).setName(`${LOBBY_UI_NON_OVERLAP_TAG}:${LOBBY_FULLSCREEN_SPREAD_TAG}`);
    if (this.textures.exists('uiSettingsButton')) button.add(this.add.image(0, 0, 'uiSettingsButton').setDisplaySize(46, 46));
    else button.add(this.add.circle(0, 0, 22, 0xffd86f, 0.90));
    button.add(this.add.text(0, 1, '⚙', goldText(20)).setOrigin(0.5));
    button.setSize(50, 50).setInteractive({ useHandCursor: true });
    button.on('pointerup', () => {
      if (this.busy) return;
      this.spawnTouchRipple(buttonX, buttonY);
      this.toggleLobbySettingsPanel();
    });
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: button, angle: 4, duration: scaledDuration(2200, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private toggleLobbySettingsPanel(): void {
    if (this.activeSettingsPanel) {
      this.activeSettingsPanel.destroy();
      this.activeSettingsPanel = undefined;
      return;
    }
    this.activeSpeech?.destroy();
    this.activeSpeech = undefined;

    const l = layout(this);
    const panelW = Math.min(340, l.visibleWidth - Math.max(34, l.safeLeft + l.safeRight + 34));
    const panelH = 316;
    const panel = this.add.container(l.cx, Phaser.Math.Clamp(l.cy + 4, l.top + panelH / 2 + 10, l.bottom - panelH / 2 - 10)).setDepth(1200).setName(`settings:${LOBBY_COPY_COLLISION_FIX_TAG}:${SETTINGS_COPY_SAFE_TAG}`);
    if (this.textures.exists('uiPanelWood')) panel.add(this.add.image(0, 0, 'uiPanelWood').setDisplaySize(panelW, panelH).setAlpha(0.97));
    else {
      const bg = this.add.graphics();
      bg.fillStyle(0x07142c, 0.94);
      bg.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 26);
      bg.lineStyle(1, 0xffd86f, 0.24);
      bg.strokeRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 26);
      panel.add(bg);
    }
    panel.add(this.add.text(0, -120, '설정', titleText(19)).setOrigin(0.5));
    panel.add(this.add.text(0, -94, '화면과 조작을 편하게 조정해요.', applyTightCopyBox(mutedText(8), panelW - 52, 24)).setOrigin(0.5));
    const prefs = AccessibilitySystem.getPrefs();

    const addToggle = (y: number, label: string, enabled: boolean, toggle: () => void) => {
      const row = this.add.container(0, y);
      row.add(this.add.rectangle(0, 0, panelW - 54, 34, enabled ? 0xfffbf1 : 0x26334f, enabled ? 0.90 : 0.64).setStrokeStyle(1, enabled ? 0xffd86f : 0x8fd3ff, enabled ? 0.28 : 0.16));
      row.add(this.add.text(-panelW / 2 + 44, 0, label, enabled ? darkText(10) : mutedText(10)).setOrigin(0, 0.5));
      row.add(this.add.text(panelW / 2 - 44, 0, enabled ? '켜짐' : '꺼짐', enabled ? darkText(10) : mutedText(10)).setOrigin(1, 0.5));
      const hit = this.add.zone(0, 0, panelW - 40, 42).setInteractive({ useHandCursor: true });
      hit.on('pointerup', () => {
        toggle();
        this.quality = getCardVilleQuality();
        this.activeSettingsPanel?.destroy();
        this.activeSettingsPanel = undefined;
        this.toggleLobbySettingsPanel();
      });
      row.add(hit);
      panel.add(row);
    };
    addToggle(-50, '편안한 모션', prefs.reduceMotion, () => AccessibilitySystem.toggleReduceMotion());
    addToggle(-8, '고대비 화면', prefs.highContrast, () => AccessibilitySystem.toggleHighContrast());
    addToggle(34, '큰 안내 문구', prefs.largeText, () => AccessibilitySystem.toggleLargeText());
    panel.add(this.add.text(0, 78, '뒤로가기 한 번: 나가기 확인 · 한 번 더: 창 닫기 시도', applyTightCopyBox(mutedText(8), panelW - 56, 38)).setOrigin(0.5));
    const close = this.add.container(0, 126);
    if (this.textures.exists('uiNameplateGold')) close.add(this.add.image(0, 0, 'uiNameplateGold').setDisplaySize(112, 40));
    else close.add(this.add.rectangle(0, 0, 110, 38, 0xffd86f, 0.90).setStrokeStyle(1, 0xffffff, 0.24));
    close.add(this.add.text(0, 0, '닫기', { fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#2a160c', fontStyle: '900' }).setOrigin(0.5));
    close.setSize(116, 44).setInteractive({ useHandCursor: true });
    close.on('pointerup', () => this.toggleLobbySettingsPanel());
    panel.add(close);
    if (this.quality.highContrast) panel.add(this.add.rectangle(0, 0, panelW + 8, panelH + 8, 0xffffff, 0.025).setStrokeStyle(1, 0xffffff, 0.18));
    panel.setScale(0.92).setAlpha(0);
    this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 180, ease: 'Back.easeOut' });
    this.activeSettingsPanel = panel;
  }

  private addNpcIdleGesture(npc: LobbyNpc, npcImage: Phaser.GameObjects.Image, x = npc.x, y = npc.y): void {
    if (!allowAmbientMotion(this.quality)) return;
    if (npc.animation === 'wave') {
      this.tweens.add({ targets: npcImage, angle: 4, duration: 840, delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      return;
    }
    if (npc.animation === 'sparkle') {
      this.time.addEvent({ delay: scaledDuration(1700, this.quality), startAt: npc.delay, loop: true, callback: () => this.spawnNpcSparkle(x + 10, y - 20, 2) });
      return;
    }
    if (npc.animation === 'cat') {
      this.tweens.add({ targets: npcImage, angle: -3, duration: 620, delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      return;
    }
    if (npc.animation === 'book') {
      this.time.addEvent({ delay: 2100, startAt: npc.delay, loop: true, callback: () => this.spawnFloatingCue('iconCvLibrary', x + 12, y - 24) });
    }
  }

  private showNpcDialogue(npc: LobbyNpc, x = npc.x, y = npc.y): void {
    this.activeSpeech?.destroy();
    this.activeSettingsPanel?.destroy();
    this.activeSettingsPanel = undefined;

    const nextIndex = (this.npcLineIndexes.get(npc.key) ?? 0) % npc.lines.length;
    this.npcLineIndexes.set(npc.key, nextIndex + 1);
    const line = npc.lines[nextIndex];
    const bubbleX = Phaser.Math.Clamp(x + (x < 195 ? 78 : -78), layout(this).visibleX + 112, layout(this).visibleX + layout(this).visibleWidth - 112);
    const bubbleY = Phaser.Math.Clamp(y - 74, layout(this).top + 74, layout(this).bottom - 126);
    const bubble = this.add.container(bubbleX, bubbleY).setDepth(1150);
    if (this.textures.exists('uiSpeechBubble')) bubble.add(this.add.image(0, 0, 'uiSpeechBubble').setDisplaySize(226, 84).setAlpha(0.96));
    else {
      const bg = this.add.graphics();
      bg.fillStyle(0x07142c, 0.92);
      bg.fillRoundedRect(-113, -42, 226, 84, 22);
      bg.lineStyle(2, 0xffd86f, 0.55);
      bg.strokeRoundedRect(-113, -42, 226, 84, 22);
      bubble.add(bg);
    }
    bubble.add(this.add.text(-88, -24, npc.label, goldText(13)).setOrigin(0, 0.5));
    bubble.add(this.add.text(0, 10, line, applyNoticeBox(noticeText(11), 188, 46)).setOrigin(0.5));
    bubble.setScale(0.82).setAlpha(0);
    this.tweens.add({ targets: bubble, scale: 1, alpha: 1, y: bubbleY - 4, duration: 170, ease: 'Back.easeOut' });
    this.time.delayedCall(3300, () => {
      if (this.activeSpeech !== bubble) return;
      this.tweens.add({ targets: bubble, alpha: 0, y: bubble.y - 8, duration: 180, onComplete: () => bubble.destroy() });
      this.activeSpeech = undefined;
    });
    this.activeSpeech = bubble;
    this.hintText?.setText(`${npc.label}: ${line}`);
  }

  private playNpcGesture(npc: LobbyNpc, npcImage: Phaser.GameObjects.Image, x = npc.x, y = npc.y): void {
    this.tweenRelativeScale(npcImage, 1.075, 90, true);
    if (npc.animation === 'sparkle') {
      this.spawnNpcSparkle(x, y - 18, 7);
      return;
    }
    if (npc.animation === 'book') {
      this.spawnFloatingCue('iconCvLibrary', x + 16, y - 26);
      this.spawnFloatingCue('assetWord', x - 14, y - 18);
      return;
    }
    if (!allowAmbientMotion(this.quality)) return;
    if (npc.animation === 'wave') {
      this.tweens.add({ targets: npcImage, angle: 11, duration: 85, yoyo: true, repeat: 3, ease: 'Sine.easeInOut' });
      this.spawnFloatingCue('assetGift', x + 15, y - 24);
      return;
    }
    if (npc.animation === 'teach') {
      this.spawnFloatingCue('iconCvSchool', x + 13, y - 24);
      return;
    }
    if (npc.animation === 'cook') {
      this.spawnFloatingCue('iconCvEvent', x + 12, y - 22);
      return;
    }
    if (npc.animation === 'cat') {
      this.spawnFloatingCue('catHint', x + 12, y - 20);
      return;
    }
    if (npc.animation === 'salute') {
      this.spawnFloatingCue('iconCvCastle', x + 12, y - 24);
      return;
    }
    this.spawnNpcSparkle(x, y - 20, 3);
  }

  private spawnFloatingCue(key: string, x: number, y: number): void {
    const cue = this.textures.exists(key)
      ? this.rememberBaseScale(this.add.image(x, y, key).setDisplaySize(24, 24))
      : this.rememberBaseScale(this.add.text(x, y, '✦', goldText(15)).setOrigin(0.5));
    cue.setDepth(1160).setAlpha(0.92);
    const base = this.baseScaleOf(cue);
    this.tweens.add({ targets: cue, y: y - 26, scaleX: base.x * 0.76, scaleY: base.y * 0.76, alpha: 0, duration: 760, ease: 'Sine.easeOut', onComplete: () => cue.destroy() });
  }

  private spawnNpcSparkle(x: number, y: number, count: number): void {
    const total = Math.min(count, this.quality.maxSparkles);
    for (let i = 0; i < total; i += 1) {
      const sparkle = this.textures.exists('particleSparkle')
        ? this.add.image(x + Phaser.Math.Between(-18, 18), y + Phaser.Math.Between(-18, 18), 'particleSparkle').setDisplaySize(14, 14)
        : this.add.text(x + Phaser.Math.Between(-18, 18), y + Phaser.Math.Between(-18, 18), '✦', goldText(12)).setOrigin(0.5);
      this.rememberBaseScale(sparkle).setDepth(1160).setAlpha(0.85);
      const base = this.baseScaleOf(sparkle);
      this.tweens.add({ targets: sparkle, y: sparkle.y - Phaser.Math.Between(14, 30), alpha: 0, scaleX: base.x * 0.45, scaleY: base.y * 0.45, duration: 700, delay: i * 45, ease: 'Sine.easeOut', onComplete: () => sparkle.destroy() });
    }
  }

  private drawHeroParty(): void {
    const scale = this.vs(0.94, 1.10);
    const catHome = this.point(CAT_HOME.x, CAT_HOME.y);
    const heroHome = this.point(HERO_HOME.x, HERO_HOME.y);
    this.cat = this.add.container(catHome.x, catHome.y).setDepth(catHome.y + 2).setName(`${RESPONSIVE_MOBILE_VIEWPORT_TAG}:cat-home`);
    if (this.textures.exists('blackCatMascotPremium')) {
      this.catImage = this.fitImageToBox(this.add.image(0, 0, 'blackCatMascotPremium'), 58 * scale, 64 * scale);
      this.cat.add(this.catImage);
    } else if (this.textures.exists('catIdle')) {
      this.catImage = this.fitImageToBox(this.add.image(0, 0, 'catIdle'), 54 * scale, 57 * scale);
      this.cat.add(this.catImage);
    } else if (this.textures.exists('dioramaCat')) this.cat.add(this.fitImageToBox(this.add.image(0, 0, 'dioramaCat'), 54 * scale, 57 * scale));
    else this.cat.add(this.add.text(0, 0, '🐈‍⬛', { fontSize: `${Math.round(44 * scale)}px` }).setOrigin(0.5));

    this.hero = this.add.container(heroHome.x, heroHome.y).setDepth(heroHome.y + 4).setName(`${RESPONSIVE_MOBILE_VIEWPORT_TAG}:hero-home`);
    if (this.textures.exists('heroTravelerPremium')) {
      this.heroImage = this.fitImageToBox(this.add.image(0, 0, 'heroTravelerPremium'), 78 * scale, 108 * scale);
      this.hero.add(this.heroImage);
    } else if (this.textures.exists('heroIdle')) {
      this.heroImage = this.fitImageToBox(this.add.image(0, 0, 'heroIdle'), 74 * scale, 115 * scale);
      this.hero.add(this.heroImage);
    } else if (this.textures.exists('dioramaHero')) this.hero.add(this.fitImageToBox(this.add.image(0, 0, 'dioramaHero'), 74 * scale, 115 * scale));
    else this.hero.add(this.add.text(0, 0, '🧒', { fontSize: `${Math.round(60 * scale)}px` }).setOrigin(0.5));

    if (allowAmbientMotion(this.quality)) {
      this.tweens.add({ targets: this.hero, y: heroHome.y - 3 * scale, duration: scaledDuration(1050, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: this.cat, y: catHome.y - 2 * scale, duration: scaledDuration(820, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: this.cat, angle: 2, duration: scaledDuration(520, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawBottomHint(nickname: string): void {
    const l = layout(this);
    const y = l.bottom + 6;
    const panelW = Math.min(430, l.visibleWidth - Math.max(28, l.safeLeft + l.safeRight + 28));
    if (this.textures.exists('uiPanelGlass')) this.add.image(l.cx, y, 'uiPanelGlass').setDisplaySize(panelW, 34).setAlpha(0.88).setDepth(940).setName(`${LOBBY_UI_NON_OVERLAP_TAG}:${RESPONSIVE_MOBILE_VIEWPORT_TAG}`);
    else {
      const g = this.add.graphics().setDepth(940).setName(`${LOBBY_UI_NON_OVERLAP_TAG}:${RESPONSIVE_MOBILE_VIEWPORT_TAG}`);
      g.fillStyle(0x07142c, 0.66);
      g.fillRoundedRect(l.cx - panelW / 2, y - 18, panelW, 34, 16);
      g.lineStyle(1, 0xffffff, 0.16);
      g.strokeRoundedRect(l.cx - panelW / 2, y - 18, panelW, 34, 16);
    }
    this.hintText = this.add.text(
      l.cx,
      y,
      `${nickname} 모험가님, 건물 그림을 눌러 이동하세요.`,
      applyWrap(bodyText(14), panelW - 26)
    ).setOrigin(0.5).setDepth(942).setName(`${LOBBY_NO_PATCH_TEXT_TAG}:${RESPONSIVE_MOBILE_VIEWPORT_TAG}`);
  }

  private drawAmbientLife(): void {
    this.addMovingCloud(75, 128, 116, 0.26, 31000);
    this.addMovingCloud(300, 204, 142, 0.20, 39000);
    const floatingCards = ambientCount(5, this.quality, 1);
    const butterflies = ambientCount(4, this.quality, 1);
    const birds = ambientCount(3, this.quality, this.quality.tier === 'lite' ? 0 : 1);
    const fireflies = ambientCount(9, this.quality, 2);
    const sparkleDots = Math.min(this.quality.maxSparkles * 3, scaledCount(24, this.quality));
    for (let i = 0; i < floatingCards; i += 1) this.addFloatingCard(54 + i * 70, 160 + (i % 2) * 88, i * 230);
    for (let i = 0; i < butterflies; i += 1) this.addButterfly(58 + i * 86, 386 + (i % 3) * 98, i * 480);
    for (let i = 0; i < birds; i += 1) this.addBird(70 + i * 108, 112 + i * 50, i * 760);
    for (let i = 0; i < fireflies; i += 1) this.addFirefly(34 + i * 39, 602 + (i % 3) * 46, i * 140);
    for (let i = 0; i < sparkleDots; i += 1) {
      const x = this.vx(Phaser.Math.Between(20, 370));
      const y = this.vy(Phaser.Math.Between(260, 735));
      const dot = this.add.circle(x, y, Phaser.Math.FloatBetween(1.2, 2.4), 0xffdf7a, Phaser.Math.FloatBetween(0.20, 0.54)).setDepth(800);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: dot, y: y - Phaser.Math.Between(8, 26), alpha: 0.05, duration: scaledDuration(Phaser.Math.Between(1200, 2600), this.quality), delay: i * 70, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private addMovingCloud(x: number, y: number, width: number, alpha: number, duration: number): void {
    const px = this.vx(x);
    const py = this.vy(y);
    const scale = this.vs(0.94, 1.12);
    const cloud = this.textures.exists('dioramaCloud')
      ? this.add.image(px, py, 'dioramaCloud').setDisplaySize(width * scale, width * 0.42 * scale).setAlpha(alpha)
      : this.add.ellipse(px, py, width * scale, width * 0.34 * scale, 0xffffff, alpha);
    cloud.setDepth(5);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: cloud, x: px + 85 * scale, duration: scaledDuration(duration, this.quality), repeat: -1, yoyo: true, ease: 'Sine.easeInOut' });
  }

  private addFloatingCard(x: number, y: number, delay: number): void {
    const px = this.vx(x);
    const py = this.vy(y);
    const scale = this.vs(0.94, 1.12);
    const card = this.textures.exists('dioramaFloatingCard')
      ? this.add.image(px, py, 'dioramaFloatingCard').setDisplaySize(26 * scale, 35 * scale)
      : this.add.rectangle(px, py, 22 * scale, 30 * scale, 0x7a4ed5, 0.8).setStrokeStyle(1, 0xffe08d, 0.8);
    card.setAlpha(0.62).setDepth(20).setAngle(Phaser.Math.Between(-10, 10));
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: card, y: py - 20 * scale, angle: card.angle + 12, alpha: 0.22, duration: scaledDuration(2500, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addButterfly(x: number, y: number, delay: number): void {
    const px = this.vx(x);
    const py = this.vy(y);
    const scale = this.vs(0.94, 1.12);
    const butterfly = this.textures.exists('dioramaButterfly')
      ? this.add.image(px, py, 'dioramaButterfly').setDisplaySize(30 * scale, 22 * scale)
      : this.add.text(px, py, '✦', goldText(16)).setOrigin(0.5);
    butterfly.setAlpha(0.78).setDepth(650);
    this.rememberBaseScale(butterfly);
    const base = this.baseScaleOf(butterfly);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: butterfly, x: px + Phaser.Math.Between(-24, 28) * scale, y: py - Phaser.Math.Between(16, 34) * scale, scaleX: base.x * 0.82, scaleY: base.y * 0.82, duration: scaledDuration(1500, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addBird(x: number, y: number, delay: number): void {
    if (!this.textures.exists('propBird')) return;
    const scale = this.vs(0.94, 1.12);
    const px = this.vx(x);
    const py = this.vy(y);
    const bird = this.add.image(px, py, 'propBird').setDisplaySize(28 * scale, 22 * scale).setAlpha(0.62).setDepth(50);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: bird, x: px + 80 * scale, y: py - 16 * scale, alpha: 0.18, duration: scaledDuration(4200, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addFirefly(x: number, y: number, delay: number): void {
    const px = this.vx(x);
    const py = this.vy(y);
    const scale = this.vs(0.94, 1.12);
    const firefly = this.textures.exists('propFirefly')
      ? this.add.image(px, py, 'propFirefly').setDisplaySize(14 * scale, 14 * scale)
      : this.add.circle(px, py, 4 * scale, 0xffdf7a, 0.7);
    firefly.setDepth(760).setAlpha(0.58);
    this.rememberBaseScale(firefly);
    const base = this.baseScaleOf(firefly);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: firefly, x: px + Phaser.Math.Between(-18, 22) * scale, y: py - Phaser.Math.Between(12, 30) * scale, alpha: 0.18, scaleX: base.x * 0.72, scaleY: base.y * 0.72, duration: scaledDuration(1800, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private enterBuilding(building: DioramaBuilding, buildingContainer: Phaser.GameObjects.Container): void {
    if (this.busy) return;
    const route = building.route;
    if (!building.open || !route) {
      this.showLockedMessage(building.title);
      return;
    }
    if (!this.hero || !this.cat) return;
    this.busy = true;
    this.activeSpeech?.destroy();
    this.activeSpeech = undefined;
    this.activeSettingsPanel?.destroy();
    this.activeSettingsPanel = undefined;
    this.hintText?.setText(`${building.title}로 갑니다 · 톡톡톡!`);
    const target = this.buildingTarget(building);
    const scale = this.vs(0.94, 1.10);
    this.tweens.killTweensOf(this.hero);
    this.tweens.killTweensOf(this.cat);
    this.spawnFootsteps(this.hero.x, this.hero.y, target.x, target.y);
    this.startWalkAnimation();
    this.tweens.add({
      targets: this.hero,
      x: target.x,
      y: target.y,
      scale: 0.92,
      duration: 560,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.cat,
      x: target.x - 33 * scale,
      y: target.y + 18 * scale,
      scale: 0.90,
      duration: 520,
      delay: 70,
      ease: 'Sine.easeInOut',
      onComplete: () => this.openBuildingDoor(building, buildingContainer, route)
    });
    if (isMotionEnabled(this.quality)) {
      this.addStepBounce(this.hero, 6, 4);
      this.addStepBounce(this.cat, 5, 3);
    }
  }

  private startWalkAnimation(): void {
    const heroFrames = ['heroWalk01', 'heroWalk02', 'heroWalk03'];
    const catFrames = ['catWalk01', 'catWalk02'];
    let frame = 0;
    this.walkTimer?.remove(false);
    this.walkTimer = this.time.addEvent({
      delay: 110,
      loop: true,
      callback: () => {
        if (this.heroImage && this.textures.exists(heroFrames[frame % heroFrames.length])) this.heroImage.setTexture(heroFrames[frame % heroFrames.length]);
        if (this.catImage && this.textures.exists(catFrames[frame % catFrames.length])) this.catImage.setTexture(catFrames[frame % catFrames.length]);
        frame += 1;
      }
    });
  }

  private stopWalkAnimation(): void {
    this.walkTimer?.remove(false);
    this.walkTimer = undefined;
    if (this.heroImage && this.textures.exists('heroIdle')) this.heroImage.setTexture('heroIdle');
    if (this.catImage && this.textures.exists('catIdle')) this.catImage.setTexture('catIdle');
  }

  private addStepBounce(target: Phaser.GameObjects.Container, count: number, amount: number): void {
    for (let i = 0; i < count; i += 1) {
      this.time.delayedCall(i * 95, () => {
        this.tweens.add({ targets: target, y: target.y - amount, duration: 50, yoyo: true, ease: 'Quad.easeOut' });
      });
    }
  }

  private spawnTouchRipple(x: number, y: number): void {
    if (this.textures.exists('uiTouchRipple')) {
      const ripple = this.rememberBaseScale(this.add.image(x, y, 'uiTouchRipple').setDisplaySize(54, 54)).setDepth(1000).setAlpha(0.72);
      const base = this.baseScaleOf(ripple);
      this.tweens.add({ targets: ripple, scaleX: base.x * 1.75, scaleY: base.y * 1.75, alpha: 0, duration: 360, ease: 'Cubic.easeOut', onComplete: () => ripple.destroy() });
      return;
    }
    const ripple = this.add.circle(x, y, 18, 0xffffff, 0.3).setDepth(1000);
    this.tweens.add({ targets: ripple, scale: 2.2, alpha: 0, duration: 360, ease: 'Cubic.easeOut', onComplete: () => ripple.destroy() });
  }

  private spawnFootsteps(fromX: number, fromY: number, toX: number, toY: number): void {
    const steps = this.quality.tier === 'lite' ? 3 : 5;
    for (let i = 1; i <= steps; i += 1) {
      const t = i / (steps + 1);
      const x = Phaser.Math.Linear(fromX, toX, t) + (i % 2 ? -6 : 6);
      const y = Phaser.Math.Linear(fromY + 45, toY + 40, t);
      const step = this.add.ellipse(x, y, 14, 7, 0x3f2a25, 0.22).setDepth(740);
      this.tweens.add({ targets: step, alpha: 0, scale: 1.25, duration: 650, delay: i * 65, onComplete: () => step.destroy() });
    }
  }

  private openBuildingDoor(building: DioramaBuilding, buildingContainer: Phaser.GameObjects.Container, route: DioramaRoute): void {
    this.stopWalkAnimation();
    const point = this.buildingPoint(building);
    const scale = this.vs(0.94, 1.12);
    const glow = this.textures.exists('uiDoorLight')
      ? this.add.image(point.x, point.y + 18 * scale, 'uiDoorLight').setDisplaySize(92 * scale, 118 * scale).setDepth(900).setAlpha(0.62)
      : this.add.circle(point.x, point.y + 22 * scale, 46 * scale, 0xffe28c, 0.28).setDepth(900);
    this.rememberBaseScale(glow);
    const base = this.baseScaleOf(glow);
    this.tweens.add({ targets: glow, scaleX: base.x * 2.1, scaleY: base.y * 2.1, alpha: 0, duration: 420, ease: 'Cubic.easeOut', onComplete: () => glow.destroy() });
    this.cameras.main.flash(220, 255, 232, 166, false);
    this.time.delayedCall(360, () => this.goToRoute(route));
    this.tweens.add({ targets: buildingContainer, alpha: 0.82, duration: 100, yoyo: true, repeat: 1 });
  }

  private goToRoute(route: DioramaRoute): void {
    if (route.scene === 'MathLabScene') {
      NavigationSystem.safeStart(this, 'StageSelectScene', { modeId: 'math', title: '연산 연구소', recommendedStage: SaveSystem.nextPlayableModeStage('math', MATH_STAGES.length) });
      return;
    }
    if (route.scene === 'MemoryForestScene') {
      NavigationSystem.safeStart(this, 'StageSelectScene', { modeId: 'memory', title: '기억의 숲', recommendedStage: SaveSystem.nextPlayableModeStage('memory', MEMORY_STAGES.length) });
      return;
    }
    NavigationSystem.safeStart(this, route.scene, 'data' in route ? route.data : undefined);
  }

  private showLockedMessage(title: string): void {
    this.hintText?.setText(`${title}은(는) 아직 열리지 않았어요.`);
    const l = layout(this);
    const toastY = l.bottom - 104;
    const toastBg = this.textures.exists('uiToast') ? this.add.image(l.cx, toastY, 'uiToast').setDisplaySize(166, 56).setDepth(999).setAlpha(0.90) : undefined;
    const toast = this.add.text(l.cx, toastY, '준비중', applyNoticeBox(noticeText(13), 144, 34)).setOrigin(0.5).setDepth(1000);
    this.tweens.add({ targets: [toast, toastBg].filter(Boolean), y: toastY - 24, alpha: 0, duration: 900, ease: 'Sine.easeOut', onComplete: () => { toast.destroy(); toastBg?.destroy(); } });
  }
}
