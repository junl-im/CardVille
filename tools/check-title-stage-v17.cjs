'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const html=read('web/index.html'),sw=read('web/sw.js'),css=read('web/css/lany-title-stage-v17.css'),js=read('web/js/lany-update-v17.js');
const cfg=JSON.parse(read('firebase.json')),version=JSON.parse(read('web/version.json')),manifest=JSON.parse(read('web/manifest.json'));
const trigger=JSON.parse(read('ops/firebase-preview-trigger.json'));
const wf=read('.github/workflows/firebase-hosting.yml');
assert.equal(version.version,'1.8.0-beta');
for(const x of ['approvedRasterTitleRestored','blackCatDistinct','previewAutoSync','noStoreVersionEndpoint','inAppVersionUpdate'])assert.equal(version[x],true,x);
assert.equal(trigger.channelId,'cardville-match3-preview');
assert.equal(trigger.version,version.version);assert.equal(trigger.neverDeployLive,true);
assert(wf.includes('      - web/**'),'Preview must deploy for game source changes');
assert(wf.includes('ops/firebase-preview-trigger.json'));
assert(wf.includes('channelId: cardville-match3-preview'));
assert(wf.includes('node tools/check-title-stage-v17.cjs'));
assert(wf.includes('version.json')&&wf.includes('expected_version'),'Preview smoke must compare published version to repo');
assert(!/channelId:\s*live\b/.test(wf),'Preview must never publish to live');
for(const source of ['/','/index.html','/version.json','/sw.js']){
 const h=cfg.hosting.headers.find(x=>x.source===source);
 assert(h&&h.headers.some(v=>v.key==='Cache-Control'&&v.value.includes('no-store')),source);
}
for(const value of ['lany-title-stage-v17.css?v=1.8.0','lany-update-v17.js?v=1.8.0','btn-play-v18.webp?v=1.8.0','lany-title-play-scene','lany-title-woodsign','id="lany-update-now"','id="lany-update-banner"','v1.8.0'])assert(html.includes(value),value);
for(const value of ['title-forest-v17.svg','.lany-title-cast','.lany-title-woodsign','.lany-title-play-scene','prefers-reduced-motion','max-height:480px','.lany-title-shortcuts'])assert(css.includes(value),value);
for(const name of ['title-forest-v17.svg','title-mascots-v17.svg']){
 const img=read('web/assets/title/'+name);
 assert(img.includes('<svg')&&img.includes('</svg>')&&img.length>2500,name);
 assert(!/<script|foreignObject/i.test(img),name);
 // Legacy SVG files remain for source provenance, but are no longer PWA-preloaded.
}
assert(sw.includes('lanypang-match-v1.8.0-ko'));
assert(sw.includes('./js/lany-update-v17.js'));
assert(sw.includes('./css/lany-title-stage-v17.css'));
assert(manifest.start_url.includes('v=1.8.0'));
for(const mark of ['cache:\'no-store\'','response.json()','version.json?_fresh=','navigator.serviceWorker','window.location.replace','LanyUpdate','pageshow'])assert(js.includes(mark),mark);
for(const mark of ['sc_unlocked','sc_best','sc_stars'])assert(html.includes(mark),'Preserve '+mark);
new vm.Script(js);
console.log(JSON.stringify({pass:true,version:version.version,previewAutoSync:true,rootNoCache:true,forestScene:true,titleCast:true,installedPwaUpgrade:true,saveKeysPreserved:true}));
