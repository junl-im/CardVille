/* CI gate — Node.js only, no dependencies. */
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('web/index.html');
const block=html.match(/const LEVELS = \[([\s\S]*?)\];\s*let state/);
assert(block,'Expected 250-level data in game engine');
const LEVELS=vm.runInNewContext('['+block[1]+']');
assert.equal(LEVELS.length,250);
assert.equal(new Set(LEVELS.map(x=>x.l)).size,250);
assert.equal(LEVELS.filter(x=>x.isBoss).length,10);
for (const [i,level] of LEVELS.entries()) {
  assert.equal(level.l,i+1);
  assert(Number.isFinite(level.goal)&&level.goal>0,'Invalid level goal');
  assert(Number.isInteger(level.moves)&&level.moves>0&&level.moves<=100);
  assert(Number.isInteger(level.colors)&&level.colors>=3&&level.colors<=7);
  assert(Number.isInteger(level.lockedCount)&&level.lockedCount>=0&&level.lockedCount<=64);
}
const balance=require('../web/js/cardville-balance.js');
const orig=LEVELS.map(x=>x.goal);
const result=balance.apply(LEVELS);
assert.equal(result.length,250);
assert.equal(LEVELS[249].goal,3150);
assert.equal(LEVELS[249].originalGoal,297750);
assert.equal(LEVELS[0].goal,400);
assert(LEVELS.every((l,i)=>l.goal<=orig[i]&&l.goal>0));
assert(result.filter(x=>x.changed).length>100);
assert.equal(balance.apply(LEVELS)[249].current,3150,'Idempotent tuning expected');
// Verify source-level HTML script parsing (fast smoke; browser tests separate).
const embedded=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
for(const [index,match] of embedded.entries())new vm.Script(match[1],{filename:`embedded-${index}.js`});
for(const p of [
 'web/js/cardville-balance.js','web/js/a11y.js','web/js/daily-challenge.js',
 'web/js/difficulty.js','web/js/leaderboard.js','web/js/level-editor.js',
 'web/js/multiplayer.js','web/project-overlay/project.js','web/sw.js']) {
 new vm.Script(read(p),{filename:p});
}
assert(html.includes('cardville-balance.js'));
assert(html.includes('<html lang="ko">'));
assert(html.includes('function cvKeyboardSelect(r,c)'));
assert(!/function onCellClick\(r,c\)\s*\{[^}]*state\.selected\s*=/.test(html),'No click-click swapping');
assert(read('web/project-overlay/project.js').includes('board.setPointerCapture'),'Pointer capture needed');
assert(read('web/project-overlay/project.js').includes("addEventListener('contextmenu'"),'No right click menu');
assert(!html.includes("div.addEventListener('touchstart'"),'Avoid duplicate touch event handling');
assert(read('web/js/a11y.js').includes('.cell[data-r='),'A11y must select the actual game cells');
assert(read('web/js/leaderboard.js').includes('player.textContent'),'HTML name injection regression');
assert(read('web/sw.js').includes("url.origin!==self.location.origin"),'SW must avoid cross-origin caching');
const manifest=JSON.parse(read('web/manifest.json'));
assert(manifest.name.includes('카드빌'));
assert.equal(fs.existsSync(path.join(root,'web/LICENSE')),true);
assert.equal(fs.existsSync(path.join(root,'firebase.json')),true);
assert.equal(JSON.parse(read('.firebaserc')).projects.default,'cardville');
const firebaseWorkflow=read('.github/workflows/firebase-hosting.yml');
assert(firebaseWorkflow.includes('projectId: cardville'));
assert(firebaseWorkflow.includes('channelId: cardville-match3-preview'));
assert(!/channelId:\s*live\b/.test(firebaseWorkflow), 'Firebase must NOT overwrite existing live site');
assert(firebaseWorkflow.includes('secrets.FIREBASE_SERVICE_ACCOUNT_CARDVILLE'));
assert.equal(JSON.parse(read('firebase.json')).hosting.public,'web');
console.log(JSON.stringify({ok:true,stages:250,bosses:10,goal250:3150,adjusted:result.filter(x=>x.changed).length,inlineScripts:embedded.length,tests:['scripts','levels','balance','input','a11y','leaderboard','service-worker','license']},null,2));
