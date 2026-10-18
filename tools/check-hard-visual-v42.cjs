'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
const css=fs.readFileSync('web/css/lany-hard-v42.css','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
assert(html.includes('lany-hard-v42.css'));
assert(shell.includes("state.mode==='hard'?'🔥 라니팡 하드 맵'"));
assert(shell.includes('불꽃 하드 도전 시작!'));
assert(css.includes('body[data-campaign="hard"] #lany-world-map .lany-map-levels'));
assert(css.includes('#board .cell.lany-wall::before'));
assert(css.includes('.lany-go-intro .lany-go-mascots'));
for(const name of ['hard-map','brick-wall','mode-normal','mode-hard']){
 const file=`web/assets/v42/${name}.webp`;
 assert(fs.existsSync(file),`Missing raster asset: ${file}`);
 assert(fs.statSync(file).size>1000,`Empty raster asset: ${file}`);
 assert(sw.includes(`./assets/v42/${name}.webp`),`Offline cache missing: ${name}`);
 assert(css.includes(`../assets/v42/${name}.webp`),`Visual style missing: ${name}`);
}
assert(!fs.readdirSync('web/assets/v42').some(name=>name.endsWith('.svg')));
assert(sw.includes('v63-control-rims-r1'));
console.log(JSON.stringify({pass:true,modeArt:2,wall:'WebP',hardMap:'WebP',svg:0}));

