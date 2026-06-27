export class HapticSystem {
  static light(): void {
    if ('vibrate' in navigator) navigator.vibrate(12);
  }

  static success(): void {
    if ('vibrate' in navigator) navigator.vibrate([18, 20, 28]);
  }

  static wrong(): void {
    if ('vibrate' in navigator) navigator.vibrate([40, 20, 40]);
  }
}
