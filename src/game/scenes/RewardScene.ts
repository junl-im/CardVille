import Phaser from 'phaser';
import { PlayResultData } from '../types/ModeTypes';
import { GameButton } from '../ui/GameButton';
import { GlassPanel } from '../ui/GlassPanel';
import { SceneBackSystem } from '../systems/SceneBackSystem';
import { CollectionSystem } from '../systems/CollectionSystem';
import { UserDataSystem } from '../systems/UserDataSystem';
import { PackOpenResult } from '../types/CollectionTypes';
import { VisualSystem } from '../systems/VisualSystem';

export class RewardScene extends Phaser.Scene {
  private dataRef!: PlayResultData;
  private packOpened = false;
  private hasPack = false;
  private rewardStatusText?: Phaser.GameObjects.Text;

  constructor() {
    super('RewardScene');
  }

  create(data: PlayResultData): void {
    this.dataRef = data;
    this.hasPack = Math.random() < data.rewards.packChance;

    this.drawBackground();
    this.createRewardPanel();
    this.applyBaseReward();

    SceneBackSystem.bind(this, () => this.scene.start('MainLobbyScene'));
  }

  private createRewardPanel(): void {
    new GlassPanel(this, 195, 408, 334, 520, 34, 0.16);

    this.add.text(195, 172, '보상 획득', {
      fontSize: '36px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#8fd3ff', blur: 14, fill: true }
    }).setOrigin(0.5);

    this.add.text(195, 232, `⭐ 경험치 +${this.dataRef.rewards.xp}`, {
      fontSize: '24px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(195, 274, `🪙 코인 +${this.dataRef.rewards.coins}`, {
      fontSize: '24px',
      fontStyle: '900',
      color: '#fff0b8'
    }).setOrigin(0.5);

    this.rewardStatusText = this.add.text(195, 322, '성장 데이터 저장 중...', {
      fontSize: '15px',
      fontStyle: '800',
      color: '#d9e8ff',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);

    this.createPackPreview();

    const next = new GameButton(this, 195, 644, '스테이지 선택', 250, 58, 0xffd86f);
    next.on('pointerup', () => this.scene.start('StageSelectScene', { modeId: this.dataRef.modeId }));

    const album = new GameButton(this, 195, 716, '앨범 보기', 250, 58, 0x8fd3ff);
    album.on('pointerup', () => this.scene.start('CollectionScene'));
  }

  private createPackPreview(): void {
    const y = 410;
    const pack = this.add.container(195, y);
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.24);
    shadow.fillEllipse(0, 80, 180, 36);

    const body = this.add.graphics();
    body.fillStyle(this.hasPack ? 0x8fd3ff : 0x8291a8, this.hasPack ? 0.96 : 0.5);
    body.fillRoundedRect(-72, -86, 144, 172, 24);
    body.fillStyle(0xffffff, this.hasPack ? 0.22 : 0.08);
    body.fillRoundedRect(-58, -70, 116, 44, 18);
    body.lineStyle(3, this.hasPack ? 0xffffff : 0xb9c4d6, this.hasPack ? 0.58 : 0.22);
    body.strokeRoundedRect(-72, -86, 144, 172, 24);
    body.lineStyle(2, 0xffd86f, this.hasPack ? 0.8 : 0.25);
    body.strokeRoundedRect(-54, -62, 108, 124, 18);

    const symbol = this.add.text(0, -10, this.hasPack ? '✦' : '?', {
      fontSize: '58px',
      fontStyle: '900',
      color: this.hasPack ? '#fff7bd' : '#d6dbea'
    }).setOrigin(0.5);

    const label = this.add.text(0, 54, this.hasPack ? '카드팩 발견!' : '카드팩은 다음 기회에', {
      fontSize: '17px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5);

    pack.add([shadow, body, symbol, label]);

    if (this.hasPack) {
      pack.setSize(160, 200);
      pack.setInteractive(new Phaser.Geom.Rectangle(-80, -100, 160, 200), Phaser.Geom.Rectangle.Contains);
      pack.on('pointerup', () => this.openPack(pack));
      this.tweens.add({ targets: pack, y: y - 8, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.spawnPackSparkles(195, y);

      this.add.text(195, 552, '카드팩을 터치해서 열어보세요', {
        fontSize: '16px',
        fontStyle: '800',
        color: '#dff7ff'
      }).setOrigin(0.5);
    } else {
      this.add.text(195, 552, '스테이지를 계속 클리어하면 카드팩을 얻을 수 있어요.', {
        fontSize: '15px',
        color: '#d9e8ff'
      }).setOrigin(0.5);
    }
  }

  private async openPack(packContainer: Phaser.GameObjects.Container): Promise<void> {
    if (this.packOpened) return;
    this.packOpened = true;
    packContainer.disableInteractive();

    this.tweens.add({ targets: packContainer, scale: 1.12, duration: 120, yoyo: true, ease: 'Back.easeOut' });
    this.cameras.main.flash(260, 255, 240, 180);
    this.cameras.main.shake(180, 0.004);
    this.spawnBurst(195, 410);

    try {
      const result = await CollectionSystem.openPack(this.dataRef.rewards.packId ?? 'starter_pack');
      this.time.delayedCall(360, () => this.showOpenedCards(result));
    } catch (error) {
      console.warn('[CardVille] Pack open failed.', error);
      this.showToast('카드팩을 열지 못했어요. 다시 시도해주세요.');
      this.packOpened = false;
      packContainer.setInteractive(new Phaser.Geom.Rectangle(-80, -100, 160, 200), Phaser.Geom.Rectangle.Contains);
    }
  }

  private showOpenedCards(result: PackOpenResult): void {
    this.children.removeAll();
    this.drawBackground();
    new GlassPanel(this, 195, 418, 342, 574, 34, 0.17);

    this.add.text(195, 142, '새 카드 획득!', {
      fontSize: '34px',
      fontStyle: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#ffd86f', blur: 16, fill: true }
    }).setOrigin(0.5);

    this.add.text(195, 182, result.pack.title, {
      fontSize: '16px',
      fontStyle: '800',
      color: '#dff7ff'
    }).setOrigin(0.5);

    result.cards.forEach((card, index) => this.createRewardCard(card, index));

    const album = new GameButton(this, 195, 662, '앨범에 등록하기', 260, 58, 0xffd86f);
    album.on('pointerup', () => this.scene.start('CollectionScene'));

    const lobby = new GameButton(this, 195, 734, '메인 로비', 260, 58, 0x8fd3ff);
    lobby.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }

  private createRewardCard(card: PackOpenResult['cards'][number], index: number): void {
    const x = 92 + index * 103;
    const y = 392;
    const color = CollectionSystem.getRarityColor(card.rarity);
    const rarityLabel = CollectionSystem.getRarityLabel(card.rarity);
    const cardBox = this.add.container(x, y);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.25);
    shadow.fillRoundedRect(-42, -61 + 8, 84, 132, 18);

    const frame = this.add.graphics();
    frame.fillStyle(0xffffff, 0.88);
    frame.fillRoundedRect(-42, -61, 84, 132, 18);
    frame.lineStyle(4, color, 0.96);
    frame.strokeRoundedRect(-42, -61, 84, 132, 18);
    frame.fillStyle(color, 0.16);
    frame.fillRoundedRect(-32, -50, 64, 62, 15);
    frame.fillStyle(0xffffff, 0.4);
    frame.fillRoundedRect(-30, -48, 60, 13, 8);

    const textureKey = VisualSystem.imageTextureKey(card.imageKey);
    const emoji = textureKey && this.textures.exists(textureKey)
      ? this.add.image(0, -19, textureKey).setDisplaySize(48, 48).setOrigin(0.5)
      : this.add.text(0, -19, this.getFallbackEmoji(card.cardId), {
        fontSize: '34px'
      }).setOrigin(0.5);

    const name = this.add.text(0, 31, card.name, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#17243c'
    }).setOrigin(0.5);

    const rarity = this.add.text(0, 52, rarityLabel, {
      fontSize: '11px',
      fontStyle: '900',
      color: '#17243c'
    }).setOrigin(0.5);

    cardBox.add([shadow, frame, emoji, name, rarity]);
    cardBox.setAlpha(0).setScale(0.6).setY(y + 36);

    this.tweens.add({
      targets: cardBox,
      alpha: 1,
      scale: 1,
      y,
      delay: 170 * index,
      duration: 380,
      ease: 'Back.easeOut',
      onStart: () => this.spawnMiniStars(x, y - 25, color)
    });
  }

  private async applyBaseReward(): Promise<void> {
    try {
      const result = await UserDataSystem.applyReward(this.dataRef.rewards.xp, this.dataRef.rewards.coins);
      const savedLabel = result.source === 'firestore' ? 'Firestore 저장 완료' : '오프라인 임시 저장';
      const levelLabel = result.levelUp
        ? `레벨 업! Lv.${result.before.level} → Lv.${result.after.level}`
        : `현재 Lv.${result.after.level}`;

      this.rewardStatusText?.setText(`${savedLabel} · ${levelLabel}`);

      if (result.levelUp) {
        this.cameras.main.flash(280, 255, 216, 111);
        VisualSystem.spawnBurst(this, 195, 322, '#ffd86f', 28);
        this.showLevelUpToast(result.after.level);
      }
    } catch (error) {
      console.warn('[CardVille] Reward apply failed.', error);
      this.rewardStatusText?.setText('보상 저장 실패 · 로그인 상태를 확인해 주세요.');
    }
  }

  private showLevelUpToast(level: number): void {
    const toast = this.add.text(195, 104, `LEVEL UP · ${level}`, {
      fontSize: '22px',
      fontStyle: '900',
      color: '#17243c',
      backgroundColor: 'rgba(255, 216, 111, 0.95)',
      padding: { left: 18, right: 18, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(80);

    this.tweens.add({
      targets: toast,
      y: 84,
      alpha: 0,
      delay: 1100,
      duration: 520,
      ease: 'Sine.easeInOut',
      onComplete: () => toast.destroy()
    });
  }

  private getFallbackEmoji(cardId: string): string {
    return VisualSystem.emojiForCardId(cardId);
  }

  private showToast(message: string): void {
    const toast = this.add.text(195, 758, message, {
      fontSize: '15px',
      fontStyle: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(12, 18, 38, 0.82)',
      padding: { left: 16, right: 16, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(50);

    this.tweens.add({ targets: toast, y: 738, alpha: 0, delay: 900, duration: 420, onComplete: () => toast.destroy() });
  }

  private spawnPackSparkles(x: number, y: number): void {
    for (let i = 0; i < 18; i += 1) {
      const star = this.add.text(x + Phaser.Math.Between(-82, 82), y + Phaser.Math.Between(-90, 90), '✦', {
        fontSize: `${Phaser.Math.Between(12, 24)}px`,
        color: '#ffe4a3'
      }).setOrigin(0.5).setAlpha(0.65);

      this.tweens.add({
        targets: star,
        y: star.y - Phaser.Math.Between(12, 32),
        alpha: 0,
        duration: 900 + Phaser.Math.Between(0, 520),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }
  }

  private spawnBurst(x: number, y: number): void {
    for (let i = 0; i < 34; i += 1) {
      const star = this.add.text(x, y, i % 3 === 0 ? '◆' : '✦', {
        fontSize: `${Phaser.Math.Between(14, 32)}px`,
        color: i % 2 === 0 ? '#ffe4a3' : '#dff7ff'
      }).setOrigin(0.5).setDepth(20);

      this.tweens.add({
        targets: star,
        x: x + Phaser.Math.Between(-170, 170),
        y: y + Phaser.Math.Between(-170, 170),
        alpha: 0,
        scale: 0.1,
        duration: 760,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  private spawnMiniStars(x: number, y: number, color: number): void {
    for (let i = 0; i < 10; i += 1) {
      const star = this.add.text(x, y, '✦', {
        fontSize: `${Phaser.Math.Between(10, 18)}px`,
        color: `#${color.toString(16).padStart(6, '0')}`
      }).setOrigin(0.5);

      this.tweens.add({
        targets: star,
        x: x + Phaser.Math.Between(-52, 52),
        y: y + Phaser.Math.Between(-48, 48),
        alpha: 0,
        scale: 0.2,
        duration: 560,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  private drawBackground(): void {
    VisualSystem.drawPremiumBackground(this, 'reward');
    VisualSystem.spawnAmbientStars(this, 20);
  }
}
