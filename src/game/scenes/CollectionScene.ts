import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, cardText } from '../ui/TextStyles';

export class CollectionScene extends Phaser.Scene {
  constructor() { super('CollectionScene'); }
  create(): void {
    DrawSystem.background(this, '카드 앨범');
    const collection = SaveSystem.loadCollection();
    const entries = Object.entries(collection);
    panel(this, 195, 342, 336, 506, 34);
    if (!entries.length) {
      this.add.text(195, 330, '아직 보유 카드가 없어요.\n스테이지를 클리어하고 카드팩을 열어보세요.', { ...applyWrap(bodyText(17), 286), lineSpacing: 8 }).setOrigin(0.5);
    } else {
      entries.slice(0, 12).forEach(([id, count], i) => {
        const x = 82 + (i % 3) * 112;
        const y = 160 + Math.floor(i / 3) * 112;
        this.add.rectangle(x, y, 90, 98, 0xfff3cc, 0.97).setStrokeStyle(3, 0x8fd3ff, 0.95);
        this.add.text(x, y - 10, '✨', { fontSize: '24px' }).setOrigin(0.5);
        this.add.text(x, y + 26, `${id}\nx${count}`, { ...cardText(10), align: 'center' }).setOrigin(0.5);
      });
    }
    const back = new GameButton(this, 195, 746, '로비로', 248, 56, 0xc9f4ff);
    back.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }
}
