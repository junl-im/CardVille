const CACHE_PREFIX = 'cardville-cache-';
const MIGRATION_KEY = 'cardville.sw.migration.rc2';

async function deleteCardVilleCaches(): Promise<void> {
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX)).map((key) => caches.delete(key)));
}

async function unregisterCardVilleWorkers(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;
  const registrations = await navigator.serviceWorker.getRegistrations();
  const base = import.meta.env.BASE_URL || '/CardVille/';
  const targets = registrations.filter((registration) => registration.scope.includes(base));
  const results = await Promise.all(targets.map((registration) => registration.unregister()));
  return results.some(Boolean) || targets.length > 0;
}

async function cleanupLegacyServiceWorkerOnce(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (window.localStorage.getItem(MIGRATION_KEY) === 'done') return;

  try {
    await deleteCardVilleCaches();
    const unregistered = await unregisterCardVilleWorkers();
    window.localStorage.setItem(MIGRATION_KEY, 'done');

    if (unregistered && navigator.serviceWorker.controller && !window.sessionStorage.getItem(`${MIGRATION_KEY}.reloaded`)) {
      window.sessionStorage.setItem(`${MIGRATION_KEY}.reloaded`, '1');
      window.location.reload();
    }
  } catch (error) {
    console.warn('[CardVille] Legacy service worker cleanup failed.', error);
  }
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    cleanupLegacyServiceWorkerOnce().then(() => {
      // RC2 intentionally keeps PWA registration disabled by default.
      // Previous cache-first service workers could serve old index.html files and make the first screen blank.
      // Re-enable by setting VITE_ENABLE_PWA=true after the final release cache strategy is confirmed.
      if (import.meta.env.VITE_ENABLE_PWA !== 'true') return;
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js?v=rc2`).catch((error) => {
        console.warn('[CardVille] Service worker registration failed.', error);
      });
    });
  });
}
