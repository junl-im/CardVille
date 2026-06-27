export class KakaoBrowserSystem {
  private static installed = false;

  static install(onBack: () => void): void {
    if (this.installed) return;
    this.installed = true;

    window.history.pushState({ cardville: true }, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState({ cardville: true }, '', window.location.href);
      onBack();
    });
  }
}
