import Phaser from 'phaser';
import { addFullBleedRect } from './LayoutSystem';

export const CARDVILLE_NAVIGATION_GUARD_TAG = 'scene-navigation-guard-v152' as const;
export const CARDVILLE_NAVIGATION_HARDENING_TAG = 'scene-navigation-no-freeze-v154' as const;
export const CARDVILLE_SILENT_TRANSITION_TAG = 'silent-scene-transition-v164' as const;
export const CARDVILLE_RESTART_INPUT_RECOVERY_TAG = 'restart-input-recovery-v165' as const;

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
    let started = false;

    const restoreInput = () => {
      try { if (scene.input) scene.input.enabled = true; } catch { /* ignore */ }
    };

    const startNow = () => {
      if (started) return;
      started = true;
      try { shield?.destroy(); } catch { /* ignore */ }
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
      shield = addFullBleedRect(scene, 0x020814, 0.10).setDepth(4900).setName(`scene-transition-shield-v154:${CARDVILLE_SILENT_TRANSITION_TAG}`);

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
      if (scene.input) scene.input.enabled = true;
      scene.scene.restart(data);
      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          try { if (scene.input) scene.input.enabled = true; } catch { /* ignore */ }
        }, 160);
      }
      return true;
    } catch (error) {
      console.error('[CardVille] safeRestart failed', { target, reason, error, tag: CARDVILLE_NAVIGATION_HARDENING_TAG, recovery: CARDVILLE_RESTART_INPUT_RECOVERY_TAG });
      try { if (scene.input) scene.input.enabled = true; } catch { /* ignore */ }
      return false;
    }
  }

  static resetLockForTests(): void {
    state.lockedUntil = 0;
    state.lastTarget = '';
  }
}
