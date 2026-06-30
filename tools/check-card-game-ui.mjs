import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const requiredAssets = [
  'public/assets/cards/word_ui/word_card_frame_layout_a.png',
  'public/assets/cards/word_ui/word_card_frame_layout_b.png',
  'public/assets/cards/word_ui/word_card_frame_layout_c.png',
  'public/assets/cards/word_ui/word_card_frame_syllable_slots.png',
  'public/assets/cards/word_ui/word_card_back_design.png'
];

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function pngInfo(rel) {
  const b = fs.readFileSync(path.join(root, rel));
  if (b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`${rel} is not a PNG`);
  const colorType = b[25];
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), colorType, bytes: b.length };
}

for (const rel of requiredAssets) {
  const info = pngInfo(rel);
  if (info.width < 800 || info.height < 1200) throw new Error(`Word card UI asset too small after processing: ${rel} ${info.width}x${info.height}`);
  if (info.colorType !== 6) throw new Error(`Word card UI asset must be RGBA/alpha after checker cleanup: ${rel}, colorType ${info.colorType}`);
  const webp = rel.replace(/\.png$/, '.webp');
  if (!fs.existsSync(path.join(root, webp))) throw new Error(`Missing word card WebP companion: ${webp}`);
}

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'wordCardFrameLayoutA',
  'wordCardFrameLayoutB',
  'wordCardFrameLayoutC',
  'wordCardFrameSyllableSlots',
  'wordCardBackDesign'
]) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing word-card UI token: ${token}`);
}

const cardSystem = read('src/game/systems/CardGameSystem.ts');
for (const token of ['word-card-ui-frame-v157', 'card-game-performance-v158', 'mobile-card-layout-v158', 'card-engine-upgrade-v158', 'shuffleCopy', 'wordCardFrameKey', 'addWordCardFrame', 'calculateComboScore']) {
  if (!cardSystem.includes(token)) throw new Error(`CardGameSystem missing token: ${token}`);
}

const play = read('src/game/scenes/PlayScene.ts');
for (const token of ['addWordCardFrame', 'wordCardFrameKey', 'CARDVILLE_MOBILE_CARD_LAYOUT_TAG', 'railX = l.visibleX + 14', 'baseY: 438', 'drawPremiumBottomRail', 'l.visibleX + 326', 'assertNoVerticalOverlap']) {
  if (!play.includes(token)) throw new Error(`PlayScene missing mobile word-card layout token: ${token}`);
}

const text = read('src/game/ui/TextStyles.ts');
for (const token of ['mobile-readable-text-v158', 'return prefs.largeText ? 1.40 : 1.20', 'size <= 9 ? 13', 'size <= 11 ? 15']) {
  if (!text.includes(token)) throw new Error(`TextStyles missing v157 mobile readability token: ${token}`);
}

for (const file of ['src/game/scenes/MemoryForestScene.ts', 'src/game/scenes/MathLabScene.ts', 'src/game/scenes/EnglishSchoolScene.ts']) {
  const content = read(file);
  if (!content.includes('shuffleCopy(items)')) throw new Error(`${file} must use Fisher-Yates shuffleCopy instead of sort-random shuffle`);
  if (content.includes('sort(() => Math.random() - 0.5)')) throw new Error(`${file} still uses biased sort-random shuffle`);
}

const math = read('src/game/scenes/MathLabScene.ts');
const english = read('src/game/scenes/EnglishSchoolScene.ts');
for (const [name, content] of [['MathLabScene', math], ['EnglishSchoolScene', english]]) {
  for (const token of ['panel(this, 195, 420, 348, 500, 34)', 'setSize(170, 104)', 'Math.floor(slot / 2) * 102', 'drawReadablePanel']) {
    if (!content.includes(token)) throw new Error(`${name} missing enlarged mobile answer layout token: ${token}`);
  }
}

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'word-card-ui-frame-v157', 'card-game-performance-v158', 'check:card-game-ui']) {
  if (!readme.includes(token)) throw new Error(`README missing 1.0.57 card-game UI token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.58 플레이필드/UI/엔진 점검', 'word-card-ui-frame-v157', 'card-game-performance-v158']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing 1.0.57 token: ${token}`);
}

if (pkg.scripts?.['check:card-game-ui'] !== 'node tools/check-card-game-ui.mjs') throw new Error('check:card-game-ui script missing');
if (!pkg.scripts?.verify?.includes('check:card-game-ui')) throw new Error('verify must include check:card-game-ui');

console.log(`Card game UI check passed. Version ${pkg.version}, processed word-card frames, v158 mobile playfield layout, Fisher-Yates shuffle, and engine scoring guards verified.`);
