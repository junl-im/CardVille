const BASE_PATH = import.meta.env.BASE_URL || '/CardVille/';
const BUILD_ID = '1.0-rc.3';
const CACHE_PREFIX = 'cardville-cache-';
const MIGRATION_KEY = `cardville.cache.migration.${BUILD_ID}`;
const RELOAD_KEY = `cardville.cache.migration.${BUILD_ID}.reloaded`;

type MigrationResult = {
  deletedCaches: number;
  unregisteredWorkers: number;
  hadController: boolean;
};

function isCardVilleScope(scope: string): boolean {
  try {
    const url = new URL(scope);
    return url.pathname.includes(BASE_PATH);
  } catch {
    return scope.includes(BASE_PATH);
  }
}

async function deleteCardVilleCaches(): Promise<number> {
  if (!('caches' in window)) return 0;
  const keys = await caches.keys();
  const targets = keys.filter((key) => key.startsWith(CACHE_PREFIX));
  await Promise.all(targets.map((key) => caches.delete(key)));
  return targets.length;
}

async function unregisterCardVilleWorkers(): Promise<number> {
  if (!('serviceWorker' in navigator)) return 0;
  const registrations = await navigator.serviceWorker.getRegistrations();
  const targets = registrations.filter((registration) => isCardVilleScope(registration.scope));
  const results = await Promise.all(targets.map((registration) => registration.unregister()));
  return results.filter(Boolean).length || targets.length;
}

async function registerMigrationWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register(`${BASE_PATH}sw.js?v=${BUILD_ID}`, {
      scope: BASE_PATH,
      updateViaCache: 'none'
    });
    await registration.update().catch(() => undefined);
    registration.active?.postMessage({ type: 'CARDVILLE_FORCE_CACHE_MIGRATION', buildId: BUILD_ID });
  } catch (error) {
    console.warn('[CardVille] Migration service worker registration skipped.', error);
  }
}

async function runClientMigration(): Promise<MigrationResult> {
  const hadController = Boolean(navigator.serviceWorker?.controller);
  const deletedCaches = await deleteCardVilleCaches();
  const unregisteredWorkers = await unregisterCardVilleWorkers();
  window.localStorage.setItem(MIGRATION_KEY, 'done');
  window.localStorage.setItem('cardville.currentBuildId', BUILD_ID);
  return { deletedCaches, unregisteredWorkers, hadController };
}

function shouldReloadAfterMigration(result: MigrationResult): boolean {
  if (window.sessionStorage.getItem(RELOAD_KEY) === '1') return false;
  if (new URLSearchParams(window.location.search).get('cv_cache_migrated') === BUILD_ID) return false;
  return result.hadController || result.unregisteredWorkers > 0 || result.deletedCaches > 0;
}

function reloadOnceAfterMigration(): void {
  window.sessionStorage.setItem(RELOAD_KEY, '1');
  const url = new URL(window.location.href);
  url.searchParams.set('cv_cache_migrated', BUILD_ID);
  url.searchParams.set('t', String(Date.now()));
  window.location.replace(url.toString());
}

export async function prepareRuntimeCache(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator) && !('caches' in window)) return;
  if (window.localStorage.getItem(MIGRATION_KEY) === 'done') return;

  try {
    const result = await runClientMigration();
    if (shouldReloadAfterMigration(result)) {
      reloadOnceAfterMigration();
    }
  } catch (error) {
    console.warn('[CardVille] Automatic cache migration failed.', error);
  }
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    registerMigrationWorker().then(() => {
      if (import.meta.env.VITE_ENABLE_PWA !== 'true') return;
      // PWA caching is intentionally disabled by default until final release.
      // When enabled later, use a network-first navigation strategy and keep index.html out of cache-first storage.
    });
  });
}
