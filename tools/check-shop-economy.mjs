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
    if (!text.includes(token)) throw new Error(`${file} missing shop-economy token: ${token}`);
  }
  return text;
}

must('src/main.ts', ['ShopScene', 'shop economy hub']);
must('src/game/scenes/ShopScene.ts', ['export class ShopScene', 'SHOP_OFFERS', 'drawOfferCard', 'claimDailyShopPack', 'spendCoins', 'spendGems', 'RewardScene', 'CollectionScene', '품질']);
must('src/game/systems/SaveSystem.ts', ['spendCoins', 'spendGems', 'getDailyShopStatus', 'claimDailyShopPack', 'cardville.shop.dailyPack.v134', 'DailyShopStatus']);
must('src/game/data/dioramaBuildings.ts', ["scene: 'ShopScene'", "subtitle: '카드팩 상점'"]);
must('src/game/systems/BackButtonSystem.ts', ['ShopScene']);
must('src/game/scenes/RewardScene.ts', ["source?: 'game' | 'shop'", 'packLabel', "this.source === 'shop'", 'rewardLine']);

const shop = read('src/game/scenes/ShopScene.ts');
const offerCount = (shop.match(/\n    id: '(daily_free|coin_pack|gem_pack)'/g) ?? []).length;
if (offerCount !== 3) throw new Error(`Expected exactly 3 shop offers, found ${offerCount}`);
for (const token of ['일일 무료팩', '상점 실버팩', '왕관 프리미엄팩']) {
  if (!shop.includes(token)) throw new Error(`ShopScene missing offer copy: ${token}`);
}

const pkgScripts = pkg.scripts ?? {};
if (pkgScripts['check:shop-economy'] !== 'node tools/check-shop-economy.mjs') throw new Error('check:shop-economy script mismatch');
if (!pkgScripts.verify?.includes('check:shop-economy')) throw new Error('verify must include check:shop-economy');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '상점 허브', 'check:shop-economy']) {
  if (!readme.includes(token)) throw new Error(`README missing shop-economy token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, 'ShopScene', 'cardville.shop.dailyPack.v134', '상점 허브']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing shop-economy token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);

console.log(`Shop economy check passed. Version ${pkg.version}, offers ${offerCount}, daily free pack, spending guards, and shop-aware reward flow OK.`);
