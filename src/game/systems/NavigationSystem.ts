import Phaser from 'phaser';
import { addFullBleedRect, layout } from './LayoutSystem';
import { mutedText } from '../ui/TextStyles';

export const CARDVILLE_NAVIGATION_GUARD_TAG = 'scene-navigation-guard-v152' as const;
export const CARDVILLE_NAVIGATION_HARDENING_TAG = 'scene-navigation-no-freeze-v154' as const;

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

    state.lockedUntil = t + 420;
    state.lastTarget = key;
    NavigationSystem.cleanupModalScenes(scene);

    let shield: Phaser.GameObjects.GameObject | undefined;
    let note: Phaser.GameObjects.Text | undefined;
    let started = false;

    const restoreInput = () => {
      try { if (scene.input) scene.input.enabled = true; } catch { /* ignore */ }
    };

    const startNow = () => {
      if (started) return;
      started = true;
      try { shield?.destroy(); } catch { /* ignore */ }
      try { note?.destroy(); } catch { /* ignore */ }
      restoreInput();
      try {
        scene.scene.start(key, data);
      } catch (error) {
        console.error('[CardVille] safeStart final start failed', { target: key, reason, error, tag: CARDVILLE_NAVIGATION_HARDENING_TAG });
        restoreInput();
      }
    };

    try {
      if (scene.input) scene.input.enabled = false;
      const l = layout(scene);
      shield = addFullBleedRect(scene, 0x020814, 0.10).setDepth(4900).setName('scene-transition-shield-v154');
      note = scene.add.text(l.cx, Math.min(806, l.visibleY + l.visibleHeight - 34), '이동 중...', mutedText(12)).setOrigin(0.5).setDepth(4901).setAlpha(0.74);

      // Phaser delayedCall can be skipped if a source scene is shut down during a tight mobile lifecycle edge.
      // Pair it with a native timer so navigation cannot leave input disabled and look frozen.
      scene.time.delayedCall(24, startNow);
      if (typeof window !== 'undefined') window.setTimeout(startNow, 120);
      return true;
    } catch (error) {
      console.error('[CardVille] safeStart failed; starting immediately', { target: key, reason, error, tag: CARDVILLE_NAVIGATION_HARDENING_TAG });
      startNow();
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
      console.error('[CardVille] safeRestart failed', { target, reason, error, tag: CARDVILLE_NAVIGATION_HARDENING_TAG });
      return false;
    }
  }

  static resetLockForTests(): void {
    state.lockedUntil = 0;
    state.lastTarget = '';
  }
}
