const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/css/lany-mode-game-v44.css','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
assert(html.includes('lany-mode-game-v44.css'));
for(const id of ['hammer','shuffle','color','time']){
 assert(html.includes(`<button class="booster" id="b-${id}"`),id);
 assert(html.includes(`id="b-${id}-cnt" aria-hidden="true"`),id);
}
assert(css.includes('body[data-campaign="normal"]:not(.lany-at-title)'));
assert(css.includes('body[data-campaign="hard"]:not(.lany-at-title)'));
assert(css.includes('../assets/v44/mode-hard-red.webp'));
assert(fs.existsSync('web/assets/v44/mode-hard-red.webp'));
assert(sw.includes('v83-cascade-perf-r1'));
assert(sw.includes('./assets/v44/mode-hard-red.webp'));
assert(!fs.readdirSync('web/assets/v44').some(f=>f.endsWith('.svg')));
console.log('v44 game modes and booster buttons: OK');

