import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';

const rewards = ['apple_card', 'cat_card', 'library_card', 'star_card'];

export class RewardScene extends Phaser.Scene {
  constructor() { super('RewardScene'); }
  create(): void {
    const card = Phaser.Utils.Array.GetRandom(rewards);
    const profile = SaveSystem.addReward(30, 50);
    const count = SaveSystem.addCard(card);
    DrawSystem.background(this, '보상');
    panel(this, 195, 330, 330, 380, 34);
    this.add.text(195, 206, '카드팩 보상', { fontSize: '32px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.rectangle(195, 336, 146, 190, 0xfff3cc, 0.95).setStrokeStyle(4, 0xffd86f, 1);
    this.add.text(195, 320, '✨', { fontSize: '54px' }).setOrigin(0.5);
    this.add.text(195, 388, `${card}\n보유 ${count}장`, { fontSize: '16px', fontStyle: '900', color: '#172445', align: 'center' }).setOrigin(0.5);
    this.add.text(195, 500, `+30 XP  +50 코인\n현재 Lv.${profile.level} · 🪙 ${profile.coins}`, { fontSize: '16px', color: '#d8ebff', align: 'center', lineSpacing: 6 }).setOrigin(0.5);
    const lobby = new GameButton(this, 195, 636, '로비로 이동', 270, 60, 0xffd86f);
    lobby.on('pointerup', () => this.scene.start('MainLobbyScene'));
  }
}
