import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
const button = read('src/game/ui/GameButton.ts');
for (const token of [
  'CARDVILLE_PREMIUM_BUTTON_STYLE_TAG',
  'premium-vector-button-v148',
  'resolveButtonPalette',
  'options.skin === true',
  'chooseButtonSkin',
  'skinImage',
  'fillGradientStyle',
  'fontStyle: \'900\''
]) {
  if (!button.includes(token)) throw new Error(`GameButton missing premium button token: ${token}`);
}
if (button.includes('options.skin === false ? null : chooseButtonSkin')) throw new Error('GameButton must not default to old baked button skins');
const login = read('src/game/scenes/LoginScene.ts');
for (const token of ['LOGIN_CTA_BUTTON_STYLE', 'skin: false', 'shine: false', '게임 시작']) {
  if (!login.includes(token)) throw new Error(`LoginScene lost start CTA token: ${token}`);
}
const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, '시작 화면 CTA 품질을 공통 GameButton 기본값으로 확장', 'check:premium-buttons']) {
  if (!readme.includes(token)) throw new Error(`README missing premium button note: ${token}`);
}
console.log(`Premium button check passed. Version ${pkg.version}, GameButton defaults to start-screen-like vector CTAs while optional baked skins remain opt-in.`);
