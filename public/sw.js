const CACHE_NAME = 'cardville-cache-v1-preview';
const CORE_ASSETS = [
  '/CardVille/',
  '/CardVille/index.html',
  '/CardVille/manifest.webmanifest',
  '/CardVille/assets/manifest/assets.manifest.json',
  '/CardVille/assets/json/asset_manifest.json',
  '/CardVille/assets/json/cards_image_index.json',
  '/CardVille/assets/data/modes/catalog.json',
  '/CardVille/assets/data/modes/word_ko_basic.json',
  '/CardVille/assets/data/modes/math_basic.json',
  '/CardVille/assets/data/modes/memory_basic.json',
  '/CardVille/assets/data/modes/english_basic.json',
  '/CardVille/assets/data/modes/puzzle_basic.json',
  '/CardVille/assets/data/cards/collection.base.json',
  '/CardVille/assets/data/packs/card_packs.json',
  '/CardVille/assets/backgrounds/dream_library_day.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/CardVille/')) return;

  // The 5,000-card image library is intentionally lazy-loaded and not forced into PWA cache.
  // This protects free hosting users from excessive storage growth on mobile browsers.
  const skipRuntimeCache = url.pathname.includes('/assets/cards_image/');

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!skipRuntimeCache && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => undefined);
        }
        return response;
      });
    })
  );
});
