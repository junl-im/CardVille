/* 카드빌 v0.5 오프라인 기본 파일; only cache same-origin safe GET responses. */
const CACHE='lanypang-match-v1.4.0-ko';
const ASSETS=['./','./index.html','./manifest.json','./css/a11y.css','./js/a11y.js','./js/cardville-balance.js','./js/daily-challenge.js','./js/leaderboard.js','./js/difficulty.js','./js/level-editor.js','./js/multiplayer.js','./project-overlay/project.js','./project-overlay/project.css','./js/lany-shell.js','./js/lany-tempo.js','./css/lany-shell.css','./assets/lanypang-cover.webp','./assets/lanypang-icon-192.png','./assets/lanypang-icon-512.png', './js/lany-friends.js','./css/lany-mobile-friends.css','./css/lany-polish.css','./css/lany-paging.css','./css/lany-install.css','./js/lany-install.js','./assets/lanypang-brand.svg','./assets/lanypang-maskable.svg','./assets/lanypang-favicon-32.png','./assets/lanypang-apple-touch-180.png','./assets/lanypang-maskable-192.png','./assets/lanypang-maskable-512.png','./js/lany-polish.js','./assets/polish/game-meadow.webp','./assets/polish/world-map.webp','./assets/polish/combo.webp','./assets/polish/burst-star.webp','./assets/polish/burst-heart.webp','./assets/polish/rabbit-wink.webp','./assets/polish/bear-surprise.webp','./assets/friends/rabbit.webp','./assets/friends/bear.webp','./assets/friends/chick.webp','./assets/friends/puppy.webp','./assets/friends/cat.webp','./assets/friends/fox.webp','./assets/friends/wolf.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('cardville-match-')||k.startsWith('lanypang-match-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/__/'))return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok&&r.type==='basic') {const copy=r.clone();void caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(c=>c||(e.request.mode==='navigate'?caches.match('./index.html'):undefined)).then(c=>c||Response.error())));
});
