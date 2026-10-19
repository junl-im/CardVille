const fs=require('node:fs');
const assert=require('node:assert/strict');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
const css=fs.readFileSync('web/css/lany-map-connect-v45.css','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
assert(html.includes('lany-map-connect-v45.css'));
assert(sw.includes('v85-keyboard-focus-r1'));
assert(sw.includes('./css/lany-map-connect-v45.css'));
assert(shell.includes('const stage=savedStage();nav.world=Math.floor((stage-1)/25)'));
assert(shell.includes('tabs.querySelector(`[data-world="${i}"]`)?.focus()'));
assert(fs.statSync('web/assets/v23/regions/world-atlas.webp').size>60000);
for(let n=0;n<10;n++)assert(css.includes(`.lany-map-levels[data-world="${n}"]`),`region ${n}`);
assert(css.includes('body[data-campaign="hard"]'));
console.log('v45 map progress and regional art: OK');

