'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const html=read('web/index.html');
const drag=read('web/project-overlay/project.js');
const css=read('web/css/lany-raster-only-v22.css');
const shell=read('web/js/lany-shell.js');
const tempo=read('web/js/lany-tempo.js');
const sw=read('web/sw.js');
const version=JSON.parse(read('web/version.json'));
assert.equal(version.version,'2.3.37-beta');
assert.equal(version.goCountdownInputV71,true);
assert(sw.includes('v91-save-resume-r1'),'service worker cache must rotate');
assert(/\.lany-go-intro\{[^}]*pointer-events:auto/.test(css),'countdown must intercept touches');
assert(html.includes("function gameCountdownActive(){return document.getElementById('lany-go-intro')?.hidden===false}"));
assert(html.includes('function gameInputReady()')&&html.slice(html.indexOf('function gameInputReady()'),html.indexOf('function onCellClick(')).includes('!gameCountdownActive()'),'shared input gate must block countdown');
for(const name of ['onCellClick','cvKeyboardSelect','trySwap','activateBooster','applyBooster']){
 const start=html.indexOf('function '+name+'(');
 assert(start>=0&&html.slice(start,start+360).includes('!gameInputReady()'),name+' must ignore countdown input');
}
assert(drag.includes('!window.gameInputReady?.()'),'drag must ignore countdown input');
assert(shell.includes('window.LanyTempo?.pause()')&&shell.includes('window.LanyTempo?.resume()'),'countdown must pause and resume the clock');
assert(tempo.includes('isRunning:()=>active&&!paused'),'clock running state required');
console.log('v71 countdown input lock and timer checks passed');
