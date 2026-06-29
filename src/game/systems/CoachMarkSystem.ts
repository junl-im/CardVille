import Phaser from 'phaser';
import { applyWrap, bodyText, darkText, goldText, mutedText } from '../ui/TextStyles';
import { layout } from './LayoutSystem';
import { getCardVilleQuality, isMotionEnabled, scaledDuration } from './QualitySystem';

const COACH_SEEN_KEY = 'cardville.coach.seen.v140';

export type CoachMarkTone = 'gold' | 'blue' | 'purple' | 'green';

export type CoachMarkOptions = {
  id: string;
  title: string;
  body: string;
  x?: number;
  y?: number;
  width?: number;
  tone?: CoachMarkTone;
  anchorX?: number;
  anchorY?: number;
  actionLabel?: string;
  force?: boolean;
};

const TONE_COLOR: Record<CoachMarkTone, number> = {
  gold: 0xffd86f,
  blue: 0x8fd3ff,
  purple: 0xd7a5ff,
  green: 0x7cf2bd
};

function safeRead(): Record<string, true> {
  try {
    const raw = localStorage.getItem(COACH_SEEN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const clean: Record<string, true> = {};
    for (const key of Object.keys(parsed)) {
      if (/^[a-z0-9_.:-]{3,80}$/i.test(key)) clean[key] = true;
    }
    return clean;
  } catch {
    return {};
  }
}

function safeWrite(value: Record<string, true>): void {
  try { localStorage.setItem(COACH_SEEN_KEY, JSON.stringify(value)); } catch { /* private browser storage may be blocked */ }
}

export class CoachMarkSystem {
  static readonly storageKey = COACH_SEEN_KEY;

  static hasSeen(id: string): boolean {
    return safeRead()[id] === true;
  }

  static markSeen(id: string): void {
    const seen = safeRead();
    seen[id] = true;
    safeWrite(seen);
  }

  static reset(): void {
    try { localStorage.removeItem(COACH_SEEN_KEY); } catch { /* ignore */ }
  }

  static showOnce(scene: Phaser.Scene, options: CoachMarkOptions): Phaser.GameObjects.Container | null {
    if (!options.force && this.hasSeen(options.id)) return null;
    return this.show(scene, options, true);
  }

  static show(scene: Phaser.Scene, options: CoachMarkOptions, markOnClose = false): Phaser.GameObjects.Container {
    const l = layout(scene);
    const width = Phaser.Math.Clamp(options.width ?? 304, 252, Math.min(336, l.visibleWidth - 34));
    const x = Phaser.Math.Clamp(options.x ?? l.visibleX + l.visibleWidth / 2, l.visibleX + width / 2 + 12, l.visibleX + l.visibleWidth - width / 2 - 12);
    const y = Phaser.Math.Clamp(options.y ?? 646, l.visibleY + 122, l.visibleY + l.visibleHeight - 118);
    const height = 126;
    const color = TONE_COLOR[options.tone ?? 'gold'];
    const container = scene.add.container(x, y).setDepth(2600).setName(`coach:${options.id}`);
    const shadow = scene.add.rectangle(5, 8, width, height, 0x000000, 0.22).setOrigin(0.5);
    const bg = scene.add.rectangle(0, 0, width, height, 0x07142c, 0.96).setOrigin(0.5).setStrokeStyle(2, color, 0.72);
    const glow = scene.add.rectangle(0, -height / 2 + 10, width - 30, 10, color, 0.16).setOrigin(0.5);
    const icon = scene.textures.exists('catHint')
      ? scene.add.image(-width / 2 + 34, -height / 2 + 34, 'catHint').setDisplaySize(42, 42)
      : scene.add.text(-width / 2 + 34, -height / 2 + 34, '🐾', { fontSize: '28px' }).setOrigin(0.5);
    const title = scene.add.text(-width / 2 + 66, -height / 2 + 24, options.title, goldText(14)).setOrigin(0, 0.5);
    const body = scene.add.text(-width / 2 + 24, -14, options.body, applyWrap(bodyText(11), width - 48, 'left')).setOrigin(0, 0.5);
    const closeBg = scene.add.rectangle(width / 2 - 52, height / 2 - 24, 78, 28, color, 0.94).setOrigin(0.5).setStrokeStyle(1, 0xffffff, 0.46);
    const closeLabel = scene.add.text(width / 2 - 52, height / 2 - 24, options.actionLabel ?? '알겠어요', darkText(9)).setOrigin(0.5);
    const closeHit = scene.add.zone(width / 2 - 52, height / 2 - 24, 88, 40).setOrigin(0.5).setInteractive({ useHandCursor: true });
    container.add([shadow, bg, glow, icon, title, body, closeBg, closeLabel, closeHit]);

    if (typeof options.anchorX === 'number' && typeof options.anchorY === 'number') {
      const ax = Phaser.Math.Clamp(options.anchorX - x, -width / 2 + 28, width / 2 - 28);
      const arrowY = options.anchorY > y ? height / 2 + 9 : -height / 2 - 9;
      const arrow = scene.add.triangle(ax, arrowY, 0, options.anchorY > y ? 0 : 18, 18, options.anchorY > y ? 0 : 18, 9, options.anchorY > y ? 18 : 0, color, 0.88).setOrigin(0.5);
      container.add(arrow);
    }

    const close = () => {
      if (markOnClose) CoachMarkSystem.markSeen(options.id);
      closeHit.disableInteractive();
      scene.tweens.add({ targets: container, alpha: 0, y: y - 10, duration: 170, ease: 'Sine.easeIn', onComplete: () => container.destroy() });
    };
    closeHit.on('pointerup', close);
    closeBg.on('pointerup', close);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => container.destroy());

    container.setAlpha(0).setScale(0.94);
    scene.tweens.add({ targets: container, alpha: 1, scale: 1, duration: 190, ease: 'Back.easeOut' });
    if (isMotionEnabled(getCardVilleQuality())) {
      scene.tweens.add({ targets: glow, alpha: 0.05, duration: scaledDuration(1150, getCardVilleQuality()), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    return container;
  }
}
