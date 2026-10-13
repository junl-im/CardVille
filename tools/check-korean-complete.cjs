/* v0.6: inventory of all 250 raw stage labels and runtime user-facing Korean strings. */
'use strict';
const fs = require('node:fs'), assert = require('node:assert/strict'), vm = require('node:vm');
const html = fs.readFileSync('web/index.html','utf8');
const multi = fs.readFileSync('web/js/multiplayer.js','utf8');
const overlay = fs.readFileSync('web/project-overlay/project.js','utf8');
const sw = fs.readFileSync('web/sw.js','utf8');
const version = JSON.parse(fs.readFileSync('web/version.json','utf8'));
const manifest = JSON.parse(fs.readFileSync('web/manifest.json','utf8'));
const data = html.match(/const LEVELS = \[([\s\S]*?)\];\s*let state/);
assert(data, 'Missing stage dataset');
const levels=vm.runInNewContext('['+data[1]+']');
assert.equal(levels.length,250);
assert.equal(new Set(levels.map(l=>l.l)).size,250);
assert.equal(levels.filter(l=>l.isBoss).length,10);
for (const lv of levels) {
  assert(lv.name.length>3&&/[가-힣]/.test(lv.name),`Level ${lv.l} Korean name missing`);
  assert(/[가-힣]/.test(lv.theme),`Level ${lv.l} Korean theme missing`);
  assert(!/[A-Za-z]/.test(lv.name+lv.theme),`Level ${lv.l} has English data`);
  assert(!('englishSourceName' in lv),`Level ${lv.l} carries legacy English name`);
}
assert.equal(new Set(levels.map(l=>l.name)).size,250);
assert.equal(new Set(levels.map(l=>l.theme)).size,10);
assert(html.includes('<html lang="ko">'));
assert(manifest.name.includes('라니팡'));
assert(version.language==='ko'&&version.version==='0.9.0-beta');
assert(!overlay.includes('lv.englishSourceName=lv.name'));
assert(!overlay.includes('lv.name=`'), 'Late DOM-level translation is no longer safe');
for(const label of ['방을 찾지 못했어요','대결 서버에 연결하지 못했어요','연결 시간이 초과됐어요','상대방의 연결이 끊어졌어요','님의 차례예요!','1번 플레이어','2번 플레이어']){
 assert(multi.includes(label),`Multiplayer Korean message missing: ${label}`);
}
for (const en of ['Connecting to PeerJS','Room ready!','Room not found','Connection timeout','Opponent disconnected',"'s turn!",'Player 1','Player 2']){
 assert(!multi.includes(en),`English user-facing text remains: ${en}`);
}
assert(sw.includes('lanypang-match-v0.9-ko'),'Service worker cache must be bumped');
const previewWorkflow=fs.readFileSync('.github/workflows/firebase-hosting.yml','utf8');
assert(!previewWorkflow.includes("grep -q 'CardVille'"),'Legacy English game-name smoke check regressed');
assert(previewWorkflow.includes("name:'사탕 골짜기 · 반짝이는 첫걸음'"),'Firebase must verify actual Korean stage data');
assert(overlay.includes('온라인 순위 기능은 서버 연동 후 제공됩니다.'));
console.log(JSON.stringify({passed:true,language:'ko',stageRecords:250,englishStageFields:0,localizedThemes:10,distinctKoreanNames:250,translatedMultiplayer:true,offlineCache:'v0.8-ko'},null,2));
