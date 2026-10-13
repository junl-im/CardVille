/* 카드빌 v0.5 오프라인 기본 파일; only cache same-origin safe GET responses. */
const CACHE='lanypang-match-v0.8-ko';
const ASSETS=['./','./index.html','./manifest.json','./css/a11y.css','./js/a11y.js','./js/cardville-balance.js','./js/daily-challenge.js','./js/leaderboard.js','./js/difficulty.js','./js/level-editor.js','./js/multiplayer.js','./project-overlay/project.js','./project-overlay/project.css','./js/lany-shell.js','./css/lany-shell.css','./assets/lanypang-cover.webp','./assets/lanypang-icon-192.png','./assets/lanypang-icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('cardville-match-')||k.startsWith('lanypang-match-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/__/'))return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok&&r.type==='basic') {const copy=r.clone();void caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match(e.request).then(c=>c||Response.error())));
});
