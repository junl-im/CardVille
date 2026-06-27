const CACHE_NAME = 'cardville-cache-v1-rc2';
const CACHE_PREFIX = 'cardville-cache-';
const CORE_ASSETS = [
  '/CardVille/manifest.webmanifest',
  '/CardVille/assets/manifest/assets.manifest.json',
  '/CardVille/assets/json/asset_manifest.json',
  '/CardVille/assets/json/cards_image_index.json',
  '/CardVille/assets/data/modes/catalog.json',
  '/CardVille/assets/data/cards/collection.base.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/CardVille/')) return;

  const isNavigation = event.request.mode === 'navigate' || url.pathname.endsWith('/CardVille/') || url.pathname.endsWith('/index.html');
  const isBuildAsset = url.pathname.includes('/assets/') && /\.(js|css)$/i.test(url.pathname);
  const isLargeCardImage = url.pathname.includes('/assets/cards_image/');

  if (isNavigation || isBuildAsset || isLargeCardImage) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => undefined);
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
