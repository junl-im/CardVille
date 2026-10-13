/* CardVille v0.4 offline shell; only cache same-origin safe GET responses. */
const CACHE='cardville-match-v0.4';
const ASSETS=['./','./index.html','./manifest.json','./js/cardville-balance.js','./project-overlay/project.js','./project-overlay/project.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cardville-match-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/__/'))return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok&&r.type==='basic') {const copy=r.clone();void caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match(e.request).then(c=>c||Response.error())));
});
