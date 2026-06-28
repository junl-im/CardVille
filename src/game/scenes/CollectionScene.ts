import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, cardText, goldText } from '../ui/TextStyles';

export class CollectionScene extends Phaser.Scene {
  constructor() { super('CollectionScene'); }
  create(): void {
    const profile = SaveSystem.loadProfile();
    DrawSystem.background(this, '카드 앨범');
    DrawSystem.topHud(this, profile.coins, profile.level);
    const collection = SaveSystem.loadCollection();
    const entries = Object.entries(collection);
    panel(this, 195, 394, 336, 540, 34);
    this.add.text(195, 128, '내가 모은 말 카드', goldText(22)).setOrigin(0.5);
    if (!entries.length) {
      this.add.text(195, 358, '아직 보유 카드가 없어요.\n말 카드 스테이지를 클리어하고 카드팩을 열어보세요.', { ...applyWrap(bodyText(17), 286), lineSpacing: 8 }).setOrigin(0.5);
    } else {
      entries.slice(0, 12).forEach(([id, count], i) => {
        const x = 82 + (i % 3) * 112;
        const y = 196 + Math.floor(i / 3) * 112;
        this.add.rectangle(x, y, 90, 98, 0xfffbf1, 1).setStrokeStyle(3, 0xffa320, 0.95);
        this.add.rectangle(x, y - 36, 78, 16, 0xffa320, 0.9);
        this.add.text(x, y - 4, '✨', { fontSize: '24px' }).setOrigin(0.5);
        this.add.text(x, y + 30, `${id}\nx${count}`, { ...cardText(10), align: 'center' }).setOrigin(0.5);
      });
    }
    const back = new GameButton(this, 195, 746, '광장으로', 248, 56, 0xc9f4ff);
    back.onClick(() => this.scene.start('MainLobbyScene'));
  }
}
