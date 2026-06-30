import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function pngInfo(rel, minBytes = 100_000) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing asset: ${rel}`);
  const b = fs.readFileSync(full);
  if (b.length < 26 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  if (b.length < minBytes) throw new Error(`Asset too small: ${rel} bytes=${b.length}`);
  const webp = full.replace(/\.png$/i, '.webp');
  if (!fs.existsSync(webp) || fs.statSync(webp).size < 5_000) throw new Error(`Missing/empty WebP companion: ${rel}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), colorType: b[25], bytes: b.length };
}

for (const rel of [
  'public/assets/diorama/building_castle.png',
  'public/assets/diorama/building_library.png',
  'public/assets/diorama/building_lab.png',
  'public/assets/diorama/building_forest.png'
]) {
  const info = pngInfo(rel, 1_000_000);
  if (info.width !== 1254 || info.height !== 1254) throw new Error(`${rel} must preserve 1254 square source, got ${info.width}x${info.height}`);
  if (info.colorType !== 6) throw new Error(`${rel} must be RGBA after checkerboard cleanup, colorType=${info.colorType}`);
}
for (const rel of [
  'public/assets/characters/npc_librarian.png',
  'public/assets/characters/npc_wizard.png',
  'public/assets/characters/npc_merchant.png',
  'public/assets/characters/npc_forest_sage.png'
]) {
  const info = pngInfo(rel, 600_000);
  if (info.width !== 1122 || info.height !== 1402) throw new Error(`${rel} must preserve 1122x1402 NPC source, got ${info.width}x${info.height}`);
  if (info.colorType !== 6) throw new Error(`${rel} must be RGBA after checkerboard cleanup, colorType=${info.colorType}`);
}
for (const rel of [
  'public/assets/diorama/diorama_bg.png',
  'public/assets/backgrounds/bg_library_great_hall.png',
  'public/assets/backgrounds/bg_star_magic_lab.png',
  'public/assets/backgrounds/bg_memory_forest_path.png',
  'public/assets/backgrounds/bg_shop_interior.png',
  'public/assets/backgrounds/bg_grand_palace_hall.png'
]) {
  pngInfo(rel, 1_000_000);
}

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'bgLibraryGreatHallPremium',
  'bgStarMagicLabPremium',
  'bgMemoryForestPremium',
  'bgGrandPalacePremium',
  'npcForestSagePremium'
]) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing 1.0.56 art token: ${token}`);
}
const draw = read('src/game/systems/DrawSystem.ts');
for (const token of ['scene-premium-backdrop-v155', "'library'", "'lab'", "'shop'", "'palace'", 'BACKDROP_BY_VARIANT']) {
  if (!draw.includes(token)) throw new Error(`DrawSystem missing premium backdrop token: ${token}`);
}
for (const [rel, token] of [
  ['src/game/scenes/PlayScene.ts', "'library'"],
  ['src/game/scenes/MathLabScene.ts', "'lab'"],
  ['src/game/scenes/ShopScene.ts', "'shop'"],
  ['src/game/scenes/CollectionScene.ts', "'palace'"]
]) {
  if (!read(rel).includes(token)) throw new Error(`${rel} missing backdrop variant ${token}`);
}
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['lobby-art-placement-v155', 'premium lobby art placement', 'npcForestSagePremium']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing art placement token: ${token}`);
}
const diorama = read('src/game/data/dioramaBuildings.ts');
for (const token of ['x: 60', 'x: 330', 'visualWidth: 150', 'visualWidth: 124', 'npcForestSagePremium', 'user-lobby-asset-assignment-v156', 'lobby-wide-village-spacing-v159']) {
  if (!diorama.includes(token)) throw new Error(`dioramaBuildings missing 1.0.56 spacing/art token: ${token}`);
}
const text = read('src/game/ui/TextStyles.ts');
for (const token of ['mobile-readable-text-v156', 'return prefs.largeText ? 1.34 : 1.17', 'size <= 9 ? 12']) {
  if (!text.includes(token)) throw new Error(`TextStyles missing 1.0.56 readable text token: ${token}`);
}
const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '로비/NPC/건물/배경 에셋', 'scene-premium-backdrop-v155', 'HUD/UI 비겹침', 'check:lobby-art-ui']) {
  if (!readme.includes(token)) throw new Error(`README missing 1.0.56 art UI note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.56 로비 HUD/에셋 가시성 핫픽스', 'lobby-art-placement-v155', 'mobile-readable-text-v156']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing 1.0.56 art UI note: ${token}`);
}
if (pkg.scripts?.['check:lobby-art-ui'] !== 'node tools/check-lobby-art-ui.mjs') throw new Error('check:lobby-art-ui script mismatch');
if (!pkg.scripts?.verify?.includes('check:lobby-art-ui')) throw new Error('verify must include check:lobby-art-ui');
console.log(`Lobby art/UI check passed. Version ${pkg.version}, selected buildings/NPCs/backgrounds, scene backdrops, spacing, and mobile text verified.`);
