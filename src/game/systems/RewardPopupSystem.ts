import Phaser from 'phaser';
import { GameButton } from '../ui/GameButton';
import { applyWrap, bodyText, darkText, goldText, mutedText, titleText } from '../ui/TextStyles';
import { addFullBleedRect } from './LayoutSystem';
import { getCardVilleQuality, isMotionEnabled, scaledDuration } from './QualitySystem';

export type RewardPopupTone = 'gold' | 'blue' | 'green' | 'purple' | 'coral';

export type RewardPopupOptions = {
  title: string;
  message: string;
  tone?: RewardPopupTone;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  autoCloseMs?: number;
};

const TONE_COLOR: Record<RewardPopupTone, number> = {
  gold: 0xffd86f,
  blue: 0x8fd3ff,
  green: 0xa9f5b5,
  purple: 0xd7a5ff,
  coral: 0xffb39a
};

export class RewardPopupSystem {
  static show(scene: Phaser.Scene, options: RewardPopupOptions): Phaser.GameObjects.Container {
    const quality = getCardVilleQuality();
    const color = TONE_COLOR[options.tone ?? 'gold'];
    const overlay = addFullBleedRect(scene, 0x020814, quality.highContrast ? 0.72 : 0.56).setDepth(3400).setInteractive();
    const popup = scene.add.container(195, 424).setDepth(3401).setName('reward-popup:v143');
    const shadow = scene.add.rectangle(6, 10, 328, 254, 0x000000, 0.26).setOrigin(0.5);
    const bg = scene.add.rectangle(0, 0, 328, 254, quality.highContrast ? 0xfffbf1 : 0x07142c, quality.highContrast ? 0.98 : 0.97)
      .setOrigin(0.5)
      .setStrokeStyle(3, color, 0.86);
    const topGlow = scene.add.rectangle(0, -112, 284, 12, color, quality.highContrast ? 0.26 : 0.18).setOrigin(0.5);
    const rewardBurst = scene.textures.exists('effectRewardBurstPremium')
      ? scene.add.image(84, -52, 'effectRewardBurstPremium').setDisplaySize(132, 132).setAlpha(quality.highContrast ? 0.14 : 0.24)
      : null;
    const catKey = options.tone === 'green' ? 'catHintHappy' : options.tone === 'blue' ? 'catHintThink' : options.tone === 'coral' ? 'catHintSleepy' : 'catHintSurprise';
    const iconKey = scene.textures.exists(catKey) ? catKey : 'catHint';
    const icon = scene.textures.exists(iconKey)
      ? scene.add.image(-112, -76, iconKey).setDisplaySize(52, 52)
      : scene.add.text(-112, -76, '🐾', { fontSize: '34px' }).setOrigin(0.5);
    const chest = scene.textures.exists('uiTreasureChestPremium')
      ? scene.add.image(112, 52, 'uiTreasureChestPremium').setDisplaySize(54, 44).setAlpha(0.78)
      : null;
    const titleStyle = quality.highContrast ? darkText(20) : titleText(20);
    const messageStyle = quality.highContrast ? { ...darkText(12), fontStyle: '800' } : bodyText(12);
    const title = scene.add.text(-76, -78, options.title, titleStyle).setOrigin(0, 0.5);
    const body = scene.add.text(0, -10, options.message, { ...applyWrap(messageStyle, 282, 'center'), lineSpacing: 5 }).setOrigin(0.5);
    const caption = scene.add.text(0, 60, '보상은 프로필과 주간 미션 게이지에 안전하게 저장됩니다.', quality.highContrast ? darkText(9) : mutedText(9)).setOrigin(0.5);
    popup.add([shadow, bg, topGlow]);
    if (rewardBurst) popup.add(rewardBurst);
    popup.add([icon, title, body, caption]);
    if (chest) popup.add(chest);

    const closePopup = (callback?: () => void) => {
      overlay.disableInteractive();
      scene.tweens.add({
        targets: [popup, overlay],
        alpha: 0,
        duration: 150,
        ease: 'Sine.easeIn',
        onComplete: () => {
          overlay.destroy();
          popup.destroy();
          callback?.();
        }
      });
    };

    const primary = new GameButton(scene, 195, 538, options.primaryLabel ?? '확인', 142, 42, color, { skin: false, shine: false, debounceMs: 520 })
      .onClick(() => closePopup(options.onPrimary));
    popup.add(primary);
    if (options.secondaryLabel) {
      primary.setPosition(-82, 114);
      const secondary = new GameButton(scene, 82, 114, options.secondaryLabel, 128, 42, 0xc9f4ff, { skin: false, shine: false, debounceMs: 520 })
        .onClick(() => closePopup(options.onSecondary));
      popup.add(secondary);
    } else {
      primary.setPosition(0, 114);
    }

    popup.setAlpha(0).setScale(0.92);
    scene.tweens.add({ targets: popup, alpha: 1, scale: 1, duration: 170, ease: 'Back.easeOut' });
    if (isMotionEnabled(quality)) {
      scene.tweens.add({ targets: topGlow, alpha: quality.highContrast ? 0.10 : 0.04, duration: scaledDuration(960, quality), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      for (let i = 0; i < Math.min(quality.maxSparkles, 7); i += 1) {
        const sparkle = scene.add.text(195 + Phaser.Math.Between(-126, 126), 382 + Phaser.Math.Between(-80, 90), '✦', goldText(12)).setDepth(3402).setOrigin(0.5).setAlpha(0.0);
        scene.tweens.add({ targets: sparkle, alpha: { from: 0, to: 0.78 }, y: sparkle.y - Phaser.Math.Between(16, 42), duration: scaledDuration(520, quality), delay: 70 + i * 48, yoyo: true, onComplete: () => sparkle.destroy() });
      }
    }
    if (options.autoCloseMs && options.autoCloseMs > 0) scene.time.delayedCall(options.autoCloseMs, () => closePopup(options.onPrimary));
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      overlay.destroy();
      popup.destroy();
    });
    return popup;
  }
}
