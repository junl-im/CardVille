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
  'exit-real-close-v153',
  'requestNativeCloseBridge',
  'showExitBlockedRecovery',
  'data-cardville-exit-blocked-v153',
  'stopSceneFallback',
  'window.clearTimeout',
  'exitRequested = false',
  "'EnglishSchoolScene'",
  "'DailyMissionScene'",
  "'나가기'",
  "'창 닫기가 브라우저에서 막혔어요'"
]) {
  if (!back.includes(token)) throw new Error(`BackButtonSystem missing real-close token: ${token}`);
}
const exitMethods = back.slice(back.indexOf('static requestExit'), back.indexOf('private static showExitBlockedRecovery'));
const blockedRecovery = back.slice(back.indexOf('private static showExitBlockedRecovery'));
for (const forbidden of ['about:blank', 'location.replace', 'location.href', 'history.back', '빈 페이지로 이동', '나가기 시도']) {
  if (exitMethods.includes(forbidden) || blockedRecovery.includes(forbidden)) throw new Error(`BackButtonSystem must not use blank-page/navigation exit fallback: ${forbidden}`);
}
if (back.includes('this.launchSceneFallback();\n  }\n\n  private static closeOverlay')) throw new Error('DOM back overlay should not leave fallback scene stacked under it');
const confirm = read('src/game/scenes/BackConfirmScene.ts');
for (const token of ['BackButtonSystem.requestExit()', '창 닫기 시도 중', '게임으로 복구']) {
  if (!confirm.includes(token)) throw new Error(`BackConfirmScene missing real-close token: ${token}`);
}
for (const forbidden of ['about:blank', 'history.back', '나가는 중...', '나가기 시도']) {
  if (confirm.includes(forbidden)) throw new Error(`BackConfirmScene still has old/freeze-prone exit path: ${forbidden}`);
}
const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '실제 창 닫기', '빈 페이지 이동 제거', 'check:exit-flow']) {
  if (!readme.includes(token)) throw new Error(`README missing exit-flow note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.53 실제 나가기/모바일 가독성/로비 배치 패스', 'exit-real-close-v153']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing exit-flow note: ${token}`);
}
if (pkg.scripts?.['check:exit-flow'] !== 'node tools/check-exit-flow.mjs') throw new Error('check:exit-flow script mismatch');
if (!pkg.scripts?.verify?.includes('check:exit-flow')) throw new Error('verify must include check:exit-flow');
console.log(`Exit flow check passed. Version ${pkg.version}, exit attempts real close/native bridge only and never redirects to a blank page.`);
