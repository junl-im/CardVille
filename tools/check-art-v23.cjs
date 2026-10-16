'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('web/index.html'),css=read('web/css/lany-art-v23.css'),sw=read('web/sw.js'),shell=read('web/js/lany-shell.js');
const names=['buttons/back.webp','buttons/help.webp','buttons/close.webp','buttons/prev.webp','buttons/next.webp','buttons/settings.webp','buttons/music.webp','regions/world-01.webp','regions/world-03.webp','regions/world-05.webp','decor/region-header.webp','decor/daily-ornament.webp','decor/vs-ornament.webp','decor/invite-ornament.webp','decor/install-ornament.webp','decor/friends-ornament.webp','decor/editor-ornament.webp'];
assert(html.includes('lany-art-v23.css?v=2.3.0'),'load the stylesheet');
assert(html.indexOf('lany-art-v23.css')>html.indexOf('lany-raster-only-v22.css'),'v23 follows v22');
assert(sw.includes('lanypang-match-v2.3.0-ko-v32-popup-compact-r1'),'rotate cache');
assert(sw.includes("'./css/lany-art-v23.css'"),'cache stylesheet');
assert(!css.includes('.svg')&&!css.includes('<svg'),'no vector art');
for(const name of names){
 const p='web/assets/v23/'+name,b=fs.readFileSync(path.join(root,p));
 assert(b.length>1000,p+' too small');
 assert.equal(b.toString('ascii',0,4),'RIFF',p+' invalid RIFF');
 assert.equal(b.toString('ascii',8,12),'WEBP',p+' invalid WebP');
 assert(sw.includes("'./assets/v23/"+name+"'"),'offline asset '+name);
}
for(const [i,art] of [['0','world-01'],['2','world-03'],['4','world-05']]){
 assert(css.includes('data-world="'+i+'"')&&css.includes('regions/'+art+'.webp'),art+' missing');
}
const atlas='web/assets/v23/regions/world-atlas.webp',bytes=fs.readFileSync(path.join(root,atlas));
assert(bytes.length>60000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP','10-map atlas incomplete');
assert(sw.includes("'./assets/v23/regions/world-atlas.webp'"),'offline atlas');
for(let i=0;i<10;i++)assert(css.includes('data-world="'+i+'"]'),'Map artwork missing: '+i);
assert(css.includes('world-map.webp'),'fallback preserved');
assert(css.includes('region-header.webp'),'approved text-free header');
for(const name of ['back','help','close','prev','next'])assert(css.includes('buttons/'+name+'.webp'),'Missing individual icon '+name);
for(const art of ['daily-ornament','vs-ornament','invite-ornament','editor-ornament','install-ornament','friends-ornament'])assert(css.includes(art+'.webp'),'missing '+art);
for(const n of ['사탕 골짜기','막대사탕 숲','젤리 바다','초콜릿 산맥','무지개 하늘','설탕 성','말랑별 은하','캐러멜 협곡','토피 설원','수정 동굴'])assert(shell.includes(n),'original world name lost');
console.log(JSON.stringify({pass:true,art:'v23',webp:names.length,independentWorlds:10,decorativeFeatures:6,worldNamesUnchanged:true,svg:false,offline:true}));
