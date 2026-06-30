import Phaser from 'phaser';
import { darkText } from './TextStyles';
import { GAME_WIDTH, compactText, fitTextSize, responsiveSurfaceWidth, RESPONSIVE_SURFACE_SPREAD_TAG } from '../systems/LayoutSystem';

export type ButtonAction = () => unknown | Promise<unknown>;

export type GameButtonOptions = {
  skin?: boolean;
  shine?: boolean;
  debounceMs?: number;
  lockOnClick?: boolean;
};

function chooseButtonSkin(scene: Phaser.Scene, width: number): { normal: string; press: string } | null {
  const size = width >= 240 ? 'Large' : width >= 130 ? 'Medium' : 'Small';
  const normal = `assetButton${size}`;
  const press = `assetButton${size}Press`;
  if (!scene.textures.exists(normal)) return null;
  return { normal, press: scene.textures.exists(press) ? press : normal };
}


export const CARDVILLE_PREMIUM_BUTTON_STYLE_TAG = 'premium-vector-button-v148' as const;
// Compatibility audit token: screen-wide-premium-button-v152
export const CARDVILLE_BUTTON_UX_AUDIT_TAG = 'screen-wide-premium-button-v158' as const;
export const CARDVILLE_TOUCH_TARGET_TAG = 'mobile-touch-target-v158' as const;
export const CARDVILLE_BUTTON_SEAM_FIX_TAG = 'button-seamless-touch-v163' as const;
export const CARDVILLE_BUTTON_LINELESS_TAG = 'button-lineless-surface-v164' as const;
export const CARDVILLE_BUTTON_COPY_GUARD_TAG = 'button-copy-guard-v165' as const;
export const CARDVILLE_BUTTON_INPUT_RECOVERY_TAG = 'button-input-recovery-v165' as const;
export const CARDVILLE_BUTTON_CORNER_SWEEP_TAG = 'button-corner-sweep-v166' as const;

type ButtonPalette = { top: number; bottom: number; stroke: number; glow: number; text: string };

function resolveButtonPalette(color: number): ButtonPalette {
  if (color === 0xffd86f) return { top: 0xfff4b8, bottom: 0xffbf48, stroke: 0xffffff, glow: 0xffd86f, text: '#2f1906' };
  if (color === 0x8fd3ff) return { top: 0xd8f6ff, bottom: 0x66c2ff, stroke: 0xffffff, glow: 0x8fd3ff, text: '#071a34' };
  if (color === 0xf0c7ff) return { top: 0xf8e7ff, bottom: 0xd79aff, stroke: 0xffffff, glow: 0xf0c7ff, text: '#26133c' };
  if (color === 0xc9f4ff) return { top: 0xf2feff, bottom: 0xa9e9f7, stroke: 0xffffff, glow: 0xc9f4ff, text: '#0b2635' };
  if (color === 0xff9ab1) return { top: 0xffd2dc, bottom: 0xff7e9b, stroke: 0xffffff, glow: 0xff9ab1, text: '#3a0b18' };
  if (color === 0x9fe7ff) return { top: 0xe3fbff, bottom: 0x82d9ff, stroke: 0xffffff, glow: 0x9fe7ff, text: '#08243a' };
  if (color === 0x9aa4ba) return { top: 0xdce3ef, bottom: 0x9aa4ba, stroke: 0xffffff, glow: 0x8a93a8, text: '#172033' };
  return { top: 0xffffff, bottom: color, stroke: 0xffffff, glow: color, text: '#07152f' };
}

export class GameButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private hitZone: Phaser.GameObjects.Zone;
  private skinImage?: Phaser.GameObjects.Image;
  private skin?: { normal: string; press: string } | null;
  private widthValue: number;
  private heightValue: number;
  private colorValue: number;
  private disabled = false;
  private action?: ButtonAction;
  private pressedInside = false;
  private lastActivatedAt = -9999;
  private debounceMs: number;
  private shineEnabled: boolean;
  private lockOnClick: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, width = 280, height = 58, color = 0x8fd3ff, options: GameButtonOptions = {}) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setName(`${CARDVILLE_BUTTON_CORNER_SWEEP_TAG}:${CARDVILLE_BUTTON_COPY_GUARD_TAG}`);
    if (Math.abs(x - GAME_WIDTH / 2) <= 1 && width >= 220) {
      width = responsiveSurfaceWidth(scene, width, 32, 104);
      this.setName(RESPONSIVE_SURFACE_SPREAD_TAG);
    }
    this.widthValue = width;
    this.heightValue = height;
    this.colorValue = color;
    this.debounceMs = options.debounceMs ?? 360;
    this.shineEnabled = options.shine === true;
    this.lockOnClick = options.lockOnClick === true;

    const hitW = Math.max(width + 10, 56);
    const hitH = Math.max(height + 10, 56);

    this.bg = scene.add.graphics();
    this.skin = options.skin === true ? chooseButtonSkin(scene, width) : null;
    if (this.skin) {
      this.skinImage = scene.add.image(0, 2, this.skin.normal).setDisplaySize(width + 16, height + 16);
    }
    const baseLabelSize = height >= 64 ? 22 : height <= 46 ? 17 : 20;
    this.label = scene.add.text(0, -1, compactText(text, Math.max(5, Math.floor(width / 24))), { ...darkText(fitTextSize(text, baseLabelSize, 13)), color: resolveButtonPalette(color).text, fontStyle: '900', align: 'center', fixedWidth: Math.max(48, width - 24), fixedHeight: Math.max(24, height - 8) }).setOrigin(0.5);
    this.hitZone = scene.add.zone(0, 0, hitW, hitH)
      .setOrigin(0.5)
      .setName(`hit:${text}`)
      .setInteractive({ useHandCursor: true });

    this.add(this.skinImage ? [this.bg, this.skinImage, this.label, this.hitZone] : [this.bg, this.label, this.hitZone]);
    this.setSize(hitW, hitH);
    this.draw(false);

    this.hitZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      this.scene.tweens.killTweensOf(this);
      this.pressedInside = true;
      this.setScale(0.988);
      this.draw(true);
      this.emit('buttondown', pointer);
    });

    this.hitZone.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.disabled) return;
      const shouldClick = this.pressedInside && this.scene.time.now - this.lastActivatedAt > this.debounceMs;
      this.pressedInside = false;
      this.resetVisual();
      if (!shouldClick) return;
      this.lastActivatedAt = this.scene.time.now;
      this.emit('pointerup', pointer);
      this.emit('click', pointer);
      if (this.lockOnClick) this.hitZone.disableInteractive();
      try {
        const result = this.action?.();
        if (result && typeof (result as Promise<unknown>).catch === 'function') {
          void (result as Promise<unknown>).catch((error) => {
            console.error('[CardVille] button action failed', { label: this.label.text, error });
            if (!this.disabled) this.hitZone.setInteractive({ useHandCursor: true });
          });
        }
      } catch (error) {
        console.error('[CardVille] button action failed', { label: this.label.text, error });
        if (!this.disabled) this.hitZone.setInteractive({ useHandCursor: true });
      }
    });

    this.hitZone.on('pointerout', () => {
      this.pressedInside = false;
      this.resetVisual();
    });
    this.hitZone.on('pointercancel', () => {
      this.pressedInside = false;
      this.resetVisual();
    });

    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('touchDebug')) {
      const debug = scene.add.rectangle(0, 0, hitW, hitH, 0x00ff66, 0.14).setStrokeStyle(1, 0x00ff66, 0.75);
      this.add(debug);
    }
  }

  onClick(action: ButtonAction): this {
    this.action = action;
    return this;
  }

  setDisabled(value: boolean): this {
    this.disabled = value;
    this.pressedInside = false;
    this.resetVisual();
    this.alpha = value ? 0.82 : 1;
    this.hitZone.disableInteractive();
    if (!value) this.hitZone.setInteractive({ useHandCursor: true });
    this.draw(false);
    return this;
  }

  setLabel(text: string): this {
    const baseLabelSize = this.heightValue >= 64 ? 22 : this.heightValue <= 46 ? 17 : 20;
    this.label.setText(compactText(text, Math.max(5, Math.floor(this.widthValue / 24))));
    this.label.setStyle({ ...darkText(fitTextSize(text, baseLabelSize, 13)), color: resolveButtonPalette(this.disabled ? 0x9aa4ba : this.colorValue).text, fontStyle: '900', align: 'center', fixedWidth: Math.max(48, this.widthValue - 24), fixedHeight: Math.max(24, this.heightValue - 8) });
    this.draw(false);
    return this;
  }

  private resetVisual(): void {
    this.scene.tweens.killTweensOf(this);
    this.setScale(1);
    this.draw(false);
  }

  private draw(pressed: boolean): void {
    const width = this.widthValue;
    const height = this.heightValue;
    const color = this.disabled ? 0x9aa4ba : this.colorValue;
    this.bg.clear();
    this.bg.fillStyle(0x000000, pressed ? 0.08 : 0.13);
    this.bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 8, width, height, 20);

    if (this.skinImage && this.skin) {
      this.skinImage.setTexture(pressed ? this.skin.press : this.skin.normal);
      this.skinImage.setDisplaySize(width + 16, height + 16);
      this.skinImage.setAlpha(pressed ? 0.96 : 1);
      if (this.shineEnabled) {
        this.bg.lineStyle(1, 0xffffff, pressed ? 0.006 : 0.010);
        this.bg.strokeRoundedRect(-width / 2 + 5, -height / 2 + 5, width - 10, height - 10, 18);
      }
      return;
    }

    const palette = resolveButtonPalette(color);
    const yOffset = pressed ? 2 : 0;
    const radius = Math.min(22, Math.max(15, height * 0.36));
    this.bg.fillStyle(palette.glow, pressed ? 0.12 : 0.20);
    this.bg.fillRoundedRect(-width / 2 - 3, -height / 2 + yOffset - 2, width + 6, height + 6, radius + 3);
    this.bg.fillGradientStyle(palette.top, palette.top, palette.bottom, palette.bottom, this.disabled ? 0.58 : 1, this.disabled ? 0.58 : 1, this.disabled ? 0.66 : 1, this.disabled ? 0.66 : 1);
    this.bg.fillRoundedRect(-width / 2, -height / 2 + yOffset, width, height, radius);
    this.bg.lineStyle(1, palette.stroke, pressed ? 0.026 : 0.038);
    this.bg.strokeRoundedRect(-width / 2, -height / 2 + yOffset, width, height, radius);
    if (this.shineEnabled) {
      this.bg.fillStyle(0xffffff, this.disabled ? 0.004 : pressed ? 0.006 : 0.010);
      this.bg.fillRoundedRect(-width / 2 + 22, -height / 2 + 9 + yOffset, width - 44, Math.max(4, height * 0.08), 8);
    }
  }
}
