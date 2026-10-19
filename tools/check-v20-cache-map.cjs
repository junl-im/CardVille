'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const sw=read('web/sw.js'),html=read('web/index.html'),worlds=read('web/css/lany-worlds-v20.css');
const timer=read('web/js/lany-tempo.js'),builder=read('tools/build-visual-v18.py');
const manifest=JSON.parse(read('web/manifest.json')),v=JSON.parse(read('web/version.json'));
const mainAssets=['ordinary','current','boss','locked'].map(x=>'stage-'+x+'-v20.webp');
assert.equal(v.version,'2.3.33-beta');
for(const key of ['canonicalPwaCache','versionProbesNotCached','allAnimalArtOffline','mobileNoTileFilters','clockRunsOnlyDuringGameplay'])assert.equal(v[key],true,key);
assert.equal(v.rasterMapMedallions,4);assert.equal(v.worldTintThemes,10);
assert(manifest.start_url.includes('v=2.3.33'));
assert(html.includes('lany-worlds-v20.css?v=2.3.33'));
assert(sw.includes('lanypang-match-v2.3.33-ko'));
for(const src of ['PRECACHE=','staticURLs=new Set(','!isStatic(url)','const key=normalized(url)','cache.match(key)','cache.put(key,response.clone())','if(request.mode===\'navigate\')','fetch(request).catch(safeFallback)'])assert(sw.includes(src),src);
assert(!sw.includes('cache.put(e.request,copy)'));
assert(!sw.includes("caches.match(e.request,{ignoreSearch:true})"));
assert(!sw.includes("'./version.json'"),'version metadata should never be cached');
assert(sw.includes("'./css/lany-raster-v18.css'"),'previous missing CSS must stay cached');
assert(sw.includes("'./css/lany-worlds-v20.css'"));
for(const name of mainAssets){
 const loc='./assets/map/'+name;
 assert(sw.includes("'"+loc+"'"),loc+' offline');
 assert(worlds.includes(name),name+' visible in CSS');
 assert(builder.includes("stage-{name}-v20.webp"),'raster builder creates stage medallions');
}
for(let i=0;i<10;i++)assert(worlds.includes('[data-world="'+i+'"]'),i+' world art tint');
for(const image of ['rabbit-cheer.webp','bear-cheer.webp','cat-cheer.webp','chick-wink.webp'])assert(sw.includes(image),image);
const friends=fs.readdirSync('web/assets/friends').filter(x=>x.endsWith('.webp'));
assert.equal(friends.length,30);
for(const name of friends)assert(sw.includes("'./assets/friends/"+name+"'"),name+' gallery offline');
assert(timer.includes('let ticker=null'));
assert(timer.includes('clearInterval(ticker)'));
assert(!timer.includes('setInterval(update,200)'));
assert(timer.includes('ticker=setInterval(update,250)'));
new vm.Script(sw);
if(process.argv.includes('--raster')){
 for(const name of mainAssets){
  const file='web/assets/map/'+name,raw=fs.readFileSync(file);
  assert(raw.subarray(0,4).toString()==='RIFF');
  assert(raw.subarray(8,12).toString()==='WEBP');
  assert(raw.length>700,file);
 }
}
console.log(JSON.stringify({pass:true,version:v.version,offlinePortraits:friends.length,worlds:10,medallions:4,staticCacheCanonical:true,noDynamicCacheGrowth:true,clockPauses:true,raster:process.argv.includes('--raster')}));
