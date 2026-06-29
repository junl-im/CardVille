import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function must(file, tokens) {
  const text = read(file);
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${file} missing reward popup token: ${token}`);
  }
  return text;
}

must('src/game/systems/RewardPopupSystem.ts', [
  'RewardPopupSystem',
  'reward-popup:v143',
  'primaryLabel',
  'secondaryLabel',
  'highContrast',
  '보상은 프로필과 주간 미션 게이지'
]);

must('src/game/scenes/DailyMissionScene.ts', [
  'RewardPopupSystem',
  'showRewardPopup',
  '출석 보상 수령',
  '주간 미션 완성',
  'nextActionTitle',
  'nextActionCopy'
]);

must('src/game/systems/DailyMissionSystem.ts', [
  'nextActionForBoard',
  'nextActionTitle',
  'nextActionCopy',
  '주간 보상 준비 완료',
  '오늘 루프 완료'
]);

const daily = read('src/game/systems/DailyMissionSystem.ts');
if ((daily.match(/return this\.incrementMission\(missionId, 1\);/g) ?? []).length !== 1) {
  throw new Error('recordModeClear must not keep duplicated unreachable return');
}

const scripts = pkg.scripts ?? {};
if (scripts['check:reward-popup'] !== 'node tools/check-reward-popup.mjs') throw new Error('check:reward-popup script mismatch');
if (!scripts.verify?.includes('check:reward-popup')) throw new Error('verify must include check:reward-popup');

const readme = read('README.md');
for (const token of ['RewardPopupSystem', 'nextActionForBoard', 'check:reward-popup']) {
  if (!readme.includes(token)) throw new Error(`README missing reward popup token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of ['RewardPopupSystem', 'nextActionForBoard', 'check:reward-popup']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing reward popup token: ${token}`);
}

console.log(`Reward popup check passed. Version ${pkg.version}, mission claim popup and next-action CTA verified.`);
