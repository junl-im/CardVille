/* 라니팡 v2.0 — bounded offline PWA caching.
   Never cache timestamped version probes, navigation query variants, or dynamic GETs.
   Old game versions are purged on activate, and gameplay progress is never touched.
*/
const CACHE='lanypang-match-v2.0.0-ko';
const PRECACHE=['./','./index.html','./manifest.json','./css/a11y.css','./js/a11y.js','./js/cardville-balance.js','./js/daily-challenge.js','./js/leaderboard.js','./js/difficulty.js','./js/level-editor.js','./js/multiplayer.js','./project-overlay/project.js','./project-overlay/project.css','./js/lany-shell.js','./js/lany-tempo.js','./css/lany-shell.css','./assets/lanypang-cover.webp','./assets/friends/cow.webp','./assets/friends/crocodile.webp','./assets/friends/deer.webp','./assets/friends/elephant.webp','./assets/friends/frog.webp','./assets/friends/giraffe.webp','./assets/friends/hamster.webp','./assets/friends/hedgehog.webp','./assets/friends/hen.webp','./assets/friends/hippo.webp','./assets/friends/koala.webp','./assets/friends/lion.webp','./assets/friends/monkey.webp','./assets/friends/owl.webp','./assets/friends/panda.webp','./assets/friends/penguin.webp','./assets/friends/pig.webp','./assets/friends/polar_bear.webp','./assets/friends/raccoon.webp','./assets/friends/red_panda.webp','./assets/friends/sheep.webp','./assets/friends/squirrel.webp','./assets/friends/tiger.webp','./assets/polish/bear-cheer.webp','./assets/polish/bear-normal.webp','./assets/polish/bear-wink.webp','./assets/polish/cat-cheer.webp','./assets/polish/cat-normal.webp','./assets/polish/cat-surprise.webp','./assets/polish/cat-wink.webp','./assets/polish/chick-cheer.webp','./assets/polish/chick-normal.webp','./assets/polish/chick-surprise.webp','./assets/polish/chick-wink.webp','./assets/polish/fox-cheer.webp','./assets/polish/fox-normal.webp','./assets/polish/fox-surprise.webp','./assets/polish/fox-wink.webp','./assets/polish/panda-cheer.webp','./assets/polish/panda-normal.webp','./assets/polish/panda-surprise.webp','./assets/polish/panda-wink.webp','./assets/polish/puppy-cheer.webp','./assets/polish/puppy-normal.webp','./assets/polish/puppy-surprise.webp','./assets/polish/puppy-wink.webp','./assets/polish/rabbit-cheer.webp','./assets/polish/rabbit-normal.webp','./assets/polish/rabbit-surprise.webp','./assets/polish/rainbow.webp','./assets/polish/wolf-cheer.webp','./assets/polish/wolf-normal.webp','./assets/polish/wolf-surprise.webp','./assets/polish/wolf-wink.webp','./assets/lanypang-icon-192.png','./assets/lanypang-icon-512.png', './js/lany-friends.js','./css/lany-mobile-friends.css','./css/lany-polish.css','./css/lany-paging.css','./css/lany-install.css','./js/lany-install.js','./js/lany-art-buttons.js','./css/lany-art-buttons.css','./css/lany-action-art-v16.css','./css/lany-title-stage-v17.css','./css/lany-worlds-v20.css','./assets/map/stage-ordinary-v20.webp','./assets/map/stage-current-v20.webp','./assets/map/stage-boss-v20.webp','./assets/map/stage-locked-v20.webp','./css/lany-raster-v18.css','./css/lany-result-v19.css','./js/lany-perf-v19.js','./js/lany-update-v17.js','./assets/title/title-logo-v18.webp','./assets/title/btn-play-v18.webp','./assets/title/btn-install-v18.webp','./assets/title/btn-help-v18.webp','./assets/title/btn-friends-v18.webp','./assets/buttons/action-play.svg','./assets/buttons/action-map.svg','./assets/buttons/action-resume.svg','./assets/buttons/action-retry.svg','./assets/buttons/action-next.svg','./assets/buttons/action-home.svg','./assets/buttons/action-help.svg','./assets/buttons/action-pause.svg','./assets/buttons/action-exit.svg','./assets/buttons/action-back.svg','./assets/buttons/action-friends.svg','./assets/buttons/action-close.svg','./assets/buttons/stage-ordinary.svg','./assets/buttons/stage-current.svg','./assets/buttons/stage-boss.svg','./assets/buttons/stage-locked.svg','./assets/lanypang-brand.svg','./assets/lanypang-maskable.svg','./assets/buttons/skin-pink.svg','./assets/buttons/skin-blue.svg','./assets/buttons/skin-gold.svg','./assets/buttons/skin-green.svg','./assets/lanypang-favicon-32.png','./assets/lanypang-apple-touch-180.png','./assets/lanypang-maskable-192.png','./assets/lanypang-maskable-512.png','./js/lany-polish.js','./assets/polish/game-meadow.webp','./assets/polish/world-map.webp','./assets/polish/combo.webp','./assets/polish/burst-star.webp','./assets/polish/burst-heart.webp','./assets/polish/rabbit-wink.webp','./assets/polish/bear-surprise.webp','./assets/friends/rabbit.webp','./assets/friends/bear.webp','./assets/friends/chick.webp','./assets/friends/puppy.webp','./assets/friends/cat.webp','./assets/friends/fox.webp','./assets/friends/wolf.webp'];
const SCOPE=self.registration.scope;
const indexURL=new URL('./index.html',SCOPE).href;
const staticURLs=new Set(PRECACHE.filter(p=>p!=='./'&&p!=='./index.html')
  .map(p=>new URL(p,SCOPE).pathname));
const normalized=(url)=>new URL(url.pathname,url.origin).href;
const isStatic=(url)=>staticURLs.has(url.pathname);
const safeFallback=()=>caches.match(indexURL).then(r=>r||Response.error());
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE)
    .then(cache=>cache.addAll(PRECACHE))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>(k.startsWith('cardville-match-')||k.startsWith('lanypang-match-'))&&k!==CACHE)
      .map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin
      ||!url.href.startsWith(SCOPE)||url.pathname.includes('/__/'))return;
  // Network-first navigation. Save exactly one canonical index.html in precache.
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).catch(safeFallback));
    return;
  }
  // version.json?_fresh=Date.now(), sw.js and any query-only / API request:
  // let the browser handle directly. Never grow cache for these addresses.
  if(!isStatic(url))return;
  const key=normalized(url);
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const hit=await cache.match(key);
    if(hit)return hit;
    try{
      const response=await fetch(request);
      if(response.ok && response.type==='basic'){
        // Only whitelisted static paths. Canonical key ignores ?v=..., no duplicates.
        await cache.put(key,response.clone());
      }
      return response;
    }catch(_){return Response.error();}
  }));
});
