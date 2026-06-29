import Phaser from 'phaser';
import { addFullBleedRect, layout } from './LayoutSystem';
import { mutedText } from '../ui/TextStyles';

export const CARDVILLE_NAVIGATION_GUARD_TAG = 'scene-navigation-guard-v152' as const;

type SceneData = object | undefined;

type TransitionState = {
  lockedUntil: number;
  lastTarget: string;
};

const state: TransitionState = {
  lockedUntil: 0,
  lastTarget: ''
};

function now(scene: Phaser.Scene): number {
  return scene.time?.now ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
}

function safeSceneKey(key: string): string {
  return key.replace(/[^A-Za-z0-9_-]/g, '');
}

export class NavigationSystem {
  static cleanupModalScenes(scene: Phaser.Scene): void {
    try {
      if (scene.scene.isActive('BackConfirmScene') || scene.scene.isPaused('BackConfirmScene')) {
        scene.scene.stop('BackConfirmScene');
      }
    } catch (error) {
      console.warn('[CardVille] modal cleanup skipped', error);
    }
  }

  static safeStart(scene: Phaser.Scene, target: string, data?: SceneData, reason = 'ui'): boolean {
    const t = now(scene);
    const key = safeSceneKey(target);
    if (!key) return false;
    if (t < state.lockedUntil && state.lastTarget === key) {
      console.info('[CardVille] duplicate scene navigation blocked', { target: key, reason, tag: CARDVILLE_NAVIGATION_GUARD_TAG });
      return false;
    }

    state.lockedUntil = t + 520;
    state.lastTarget = key;
    NavigationSystem.cleanupModalScenes(scene);

    try {
      scene.input.enabled = false;
      const l = layout(scene);
      const shield = addFullBleedRect(scene, 0x020814, 0.12).setDepth(4900).setName('scene-transition-shield-v152');
      const note = scene.add.text(l.cx, Math.min(806, l.visibleY + l.visibleHeight - 34), '이동 중...', mutedText(10)).setOrigin(0.5).setDepth(4901).setAlpha(0.66);
      scene.time.delayedCall(36, () => {
        shield.destroy();
        note.destroy();
        scene.input.enabled = true;
        scene.scene.start(key, data);
      });
      return true;
    } catch (error) {
      scene.input.enabled = true;
      console.error('[CardVille] safeStart failed', { target: key, reason, error });
      scene.scene.start(key, data);
      return true;
    }
  }

  static safeRestart(scene: Phaser.Scene, data?: SceneData, reason = 'ui'): boolean {
    const target = scene.scene.key;
    const t = now(scene);
    if (t < state.lockedUntil && state.lastTarget === `${target}:restart`) return false;
    state.lockedUntil = t + 360;
    state.lastTarget = `${target}:restart`;
    try {
      scene.scene.restart(data);
      return true;
    } catch (error) {
      console.error('[CardVille] safeRestart failed', { target, reason, error });
      return false;
    }
  }

  static resetLockForTests(): void {
    state.lockedUntil = 0;
    state.lastTarget = '';
  }
}
