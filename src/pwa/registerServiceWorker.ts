export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
      console.warn('[CardVille] Service worker registration failed.', error);
    });
  });
}
