import Phaser from 'phaser';
import { NavigationSystem } from '../systems/NavigationSystem';
import { applyResponsiveCamera } from '../systems/LayoutSystem';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { REWARD_CARDS, RARITY_META } from '../data/rewardCards';
import { applyWrap, bodyText, cardText, darkText, goldText, mutedText } from '../ui/TextStyles';

export class CollectionScene extends Phaser.Scene {
  private page = 0;
  constructor() { super('CollectionScene'); }

  init(data: { page?: number }): void {
    this.page = data.page ?? 0;
  }

  create(): void {
    applyResponsiveCamera(this);
    const profile = SaveSystem.loadProfile();
    DrawSystem.background(this, '카드 앨범');
    DrawSystem.topHud(this, profile.coins, profile.level);
    const collection = SaveSystem.loadCollection();
    const entries = REWARD_CARDS.map((card) => ({ card, count: collection[card.id] ?? 0 }));
    const owned = entries.filter((entry) => entry.count > 0).length;
    const pageSize = 9;
    const maxPage = Math.max(0, Math.ceil(entries.length / pageSize) - 1);
    this.page = Phaser.Math.Clamp(this.page, 0, maxPage);
    const visible = entries.slice(this.page * pageSize, this.page * pageSize + pageSize);

    panel(this, 195, 414, 338, 566, 34);
    this.add.text(195, 112, '내가 모은 말 카드', goldText(22)).setOrigin(0.5);
    this.add.text(195, 140, `${owned}/${REWARD_CARDS.length}종 수집 · ${this.page + 1}/${maxPage + 1}쪽`, applyWrap(mutedText(12), 310)).setOrigin(0.5);
    this.drawAlbumStats(entries);

    visible.forEach((entry, i) => {
      const x = 82 + (i % 3) * 112;
      const y = 250 + Math.floor(i / 3) * 116;
      this.drawAlbumCard(x, y, entry.card.id, entry.card.icon, entry.card.rarity, entry.count);
    });

    const prev = new GameButton(this, 94, 688, '이전', 116, 52, 0xc9f4ff).onClick(() => NavigationSystem.safeRestart(this, { page: this.page - 1 }));
    const next = new GameButton(this, 296, 688, '다음', 116, 52, 0xffd86f).onClick(() => NavigationSystem.safeRestart(this, { page: this.page + 1 }));
    prev.setDisabled(this.page <= 0);
    next.setDisabled(this.page >= maxPage);
    new GameButton(this, 195, 758, '광장으로', 248, 56, 0xc9f4ff).onClick(() => NavigationSystem.safeStart(this, 'MainLobbyScene'));
  }


  private drawAlbumStats(entries: { card: (typeof REWARD_CARDS)[number]; count: number }[]): void {
    const totalCopies = entries.reduce((sum, entry) => sum + entry.count, 0);
    const rarityOwned = (rarity: keyof typeof RARITY_META) => entries.filter((entry) => entry.card.rarity === rarity && entry.count > 0).length;
    this.add.rectangle(195, 176, 310, 42, 0x07142c, 0.52).setStrokeStyle(1, 0xffffff, 0.18);
    this.add.text(56, 176, `총 ${totalCopies}장`, goldText(11)).setOrigin(0, 0.5);
    const chips: Array<[keyof typeof RARITY_META, string, number]> = [
      ['rare', 'R', 148],
      ['epic', 'E', 206],
      ['legendary', 'L', 268]
    ];
    chips.forEach(([rarity, label, x]) => {
      const meta = RARITY_META[rarity];
      this.add.rectangle(x, 176, 46, 20, meta.color, 0.78).setStrokeStyle(1, 0xffffff, 0.34);
      this.add.text(x, 176, `${label} ${rarityOwned(rarity)}`, darkText(9)).setOrigin(0.5);
    });
    this.add.text(195, 206, '미획득 카드는 회색, 보유 카드는 희귀도 프레임과 보유 수량으로 표시됩니다.', applyWrap(mutedText(9), 304)).setOrigin(0.5);
  }

  private drawAlbumCard(x: number, y: number, id: string, icon: string, rarity: keyof typeof RARITY_META, count: number): void {
    const meta = RARITY_META[rarity];
    this.add.rectangle(x + 4, y + 6, 92, 104, 0x000000, 0.22);
    const frameKey = rarity === 'legendary' ? 'assetFrameLegendary' : rarity === 'epic' ? 'assetFrameEpic' : 'assetFrameRare';
    if (count > 0 && this.textures.exists(frameKey)) this.add.image(x, y, frameKey).setDisplaySize(108, 120).setAlpha(0.45);
    this.add.rectangle(x, y, 92, 104, count > 0 ? 0xfffbf1 : 0xd7deeb, 0.94).setStrokeStyle(3, count > 0 ? meta.color : 0x66708a, 0.95);
    this.add.rectangle(x, y - 40, 78, 16, count > 0 ? meta.color : 0x66708a, 0.9);
    this.add.text(x, y - 40, count > 0 ? meta.label : 'LOCKED', count > 0 ? darkText(7) : mutedText(7)).setOrigin(0.5);
    this.add.text(x, y - 12, count > 0 ? icon : '？', { fontSize: '24px' }).setOrigin(0.5);
    this.add.text(x, y + 24, count > 0 ? `${id}\nx${count}` : '미획득', { ...cardText(9), align: 'center', wordWrap: { width: 80, useAdvancedWrap: true } }).setOrigin(0.5).setAlpha(count > 0 ? 1 : 0.56);
    this.add.text(x, y + 47, count > 0 ? '앨범 보관중' : '카드팩에서 발견', mutedText(8)).setOrigin(0.5).setAlpha(count > 0 ? 1 : 0.62);
  }
}
