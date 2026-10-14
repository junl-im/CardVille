/* Regression gate for role-specific image illustrations in actual gameplay screens. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const html=read('web/index.html'),css=read('web/css/lany-action-art-v16.css');
const manifest=JSON.parse(read('web/manifest.json')),version=JSON.parse(read('web/version.json')),sw=read('web/sw.js');
const actionNames=['play','map','resume','retry','next','home','help','pause','exit','back','friends','close'];
assert.equal(version.version,'1.8.0-beta');
assert.equal(version.illustratedActionBadges,12);
assert.equal(version.illustratedGameplayButtons,26);
assert(version.actionSpecificButtonArt===true);
assert(manifest.start_url.includes('v=1.8.0'));
assert.equal((html.match(/data-lany-art="/g)||[]).length,26);
assert(html.includes('lany-action-art-v16.css?v=1.8.0'));
for(const state of ['ordinary','current','boss','locked']){
 const path='web/assets/buttons/stage-'+state+'.svg',image=read(path);
 assert(image.includes('<svg')&&image.includes('</svg>'),path);
 assert(sw.includes('./assets/buttons/stage-'+state+'.svg'),path+' offline cache');
 assert(css.includes('stage-'+state+'.svg'),path+' applied in CSS');
}
assert(sw.includes('lanypang-match-v1.8.0-ko')&&sw.includes('./css/lany-action-art-v16.css'));
for(const key of actionNames){
 const path='web/assets/buttons/action-'+key+'.svg';
 const image=read(path);
 assert(image.includes('<svg')&&image.includes('</svg>'),path);
 assert(image.length>400,path);
 assert(!image.includes('<script')&&!image.includes('<foreignObject'),path);
 assert(sw.includes('./assets/buttons/action-'+key+'.svg'),path);
 assert(css.includes('[data-lany-art="'+key+'"]'),key+' CSS binding');
}
for(const phrase of ['[data-lany-art]::before','pointer:fine',':focus-visible','prefers-reduced-motion','#overlay-win .modal-btns','#overlay-lose .modal-btns','.lany-game-nav button[data-lany-art]'])assert(css.includes(phrase),phrase);
for(const required of ['data-lany-art="next"','data-lany-art="retry"','data-lany-art="play"','data-lany-art="pause"','data-lany-art="exit"','data-lany-art="home"'])assert(html.includes(required),required);
assert(html.includes('onclick="nextLevel()"')&&html.includes('onclick="replayLevel()"')&&html.includes('onclick="LanyShell.resume()"'));
console.log(JSON.stringify({pass:true,version:version.version,roleAssets:actionNames.length,markedGameButtons:26,legacyHandlersPreserved:true,offlineCached:true}));
