const CARDVILLE_BUILD_ID = '1.0.1';
const CARDVILLE_SCOPE = '/CardVille/';
const CACHE_PREFIX = 'cardville-cache-';

async function deleteLegacyCaches() {
  if (!self.caches) return;
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .map((key) => caches.delete(key))
  );
}

async function notifyAndRefreshClients() {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  await Promise.all(
    windows.map(async (client) => {
      try {
        client.postMessage({ type: 'CARDVILLE_SW_MIGRATED', buildId: CARDVILLE_BUILD_ID });
        const url = new URL(client.url);
        if (!url.pathname.startsWith(CARDVILLE_SCOPE)) return;
        if (url.searchParams.get('cv_sw_migrated') === CARDVILLE_BUILD_ID) return;
        url.searchParams.set('cv_sw_migrated', CARDVILLE_BUILD_ID);
        url.searchParams.set('t', String(Date.now()));
        await client.navigate(url.toString());
      } catch (error) {
        // Ignore closed clients or browsers that do not support client.navigate.
      }
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(deleteLegacyCaches().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    deleteLegacyCaches()
      .then(() => self.clients.claim())
      .then(() => notifyAndRefreshClients())
  );
});

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'CARDVILLE_FORCE_CACHE_MIGRATION') return;
  event.waitUntil(deleteLegacyCaches().then(() => notifyAndRefreshClients()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(CARDVILLE_SCOPE)) return;

  const isNavigation = event.request.mode === 'navigate' || url.pathname === CARDVILLE_SCOPE || url.pathname.endsWith('/index.html');
  const isBuildAsset = /\/assets\/.*\.(js|css)$/i.test(url.pathname);
  const isManifestOrVersion = url.pathname.endsWith('/manifest.webmanifest') || url.pathname.endsWith('/build.json');

  if (isNavigation || isBuildAsset || isManifestOrVersion) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => fetch(new Request(`${CARDVILLE_SCOPE}reset.html`, { cache: 'reload' })))
    );
  }
});
