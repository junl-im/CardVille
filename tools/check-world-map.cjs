/* 라니팡 v0.8 — 월드맵·준비창·진행 보존 자동 회귀 검사 */
'use strict';
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
const css=fs.readFileSync('web/css/lany-shell.css','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
const version=JSON.parse(fs.readFileSync('web/version.json'));
const manifest=JSON.parse(fs.readFileSync('web/manifest.json'));
assert.equal(version.version,'1.5.0-beta');
assert(version.stageMap&&version.stagePreparation);
assert.equal(manifest.short_name,'라니팡');
assert(manifest.start_url.startsWith('./?v=1.5.0'),'PWA start URL must retain versioned game entry');
for(const s of ['lany-world-map','lany-world-tabs','lany-map-levels','lany-map-resume','lany-stage-prep','lany-prep-goal','lany-prep-moves','lany-prep-play','이 단계 시작','지도 돌아가기','250단계'])assert(html.includes(s),`Missing map/prep UI: ${s}`);
for(const s of ['function openMap','function openPrep','function playPrepared','function renderMap','function continueStage','function resumeGameFromMap','const worlds=[','aria-pressed','btn.disabled=!enabled','state.unlockedLevels','state.levelStars','state.bestScores','state.boosters','const n=nav.selectedLevel'])assert(shell.includes(s),`Missing map logic: ${s}`);
assert(shell.includes('window.initGame(n)')&&!shell.includes('window.initGame();'),'No board creation before stage confirmation');
assert(html.includes('LanyShell.openPrep(state.level+1)'),'Winning must show preparation first');
assert(/function showLevelSelect\(\)\{[\s\S]{0,250}LanyShell.openMap\(\)/.test(html),'Legacy map entry must route to unified map');
assert(shell.includes("nav.screen==='prep'")&&shell.includes("nav.screen==='map'"),'Back key must manage prepare/map screen');
assert(css.includes("url('../assets/lanypang-cover.webp')"),'Title/map art CSS relative asset path');
assert(sw.includes('lanypang-match-v1.5.0-ko'),'Release cache version not bumped');
assert(!html.includes('How to Play CardVille'));
for(const path of ['web/js/lany-shell.js','web/css/lany-shell.css','web/assets/lanypang-cover.webp'])assert(fs.existsSync(path));
new vm.Script(shell);
const code=html.match(/const LEVELS = \[([\s\S]*?)\];\s*let state/);
assert(code);const stages=vm.runInNewContext('['+code[1]+']');
assert.equal(stages.length,250);
assert.equal(stages.filter(x=>x.isBoss).length,10);
assert.equal(new Set(stages.map(x=>x.theme)).size,10);
assert(stages.every(x=>!/[A-Za-z]/.test(x.name+x.theme)));
for(const file of ['.github/workflows/firebase-hosting.yml','.github/workflows/pages.yml']){
 const workflow=fs.readFileSync(file,'utf8');assert(workflow.includes('node tools/check-world-map.cjs'),`${file} missing map test`);
}
console.log(JSON.stringify({pass:true,version:version.version,regions:10,stages:250,startingFlow:'타이틀→월드맵→단계 준비→게임',progressKeysPreserved:true,lockedStagesProtected:true,koreanOnlyGameLabels:true},null,2));
