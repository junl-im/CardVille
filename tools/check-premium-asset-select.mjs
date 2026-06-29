import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function pngInfo(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing selected PremiumAAA PNG: ${rel}`);
  const b = fs.readFileSync(full);
  if (b.length < 33 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  const width = b.readUInt32BE(16);
  const height = b.readUInt32BE(20);
  const colorType = b[25];
  if (![4, 6].includes(colorType)) throw new Error(`Selected PremiumAAA asset must be alpha PNG: ${rel} colorType=${colorType}`);
  const webp = rel.replace(/\.png$/i, '.webp');
  const webpFull = path.join(root, webp);
  if (!fs.existsSync(webpFull)) throw new Error(`Missing selected PremiumAAA WebP companion: ${webp}`);
  if (fs.statSync(webpFull).size < 1000) throw new Error(`Selected PremiumAAA WebP companion too small: ${webp}`);
  if (b.length < 20000) throw new Error(`Selected PremiumAAA PNG looks too small/empty: ${rel}`);
  return { width, height, colorType, bytes: b.length };
}

for (const rel of [
  'public/assets/characters/hero_traveler_premium.png',
  'public/assets/characters/black_cat_mascot_premium.png',
  'public/assets/diorama/character_boy_token.png',
  'public/assets/diorama/mascot_black_cat_token.png',
  'public/assets/diorama/building_shop.png',
  'public/assets/cards/frames/frame_legendary_gold_normal.png',
  'public/assets/effects/effect_reward_burst_premium.png',
  'public/assets/ui/ui_treasure_chest_premium.png'
]) {
  const info = pngInfo(rel);
  if (info.width < 1000 || info.height < 1000) throw new Error(`${rel} should keep PremiumAAA source resolution, got ${info.width}x${info.height}`);
}

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'heroTravelerPremium',
  'blackCatMascotPremium',
  'assets/characters/hero_traveler_premium.png',
  'assets/characters/black_cat_mascot_premium.png'
]) if (!manifest.includes(token)) throw new Error(`assetManifest missing selected PremiumAAA token: ${token}`);

const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['premium-asset-visible-v149', 'heroTravelerPremium', 'blackCatMascotPremium', 'this.fitImageToBox(this.add.image(0, 0, \'heroTravelerPremium\')', 'this.fitImageToBox(this.add.image(0, 0, \'blackCatMascotPremium\')']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing selected PremiumAAA token: ${token}`);
}
const shop = read('src/game/scenes/ShopScene.ts');
for (const token of ['drawPremiumShopAccents', 'dioramaShop', 'npcMerchant', 'heroTravelerPremium']) {
  if (!shop.includes(token)) throw new Error(`ShopScene missing PremiumAAA shop accent token: ${token}`);
}

// The new batch still includes text-baked and role-mismatched source files. They must not be wired into runtime.
for (const forbidden of ['uiRewardPopupPremium', 'buildingTavernPremium', 'ui_reward_popup_premium.png', 'building_tavern_premium.png']) {
  if (manifest.includes(forbidden)) throw new Error(`Forbidden/deferred PremiumAAA asset was wired into manifest: ${forbidden}`);
}

for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'PremiumAAA 선별 에셋 적용', '텍스트 박힘 보상 팝업은 보류', 'check:premium-asset-select']) {
  if (!read('README.md').includes(token)) throw new Error(`README missing selected PremiumAAA token: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.49 PremiumAAA 선별 에셋 적용 패스', 'tavern 건물은 키즈/교육 톤과 역할이 맞지 않아 보류']) {
  if (!read('AI_HANDOFF_CARDVILLE.md').includes(token)) throw new Error(`AI handoff missing selected PremiumAAA token: ${token}`);
}
if (pkg.scripts?.['check:premium-asset-select'] !== 'node tools/check-premium-asset-select.mjs') throw new Error('check:premium-asset-select script mismatch');
if (!pkg.scripts?.verify?.includes('check:premium-asset-select')) throw new Error('verify must include check:premium-asset-select');
console.log(`PremiumAAA selected asset check passed. Version ${pkg.version}, role-safe shop, premium traveler/cat avatars, RGBA cleanup, WebP companions, and deferred text/tavern guards verified.`);
