import Phaser from 'phaser';
import { addCoverImage, applyResponsiveCamera, hasTouchDebug, layout } from '../systems/LayoutSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { ASSET_COUNTS } from '../data/assetManifest';
import { LOBBY_NPCS, LOBBY_PROPS, LOBBY_SAFE_RULES, LobbyNpc } from '../data/lobbyEntities';
import { allowAmbientMotion, ambientCount, CardVilleQuality, getCardVilleQuality, isMotionEnabled, qualitySummary, scaledCount, scaledDuration } from '../systems/QualitySystem';
import { DIORAMA_BUILDINGS, DioramaBuilding, DioramaRoute } from '../data/dioramaBuildings';
import { LOBBY_LAYOUT_GUARDS, LOBBY_LAYOUT_PLAN_VERSION } from '../data/lobbyLayoutPlan';
import { MATH_STAGES } from '../data/mathStages';
import { MEMORY_STAGES } from '../data/memoryStages';
import { ENGLISH_STAGES } from '../data/englishStages';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { CoachMarkSystem } from '../systems/CoachMarkSystem';
import { AccessibilitySystem } from '../systems/AccessibilitySystem';
import { DailyMissionSystem } from '../systems/DailyMissionSystem';

const LOBBY_VERSION = '1.0.49';
const MISSION_TONE_COLORS = { gold: 0xffd86f, blue: 0x8fd3ff, purple: 0xd7a5ff, green: 0xa9f5b5, coral: 0xffb39a } as const;
const PREMIUM_LOBBY_FIT_TAG = 'premium-asset-visible-v149' as const;
const HERO_HOME = { x: 195, y: 545 } as const;
const CAT_HOME = { x: 145, y: 585 } as const;

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

  create(): void {
    applyResponsiveCamera(this);
    this.quality = getCardVilleQuality();
    const profile = SaveSystem.loadProfile();
    const progress = SaveSystem.loadProgress();
    const cleared = Object.values(progress).filter((record) => record.cleared).length;
    const cards = Object.values(SaveSystem.loadCollection()).reduce((sum, count) => sum + count, 0);

    this.drawDioramaBackground();
    this.drawAtmosphericPolish();
    this.drawAmbientLife();
    this.drawDioramaProps();
    this.drawTopBrandHud(profile.coins, profile.level, cleared, cards);
    this.drawLobbySettingsButton();
    const recommendedBuildingId = this.getRecommendedBuildingId();
    this.drawBuildings(recommendedBuildingId);
    this.drawDioramaNPCs();
    this.drawHeroParty();
    this.drawBottomHint(profile.nickname);
    this.add.text(344, 28, LOBBY_VERSION, mutedText(11)).setOrigin(0.5).setAlpha(0.9);
    this.showLobbyCoach(recommendedBuildingId);
  }

  private showLobbyCoach(recommendedBuildingId: string): void {
    const target = DIORAMA_BUILDINGS.find((building) => building.id === recommendedBuildingId);
    const missionStatus = DailyMissionSystem.getLobbyStatus();
    CoachMarkSystem.showOnce(this, {
      id: 'lobby_recommended_route_v144',
      title: '고양이 길잡이',
      body: recommendedBuildingId === 'event' && missionStatus.rewardReadyCount > 0 ? `이벤트 광장에 ${missionStatus.lobbyBadgeLabel} 보상이 있어요. ${missionStatus.nextActionCopy}` : 'NEXT가 붙은 건물부터 들어가면 도서관, 학교, 연구소, 기억의 숲을 자연스럽게 이어갈 수 있어요. 보상이 준비되면 이벤트 광장이 먼저 안내됩니다.',
      x: 195,
      y: 694,
      width: 326,
      tone: 'gold',
      anchorX: target?.x,
      anchorY: target?.y
    });
  }

  private drawDioramaBackground(): void {
    const l = layout(this);
    if (this.textures.exists('dioramaBg')) {
      // Keep the 1080x1920 premium lobby illustration as cover image instead of stretching it to 390x844.
      addCoverImage(this, 'dioramaBg', 1, 1080, 1920)?.setDepth(0);
    } else {
      DrawSystem.background(this, '카드마을 광장');
    }
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x061126, 0.08).setDepth(1);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, 798, l.visibleWidth, 96 + l.extraY, 0x020814, 0.18).setDepth(2);
    this.add.rectangle(l.visibleX + 8, l.visibleY + l.visibleHeight / 2, 16, l.visibleHeight, 0x020814, 0.10).setDepth(3);
    this.add.rectangle(l.visibleX + l.visibleWidth - 8, l.visibleY + l.visibleHeight / 2, 16, l.visibleHeight, 0x020814, 0.10).setDepth(3);
  }

  private drawAtmosphericPolish(): void {
    const top = this.add.rectangle(195, 54, 390, 108, 0xffffff, 0.04).setDepth(6);
    const bottom = this.add.rectangle(195, 804, 390, 110, 0x020814, 0.14).setDepth(6);
    const focus = this.add.ellipse(195, 538, 238, 336, 0xffd86f, 0.055).setDepth(7);
    if (allowAmbientMotion(this.quality)) {
      this.tweens.add({ targets: focus, scale: 1.05, alpha: 0.025, duration: scaledDuration(1800, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: top, alpha: 0.058, duration: scaledDuration(2200, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: bottom, alpha: 0.18, duration: scaledDuration(2200, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawTopBrandHud(coins: number, level: number, cleared: number, cards: number): void {
    if (this.textures.exists('uiPanelGlass')) {
      this.add.image(143, 55, 'uiPanelGlass').setDisplaySize(252, 74).setAlpha(0.93).setDepth(910);
    } else {
      const g = this.add.graphics().setDepth(910);
      g.fillStyle(0x07142c, 0.70);
      g.fillRoundedRect(18, 18, 250, 70, 25);
      g.lineStyle(1, 0xffffff, 0.20);
      g.strokeRoundedRect(18, 18, 250, 70, 25);
    }
    this.add.rectangle(142, 35, 213, 12, 0xffffff, 0.08).setDepth(911);
    this.add.text(38, 49, '카드마을 CardVille', titleText(20)).setOrigin(0, 0.5).setDepth(912);
    const totalOpenStages = WORD_STAGES.length + ENGLISH_STAGES.length + MATH_STAGES.length + MEMORY_STAGES.length;
    this.add.text(39, 73, `Lv.${level} · 🪙 ${coins} · 카드 ${cards}장 · ${cleared}/${totalOpenStages}`, mutedText(11)).setOrigin(0, 0.5).setDepth(912);

    const album = this.add.container(319, 54).setDepth(920);
    if (this.textures.exists('uiNameplateGold')) album.add(this.add.image(0, 0, 'uiNameplateGold').setDisplaySize(92, 58));
    else {
      const bg = this.add.graphics();
      bg.fillStyle(0xffd86f, 0.90);
      bg.fillRoundedRect(-42, -27, 84, 54, 20);
      bg.lineStyle(2, 0xffffff, 0.54);
      bg.strokeRoundedRect(-42, -27, 84, 54, 20);
      album.add(bg);
    }
    if (this.textures.exists('assetAlbum')) album.add(this.add.image(-20, 0, 'assetAlbum').setDisplaySize(28, 28));
    album.add(this.add.text(10, 1, '앨범', { fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#2a160c', fontStyle: '900' }).setOrigin(0.5));
    album.setSize(90, 58).setInteractive({ useHandCursor: true });
    album.on('pointerup', () => this.scene.start('CollectionScene'));
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
    for (let i = 1; i <= dots; i += 1) {
      const t = i / (dots + 1);
      const x = Phaser.Math.Linear(HERO_HOME.x, building.targetX, t);
      const y = Phaser.Math.Linear(HERO_HOME.y + 34, building.targetY + 30, t);
      const dot = this.textures.exists('propCardTrail')
        ? this.add.image(x, y, 'propCardTrail').setDisplaySize(24, 20)
        : this.add.circle(x, y, 4, 0xffd86f, 0.42);
      dot.setDepth(735).setAlpha(0.32);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: dot, alpha: 0.08, y: y - 8, duration: scaledDuration(900 + i * 140, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawDioramaProps(): void {
    for (const prop of LOBBY_PROPS) {
      if (!this.textures.exists(prop.key)) continue;
      const image = this.add.image(prop.x, prop.y, prop.key)
        .setDisplaySize(prop.width, prop.height)
        .setAlpha(prop.alpha ?? 1)
        .setDepth(prop.depth ?? prop.y);
      if (prop.bob && allowAmbientMotion(this.quality)) {
        this.tweens.add({ targets: image, y: prop.y - prop.bob, duration: scaledDuration(1200 + Math.floor(prop.x) * 3, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
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
    const container = this.add.container(building.x, building.y).setDepth(building.y);
    if ((building.open || recommended) && this.textures.exists('uiBuildingGlow')) {
      const glow = this.add.image(0, 8, 'uiBuildingGlow').setDisplaySize(building.width * (recommended ? 1.72 : 1.55), building.height * (recommended ? 1.72 : 1.55)).setAlpha(recommended ? 0.46 : 0.35);
      container.add(glow);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: glow, alpha: 0.12, scale: 1.08, duration: scaledDuration(1100 + (building.x % 3) * 150, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    const visualWidth = building.visualWidth ?? building.width;
    const visualHeight = building.visualHeight ?? building.height;
    const baseShadow = this.add.ellipse(0, building.shadowY ?? visualHeight * 0.39, visualWidth * 0.86, Math.max(18, visualHeight * 0.17), 0x05030a, building.open ? 0.28 : 0.19);
    container.add(baseShadow);
    const contactGlow = this.add.ellipse(0, (building.shadowY ?? visualHeight * 0.39) - 4, visualWidth * 0.72, Math.max(12, visualHeight * 0.10), building.open ? 0xffd86f : 0x8fd3ff, building.open ? 0.08 : 0.04);
    container.add(contactGlow);

    const image = this.textures.exists(building.assetKey)
      ? this.fitImageToBox(this.add.image(0, 0, building.assetKey), visualWidth, visualHeight)
      : this.drawMissingBuildingFallback(building, visualWidth, visualHeight);
    container.add(image);

    if (building.open && this.textures.exists('uiDoorLight')) {
      container.add(this.add.image(0, visualHeight * 0.19, 'uiDoorLight').setDisplaySize(visualWidth * 0.34, visualHeight * 0.24).setAlpha(recommended ? 0.48 : 0.24));
    }

    if (this.textures.exists(building.iconKey)) {
      container.add(this.add.image(building.iconX ?? -visualWidth * 0.31, building.iconY ?? -visualHeight * 0.31, building.iconKey).setDisplaySize(25, 25).setAlpha(0.95));
    }

    if (building.open && this.textures.exists('badgeOpen')) {
      container.add(this.add.image(visualWidth * 0.31, -visualHeight * 0.32, 'badgeOpen').setDisplaySize(42, 24).setAlpha(0.94));
    }
    if (recommended) {
      container.add(this.add.text(0, building.recommendLabelY ?? -visualHeight * 0.47, '추천', goldText(11)).setOrigin(0.5));
      this.drawRecommendedTrail(building);
    }

    const plateY = building.nameplateY ?? visualHeight * 0.36;
    if (this.textures.exists('uiNameplateGold')) {
      container.add(this.add.image(0, plateY + 16, 'uiNameplateGold').setDisplaySize(building.nameplateWidth ?? 108, 42).setAlpha(building.open ? 0.96 : 0.72));
    } else {
      const plate = this.add.graphics();
      plate.fillStyle(0x07142c, building.open ? 0.78 : 0.58);
      plate.fillRoundedRect(-50, plateY, 100, 36, 15);
      plate.lineStyle(1, building.open ? 0xffd86f : 0xffffff, building.open ? 0.56 : 0.22);
      plate.strokeRoundedRect(-50, plateY, 100, 36, 15);
      container.add(plate);
    }
    container.add(this.add.text(0, plateY + 10, building.title, goldText(13)).setOrigin(0.5));
    container.add(this.add.text(0, plateY + 25, building.subtitle, mutedText(9)).setOrigin(0.5));
    this.drawBuildingStatusChip(container, building, recommended);

    if (!building.open) {
      if (this.textures.exists('uiLockBadge')) container.add(this.add.image(building.lockX ?? 37, building.lockY ?? -visualHeight * 0.30, 'uiLockBadge').setDisplaySize(31, 31));
      else container.add(this.add.text(building.lockX ?? 35, building.lockY ?? -visualHeight * 0.30, '준비중', goldText(9)).setOrigin(0.5));
      container.setAlpha(0.76);
    }

    const zone = this.add.zone(building.x, building.y + (building.touchOffsetY ?? 0), building.touchWidth, building.touchHeight).setInteractive({ useHandCursor: building.open });
    zone.setDepth(building.y + 5);
    zone.on('pointerup', () => {
      this.spawnTouchRipple(building.x, building.y + 10);
      this.enterBuilding(building, container);
    });
    zone.on('pointerover', () => { if (!this.busy) this.tweens.add({ targets: container, scale: 1.035, duration: 120 }); });
    zone.on('pointerout', () => { if (!this.busy) this.tweens.add({ targets: container, scale: 1, duration: 120 }); });

    if (hasTouchDebug()) {
      this.add.rectangle(building.x, building.y + (building.touchOffsetY ?? 0), building.touchWidth, building.touchHeight, 0x00ff66, 0.12)
        .setStrokeStyle(1, 0x00ff66, 0.8)
        .setDepth(900);
    }
  }


  private drawMissingBuildingFallback(building: DioramaBuilding, width: number, height: number): Phaser.GameObjects.Container {
    const fallback = this.add.container(0, 0);
    const g = this.add.graphics();
    g.fillGradientStyle(0xfff8dd, 0xfff8dd, building.open ? 0xffd86f : 0x8b96ad, building.open ? 0xffd86f : 0x8b96ad, 1, 1, 0.95, 0.95);
    g.fillRoundedRect(-width / 2, -height / 2, width, height, 28);
    g.fillStyle(0x07142c, 0.12);
    g.fillRoundedRect(-width * 0.32, -height * 0.10, width * 0.64, height * 0.44, 18);
    g.lineStyle(3, 0xffffff, 0.72);
    g.strokeRoundedRect(-width / 2, -height / 2, width, height, 28);
    g.lineStyle(2, 0xffd86f, 0.58);
    g.strokeRoundedRect(-width / 2 + 7, -height / 2 + 7, width - 14, height - 14, 22);
    fallback.add(g);
    const icon = this.textures.exists(building.iconKey)
      ? this.add.image(0, -height * 0.08, building.iconKey).setDisplaySize(Math.min(48, width * 0.38), Math.min(48, height * 0.38))
      : this.add.text(0, -height * 0.07, '□', goldText(22)).setOrigin(0.5);
    fallback.add(icon);
    fallback.add(this.add.text(0, height * 0.30, '에셋 확인', mutedText(8)).setOrigin(0.5));
    fallback.setName(`missing:${building.assetKey}`);
    console.warn('[CardVille] lobby building texture missing', building.assetKey, building.title);
    return fallback;
  }

  private drawBuildingStatusChip(container: Phaser.GameObjects.Container, building: DioramaBuilding, recommended: boolean): void {
    const missionStatus = building.id === 'event' ? DailyMissionSystem.getLobbyStatus() : null;
    const label = missionStatus ? missionStatus.lobbyBadgeLabel : recommended ? 'NEXT' : building.open ? 'OPEN' : 'LOCK';
    const visualWidth = building.visualWidth ?? building.width;
    const visualHeight = building.visualHeight ?? building.height;
    const chipY = building.statusY ?? -visualHeight * 0.45;
    const chipW = Math.max(recommended ? 54 : 48, label.length * 8 + 14);
    const color = missionStatus ? MISSION_TONE_COLORS[missionStatus.lobbyBadgeTone] : 0xffd86f;
    const active = building.open || recommended || Boolean(missionStatus?.rewardReadyCount);
    const chip = this.add.container(building.statusX ?? visualWidth * 0.18, chipY);
    chip.add(this.add.rectangle(0, 0, chipW, 18, active ? color : 0x2d3854, active ? 0.92 : 0.82).setStrokeStyle(1, 0xffffff, 0.42));
    chip.add(this.add.text(0, 0, label, active ? { fontFamily: 'system-ui, sans-serif', fontSize: '9px', color: '#301b0c', fontStyle: '900' } : mutedText(9)).setOrigin(0.5));
    chip.setAlpha(active ? 0.96 : 0.72);
    container.add(chip);
  }

  private drawDioramaNPCs(): void {
    for (const npc of LOBBY_NPCS) {
      if (!this.textures.exists(npc.key)) continue;
      const npcImage = this.fitImageToBox(this.add.image(npc.x, npc.y, npc.key), npc.width, npc.height)
        .setDepth(npc.y + 3);
      if (allowAmbientMotion(this.quality)) {
        this.tweens.add({ targets: npcImage, y: npc.y - 2, duration: scaledDuration(900, this.quality), delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.addNpcIdleGesture(npc, npcImage);
      }

      if (npc.key === 'npcMerchant' || npc.key === 'npcWizard' || npc.key === 'npcLibrarian' || npc.key === 'npcTeacher') {
        const marker = this.textures.exists('uiQuestMarker')
          ? this.add.image(npc.x + 17, npc.y - npc.height * 0.55, 'uiQuestMarker').setDisplaySize(18, 18)
          : this.add.text(npc.x + 17, npc.y - npc.height * 0.55, '!', goldText(14)).setOrigin(0.5);
        marker.setDepth(npc.y + 5);
        if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: marker, y: marker.y - 4, alpha: 0.62, duration: scaledDuration(760, this.quality), delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }

      const zone = this.add.zone(npc.x, npc.y, npc.width + 34, npc.height + 42).setInteractive({ useHandCursor: true });
      zone.setDepth(npc.y + 8);
      zone.on('pointerup', () => {
        if (this.busy) return;
        this.spawnTouchRipple(npc.x, npc.y);
        this.showNpcDialogue(npc);
        this.playNpcGesture(npc, npcImage);
      });
      zone.on('pointerover', () => { if (!this.busy) this.tweens.add({ targets: npcImage, scale: 1.08, duration: 120 }); });
      zone.on('pointerout', () => { if (!this.busy) this.tweens.add({ targets: npcImage, scale: 1, duration: 120 }); });

      if (hasTouchDebug()) {
        this.add.rectangle(npc.x, npc.y, npc.width + 34, npc.height + 42, 0xffd86f, 0.10)
          .setStrokeStyle(1, 0xffd86f, 0.75)
          .setDepth(901);
      }
    }
  }

  private drawLobbySettingsButton(): void {
    const button = this.add.container(352, 116).setDepth(930);
    if (this.textures.exists('uiSettingsButton')) button.add(this.add.image(0, 0, 'uiSettingsButton').setDisplaySize(50, 50));
    else button.add(this.add.circle(0, 0, 24, 0xffd86f, 0.90));
    button.add(this.add.text(0, 1, '⚙', goldText(18)).setOrigin(0.5));
    button.setSize(54, 54).setInteractive({ useHandCursor: true });
    button.on('pointerup', () => {
      if (this.busy) return;
      this.spawnTouchRipple(352, 116);
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

    const panel = this.add.container(195, 430).setDepth(1200);
    if (this.textures.exists('uiPanelWood')) panel.add(this.add.image(0, 0, 'uiPanelWood').setDisplaySize(312, 328).setAlpha(0.97));
    else {
      const bg = this.add.graphics();
      bg.fillStyle(0x07142c, 0.94);
      bg.fillRoundedRect(-156, -164, 312, 328, 28);
      bg.lineStyle(2, 0xffd86f, 0.64);
      bg.strokeRoundedRect(-156, -164, 312, 328, 28);
      panel.add(bg);
    }
    panel.add(this.add.text(0, -106, '카드마을 설정', titleText(22)).setOrigin(0.5));
    panel.add(this.add.text(0, -70, '현재 로비 안전 규칙', goldText(15)).setOrigin(0.5));
    const prefs = AccessibilitySystem.getPrefs();
    const lines = [
      '카메라: 고정 · 스크롤 없음',
      '건물/오브젝트: 개별 PNG/WebP',
      `성능 모드: ${qualitySummary(this.quality)}`,
      `접근성: ${AccessibilitySystem.summary()}`,
      `배치 플랜: ${LOBBY_LAYOUT_PLAN_VERSION} · ${PREMIUM_LOBBY_FIT_TAG}`
    ];
    lines.forEach((line, index) => {
      panel.add(this.add.text(-126, -48 + index * 18, `• ${line}`, mutedText(10)).setOrigin(0, 0.5));
    });

    const addToggle = (y: number, label: string, enabled: boolean, toggle: () => void) => {
      const row = this.add.container(0, y);
      row.add(this.add.rectangle(0, 0, 252, 30, enabled ? 0xfffbf1 : 0x26334f, enabled ? 0.92 : 0.66).setStrokeStyle(1, enabled ? 0xffd86f : 0x8fd3ff, enabled ? 0.64 : 0.32));
      row.add(this.add.text(-112, 0, label, enabled ? darkText(10) : mutedText(10)).setOrigin(0, 0.5));
      row.add(this.add.text(105, 0, enabled ? 'ON' : 'OFF', enabled ? darkText(10) : mutedText(10)).setOrigin(1, 0.5));
      const hit = this.add.zone(0, 0, 268, 38).setInteractive({ useHandCursor: true });
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
    addToggle(54, '편안한 모션', prefs.reduceMotion, () => AccessibilitySystem.toggleReduceMotion());
    addToggle(86, '고대비 화면', prefs.highContrast, () => AccessibilitySystem.toggleHighContrast());
    addToggle(118, '큰 안내 문구', prefs.largeText, () => AccessibilitySystem.toggleLargeText());
    panel.add(this.add.text(0, 138, LOBBY_SAFE_RULES.slice(0, 1).join(' · '), applyWrap(mutedText(9), 250)).setOrigin(0.5));
    const close = this.add.container(0, 150);
    if (this.textures.exists('uiNameplateGold')) close.add(this.add.image(0, 0, 'uiNameplateGold').setDisplaySize(120, 46));
    else close.add(this.add.rectangle(0, 0, 118, 42, 0xffd86f, 0.92).setStrokeStyle(2, 0xffffff, 0.44));
    close.add(this.add.text(0, 0, '닫기', { fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#2a160c', fontStyle: '900' }).setOrigin(0.5));
    close.setSize(120, 46).setInteractive({ useHandCursor: true });
    close.on('pointerup', () => this.toggleLobbySettingsPanel());
    panel.add(close);
    if (this.quality.highContrast) panel.add(this.add.rectangle(0, 0, 322, 338, 0xffffff, 0.035).setStrokeStyle(1, 0xffffff, 0.22));
    panel.setScale(0.88).setAlpha(0);
    this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 180, ease: 'Back.easeOut' });
    this.activeSettingsPanel = panel;
  }

  private addNpcIdleGesture(npc: LobbyNpc, npcImage: Phaser.GameObjects.Image): void {
    if (!allowAmbientMotion(this.quality)) return;
    if (npc.animation === 'wave') {
      this.tweens.add({ targets: npcImage, angle: 4, duration: 840, delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      return;
    }
    if (npc.animation === 'sparkle') {
      this.time.addEvent({ delay: scaledDuration(1700, this.quality), startAt: npc.delay, loop: true, callback: () => this.spawnNpcSparkle(npc.x + 10, npc.y - 20, 2) });
      return;
    }
    if (npc.animation === 'cat') {
      this.tweens.add({ targets: npcImage, angle: -3, duration: 620, delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      return;
    }
    if (npc.animation === 'book') {
      this.time.addEvent({ delay: 2100, startAt: npc.delay, loop: true, callback: () => this.spawnFloatingCue('iconCvLibrary', npc.x + 12, npc.y - 24) });
    }
  }

  private showNpcDialogue(npc: LobbyNpc): void {
    this.activeSpeech?.destroy();
    this.activeSettingsPanel?.destroy();
    this.activeSettingsPanel = undefined;

    const nextIndex = (this.npcLineIndexes.get(npc.key) ?? 0) % npc.lines.length;
    this.npcLineIndexes.set(npc.key, nextIndex + 1);
    const line = npc.lines[nextIndex];
    const bubbleX = Phaser.Math.Clamp(npc.x + (npc.x < 195 ? 78 : -78), 112, 278);
    const bubbleY = Phaser.Math.Clamp(npc.y - 74, 112, 690);
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
    bubble.add(this.add.text(0, 10, line, applyWrap(bodyText(12), 188)).setOrigin(0.5));
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

  private playNpcGesture(npc: LobbyNpc, npcImage: Phaser.GameObjects.Image): void {
    this.tweens.add({ targets: npcImage, scale: 1.14, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
    if (npc.animation === 'sparkle') {
      this.spawnNpcSparkle(npc.x, npc.y - 18, 7);
      return;
    }
    if (npc.animation === 'book') {
      this.spawnFloatingCue('iconCvLibrary', npc.x + 16, npc.y - 26);
      this.spawnFloatingCue('assetWord', npc.x - 14, npc.y - 18);
      return;
    }
    if (!allowAmbientMotion(this.quality)) return;
    if (npc.animation === 'wave') {
      this.tweens.add({ targets: npcImage, angle: 11, duration: 85, yoyo: true, repeat: 3, ease: 'Sine.easeInOut' });
      this.spawnFloatingCue('assetGift', npc.x + 15, npc.y - 24);
      return;
    }
    if (npc.animation === 'teach') {
      this.spawnFloatingCue('iconCvSchool', npc.x + 13, npc.y - 24);
      return;
    }
    if (npc.animation === 'cook') {
      this.spawnFloatingCue('iconCvEvent', npc.x + 12, npc.y - 22);
      return;
    }
    if (npc.animation === 'cat') {
      this.spawnFloatingCue('catHint', npc.x + 12, npc.y - 20);
      return;
    }
    if (npc.animation === 'salute') {
      this.spawnFloatingCue('iconCvCastle', npc.x + 12, npc.y - 24);
      return;
    }
    this.spawnNpcSparkle(npc.x, npc.y - 20, 3);
  }

  private spawnFloatingCue(key: string, x: number, y: number): void {
    const cue = this.textures.exists(key)
      ? this.add.image(x, y, key).setDisplaySize(24, 24)
      : this.add.text(x, y, '✦', goldText(15)).setOrigin(0.5);
    cue.setDepth(1160).setAlpha(0.92);
    this.tweens.add({ targets: cue, y: y - 26, scale: 0.76, alpha: 0, duration: 760, ease: 'Sine.easeOut', onComplete: () => cue.destroy() });
  }

  private spawnNpcSparkle(x: number, y: number, count: number): void {
    const total = Math.min(count, this.quality.maxSparkles);
    for (let i = 0; i < total; i += 1) {
      const sparkle = this.textures.exists('particleSparkle')
        ? this.add.image(x + Phaser.Math.Between(-18, 18), y + Phaser.Math.Between(-18, 18), 'particleSparkle').setDisplaySize(14, 14)
        : this.add.text(x + Phaser.Math.Between(-18, 18), y + Phaser.Math.Between(-18, 18), '✦', goldText(12)).setOrigin(0.5);
      sparkle.setDepth(1160).setAlpha(0.85);
      this.tweens.add({ targets: sparkle, y: sparkle.y - Phaser.Math.Between(14, 30), alpha: 0, scale: 0.45, duration: 700, delay: i * 45, ease: 'Sine.easeOut', onComplete: () => sparkle.destroy() });
    }
  }

  private drawHeroParty(): void {
    this.cat = this.add.container(CAT_HOME.x, CAT_HOME.y).setDepth(CAT_HOME.y + 2);
    if (this.textures.exists('blackCatMascotPremium')) {
      this.catImage = this.fitImageToBox(this.add.image(0, 0, 'blackCatMascotPremium'), 64, 70);
      this.cat.add(this.catImage);
    } else if (this.textures.exists('catIdle')) {
      this.catImage = this.fitImageToBox(this.add.image(0, 0, 'catIdle'), 54, 57);
      this.cat.add(this.catImage);
    } else if (this.textures.exists('dioramaCat')) this.cat.add(this.fitImageToBox(this.add.image(0, 0, 'dioramaCat'), 54, 57));
    else this.cat.add(this.add.text(0, 0, '🐈‍⬛', { fontSize: '44px' }).setOrigin(0.5));

    this.hero = this.add.container(HERO_HOME.x, HERO_HOME.y).setDepth(HERO_HOME.y + 4);
    if (this.textures.exists('heroTravelerPremium')) {
      this.heroImage = this.fitImageToBox(this.add.image(0, 0, 'heroTravelerPremium'), 84, 116);
      this.hero.add(this.heroImage);
    } else if (this.textures.exists('heroIdle')) {
      this.heroImage = this.fitImageToBox(this.add.image(0, 0, 'heroIdle'), 74, 115);
      this.hero.add(this.heroImage);
    } else if (this.textures.exists('dioramaHero')) this.hero.add(this.fitImageToBox(this.add.image(0, 0, 'dioramaHero'), 74, 115));
    else this.hero.add(this.add.text(0, 0, '🧒', { fontSize: '60px' }).setOrigin(0.5));

    if (allowAmbientMotion(this.quality)) {
      this.tweens.add({ targets: this.hero, y: HERO_HOME.y - 3, duration: scaledDuration(1050, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: this.cat, y: CAT_HOME.y - 2, duration: scaledDuration(820, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: this.cat, angle: 2, duration: scaledDuration(520, this.quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private drawBottomHint(nickname: string): void {
    if (this.textures.exists('uiPanelGlass')) this.add.image(195, 782, 'uiPanelGlass').setDisplaySize(342, 76).setAlpha(0.92).setDepth(910);
    else {
      const g = this.add.graphics().setDepth(910);
      g.fillStyle(0x07142c, 0.68);
      g.fillRoundedRect(24, 746, 342, 72, 26);
      g.lineStyle(1, 0xffffff, 0.18);
      g.strokeRoundedRect(24, 746, 342, 72, 26);
    }
    if (this.textures.exists('uiSpeechBubble')) this.add.image(83, 741, 'uiSpeechBubble').setDisplaySize(130, 55).setAlpha(0.88).setDepth(909);
    this.hintText = this.add.text(
      195,
      773,
      `${nickname} 모험가님, 건물이나 NPC를 터치해 보세요.`,
      applyWrap(bodyText(13), 300)
    ).setOrigin(0.5).setDepth(912);
    const assetTotal = Object.values(ASSET_COUNTS).reduce((sum, count) => sum + count, 0);
    this.add.text(195, 803, `한 화면 디오라마 · 스크롤 없음 · 자산 ${assetTotal}개 매니페스트 관리`, mutedText(10)).setOrigin(0.5).setDepth(912);
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
      const x = Phaser.Math.Between(20, 370);
      const y = Phaser.Math.Between(260, 735);
      const dot = this.add.circle(x, y, Phaser.Math.FloatBetween(1.2, 2.4), 0xffdf7a, Phaser.Math.FloatBetween(0.20, 0.54)).setDepth(800);
      if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: dot, y: y - Phaser.Math.Between(8, 26), alpha: 0.05, duration: scaledDuration(Phaser.Math.Between(1200, 2600), this.quality), delay: i * 70, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private addMovingCloud(x: number, y: number, width: number, alpha: number, duration: number): void {
    const cloud = this.textures.exists('dioramaCloud')
      ? this.add.image(x, y, 'dioramaCloud').setDisplaySize(width, width * 0.42).setAlpha(alpha)
      : this.add.ellipse(x, y, width, width * 0.34, 0xffffff, alpha);
    cloud.setDepth(5);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: cloud, x: x + 85, duration: scaledDuration(duration, this.quality), repeat: -1, yoyo: true, ease: 'Sine.easeInOut' });
  }

  private addFloatingCard(x: number, y: number, delay: number): void {
    const card = this.textures.exists('dioramaFloatingCard')
      ? this.add.image(x, y, 'dioramaFloatingCard').setDisplaySize(26, 35)
      : this.add.rectangle(x, y, 22, 30, 0x7a4ed5, 0.8).setStrokeStyle(1, 0xffe08d, 0.8);
    card.setAlpha(0.62).setDepth(20).setAngle(Phaser.Math.Between(-10, 10));
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: card, y: y - 20, angle: card.angle + 12, alpha: 0.22, duration: scaledDuration(2500, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addButterfly(x: number, y: number, delay: number): void {
    const butterfly = this.textures.exists('dioramaButterfly')
      ? this.add.image(x, y, 'dioramaButterfly').setDisplaySize(30, 22)
      : this.add.text(x, y, '✦', goldText(16)).setOrigin(0.5);
    butterfly.setAlpha(0.78).setDepth(650);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: butterfly, x: x + Phaser.Math.Between(-24, 28), y: y - Phaser.Math.Between(16, 34), scale: 0.82, duration: scaledDuration(1500, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addBird(x: number, y: number, delay: number): void {
    if (!this.textures.exists('propBird')) return;
    const bird = this.add.image(x, y, 'propBird').setDisplaySize(28, 22).setAlpha(0.62).setDepth(50);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: bird, x: x + 80, y: y - 16, alpha: 0.18, duration: scaledDuration(4200, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addFirefly(x: number, y: number, delay: number): void {
    const firefly = this.textures.exists('propFirefly')
      ? this.add.image(x, y, 'propFirefly').setDisplaySize(14, 14)
      : this.add.circle(x, y, 4, 0xffdf7a, 0.7);
    firefly.setDepth(760).setAlpha(0.58);
    if (allowAmbientMotion(this.quality)) this.tweens.add({ targets: firefly, x: x + Phaser.Math.Between(-18, 22), y: y - Phaser.Math.Between(12, 30), alpha: 0.18, scale: 0.72, duration: scaledDuration(1800, this.quality), delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
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
    this.hintText?.setText(`${building.title}(으)로 이동 중... 톡톡톡!`);
    this.tweens.killTweensOf(this.hero);
    this.tweens.killTweensOf(this.cat);
    this.spawnFootsteps(this.hero.x, this.hero.y, building.targetX, building.targetY);
    this.startWalkAnimation();
    this.tweens.add({
      targets: this.hero,
      x: building.targetX,
      y: building.targetY,
      scale: 0.92,
      duration: 560,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.cat,
      x: building.targetX - 33,
      y: building.targetY + 18,
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
      const ripple = this.add.image(x, y, 'uiTouchRipple').setDisplaySize(54, 54).setDepth(1000).setAlpha(0.72);
      this.tweens.add({ targets: ripple, scale: 1.75, alpha: 0, duration: 360, ease: 'Cubic.easeOut', onComplete: () => ripple.destroy() });
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
    const glow = this.textures.exists('uiDoorLight')
      ? this.add.image(building.x, building.y + 18, 'uiDoorLight').setDisplaySize(92, 118).setDepth(900).setAlpha(0.62)
      : this.add.circle(building.x, building.y + 22, 46, 0xffe28c, 0.28).setDepth(900);
    this.tweens.add({ targets: glow, scale: 2.1, alpha: 0, duration: 420, ease: 'Cubic.easeOut', onComplete: () => glow.destroy() });
    this.cameras.main.flash(220, 255, 232, 166, false);
    this.time.delayedCall(360, () => this.goToRoute(route));
    this.tweens.add({ targets: buildingContainer, alpha: 0.82, duration: 100, yoyo: true, repeat: 1 });
  }

  private goToRoute(route: DioramaRoute): void {
    if (route.scene === 'MathLabScene') {
      this.scene.start('StageSelectScene', { modeId: 'math', title: '연산 연구소', recommendedStage: SaveSystem.nextPlayableModeStage('math', MATH_STAGES.length) });
      return;
    }
    if (route.scene === 'MemoryForestScene') {
      this.scene.start('StageSelectScene', { modeId: 'memory', title: '기억의 숲', recommendedStage: SaveSystem.nextPlayableModeStage('memory', MEMORY_STAGES.length) });
      return;
    }
    this.scene.start(route.scene, 'data' in route ? route.data : undefined);
  }

  private showLockedMessage(title: string): void {
    this.hintText?.setText(`${title}은(는) 다음 업데이트에서 열릴 예정이에요.`);
    const toastBg = this.textures.exists('uiToast') ? this.add.image(195, 716, 'uiToast').setDisplaySize(166, 56).setDepth(999).setAlpha(0.90) : undefined;
    const toast = this.add.text(195, 716, '준비중', goldText(18)).setOrigin(0.5).setDepth(1000);
    this.tweens.add({ targets: [toast, toastBg].filter(Boolean), y: 692, alpha: 0, duration: 900, ease: 'Sine.easeOut', onComplete: () => { toast.destroy(); toastBg?.destroy(); } });
  }
}
