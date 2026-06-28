self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    if ('caches' in self) {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name.toLowerCase().includes('cardville')).map((name) => caches.delete(name)));
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('caches' in self) {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name.toLowerCase().includes('cardville')).map((name) => caches.delete(name)));
    }
    await self.registration.unregister();
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if (client.url.includes('/CardVille/')) client.navigate('/CardVille/?sw-clean=1');
    }
  })());
});

self.addEventListener('fetch', () => {
  // No caching in 1.0.11 clean stable build.
});
