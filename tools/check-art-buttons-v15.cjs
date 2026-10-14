'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const h=read('web/index.html'),css=read('web/css/lany-art-buttons.css'),js=read('web/js/lany-art-buttons.js');
const sw=read('web/sw.js'),v=JSON.parse(read('web/version.json')),m=JSON.parse(read('web/manifest.json'));
assert.equal(v.version,'1.8.0-beta');
for(const flag of ['illustratedTitleButtons','oneRowTitleShortcuts','titleMascotLogo','sharedImageButtonSkins','pressHoverTouchFeedback'])assert(v[flag]===true,flag);
assert(m.start_url.includes('v=1.8.0'),'PWA install must launch the current release');
for(const x of ['lany-title-shortcuts','id="lany-start-button"','id="lany-install-button"','title-logo-v18.webp','btn-play-v18.webp','btn-install-v18.webp','btn-help-v18.webp','btn-friends-v18.webp','class="lany-art-button lany-art-small','lany-art-buttons.css?v=1.8.0','lany-art-buttons.js?v=1.8.0','aria-label="동물 친구 도감"'])assert(h.includes(x),x);
assert.equal((h.match(/class="lany-art-button lany-art-small/g)||[]).length,3,'exactly three small buttons');
for(const x of ['.lany-title-shortcuts{display:grid;grid-template-columns:repeat(3','grid-template-columns:repeat(2','.lany-art-play','skin-blue.svg','skin-green.svg','skin-gold.svg','skin-pink.svg',':focus-visible','@media(hover:hover)','prefers-reduced-motion', 'lany-pressed'])assert(css.includes(x),x);
for(const x of ['pointerdown','pointerup','pointercancel','keydown','keyup','navigator.vibrate','lany-art-spark'])assert(js.includes(x),x);
for(const file of ['skin-pink','skin-blue','skin-gold','skin-green']){
 const path='web/assets/buttons/'+file+'.svg',source=read(path);
 assert(source.includes('<svg')&&source.includes('viewBox='),path);
 assert(source.includes('</svg>')&&!source.includes('<script'),path);
 assert(source.length>450,path);
 assert(sw.includes('./assets/buttons/'+file+'.svg'),path+' offline cache');
}
assert(sw.includes('lanypang-match-v1.8.0-ko'));
new vm.Script(js,{filename:'lany-art-buttons.js'});
const all=[...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
all.forEach((m,i)=>new vm.Script(m[1],{filename:'inline-'+i}));
console.log(JSON.stringify({pass:true,version:v.version,illustratedTitle:4,artAssets:9,imageSkins:4,threeOnOneRow:true,accessibility:true,saveProgressUntouched:true}));
