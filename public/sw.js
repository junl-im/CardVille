const CACHE_NAME = 'cardville-cache-v0.7';
const CORE_ASSETS = [
  '/CardVille/',
  '/CardVille/index.html',
  '/CardVille/manifest.webmanifest',
  '/CardVille/assets/data/modes/catalog.json',
  '/CardVille/assets/data/modes/word_ko_basic.json',
  '/CardVille/assets/data/modes/math_basic.json',
  '/CardVille/assets/data/modes/memory_basic.json',
  '/CardVille/assets/data/modes/english_basic.json',
  '/CardVille/assets/data/cards/collection.base.json',
  '/CardVille/assets/data/packs/card_packs.json'
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

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => undefined);
        return response;
      });
    })
  );
});
