export class HapticSystem {
  static light(): void {
    if ('vibrate' in navigator) navigator.vibrate(18);
  }

  static success(): void {
    if ('vibrate' in navigator) navigator.vibrate([25, 35, 35]);
  }

  static error(): void {
    if ('vibrate' in navigator) navigator.vibrate([45, 25, 45]);
  }
}
