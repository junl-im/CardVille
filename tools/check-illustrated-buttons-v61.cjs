'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const js=fs.readFileSync('web/js/lany-illustrated-buttons-v61.js','utf8');
const css=fs.readFileSync('web/css/lany-illustrated-buttons-v61.css','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
assert(html.includes('lany-illustrated-buttons-v61.css')&&html.includes('lany-illustrated-buttons-v61.js'));
assert(!html.includes('lany-button-art-v60.css'),'obsolete flat frames must not load');
assert(js.includes("document.querySelectorAll('button')")&&js.includes('MutationObserver'),'dynamic dialog buttons must be illustrated');
assert(js.includes("document.body.dataset.campaign === 'hard'")&&js.includes("document.body.dataset.campaign === 'crazy'"),'primary art must follow the mode');
assert(css.includes('.cv-illustrated-label'),'labels must remain live text');
for(const name of ['green-rabbit','blue-map','pink-bear','gold-book','purple-cat','hard-bear','crazy-cat']){
 const asset=`./assets/v61/buttons/${name}.webp`;
 const data=fs.readFileSync(`web/assets/v61/buttons/${name}.webp`);
 assert(data.length>50000&&data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP',`${name} image missing or corrupt`);
 assert(js.includes(`v61/buttons/${name}.webp`)&&sw.includes(asset),`${name} must render and be available offline`);
}
for(const name of ['start','install','help','friends']) assert(html.includes(`./assets/v26/title/${name}.webp`),`original title ${name} drawing missing`);
console.log('Illustrated buttons v61: PASS (7 complete WebP assets, dynamic buttons, title art, mode art, offline cache)');
