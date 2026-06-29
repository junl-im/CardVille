import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
const back = read('src/game/systems/BackButtonSystem.ts');
for (const token of [
  'CARDVILLE_EXIT_FLOW_TAG',
  'exit-no-freeze-v150',
  'showExitBlockedRecovery',
  'data-cardville-exit-blocked-v150',
  'stopSceneFallback',
  'window.clearTimeout',
  'exitRequested = false',
  "'EnglishSchoolScene'",
  "'DailyMissionScene'",
  "'나가기 시도'",
  "'브라우저가 닫기를 막았어요'"
]) {
  if (!back.includes(token)) throw new Error(`BackButtonSystem missing no-freeze token: ${token}`);
}
if (back.includes('this.launchSceneFallback();\n  }\n\n  private static closeOverlay')) throw new Error('DOM back overlay should not leave fallback scene stacked under it');
const confirm = read('src/game/scenes/BackConfirmScene.ts');
for (const token of ['BackButtonSystem.requestExit()', '나가기 시도 중', '자동 복구']) {
  if (!confirm.includes(token)) throw new Error(`BackConfirmScene missing safe-exit token: ${token}`);
}
for (const forbidden of ['window.history.back();\n        else window.location.href', '나가는 중...']) {
  if (confirm.includes(forbidden)) throw new Error(`BackConfirmScene still has old freeze-prone exit path: ${forbidden}`);
}
const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '나가기 버튼 멈춤 복구', 'check:exit-flow']) {
  if (!readme.includes(token)) throw new Error(`README missing exit-flow note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.50 나가기/마을 비주얼 긴급 복구 패스', 'exit-no-freeze-v150']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing exit-flow note: ${token}`);
}
if (pkg.scripts?.['check:exit-flow'] !== 'node tools/check-exit-flow.mjs') throw new Error('check:exit-flow script mismatch');
if (!pkg.scripts?.verify?.includes('check:exit-flow')) throw new Error('verify must include check:exit-flow');
console.log(`Exit flow check passed. Version ${pkg.version}, blocked browser close recovers without leaving BackConfirmScene over the game.`);
