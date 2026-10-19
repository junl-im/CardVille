/* Regression gate for role-specific image illustrations in actual gameplay screens. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const html=read('web/index.html'),css=read('web/css/lany-action-art-v16.css');
const manifest=JSON.parse(read('web/manifest.json')),version=JSON.parse(read('web/version.json')),sw=read('web/sw.js');
const actionNames=['play','map','resume','retry','next','home','help','pause','exit','back','friends','close'];
assert.equal(version.version,'2.3.21-beta');
assert.equal(version.illustratedActionBadges,12);
assert.equal(version.illustratedGameplayButtons,25);
assert(version.actionSpecificButtonArt===true);
assert(manifest.start_url.includes('v=2.3.21'));
assert.equal((html.match(/data-lany-art="/g)||[]).length,28);
assert(html.includes('lany-action-art-v16.css?v=2.3.21'));
for(const state of ['ordinary','current','boss','locked']){
 const path='./assets/map/stage-'+state+'-v20.webp';
 assert(sw.includes(path),path+' offline cache');
 assert(css.includes('stage-'+state+'-v20.webp'),path+' in map skin');
}
assert(sw.includes('lanypang-match-v2.3.21-ko')&&sw.includes('./css/lany-action-art-v16.css'));
for(const key of actionNames){
 const path='./assets/ui/v21/buttons/action-'+key+'.webp';
 assert(sw.includes(path),path+' offline cache');
 assert(css.includes('[data-lany-art="'+key+'"]'),key+' CSS binding');
 assert(css.includes('action-'+key+'.webp'),key+' specific raster picture');
}
for(const phrase of ['[data-lany-art]::before','pointer:fine',':focus-visible','prefers-reduced-motion','#overlay-win .modal-btns','#overlay-lose .modal-btns','.lany-game-nav button[data-lany-art]'])assert(css.includes(phrase),phrase);
for(const required of ['data-lany-art="next"','data-lany-art="retry"','data-lany-art="play"','data-lany-art="pause"','data-lany-art="exit"','data-lany-art="home"'])assert(html.includes(required),required);
assert(html.includes('onclick="nextLevel()"')&&html.includes('onclick="replayLevel()"')&&html.includes('onclick="LanyShell.resume()"'));
console.log(JSON.stringify({pass:true,version:version.version,roleAssets:actionNames.length,markedGameButtons:25,legacyHandlersPreserved:true,offlineCached:true}));
