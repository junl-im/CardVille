'use strict';
const fs=require('node:fs'), assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),h=read('web/index.html');
const v=JSON.parse(read('web/version.json')),m=JSON.parse(read('web/manifest.json')),sw=read('web/sw.js');
const diag=read('web/js/lany-perf-v19.js'),css=read('web/css/lany-result-v19.css'),polish=read('web/js/lany-polish.js');
assert.equal(v.version,'2.3.51-beta');assert.equal(v.visualRelease,'2.3.51');
for(const k of ['titleRAFOffDuringGame','tapExpressionImagesCapped','animalExpressionRestored','localFpsDiagnostics','longPlayMoveQA','rasterResultOverlay'])assert.equal(v[k],true,k);
assert(m.start_url.includes('v=2.3.51'),'PWA manifest');
assert(sw.includes('lanypang-match-v2.3.51-ko'));
for(const p of ['web/js/lany-perf-v19.js','web/css/lany-result-v19.css','web/css/lany-raster-v18.css']){
 assert(sw.includes('./'+p.slice(4)),p+' offline SW');
 assert(fs.existsSync(p),p);
 assert(h.includes('./'+p.slice(4)+'?v=2.3.51'),p+' HTML');
}
assert(h.includes('function syncTitleParticles()'), 'title particles lifecycle');
assert(h.includes('const LANY_MAX_AUDIO_VOICES=24')&&h.includes('osc.onended=')&&h.includes('osc.disconnect();gain.disconnect();'),'Audio voice cap and node release');
assert(h.includes('cancelAnimationFrame(lanyTitleParticleFrame)'), 'rAF cancel');
assert(h.includes("titleVisibilityObserver.observe(document.body"),'title enter/leave');
assert(h.includes("face.getAttribute('src')!==assetPath"),'restore expression sprite');
assert(polish.includes("puzzleFaces.forEach(name=>{const image=new Image()"),'preload bounded expression set');
assert(polish.includes("face(el,'wink')"),'match expression');
assert(!polish.includes("face(tile,'wink')"),'no costly image switch on touch down');
assert(diag.includes("get('perf')!=='1'"),'opt-in only');
assert(diag.includes('longtask')&&diag.includes('performance.memory')&&diag.includes('cancelAnimationFrame(raf)'),'diagnostic data');
assert(!diag.includes('localStorage.')&&!diag.includes('sendBeacon')&&!diag.includes('fetch('),'local-only privacy');
assert(css.includes('cat-cheer.webp')&&css.includes('chick-wink.webp')&&css.includes('rabbit-cheer.webp'),'WebP heroes');
assert(css.includes('prefers-reduced-motion'),'respect motion settings');
new vm.Script(diag,{filename:'lany-perf-v19.js'});
console.log(JSON.stringify({pass:true,version:v.version,rAFOnlyOnTitle:true,diagnosticsOptIn:true,expressionFix:true,actualGameArtwork:true,offlineFiles:true}));
