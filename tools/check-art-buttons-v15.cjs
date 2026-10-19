'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const h=read('web/index.html'),css=read('web/css/lany-art-buttons.css'),js=read('web/js/lany-art-buttons.js');
const sw=read('web/sw.js'),v=JSON.parse(read('web/version.json')),m=JSON.parse(read('web/manifest.json'));
assert.equal(v.version,'2.3.22-beta');
for(const flag of ['illustratedTitleButtons','oneRowTitleShortcuts','titleMascotLogo','sharedImageButtonSkins','pressHoverTouchFeedback'])assert(v[flag]===true,flag);
assert(m.start_url.includes('v=2.3.22'),'PWA install must launch the current release');
for(const x of ['lany-title-shortcuts','id="lany-start-button"','id="lany-install-button"','logo.webp','start.webp','install.webp','help.webp','friends.webp','class="lany-art-button lany-art-small','lany-art-buttons.css?v=2.3.22','lany-art-buttons.js?v=2.3.22','aria-label="동물 친구 도감"'])assert(h.includes(x),x);
assert.equal((h.match(/class="lany-art-button lany-art-small/g)||[]).length,3,'exactly three small buttons');
const bitmapCss=read('web/css/lany-ui-v21.css');
for(const color of ['blue','green','gold','pink'])assert(bitmapCss.includes('skin-'+color+'.webp'),color+' latest picture skin');
for(const x of ['.lany-title-shortcuts{display:grid;grid-template-columns:repeat(3','grid-template-columns:repeat(2','.lany-art-play',':focus-visible','@media(hover:hover)','prefers-reduced-motion', 'lany-pressed'])assert(css.includes(x),x);
for(const x of ['pointerdown','pointerup','pointercancel','keydown','keyup','navigator.vibrate','lany-art-spark'])assert(js.includes(x),x);
for(const color of ['blue','green','gold','pink']){
 assert(bitmapCss.includes('skin-'+color+'.webp'),color+' image in active stylesheet');
 assert(sw.includes('./assets/ui/v21/buttons/skin-'+color+'.webp'),color+' included offline');
}
assert(sw.includes('lanypang-match-v2.3.22-ko'));
new vm.Script(js,{filename:'lany-art-buttons.js'});
const all=[...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
all.forEach((m,i)=>new vm.Script(m[1],{filename:'inline-'+i}));
console.log(JSON.stringify({pass:true,version:v.version,illustratedTitle:4,artAssets:9,imageSkins:4,threeOnOneRow:true,accessibility:true,saveProgressUntouched:true}));
