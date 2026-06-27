import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { panel } from '../ui/Panel';
import { DrawSystem } from '../systems/DrawSystem';
import { SaveSystem } from '../systems/SaveSystem';

export class MainLobbyScene extends Phaser.Scene {
  constructor() { super('MainLobbyScene'); }
  create(): void {
    const profile = SaveSystem.loadProfile();
    DrawSystem.background(this, '꿈의 서고');
    panel(this, 195, 128, 342, 118, 28);
    this.add.text(42, 96, `Lv.${profile.level}`, { fontSize: '20px', fontStyle: '900', color: '#ffe8a6' });
    this.add.text(42, 126, profile.nickname, { fontSize: '16px', fontStyle: '900', color: '#ffffff' });
    this.add.text(252, 96, `🪙 ${profile.coins}`, { fontSize: '16px', fontStyle: '900', color: '#ffffff' });
    this.add.text(252, 126, `💎 ${profile.gems}`, { fontSize: '16px', fontStyle: '900', color: '#ffffff' });

    panel(this, 195, 342, 340, 286, 34);
    this.add.text(195, 238, '카드마을', { fontFamily: 'Georgia, serif', fontSize: '40px', fontStyle: '900', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(195, 286, '책을 열고 카드를 모으는 수집형 퍼즐', { fontSize: '15px', color: '#dceeff' }).setOrigin(0.5);

    const play = new GameButton(this, 195, 376, '꿈의 서고 입장', 292, 64, 0xffd86f);
    play.on('pointerup', () => this.scene.start('ModeSelectScene'));
    const col = new GameButton(this, 195, 462, '카드 앨범', 292, 58, 0x8fd3ff);
    col.on('pointerup', () => this.scene.start('CollectionScene'));
    const reset = new GameButton(this, 195, 548, '로컬 데이터 초기화', 292, 52, 0xf0c7ff);
    reset.on('pointerup', () => { SaveSystem.clear(); this.scene.restart(); });

    this.add.text(195, 748, 'GitHub Actions 안정 모드 · Service Worker 없음 · 로컬 게스트 우선', { fontSize: '12px', color: '#a9c4ec', align: 'center', wordWrap: { width: 330 } }).setOrigin(0.5);
    this.add.text(195, 790, '1.0.5', { fontSize: '12px', color: '#91b6e8' }).setOrigin(0.5);
  }
}
