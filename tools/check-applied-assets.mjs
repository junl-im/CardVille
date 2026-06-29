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
  if (!fs.existsSync(full)) throw new Error(`Missing PNG asset: ${rel}`);
  const b = fs.readFileSync(full);
  if (b.length < 33 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  const width = b.readUInt32BE(16);
  const height = b.readUInt32BE(20);
  const colorType = b[25];
  if (![4, 6].includes(colorType)) throw new Error(`Applied asset must be alpha PNG after checker cleanup: ${rel} colorType=${colorType}`);
  const webp = rel.replace(/\.png$/i, '.webp');
  const webpFull = path.join(root, webp);
  if (!fs.existsSync(webpFull)) throw new Error(`Missing WebP companion for applied asset: ${webp}`);
  if (fs.statSync(webpFull).size < 1000) throw new Error(`WebP companion too small: ${webp}`);
  if (b.length < 20000) throw new Error(`PNG looks too small/empty: ${rel}`);
  return { width, height, colorType, bytes: b.length };
}

const buildingFiles = ['building_castle', 'building_library', 'building_lab', 'building_shop', 'building_school', 'building_forest', 'building_event', 'building_harbor', 'building_plaza'];
for (const file of buildingFiles) {
  const info = pngInfo(`public/assets/diorama/${file}.png`);
  if (info.width < 1024 || info.height < 1024) throw new Error(`${file} must be the premium batch resolution, got ${info.width}x${info.height}`);
}

for (const rel of [
  'public/assets/characters/npc_merchant.png',
  'public/assets/characters/npc_town_cat.png',
  'public/assets/characters/cat_hint_happy.png',
  'public/assets/characters/cat_hint_think.png',
  'public/assets/characters/cat_hint_surprise.png',
  'public/assets/characters/cat_hint_sleepy.png',
  'public/assets/effects/effect_pack_burst_common.png',
  'public/assets/effects/effect_pack_burst_rare.png',
  'public/assets/effects/effect_pack_burst_epic.png',
  'public/assets/effects/effect_pack_burst_legendary.png',
  'public/assets/effects/effect_reward_burst_premium.png',
  'public/assets/ui/ui_math_console.png',
  'public/assets/ui/ui_memory_board.png',
  'public/assets/ui/ui_treasure_chest_premium.png',
  'public/assets/cards/frames/frame_legendary_gold_normal.png'
]) pngInfo(rel);

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'catHintHappy', 'catHintThink', 'catHintSurprise', 'catHintSleepy',
  'effectPackBurstCommon', 'effectPackBurstRare', 'effectPackBurstEpic', 'effectPackBurstLegendary', 'effectRewardBurstPremium',
  'uiMathConsole', 'uiMemoryBoard', 'uiTreasureChestPremium'
]) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing applied asset token: ${token}`);
}

for (const [file, tokens] of Object.entries({
  'src/game/systems/CoachMarkSystem.ts': ['catHintThink', 'catHintHappy', 'catHintSurprise'],
  'src/game/systems/RewardPopupSystem.ts': ['effectRewardBurstPremium', 'uiTreasureChestPremium', 'catHintSleepy'],
  'src/game/scenes/MathLabScene.ts': ['uiMathConsole'],
  'src/game/scenes/MemoryForestScene.ts': ['uiMemoryBoard', 'catHintThink'],
  'src/game/scenes/RewardScene.ts': ['packBurstKey', 'effectPackBurstLegendary']
})) {
  const text = read(file);
  for (const token of tokens) if (!text.includes(token)) throw new Error(`${file} missing applied asset token: ${token}`);
}

for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '프리미엄 PNG 배치 에셋 적용', 'check:applied-assets']) {
  if (!read('README.md').includes(token)) throw new Error(`README missing applied asset token: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.46 프리미엄 PNG 배치 에셋 적용 패스', '체크무늬/흰색 배경 RGB 자산을 alpha PNG로 정리']) {
  if (!read('AI_HANDOFF_CARDVILLE.md').includes(token)) throw new Error(`AI handoff missing applied asset token: ${token}`);
}
if (pkg.scripts?.['check:applied-assets'] !== 'node tools/check-applied-assets.mjs') throw new Error('check:applied-assets script mismatch');
if (!pkg.scripts?.verify?.includes('check:applied-assets')) throw new Error('verify must include check:applied-assets');

console.log(`Applied asset check passed. Version ${pkg.version}, ${buildingFiles.length} premium buildings, expression cats, pack bursts, UI boards, alpha PNG cleanup, and WebP companions verified.`);
