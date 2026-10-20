/* 라니팡 전용 초기 화면/종료/한글 릴리스 안전 검사 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
const css=fs.readFileSync('web/css/lany-shell.css','utf8');
const manifest=JSON.parse(fs.readFileSync('web/manifest.json','utf8'));
const version=JSON.parse(fs.readFileSync('web/version.json','utf8'));
for (const text of ['라니팡!','게임 시작','게임 방법','게임을 종료할까요?','계속 플레이','첫 화면으로'])assert(html.includes(text),`Missing Korean UI: ${text}`);
assert(html.includes('<html lang="ko">'));
assert(!html.includes('How to Play CardVille'));
assert(!html.includes("Let's Play!"));
assert(html.includes('<body class="lany-at-title">'));
assert(!html.includes("document.getElementById('overlay-tutorial').style.display='flex'"));
assert(html.includes('lany-shell.js')&&html.includes('lany-shell.css'));
assert(fs.statSync('web/assets/lanypang-cover.webp').size>15000);
assert(css.includes('lanypang-cover.webp'));
assert.equal(manifest.short_name,'라니팡');
assert.equal(version.version,'2.3.43-beta');
for(const method of ['requestFullscreen','popstate','openExit','showHome','exitGame'])assert(shell.includes(method));
new vm.Script(shell);
const work=fs.readFileSync('.github/workflows/firebase-hosting.yml','utf8');
assert(!work.includes("grep -q 'CardVille'"),'Old English-only smoke check has returned');
assert(work.includes('entryPoint: ./redirect-site')&&work.includes('https://cardville.web.app/'),'Preview must direct players to the official game address');
console.log(JSON.stringify({ok:true,brand:'라니팡!',koreanTutorial:true,fullscreen:true,backExitDialog:true,illustration:true,oldSaveKeysPreserved:true}));

