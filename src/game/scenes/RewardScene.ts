import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { applyWrap, bodyText, cardText, titleText } from '../ui/TextStyles';

const rewards = ['피곤함 카드', '럭키 카드', '큐브 카드', '방패 카드', '카드마을 주민증'];

export class RewardScene extends Phaser.Scene {
  constructor() { super('RewardScene'); }
  create(): void {
    const card = Phaser.Utils.Array.GetRandom(rewards);
    const profile = SaveSystem.addReward(30, 50);
    const count = SaveSystem.addCard(card);
    DrawSystem.background(this, '보상');
    panel(this, 195, 330, 336, 384, 34);
    this.add.text(195, 206, '말 카드팩 보상', titleText(32)).setOrigin(0.5);
    this.add.rectangle(195, 336, 150, 194, 0xfffbf1, 1).setStrokeStyle(5, 0xffa320, 1);
    this.add.rectangle(195, 258, 128, 24, 0xffa320, 0.95);
    this.add.text(195, 318, '✨', { fontSize: '54px' }).setOrigin(0.5);
    this.add.text(195, 388, `${card}\n보유 ${count}장`, { ...cardText(16), align: 'center' }).setOrigin(0.5);
    this.add.text(195, 500, `+30 XP  +50 코인\n현재 Lv.${profile.level} · 🪙 ${profile.coins}`, { ...applyWrap(bodyText(16), 300), lineSpacing: 7 }).setOrigin(0.5);
    const lobby = new GameButton(this, 195, 636, '카드마을 광장으로', 276, 62, 0xffd86f);
    lobby.onClick(() => this.scene.start('MainLobbyScene'));
  }
}
