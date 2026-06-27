import Phaser from 'phaser';
import { auth } from '../../firebase/firebaseApp';
import { GAME_WIDTH } from '../config/phaserConfig';
import { addGlassPanel, addTopBar, drawWorldBackground } from '../ui/SceneHelpers';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create(): void {
    drawWorldBackground(this);
    addTopBar(this, '설정');

    this.add
      .text(30, 112, '← 홈', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        fontStyle: '800',
        color: '#ffffff',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('HomeScene'));

    addGlassPanel(this, 28, 168, GAME_WIDTH - 56, 266, 26);

    const user = auth.currentUser;
    const uidText = user ? `${user.uid.slice(0, 8)}...` : '로그인 확인 중';
    const provider = user?.isAnonymous ? '익명 로그인' : user?.providerData[0]?.providerId ?? '인증 대기';

    this.add
      .text(54, 210, `Firebase Auth: ${provider}\nUID: ${uidText}\nAnalytics: 연결 코드 포함\nFirestore Rules: firebase/firestore.rules`, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '17px',
        fontStyle: '700',
        color: '#ffffff',
        lineSpacing: 12,
      })
      .setOrigin(0, 0);

    addGlassPanel(this, 28, 478, GAME_WIDTH - 56, 186, 26);
    this.add
      .text(54, 514, 'CardVille v0.1.0\nSVG 사용 금지\nPNG/WebP/SpriteSheet/Texture Atlas 기준\nGitHub Actions 자동 배포 준비 완료', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '17px',
        fontStyle: '700',
        color: '#dbe3ff',
        lineSpacing: 12,
      })
      .setOrigin(0, 0);
  }
}
