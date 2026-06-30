import Phaser from 'phaser';
import { GAME_WIDTH, clampToSafeY, layout, responsiveSurfaceBox, responsiveSurfaceWidth, RESPONSIVE_SURFACE_SPREAD_TAG } from './LayoutSystem';

export const CARDVILLE_SCREEN_UI_REDESIGN_TAG = 'screen-ui-redesign-v158' as const;
export const CARDVILLE_TOUCH_TARGET_TAG = 'mobile-touch-target-v158' as const;
export const CARDVILLE_PLAYFIELD_SAFEZONE_TAG = 'playfield-safezone-v158' as const;
export const CARDVILLE_RESPONSIVE_SURFACE_TAG = 'responsive-surface-spread-v162' as const;
export const CARDVILLE_NOTICE_FIT_TAG = 'notice-text-fit-v163' as const;
export const CARDVILLE_FLOW_FIT_TAG = 'flow-fit-ui-v164' as const;
export const CARDVILLE_CORNER_SWEEP_UI_TAG = 'holistic-ui-audit-v166' as const;
export const CARDVILLE_SAFE_COPY_CLAMP_TAG = 'safe-area-copy-clamp-v166' as const;

export type MobileSceneFrame = {
  centerX: number;
  left: number;
  right: number;
  width: number;
  titleY: number;
  subtitleY: number;
  statusY: number;
  contentTop: number;
  contentBottom: number;
  actionY: number;
  bottomNoteY: number;
};

export function mobileSceneFrame(scene: Phaser.Scene): MobileSceneFrame {
  const l = layout(scene);
  const left = l.visibleX + Math.max(16, l.safeLeft + 16);
  const right = l.visibleX + l.visibleWidth - Math.max(16, l.safeRight + 16);
  const centerX = l.visibleX + l.visibleWidth / 2;
  return {
    centerX,
    left,
    right,
    width: right - left,
    titleY: Math.max(78, l.top + 54),
    subtitleY: Math.max(110, l.top + 86),
    statusY: Math.max(156, l.top + 132),
    contentTop: Math.max(176, l.top + 152),
    contentBottom: clampToSafeY(scene, Math.min(l.bottom - 124, 704 + l.extraY), 0, 96),
    actionY: clampToSafeY(scene, l.bottom - 74, 28, 14),
    bottomNoteY: clampToSafeY(scene, l.bottom - 22, 12, 8)
  };
}

export function drawMobileActionDock(scene: Phaser.Scene, y = 744, height = 112): Phaser.GameObjects.Graphics {
  const l = layout(scene);
  const g = scene.add.graphics().setName(CARDVILLE_SCREEN_UI_REDESIGN_TAG);
  g.fillStyle(0x061127, 0.82);
  g.fillRoundedRect(l.visibleX + 12, y - height / 2, l.visibleWidth - 24, height, 24);
  g.lineStyle(1, 0xffffff, 0.026);
  g.strokeRoundedRect(l.visibleX + 12, y - height / 2, l.visibleWidth - 24, height, 24);
  g.fillStyle(0xffffff, 0.008);
  g.fillRoundedRect(l.visibleX + 26, y - height / 2 + 10, l.visibleWidth - 52, 8, 8);
  return g;
}

export function drawReadablePanel(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color = 0x07142c, alpha = 0.84): Phaser.GameObjects.Graphics {
  const box = responsiveSurfaceBox(scene, x, y, width, height);
  x = box.x;
  y = box.y;
  width = box.width;
  height = box.height;
  const g = scene.add.graphics().setName(`${CARDVILLE_PLAYFIELD_SAFEZONE_TAG}:${RESPONSIVE_SURFACE_SPREAD_TAG}:${CARDVILLE_RESPONSIVE_SURFACE_TAG}:${CARDVILLE_FLOW_FIT_TAG}:${CARDVILLE_CORNER_SWEEP_UI_TAG}`);
  g.fillStyle(color, alpha);
  g.fillRoundedRect(x - width / 2, y - height / 2, width, height, 28);
  g.lineStyle(1, 0xffffff, 0.032);
  g.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 28);
  return g;
}

export function assertNoVerticalOverlap(scene: Phaser.Scene, label: string, ranges: Array<[string, number, number]>): void {
  for (let i = 0; i < ranges.length; i += 1) {
    for (let j = i + 1; j < ranges.length; j += 1) {
      const [aName, aTop, aBottom] = ranges[i];
      const [bName, bTop, bBottom] = ranges[j];
      const overlap = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);
      if (overlap > 0) {
        console.warn('[CardVille] screen overlap risk', { label, aName, bName, overlap });
      }
    }
  }
}
export const CARDVILLE_LIST_CARD_FIT_TAG = 'list-card-fit-v165' as const;
export const CARDVILLE_ACTION_BAR_FIT_TAG = 'action-bar-fit-v165' as const;
export const CARDVILLE_COPY_BOX_GUARD_TAG = 'copy-box-guard-v165' as const;

export type MobileCardLane = {
  centerX: number;
  left: number;
  right: number;
  width: number;
};

export type StackedListMetrics = MobileCardLane & {
  top: number;
  bottom: number;
  itemHeight: number;
  gap: number;
  yFor: (index: number) => number;
};

export function mobileCardLane(scene: Phaser.Scene, preferredWidth = 334, margin = 18, maxExtra = 166): MobileCardLane {
  const l = layout(scene);
  const width = Math.min(responsiveSurfaceWidth(scene, preferredWidth, margin, maxExtra), l.visibleWidth - Math.max(24, l.safeLeft + l.safeRight + margin * 2));
  const centerX = l.visibleX + l.visibleWidth / 2;
  return { centerX, width, left: centerX - width / 2, right: centerX + width / 2 };
}

export function stackedListMetrics(scene: Phaser.Scene, count: number, options: { top?: number; bottom?: number; itemHeight?: number; minGap?: number; preferredWidth?: number } = {}): StackedListMetrics {
  const l = layout(scene);
  const lane = mobileCardLane(scene, options.preferredWidth ?? 334);
  const top = Math.max(options.top ?? 190, l.top + 130);
  const bottom = Math.min(options.bottom ?? l.bottom - 126, l.bottom - 104);
  const itemHeight = options.itemHeight ?? 88;
  const usable = Math.max(itemHeight * Math.max(1, count), bottom - top);
  const rawGap = count > 1 ? (usable - itemHeight * count) / (count - 1) : 0;
  const gap = Math.max(options.minGap ?? 10, Math.min(28, rawGap));
  const total = itemHeight * count + gap * Math.max(0, count - 1);
  const start = top + Math.max(0, (bottom - top - total) / 2) + itemHeight / 2;
  return { ...lane, top, bottom, itemHeight, gap, yFor: (index: number) => start + index * (itemHeight + gap) };
}

export function actionButtonCenters(scene: Phaser.Scene, count: number, buttonWidth: number, gap = 18): number[] {
  const lane = mobileCardLane(scene, 338, 18, 192);
  const availableGap = count > 1 ? Math.max(10, Math.min(gap, (lane.width - buttonWidth * count) / (count - 1))) : 0;
  const total = buttonWidth * count + availableGap * Math.max(0, count - 1);
  const start = lane.centerX - total / 2 + buttonWidth / 2;
  return Array.from({ length: count }, (_, index) => start + index * (buttonWidth + availableGap));
}

export function safeToastPosition(scene: Phaser.Scene, offsetFromBottom = 204): { x: number; y: number; width: number } {
  const l = layout(scene);
  const lane = mobileCardLane(scene, 322, 20, 152);
  return { x: lane.centerX, y: Math.min(l.bottom - 92, l.visibleY + l.visibleHeight - offsetFromBottom), width: lane.width };
}



export function safeCopyWidth(scene: Phaser.Scene, requested = 320, margin = 26): number {
  const l = layout(scene);
  return Math.max(120, Math.min(requested, l.visibleWidth - Math.max(margin * 2, l.safeLeft + l.safeRight + margin * 2)));
}

export function safeActionY(scene: Phaser.Scene, offset = 70, halfHeight = 28): number {
  const l = layout(scene);
  return clampToSafeY(scene, l.bottom - offset, halfHeight, 12);
}
