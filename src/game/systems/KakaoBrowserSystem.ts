import Phaser from 'phaser';

export class KakaoBrowserSystem {
  static isKakaoBrowser(): boolean {
    return /KAKAOTALK/i.test(navigator.userAgent);
  }

  static installBackGuard(scene: Phaser.Scene, onBack: () => void): void {
    history.pushState({ cardville: true }, '', location.href);
    const handler = () => {
      history.pushState({ cardville: true }, '', location.href);
      onBack();
    };
    window.addEventListener('popstate', handler);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('popstate', handler);
    });
  }
}
