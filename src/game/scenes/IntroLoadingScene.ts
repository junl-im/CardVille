import Phaser from 'phaser';
import { applyWrap, bodyText, goldText, mutedText, titleText } from '../ui/TextStyles';

export class IntroLoadingScene extends Phaser.Scene {
  private finished = false;

  constructor() { super('IntroLoadingScene'); }

  create(): void {
    this.drawFallbackBackground();
    this.add.rectangle(195, 422, 390, 844, 0x020814, 0.28);
    this.add.text(195, 86, 'CardVille', titleText(30)).setOrigin(0.5);
    this.add.text(195, 780, '카드마을로 들어가는 중...', goldText(18)).setOrigin(0.5);
    this.add.text(195, 812, '인트로 영상은 로딩 화면으로만 사용됩니다.', mutedText(11)).setOrigin(0.5);

    const hasVideo = this.cache.video.exists('introVideo');
    if (hasVideo) {
      const video = this.add.video(195, 422, 'introVideo').setOrigin(0.5);
      video.setDisplaySize(390, 844);
      video.setMute(true);
      video.setDepth(-1);
      video.on('complete', () => this.finish());
      video.on('error', () => this.finish());
      const started = video.play(false);
      if (!started) this.time.delayedCall(2600, () => this.finish());
    } else {
      this.add.text(
        195,
        422,
        '오프닝 영상을 준비하지 못했지만\n게임은 바로 시작할 수 있어요.',
        { ...applyWrap(bodyText(16), 300), lineSpacing: 8 }
      ).setOrigin(0.5);
    }

    this.input.once('pointerdown', () => this.finish());
    this.time.delayedCall(3600, () => this.finish());
  }

  private drawFallbackBackground(): void {
    if (this.textures.exists('loginBg')) {
      this.add.image(195, 422, 'loginBg').setDisplaySize(390, 844);
      return;
    }
    const g = this.add.graphics();
    g.fillGradientStyle(0x235aa2, 0x4b9bc5, 0x143e7b, 0x071126, 1, 1, 1, 1);
    g.fillRect(0, 0, 390, 844);
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.scene.start('LoginScene');
  }
}
