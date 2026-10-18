'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const project=fs.readFileSync('web/project-overlay/project.js','utf8');
const resultCss=fs.readFileSync('web/css/lany-results-recovery-v70.css','utf8');
assert(fs.existsSync('web/assets/v70/selected-mode-pin.webp'),'selected mode raster asset required');
const source=html.slice(html.indexOf('const HARD_LEVELS='),html.indexOf('function activeLevels()'));
const levels=vm.runInNewContext('['+html.match(/const LEVELS = \[([\s\S]*?)\];/)[1]+']');
const modes=vm.runInNewContext(source+';({hard:HARD_LEVELS,crazy:CRAZY_LEVELS})',{LEVELS:levels});
assert.equal(modes.hard.length,250);assert.equal(modes.crazy.length,250);
for(let i=0;i<25;i++){
 assert(modes.hard[i].goal>=3600&&modes.hard[i].clearGoal>=29,'hard early objective');
 assert(modes.crazy[i].goal>=3600&&modes.crazy[i].clearGoal>=25,'crazy early objective');
 assert(modes.crazy[i].moves<modes.hard[i].moves,'crazy has fewer moves');
}
assert(modes.hard[25].goal>=modes.hard[24].goal,'hard world boundary must not get easier');
assert(modes.crazy[25].goal>=modes.crazy[24].goal,'crazy world boundary must not get easier');
assert(project.includes("board.addEventListener('lostpointercapture', cleanup)"),'lost pointer capture must release drag');
assert(project.includes("window.addEventListener('pointercancel', cleanup)"),'cancelled pointer must release drag');
assert(/async function trySwap\([\s\S]*?finally\{[\s\S]*?state\.animating=false/.test(html),'swap must always clear input lock');
assert(/async function finishBoosterTurn\([\s\S]*?finally\{[\s\S]*?state\.animating=false/.test(html),'booster must always clear input lock');
assert(html.includes('function placeGuaranteedMove('),'a dead board needs a playable fallback');
assert(html.includes('placeGuaranteedMove(true,true,true)'),'fully blocked boards need an emergency playable lane');
assert(html.includes('if(state.movesLeft>0&&!hasLegalSwap())shuffleBoard()'),'post-match dead boards must reshuffle before the next input');
assert(resultCss.includes('selected-mode-pin.webp')&&resultCss.includes('[aria-pressed="true"]::after'),'selected mode needs its illustrated marker');
assert(html.includes('id="win-detail"')&&html.includes('id="lose-detail"'),'result objective summary required');
assert(resultCss.includes('aspect-ratio:auto'),'result panel must grow to fit summary');
console.log('v70 input recovery, balance, and result checks passed');
