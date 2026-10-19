const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/css/lany-mode-world-v43.css','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
assert(html.includes('lany-mode-world-v43.css'));
for(const name of ['normal-forest','hard-village','retry','stage-map']){
 const file=`web/assets/v43/${name}.webp`;
 assert(fs.existsSync(file),file);
 assert(fs.statSync(file).size>1000,file);
 assert(sw.includes(`./assets/v43/${name}.webp`),`offline ${name}`);
 assert(css.includes(`../assets/v43/${name}.webp`),`style ${name}`);
}
assert(css.includes('#overlay-win .modal-btns button:first-child'));
assert(css.includes('#overlay-lose .modal-btns button:first-child'));
assert(shell.includes('mapFriends={normal:')&&shell.includes('crazy:')); 
assert(sw.includes('v90-special-timing-r1'));
assert(!fs.readdirSync('web/assets/v43').some(name=>name.endsWith('.svg')));
console.log('v43 worlds and popup actions: OK');


