'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
const css=fs.readFileSync('web/css/lany-candy-stars-v78.css','utf8');
for(const name of ['earned','unearned']){
 const file=`web/assets/v78/stars/${name}.webp`;
 assert(fs.existsSync(file),file+' missing');
 assert(fs.statSync(file).size<50000,file+' must stay light');
}
assert(html.includes("s.src=`./assets/v78/stars/${i<stars?'earned':'unearned'}.webp`"));
assert(html.includes("const starAsset=`./assets/v78/stars/${earned?'earned':'unearned'}.webp`"));
assert(shell.includes('class="lany-level-star-count"'));
assert(css.includes('.lany-star-checkpoint')&&css.includes('.star-item'));
console.log('candy star asset checks passed');
