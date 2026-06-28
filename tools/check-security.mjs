import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const required = [
  'src/game/systems/SecuritySystem.ts',
  'src/game/systems/SaveSystem.ts',
  'src/game/systems/AuthSystem.ts',
  'src/game/systems/BackButtonSystem.ts'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing security file: ${file}`);
}
const security = fs.readFileSync(path.join(root, 'src/game/systems/SecuritySystem.ts'), 'utf8');
for (const token of ['sanitizeText', 'clampInt', 'safeJsonRecord', 'isSafeEmail']) {
  if (!security.includes(token)) throw new Error(`SecuritySystem missing ${token}`);
}
const save = fs.readFileSync(path.join(root, 'src/game/systems/SaveSystem.ts'), 'utf8');
for (const token of ['normalizeProfile', 'safeJsonRecord', 'safeId', 'clampInt', '/^word:']) {
  if (!save.includes(token)) throw new Error(`SaveSystem missing security token: ${token}`);
}
const auth = fs.readFileSync(path.join(root, 'src/game/systems/AuthSystem.ts'), 'utf8');
for (const token of ['isSafeEmail', 'password.length > 128', 'gstatic.com/firebasejs', '@vite-ignore']) {
  if (!auth.includes(token)) throw new Error(`AuthSystem missing security token: ${token}`);
}
const back = fs.readFileSync(path.join(root, 'src/game/systems/BackButtonSystem.ts'), 'utf8');
for (const token of ['cardville-back-overlay', 'makeOverlayButton', 'primeHistoryGuard', 'requestExit']) {
  if (!back.includes(token)) throw new Error(`BackButtonSystem missing robust back UX token: ${token}`);
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (html.includes('boot-fake-button')) throw new Error('Pre-start fake play button must not exist in index.html');
if (html.includes('카드마을을 여는 중')) throw new Error('Old boot loading text must not exist');
if (/eval\s*\(/.test(auth + save + security + back)) throw new Error('eval is not allowed');
console.log(`Security check passed. Version ${pkg.version}, local data hardening, auth validation and back overlay OK.`);
