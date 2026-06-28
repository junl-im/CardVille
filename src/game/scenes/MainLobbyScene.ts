import Phaser from 'phaser';
import { applyResponsiveCamera, hasTouchDebug, layout } from '../systems/LayoutSystem';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { WORD_STAGES } from '../data/wordStages';
import { DIORAMA_BUILDINGS, DioramaBuilding, DioramaRoute } from '../data/dioramaBuildings';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

const HERO_HOME = { x: 195, y: 545 } as const;
const CAT_HOME = { x: 145, y: 585 } as const;

export class MainLobbyScene extends Phaser.Scene {
  private hero?: Phaser.GameObjects.Container;
  private cat?: Phaser.GameObjects.Container;
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
    this.drawTopBrandHud(profile.coins, profile.level, cleared, cards);
    this.drawBuildings();
    this.drawHeroParty();
    this.drawBottomHint(profile.nickname);
    this.add.text(344, 28, '1.0.24', mutedText(11)).setOrigin(0.5).setAlpha(0.9);
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
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.70);
    g.fillRoundedRect(18, 18, 250, 70, 25);
    g.lineStyle(1, 0xffffff, 0.20);
    g.strokeRoundedRect(18, 18, 250, 70, 25);
    g.fillStyle(0xffffff, 0.08);
    g.fillRoundedRect(36, 29, 213, 12, 7);
    this.add.text(38, 49, '카드마을 CardVille', titleText(20)).setOrigin(0, 0.5);
    this.add.text(39, 73, `Lv.${level} · 🪙 ${coins} · 카드 ${cards}장 · ${cleared}/${WORD_STAGES.length}`, mutedText(11)).setOrigin(0, 0.5);

    const album = this.add.container(319, 54);
    const bg = this.add.graphics();
    bg.fillStyle(0xffd86f, 0.90);
    bg.fillRoundedRect(-42, -27, 84, 54, 20);
    bg.lineStyle(2, 0xffffff, 0.54);
    bg.strokeRoundedRect(-42, -27, 84, 54, 20);
    album.add(bg);
    if (this.textures.exists('assetAlbum')) album.add(this.add.image(-20, 0, 'assetAlbum').setDisplaySize(28, 28));
    album.add(this.add.text(10, 1, '앨범', { fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#2a160c', fontStyle: '900' }).setOrigin(0.5));
    album.setSize(90, 58).setInteractive({ useHandCursor: true });
    album.on('pointerup', () => this.scene.start('CollectionScene'));
  }

  private drawBuildings(): void {
    for (const building of DIORAMA_BUILDINGS) {
      this.drawBuilding(building);
    }
  }

  private drawBuilding(building: DioramaBuilding): void {
    const container = this.add.container(building.x, building.y).setDepth(building.y);
    const image = this.textures.exists(building.assetKey)
      ? this.add.image(0, 0, building.assetKey).setDisplaySize(building.width, building.height)
      : this.add.rectangle(0, 0, building.width, building.height, building.open ? 0xffd86f : 0x66708a, 0.86).setStrokeStyle(3, 0xffffff, 0.7);
    container.add(image);

    const plate = this.add.graphics();
    plate.fillStyle(0x07142c, building.open ? 0.78 : 0.58);
    plate.fillRoundedRect(-48, building.height * 0.33, 96, 36, 15);
    plate.lineStyle(1, building.open ? 0xffd86f : 0xffffff, building.open ? 0.56 : 0.22);
    plate.strokeRoundedRect(-48, building.height * 0.33, 96, 36, 15);
    container.add(plate);
    container.add(this.add.text(0, building.height * 0.33 + 10, building.title, goldText(13)).setOrigin(0.5));
    container.add(this.add.text(0, building.height * 0.33 + 25, building.subtitle, mutedText(9)).setOrigin(0.5));

    if (!building.open) {
      const lock = this.add.text(35, -building.height * 0.30, '준비중', goldText(9)).setOrigin(0.5);
      container.add(lock);
      container.setAlpha(0.76);
    }

    if (building.open) {
      const glow = this.add.circle(0, 5, Math.max(building.width, building.height) * 0.44, 0xffd86f, 0.08);
      glow.setDepth(-1);
      container.addAt(glow, 0);
      this.tweens.add({ targets: glow, alpha: 0.02, scale: 1.08, duration: 1100 + (building.x % 3) * 150, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    const zone = this.add.zone(building.x, building.y + 10, building.width + 12, building.height + 42).setInteractive({ useHandCursor: building.open });
    zone.setDepth(building.y + 5);
    zone.on('pointerup', () => this.enterBuilding(building, container));
    zone.on('pointerover', () => { if (!this.busy) this.tweens.add({ targets: container, scale: 1.035, duration: 120 }); });
    zone.on('pointerout', () => { if (!this.busy) this.tweens.add({ targets: container, scale: 1, duration: 120 }); });

    if (hasTouchDebug()) {
      this.add.rectangle(building.x, building.y + 10, building.width + 12, building.height + 42, 0x00ff66, 0.12)
        .setStrokeStyle(1, 0x00ff66, 0.8)
        .setDepth(900);
    }
  }

  private drawHeroParty(): void {
    this.cat = this.add.container(CAT_HOME.x, CAT_HOME.y).setDepth(CAT_HOME.y + 2);
    if (this.textures.exists('dioramaCat')) this.cat.add(this.add.image(0, 0, 'dioramaCat').setDisplaySize(54, 57));
    else this.cat.add(this.add.text(0, 0, '🐈‍⬛', { fontSize: '44px' }).setOrigin(0.5));

    this.hero = this.add.container(HERO_HOME.x, HERO_HOME.y).setDepth(HERO_HOME.y + 4);
    if (this.textures.exists('dioramaHero')) this.hero.add(this.add.image(0, 0, 'dioramaHero').setDisplaySize(74, 115));
    else this.hero.add(this.add.text(0, 0, '🧒', { fontSize: '60px' }).setOrigin(0.5));

    this.tweens.add({ targets: this.hero, y: HERO_HOME.y - 3, duration: 1050, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.cat, y: CAT_HOME.y - 2, duration: 820, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.cat, angle: 2, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private drawBottomHint(nickname: string): void {
    const g = this.add.graphics();
    g.fillStyle(0x07142c, 0.68);
    g.fillRoundedRect(24, 746, 342, 72, 26);
    g.lineStyle(1, 0xffffff, 0.18);
    g.strokeRoundedRect(24, 746, 342, 72, 26);
    this.hintText = this.add.text(
      195,
      773,
      `${nickname} 모험가님, 건물을 터치하면 소년과 고양이가 달려가요.`,
      applyWrap(bodyText(13), 300)
    ).setOrigin(0.5);
    this.add.text(195, 803, '한 화면 디오라마 · 스크롤 없음 · 5개 핵심 건물 우선', mutedText(10)).setOrigin(0.5);
  }

  private drawAmbientLife(): void {
    this.addMovingCloud(75, 128, 116, 0.26, 31000);
    this.addMovingCloud(300, 204, 142, 0.20, 39000);
    for (let i = 0; i < 5; i += 1) this.addFloatingCard(54 + i * 70, 160 + (i % 2) * 88, i * 230);
    for (let i = 0; i < 4; i += 1) this.addButterfly(58 + i * 86, 386 + (i % 3) * 98, i * 480);
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
    this.spawnFootsteps(HERO_HOME.x, HERO_HOME.y, building.targetX, building.targetY);
    this.tweens.add({ targets: buildingContainer, scale: 1.06, duration: 190, yoyo: true, ease: 'Back.easeOut' });
    this.tweens.add({ targets: this.hero, x: building.targetX, y: building.targetY, scale: 0.86, duration: 560, ease: 'Sine.easeInOut' });
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

  private addStepBounce(target: Phaser.GameObjects.Container, count: number, amount: number): void {
    for (let i = 0; i < count; i += 1) {
      this.time.delayedCall(i * 95, () => {
        this.tweens.add({ targets: target, y: target.y - amount, duration: 50, yoyo: true, ease: 'Quad.easeOut' });
      });
    }
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
    const glow = this.add.circle(building.x, building.y + 22, 46, 0xffe28c, 0.28).setDepth(900);
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
    const toast = this.add.text(195, 716, '준비중', goldText(18)).setOrigin(0.5).setDepth(1000);
    this.tweens.add({ targets: toast, y: 692, alpha: 0, duration: 900, ease: 'Sine.easeOut', onComplete: () => toast.destroy() });
  }
}
