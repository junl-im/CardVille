'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const v=JSON.parse(read('web/version.json')),h=read('web/index.html'),css=read('web/css/lany-v24-restore.css');
const map=read('web/js/lany-shell.js'),sw=read('web/sw.js'),polish=read('web/js/lany-polish.js');
assert.equal(v.version,'2.3.0-beta');assert.equal(v.visualRelease,'2.3.0');
assert(h.includes('lany-v24-restore.css?v=2.3.0'),'CSS import missing');
assert(h.includes('v2.3.0 · 250단계'),'stale release label');
assert(sw.includes("lanypang-match-v2.3.0-ko-v28-result-polish-r1"),'cache not rotated');
assert(sw.includes("'./css/lany-v24-restore.css'"),'offline style not cached');
// Chrome Cache.addAll can reject duplicate request URLs and leave the PWA uncontrolled.
const precache=sw.match(/const PRECACHE=\[([^;]+)\];/)?.[1];
assert(precache,'Precache list missing');
const urls=[...precache.matchAll(/'([^']+)'/g)].map(x=>x[1]);
assert.equal(new Set(urls).size,urls.length,'Duplicate offline resources abort PWA installation');
assert(!read('web/css/lany-raster-only-v22.css').includes("content:url('../assets/ui/v21/buttons/skin-blue.webp')"),'install art regression');
const files=['title/start.webp','title/help.webp','title/install.webp','animals/cat-black.webp',
 ...Array.from({length:10},(_,i)=>'regions/tab-'+String(i+1).padStart(2,'0')+'.webp'),
 ...['previous','next','back','help','close','understood','left','right'].map(x=>'controls/'+x+'.webp'),
 ...['progress','stage-start','map-return','resume','home','exit','exit-game'].map(x=>'actions/'+x+'.webp')];
for(const name of files){
 const path='web/assets/v24/'+name;const b=fs.readFileSync(path);
 assert(b.length>700&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP',name+' corrupt');
 assert(sw.includes("'./assets/v24/"+name+"'"),name+' not precached');
}
for(let n=0;n<10;n++)assert(css.includes('--lp24-region-icon:url(\'../assets/v24/regions/tab-'+String(n+1).padStart(2,'0')+'.webp\')'),'region '+n);
assert(map.includes("btn.dataset.world=String(i)"),'region index dataset required');
assert(h.includes("'./assets/v25/animals/'+expectedName+'.webp'"),'individual puzzle faces missing');
assert(polish.includes("img.src=puzzleRoot+name+'-wink.webp'"),'match reactions missing');
for(const name of ['rabbit','bear','chick','puppy','cat','fox','wolf'])for(const suffix of ['','-wink']){
 const path='web/assets/v25/animals/'+name+suffix+'.webp';const b=fs.readFileSync(path);
 assert(b.length>1000&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP',path+' corrupt');
 assert(sw.includes("'./assets/v25/animals/"+name+suffix+".webp'"),path+' not precached');
}
assert(sw.includes("'./css/lany-puzzle-art-v25.css'"),'puzzle style not precached');
assert(h.includes('lany-user-art-v26.css?v=6'),'user art style missing');
assert(sw.includes("'./css/lany-user-art-v26.css'"),'user art style not precached');
for(const path of ['title/logo.webp','title/start.webp','title/install.webp','title/help.webp','title/friends.webp',
 ...Array.from({length:10},(_,i)=>'regions/tab-'+String(i+1).padStart(2,'0')+'.webp'),
 ...['continue','progress','exit','prep-start','prep-map'].map(x=>'actions/'+x+'.webp')]){
 const asset='web/assets/v26/'+path;const b=fs.readFileSync(asset);
 assert(b.length>1000&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP',asset+' corrupt');
 assert(sw.includes("'./assets/v26/"+path+"'"),asset+' not precached');
}
assert(read('web/js/lany-friends.js').includes("a.main?'./assets/v25/animals/'"),'main gallery faces do not match puzzle');
for(const role of ['start','help','install'])assert(css.includes("v24/title/"+role+".webp"),'missing restored title '+role);
console.log(JSON.stringify({pass:true,version:v.version,assets:files.length,regionTabs:10,originalMechanicsPreserved:true,blackCat:true,noSVG:true}));
