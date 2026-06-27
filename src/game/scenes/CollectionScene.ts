import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';

export class CollectionScene extends Phaser.Scene {
  constructor() { super('CollectionScene'); }
  create(): void {
    DrawSystem.background(this, '카드 앨범');
    const collection = SaveSystem.loadCollection();
    const entries = Object.entries(collection);
    panel(this, 195, 342, 330, 500, 34);
    if (!entries.length) {
      this.add.text(195, 330, '아직 보유 카드가 없어요.\n스테이지를 클리어하고 카드팩을 열어보세요.', { fontSize: '17px', color: '#d8ebff', align: 'center', lineSpacing: 8, wordWrap: { width: 280 } }).setOrigin(0.5);
    } else {
      entries.slice(0, 12).forEach(([id, count], i) => {
        const x = 82 + (i % 3) * 112;
        const y = 160 + Math.floor(i / 3) * 112;
        this.add.rectangle(x, y, 88, 96, 0xfff3cc, 0.95).setStrokeStyle(2, 0x8fd3ff, 0.8);
        this.add.text(x, y - 8, '✨', { fontSize: '24px' }).setOrigin(0.5);
        this.add.text(x, y + 24, `${id}\nx${count}`, { fontSize: '10px', color: '#172445', align: 'center' }).setOrigin(0.5);
      });
    }
    const back = new GameButton(this, 195, 746, '로비로', 240, 54, 0xc9f4ff);
    back.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }
}
