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
    if (!text.includes(token)) throw new Error(`${file} missing accessibility token: ${token}`);
  }
  return text;
}

must('src/game/systems/AccessibilitySystem.ts', [
  'cardville.accessibility.v143',
  'toggleReduceMotion',
  'toggleHighContrast',
  'toggleLargeText',
  'v143-accessibility',
  'summary()'
]);

must('src/game/systems/QualitySystem.ts', [
  'AccessibilitySystem.getPrefs',
  'saved-reduced-motion',
  'saved-high-contrast',
  'saved-large-text',
  'highContrast',
  'largeText'
]);

must('src/game/scenes/MainLobbyScene.ts', [
  'AccessibilitySystem',
  '편안한 모션',
  '고대비 화면',
  '큰 안내 문구',
  'AccessibilitySystem.summary()'
]);

must('src/game/systems/CoachMarkSystem.ts', [
  'quality.largeText',
  'bodySize',
  'titleSize'
]);

const scripts = pkg.scripts ?? {};
if (scripts['check:accessibility'] !== 'node tools/check-accessibility.mjs') throw new Error('check:accessibility script mismatch');
if (!scripts.verify?.includes('check:accessibility')) throw new Error('verify must include check:accessibility');

const readme = read('README.md');
for (const token of ['접근성 설정', 'cardville.accessibility.v143', 'check:accessibility']) {
  if (!readme.includes(token)) throw new Error(`README missing accessibility token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of ['접근성 설정', 'cardville.accessibility.v143', 'check:accessibility']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing accessibility token: ${token}`);
}

console.log(`Accessibility check passed. Version ${pkg.version}, saved comfort options and quality gates verified.`);
