import Phaser from 'phaser';
import { applyResponsiveCamera, hasTouchDebug, layout } from '../systems/LayoutSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { ASSET_COUNTS } from '../data/assetManifest';
import { DIORAMA_BUILDINGS, DioramaBuilding, DioramaRoute } from '../data/dioramaBuildings';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

const LOBBY_VERSION = '1.0.25';
const HERO_HOME = { x: 195, y: 545 } as const;
const CAT_HOME = { x: 145, y: 585 } as const;

type LobbyProp = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth?: number;
  alpha?: number;
  bob?: number;
};

type LobbyNpc = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  delay: number;
};

const LOBBY_PROPS: LobbyProp[] = [
  { key: 'propPlazaTile96', x: 195, y: 365, width: 74, height: 50, alpha: 0.42, depth: 330 },
  { key: 'propFountain', x: 195, y: 365, width: 74, height: 64, depth: 365, bob: 2 },
  { key: 'propTreeOak', x: 34, y: 215, width: 56, height: 68, depth: 220, bob: 2 },
  { key: 'propTreeOak', x: 354, y: 212, width: 60, height: 72, depth: 220, bob: 2 },
  { key: 'propFlagRed', x: 133, y: 158, width: 42, height: 70, depth: 172, bob: 2 },
  { key: 'propFlagRed', x: 255, y: 158, width: 42, height: 70, depth: 172, bob: 2 },
  { key: 'propBench', x: 48, y: 552, width: 70, height: 40, depth: 552 },
  { key: 'propBench', x: 337, y: 552, width: 70, height: 40, depth: 552 },
  { key: 'propSignpost', x: 255, y: 594, width: 48, height: 46, depth: 594 },
  { key: 'propFlowerPot', x: 27, y: 480, width: 38, height: 38, depth: 483, bob: 1 },
  { key: 'propFlowerPot', x: 359, y: 480, width: 38, height: 38, depth: 483, bob: 1 },
  { key: 'propLantern', x: 23, y: 627, width: 40, height: 68, depth: 628 },
  { key: 'propLantern', x: 365, y: 627, width: 40, height: 68, depth: 628 },
  { key: 'propSmokePuff', x: 111, y: 242, width: 42, height: 30, depth: 260, alpha: 0.46, bob: 8 },
  { key: 'propSmokePuff', x: 332, y: 428, width: 42, height: 30, depth: 440, alpha: 0.40, bob: 8 },
  { key: 'propCardTrail', x: 299, y: 175, width: 54, height: 44, depth: 185, alpha: 0.82, bob: 10 }
];

const LOBBY_NPCS: LobbyNpc[] = [
  { key: 'npcGuard', x: 238, y: 196, width: 30, height: 39, label: '경비병', delay: 0 },
  { key: 'npcLibrarian', x: 123, y: 341, width: 31, height: 40, label: '사서', delay: 100 },
  { key: 'npcWizard', x: 269, y: 342, width: 31, height: 40, label: '마법사', delay: 200 },
  { key: 'npcMerchant', x: 125, y: 518, width: 32, height: 41, label: '상인', delay: 300 },
  { key: 'npcTeacher', x: 267, y: 517, width: 32, height: 41, label: '선생님', delay: 400 },
  { key: 'npcTownCat', x: 50, y: 707, width: 34, height: 36, label: '마을고양이', delay: 500 },
  { key: 'npcCook', x: 252, y: 724, width: 31, height: 40, label: '요리사', delay: 600 },
  { key: 'npcChild01', x: 218, y: 396, width: 28, height: 36, label: '아이', delay: 700 }
];

export class MainLobbyScene extends Phaser.Scene {
  private hero?: Phaser.GameObjects.Container;
  private cat?: Phaser.GameObjects.Container;
  private heroImage?: Phaser.GameObjects.Image;
  private catImage?: Phaser.GameObjects.Image;
  private walkTimer?: Phaser.Time.TimerEvent;
  private busy = false;
  private hintText?: Phaser.GameObjects.Text;

  constructor() { super('MainLobbyScene'); }

  create(): void {
    applyResponsiveCamera(this);
    const profile = SaveSystem.loadProfile();
    const progress = SaveSystem.loadProgress();
    const cleared = Object.values(progress).filter((record) => record.cleared).length;
    const cards = Object.values(SaveSystem.loadCollection()).reduce((sum, count) => sum + count, 0);

    this.drawDioramaBackground();
    this.drawAmbientLife();
    this.drawDioramaProps();
    this.drawTopBrandHud(profile.coins, profile.level, cleared, cards);
    this.drawBuildings();
    this.drawDioramaNPCs();
    this.drawHeroParty();
    this.drawBottomHint(profile.nickname);
    this.add.text(344, 28, LOBBY_VERSION, mutedText(11)).setOrigin(0.5).setAlpha(0.9);
  }

  private drawDioramaBackground(): void {
    const l = layout(this);
    if (this.textures.exists('dioramaBg')) {
      this.add.image(195, 422, 'dioramaBg').setDisplaySize(390, 844);
    } else {
      DrawSystem.background(this, '카드마을 광장');
    }
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, l.visibleY + l.visibleHeight / 2, l.visibleWidth, l.visibleHeight, 0x061126, 0.08);
    this.add.rectangle(l.visibleX + l.visibleWidth / 2, 798, l.visibleWidth, 96 + l.extraY, 0x020814, 0.18);
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
    this.add.text(39, 73, `Lv.${level} · 🪙 ${coins} · 카드 ${cards}장 · ${cleared}/${WORD_STAGES.length}`, mutedText(11)).setOrigin(0, 0.5).setDepth(912);

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

  private drawDioramaProps(): void {
    for (const prop of LOBBY_PROPS) {
      if (!this.textures.exists(prop.key)) continue;
      const image = this.add.image(prop.x, prop.y, prop.key)
        .setDisplaySize(prop.width, prop.height)
        .setAlpha(prop.alpha ?? 1)
        .setDepth(prop.depth ?? prop.y);
      if (prop.bob) {
        this.tweens.add({ targets: image, y: prop.y - prop.bob, duration: 1200 + Math.floor(prop.x) * 3, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }
  }

  private drawBuildings(): void {
    for (const building of DIORAMA_BUILDINGS) {
      this.drawBuilding(building);
    }
  }

  private drawBuilding(building: DioramaBuilding): void {
    const container = this.add.container(building.x, building.y).setDepth(building.y);
    if (building.open && this.textures.exists('uiBuildingGlow')) {
      const glow = this.add.image(0, 8, 'uiBuildingGlow').setDisplaySize(building.width * 1.55, building.height * 1.55).setAlpha(0.35);
      container.add(glow);
      this.tweens.add({ targets: glow, alpha: 0.12, scale: 1.08, duration: 1100 + (building.x % 3) * 150, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    const image = this.textures.exists(building.assetKey)
      ? this.add.image(0, 0, building.assetKey).setDisplaySize(building.width, building.height)
      : this.add.rectangle(0, 0, building.width, building.height, building.open ? 0xffd86f : 0x66708a, 0.86).setStrokeStyle(3, 0xffffff, 0.7);
    container.add(image);

    if (this.textures.exists(building.iconKey)) {
      container.add(this.add.image(-building.width * 0.32, -building.height * 0.34, building.iconKey).setDisplaySize(26, 26).setAlpha(0.95));
    }

    if (this.textures.exists('uiNameplateGold')) {
      container.add(this.add.image(0, building.height * 0.33 + 16, 'uiNameplateGold').setDisplaySize(104, 42).setAlpha(building.open ? 0.96 : 0.72));
    } else {
      const plate = this.add.graphics();
      plate.fillStyle(0x07142c, building.open ? 0.78 : 0.58);
      plate.fillRoundedRect(-48, building.height * 0.33, 96, 36, 15);
      plate.lineStyle(1, building.open ? 0xffd86f : 0xffffff, building.open ? 0.56 : 0.22);
      plate.strokeRoundedRect(-48, building.height * 0.33, 96, 36, 15);
      container.add(plate);
    }
    container.add(this.add.text(0, building.height * 0.33 + 10, building.title, goldText(13)).setOrigin(0.5));
    container.add(this.add.text(0, building.height * 0.33 + 25, building.subtitle, mutedText(9)).setOrigin(0.5));

    if (!building.open) {
      if (this.textures.exists('uiLockBadge')) container.add(this.add.image(37, -building.height * 0.30, 'uiLockBadge').setDisplaySize(31, 31));
      else container.add(this.add.text(35, -building.height * 0.30, '준비중', goldText(9)).setOrigin(0.5));
      container.setAlpha(0.76);
    }

    const zone = this.add.zone(building.x, building.y + 10, building.width + 12, building.height + 42).setInteractive({ useHandCursor: building.open });
    zone.setDepth(building.y + 5);
    zone.on('pointerup', () => {
      this.spawnTouchRipple(building.x, building.y + 10);
      this.enterBuilding(building, container);
    });
    zone.on('pointerover', () => { if (!this.busy) this.tweens.add({ targets: container, scale: 1.035, duration: 120 }); });
    zone.on('pointerout', () => { if (!this.busy) this.tweens.add({ targets: container, scale: 1, duration: 120 }); });

    if (hasTouchDebug()) {
      this.add.rectangle(building.x, building.y + 10, building.width + 12, building.height + 42, 0x00ff66, 0.12)
        .setStrokeStyle(1, 0x00ff66, 0.8)
        .setDepth(900);
    }
  }

  private drawDioramaNPCs(): void {
    for (const npc of LOBBY_NPCS) {
      if (!this.textures.exists(npc.key)) continue;
      const npcImage = this.add.image(npc.x, npc.y, npc.key)
        .setDisplaySize(npc.width, npc.height)
        .setDepth(npc.y + 3);
      this.tweens.add({ targets: npcImage, y: npc.y - 2, duration: 900, delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      if (npc.key === 'npcMerchant' || npc.key === 'npcWizard' || npc.key === 'npcLibrarian') {
        const marker = this.textures.exists('uiQuestMarker')
          ? this.add.image(npc.x + 17, npc.y - npc.height * 0.55, 'uiQuestMarker').setDisplaySize(18, 18)
          : this.add.text(npc.x + 17, npc.y - npc.height * 0.55, '!', goldText(14)).setOrigin(0.5);
        marker.setDepth(npc.y + 5);
        this.tweens.add({ targets: marker, y: marker.y - 4, alpha: 0.62, duration: 760, delay: npc.delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }
  }

  private drawHeroParty(): void {
    this.cat = this.add.container(CAT_HOME.x, CAT_HOME.y).setDepth(CAT_HOME.y + 2);
    if (this.textures.exists('catIdle')) {
      this.catImage = this.add.image(0, 0, 'catIdle').setDisplaySize(54, 57);
      this.cat.add(this.catImage);
    } else if (this.textures.exists('dioramaCat')) this.cat.add(this.add.image(0, 0, 'dioramaCat').setDisplaySize(54, 57));
    else this.cat.add(this.add.text(0, 0, '🐈‍⬛', { fontSize: '44px' }).setOrigin(0.5));

    this.hero = this.add.container(HERO_HOME.x, HERO_HOME.y).setDepth(HERO_HOME.y + 4);
    if (this.textures.exists('heroIdle')) {
      this.heroImage = this.add.image(0, 0, 'heroIdle').setDisplaySize(74, 115);
      this.hero.add(this.heroImage);
    } else if (this.textures.exists('dioramaHero')) this.hero.add(this.add.image(0, 0, 'dioramaHero').setDisplaySize(74, 115));
    else this.hero.add(this.add.text(0, 0, '🧒', { fontSize: '60px' }).setOrigin(0.5));

    this.tweens.add({ targets: this.hero, y: HERO_HOME.y - 3, duration: 1050, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.cat, y: CAT_HOME.y - 2, duration: 820, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.cat, angle: 2, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
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
      `${nickname} 모험가님, 건물을 터치하면 소년과 고양이가 달려가요.`,
      applyWrap(bodyText(13), 300)
    ).setOrigin(0.5).setDepth(912);
    const assetTotal = Object.values(ASSET_COUNTS).reduce((sum, count) => sum + count, 0);
    this.add.text(195, 803, `한 화면 디오라마 · 스크롤 없음 · 자산 ${assetTotal}개 매니페스트 관리`, mutedText(10)).setOrigin(0.5).setDepth(912);
  }

  private drawAmbientLife(): void {
    this.addMovingCloud(75, 128, 116, 0.26, 31000);
    this.addMovingCloud(300, 204, 142, 0.20, 39000);
    for (let i = 0; i < 5; i += 1) this.addFloatingCard(54 + i * 70, 160 + (i % 2) * 88, i * 230);
    for (let i = 0; i < 4; i += 1) this.addButterfly(58 + i * 86, 386 + (i % 3) * 98, i * 480);
    for (let i = 0; i < 3; i += 1) this.addBird(70 + i * 108, 112 + i * 50, i * 760);
    for (let i = 0; i < 9; i += 1) this.addFirefly(34 + i * 39, 602 + (i % 3) * 46, i * 140);
    for (let i = 0; i < 24; i += 1) {
      const x = Phaser.Math.Between(20, 370);
      const y = Phaser.Math.Between(260, 735);
      const dot = this.add.circle(x, y, Phaser.Math.FloatBetween(1.2, 2.4), 0xffdf7a, Phaser.Math.FloatBetween(0.20, 0.54)).setDepth(800);
      this.tweens.add({ targets: dot, y: y - Phaser.Math.Between(8, 26), alpha: 0.05, duration: Phaser.Math.Between(1200, 2600), delay: i * 70, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private addMovingCloud(x: number, y: number, width: number, alpha: number, duration: number): void {
    const cloud = this.textures.exists('dioramaCloud')
      ? this.add.image(x, y, 'dioramaCloud').setDisplaySize(width, width * 0.42).setAlpha(alpha)
      : this.add.ellipse(x, y, width, width * 0.34, 0xffffff, alpha);
    cloud.setDepth(5);
    this.tweens.add({ targets: cloud, x: x + 85, duration, repeat: -1, yoyo: true, ease: 'Sine.easeInOut' });
  }

  private addFloatingCard(x: number, y: number, delay: number): void {
    const card = this.textures.exists('dioramaFloatingCard')
      ? this.add.image(x, y, 'dioramaFloatingCard').setDisplaySize(26, 35)
      : this.add.rectangle(x, y, 22, 30, 0x7a4ed5, 0.8).setStrokeStyle(1, 0xffe08d, 0.8);
    card.setAlpha(0.62).setDepth(20).setAngle(Phaser.Math.Between(-10, 10));
    this.tweens.add({ targets: card, y: y - 20, angle: card.angle + 12, alpha: 0.22, duration: 2500, delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addButterfly(x: number, y: number, delay: number): void {
    const butterfly = this.textures.exists('dioramaButterfly')
      ? this.add.image(x, y, 'dioramaButterfly').setDisplaySize(30, 22)
      : this.add.text(x, y, '✦', goldText(16)).setOrigin(0.5);
    butterfly.setAlpha(0.78).setDepth(650);
    this.tweens.add({ targets: butterfly, x: x + Phaser.Math.Between(-24, 28), y: y - Phaser.Math.Between(16, 34), scale: 0.82, duration: 1500, delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addBird(x: number, y: number, delay: number): void {
    if (!this.textures.exists('propBird')) return;
    const bird = this.add.image(x, y, 'propBird').setDisplaySize(28, 22).setAlpha(0.62).setDepth(50);
    this.tweens.add({ targets: bird, x: x + 80, y: y - 16, alpha: 0.18, duration: 4200, delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private addFirefly(x: number, y: number, delay: number): void {
    const firefly = this.textures.exists('propFirefly')
      ? this.add.image(x, y, 'propFirefly').setDisplaySize(14, 14)
      : this.add.circle(x, y, 4, 0xffdf7a, 0.7);
    firefly.setDepth(760).setAlpha(0.58);
    this.tweens.add({ targets: firefly, x: x + Phaser.Math.Between(-18, 22), y: y - Phaser.Math.Between(12, 30), alpha: 0.18, scale: 0.72, duration: 1800, delay, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
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
    this.addStepBounce(this.hero, 6, 4);
    this.addStepBounce(this.cat, 5, 3);
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
    for (let i = 1; i <= 5; i += 1) {
      const t = i / 6;
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
    this.scene.start(route.scene, 'data' in route ? route.data : undefined);
  }

  private showLockedMessage(title: string): void {
    this.hintText?.setText(`${title}은(는) 다음 업데이트에서 열릴 예정이에요.`);
    if (this.textures.exists('uiToast')) this.add.image(195, 716, 'uiToast').setDisplaySize(166, 56).setDepth(999).setAlpha(0.90);
    const toast = this.add.text(195, 716, '준비중', goldText(18)).setOrigin(0.5).setDepth(1000);
    this.tweens.add({ targets: toast, y: 692, alpha: 0, duration: 900, ease: 'Sine.easeOut', onComplete: () => toast.destroy() });
  }
}
