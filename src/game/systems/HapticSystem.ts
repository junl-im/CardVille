import { SettingsSystem } from './SettingsSystem';

function canVibrate(): boolean {
  return SettingsSystem.get().haptic && typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

export class HapticSystem {
  static light(): void {
    if (canVibrate()) navigator.vibrate(12);
  }

  static success(): void {
    if (canVibrate()) navigator.vibrate([18, 20, 28]);
  }

  static wrong(): void {
    if (canVibrate()) navigator.vibrate([40, 20, 40]);
  }
}
