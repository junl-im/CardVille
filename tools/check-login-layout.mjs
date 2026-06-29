import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

const plan = read('src/game/data/loginLayoutPlan.ts');
const login = read('src/game/scenes/LoginScene.ts');
const button = read('src/game/ui/GameButton.ts');

for (const token of [
  `LOGIN_LAYOUT_PLAN_VERSION = '${pkg.version}'`,
  'LOGIN_CONTROL_RECTS',
  'LOGIN_PANEL',
  'rectsOverlap',
  '버튼 히트존 세로 겹침 없음'
]) {
  if (!plan.includes(token)) throw new Error(`loginLayoutPlan missing token: ${token}`);
}
for (const token of [
  `const LOGIN_VERSION = '${pkg.version}'`,
  'LOGIN_ACTION_START_Y',
  'LOGIN_ACTION_GOOGLE_Y',
  'LOGIN_ACTION_SECONDARY_Y',
  '겹침 없이 시작 방식을 선택하세요.',
  'LOGIN_LAYOUT_GUARDS'
]) {
  if (!login.includes(token)) throw new Error(`LoginScene missing layout token: ${token}`);
}
for (const token of ['setWordWrapWidth', 'setMaxLines', 'getBoundsForAudit']) {
  if (!button.includes(token)) throw new Error(`GameButton missing anti-overlap token: ${token}`);
}

const rectMatches = [...plan.matchAll(/\{ id: '([^']+)', label: '([^']+)', x: ([0-9]+), y: ([0-9]+), width: ([0-9]+), height: ([0-9]+), minGap: ([0-9]+) \}/g)];
if (rectMatches.length !== 5) throw new Error(`Expected 5 login control rects, found ${rectMatches.length}`);
const rects = rectMatches.map((m) => ({ id: m[1], label: m[2], x: Number(m[3]), y: Number(m[4]), width: Number(m[5]), height: Number(m[6]), minGap: Number(m[7]) }));

const required = ['status', 'guest', 'google', 'email', 'signup'];
for (const id of required) {
  if (!rects.some((rect) => rect.id === id)) throw new Error(`Missing login control rect ${id}`);
}

function overlapAmount(a, b) {
  const overlapX = Math.max(0, Math.min(a.x + a.width / 2, b.x + b.width / 2) - Math.max(a.x - a.width / 2, b.x - b.width / 2));
  const overlapY = Math.max(0, Math.min(a.y + a.height / 2, b.y + b.height / 2) - Math.max(a.y - a.height / 2, b.y - b.height / 2));
  return { overlapX, overlapY };
}

for (let i = 0; i < rects.length; i += 1) {
  for (let j = i + 1; j < rects.length; j += 1) {
    const a = rects[i];
    const b = rects[j];
    const { overlapX, overlapY } = overlapAmount(a, b);
    const allowedSameRow = (a.id === 'email' && b.id === 'signup') || (a.id === 'signup' && b.id === 'email');
    if (allowedSameRow) {
      if (overlapX > 0 || Math.abs(a.y - b.y) > 2) throw new Error(`Email/signup row invalid: ${JSON.stringify({ a, b, overlapX, overlapY })}`);
      continue;
    }
    if (overlapX > 0 && overlapY > 0) throw new Error(`Overlapping login controls: ${a.id}/${b.id} (${overlapX}x${overlapY})`);
    if (overlapX > 0) {
      const gap = Math.abs(a.y - b.y) - (a.height + b.height) / 2;
      if (gap < Math.min(a.minGap, b.minGap) - 4) throw new Error(`Login vertical gap too tight: ${a.id}/${b.id} gap ${gap}`);
    }
  }
}

const panelMatch = plan.match(/top: ([0-9]+),\n  bottom: ([0-9]+)/);
if (!panelMatch) throw new Error('LOGIN_PANEL top/bottom not found');
const panelTop = Number(panelMatch[1]);
const panelBottom = Number(panelMatch[2]);
for (const rect of rects) {
  if (rect.y - rect.height / 2 < panelTop || rect.y + rect.height / 2 > panelBottom) throw new Error(`${rect.id} outside login panel`);
}

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '시작화면 버튼 간격', 'check:login-layout']) {
  if (!readme.includes(token)) throw new Error(`README missing login-layout token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '시작화면 버튼 간격', 'LOGIN_CONTROL_RECTS']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing login-layout token: ${token}`);
}

if (pkg.scripts?.['check:login-layout'] !== 'node tools/check-login-layout.mjs') throw new Error('check:login-layout script mismatch');
if (!pkg.scripts?.verify?.includes('check:login-layout')) throw new Error('verify must include check:login-layout');

console.log(`Login layout check passed. Version ${pkg.version}, ${rects.length} controls verified with no button/text overlap.`);
