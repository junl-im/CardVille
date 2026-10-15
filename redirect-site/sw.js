/* A previous Pages/preview PWA may still control navigations.
   Serve current redirect HTML through network, never touch localStorage. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys()
 .then(keys=>Promise.all(keys.filter(x=>x.startsWith('lanypang-match-')||x.startsWith('cardville-match-')).map(k=>caches.delete(k))))
 .then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(fetch(e.request,{cache:'no-store'}));});
