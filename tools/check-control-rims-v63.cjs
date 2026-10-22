'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const html=read('web/index.html'),js=read('web/js/lany-illustrated-buttons-v61.js');
const css=read('web/css/lany-control-rims-v63.css'),sw=read('web/sw.js');
assert(html.includes('lany-control-rims-v63.css?v=2.3.53'));
for(const id of ['lany-world-prev','lany-world-next','lany-map-prev','lany-map-next','lany-prep-prev','lany-prep-next','lany-help-prev','lany-help-next','lany-friends-prev','lany-friends-next','lany-editor-prev','lany-editor-next'])assert(js.includes(`'${id}':'v23/buttons/`),id);
for(const asset of ['back','next','close','music']){const p=`web/assets/v23/buttons/${asset}.webp`,x=fs.readFileSync(p);assert(x.length>1000&&x.toString('ascii',0,4)==='RIFF',p);assert(sw.includes(`'./assets/v23/buttons/${asset}.webp'`),p+' offline')}
assert(css.includes('background-size:contain!important'));
assert(css.includes('position:relative!important'));
assert(sw.includes("'./css/lany-control-rims-v63.css'"));
assert(!js.includes("'lany-map-next':'v24/controls/next.webp'"));
console.log('v63 complete raster controls: PASS');
