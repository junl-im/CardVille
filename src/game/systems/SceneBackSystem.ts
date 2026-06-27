import Phaser from 'phaser';

export class SceneBackSystem {
  static bind(scene: Phaser.Scene, handler: () => void): void {
    scene.game.events.on('cardville:back-button', handler, scene);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.game.events.off('cardville:back-button', handler, scene);
    });
  }
}
