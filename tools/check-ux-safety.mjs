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
    if (!text.includes(token)) throw new Error(`${file} missing UX safety token: ${token}`);
  }
  return text;
}

must('src/game/scenes/ShopScene.ts', [
  'recommendedOfferId',
  'drawDailyStatusMeter',
  'showPurchaseTransition',
  'recordShopOffer',
  '추천',
  '무료팩 READY',
  '최근',
  'PREMIUM'
]);
must('src/game/systems/SaveSystem.ts', [
  'SHOP_LAST_OFFER_KEY',
  'cardville.shop.lastOffer.v136',
  'recordShopOffer',
  'getLastShopOffer',
  'safeRemove(SHOP_LAST_OFFER_KEY)'
]);
must('src/game/scenes/RewardScene.ts', [
  "this.source === 'shop'",
  "NavigationSystem.safeStart(this, 'ShopScene')",
  '상점으로',
  '앨범 보기'
]);
must('src/game/scenes/PlayScene.ts', [
  'bonusPipRects',
  'comboCoachText',
  'bonusMeter: number',
  '복구 필요',
  'updateComboCoach',
  'pulseAssistButton',
  '복구${this.shufflesLeft}',
  '보너스 장전'
]);
must('src/game/scenes/BackConfirmScene.ts', ['MathLabScene', 'MemoryForestScene', 'ShopScene']);
must('src/main.ts', ['1.0.36 shop offer cooldown UX', 'BackConfirmScene']);

const pkgScripts = pkg.scripts ?? {};
if (pkgScripts['check:ux-safety'] !== 'node tools/check-ux-safety.mjs') throw new Error('check:ux-safety script mismatch');
if (!pkgScripts.verify?.includes('check:ux-safety')) throw new Error('verify must include check:ux-safety');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '상점 오퍼', '콤보 코치', 'check:ux-safety']) {
  if (!readme.includes(token)) throw new Error(`README missing UX safety token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.36', 'ShopScene', 'BackConfirmScene', '콤보/복구']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing UX safety token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);

console.log(`UX safety check passed. Version ${pkg.version}, shop offer cooldown, purchase transition, word combo recovery coach, and scene cleanup sync OK.`);
