import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function pngSize(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing PNG asset: ${rel}`);
  const b = fs.readFileSync(full);
  if (b.length < 24 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

function requireMin(rel, minW, minH, label) {
  const { width, height, bytes } = pngSize(rel);
  if (width < minW || height < minH) throw new Error(`${label} too small: ${rel} is ${width}x${height}, expected at least ${minW}x${minH}`);
  if (bytes < 500) throw new Error(`${label} looks too tiny/empty: ${rel} is only ${bytes} bytes`);
  const webp = rel.replace(/\.png$/i, '.webp');
  const webpFull = path.join(root, webp);
  if (!fs.existsSync(webpFull)) throw new Error(`Missing WebP companion for premium asset: ${webp}`);
  if (fs.statSync(webpFull).size < 500) throw new Error(`WebP companion looks empty: ${webp}`);
}

requireMin('public/assets/diorama/diorama_bg.png', 780, 1600, 'premium diorama background');
for (const file of ['building_castle', 'building_library', 'building_lab', 'building_shop', 'building_school', 'building_forest', 'building_event', 'building_harbor', 'building_plaza']) {
  requireMin(`public/assets/diorama/${file}.png`, 512, 420, 'premium building');
}
for (const file of ['hero_idle', 'hero_walk_01', 'hero_walk_02', 'hero_walk_03', 'hero_blink', 'hero_cheer']) {
  requireMin(`public/assets/characters/${file}.png`, 300, 500, 'locked hero standee');
}
for (const file of ['cat_idle', 'cat_walk_01', 'cat_walk_02', 'cat_tail', 'cat_hint']) {
  requireMin(`public/assets/characters/${file}.png`, 300, 340, 'locked black cat standee');
}
for (const file of ['npc_librarian', 'npc_wizard', 'npc_merchant', 'npc_teacher', 'npc_guard', 'npc_cook', 'npc_child_01', 'npc_town_cat']) {
  requireMin(`public/assets/characters/${file}.png`, 240, 320, 'NPC base asset');
}
for (const file of ['ui_panel_glass', 'ui_panel_wood', 'ui_panel_gold', 'ui_speech_bubble', 'ui_nameplate_gold']) {
  const minH = file === 'ui_panel_wood' ? 400 : 100;
  requireMin(`public/assets/ui/${file}.png`, 320, minH, 'premium UI panel');
}

const manifest = fs.readFileSync(path.join(root, 'src/game/data/assetManifest.ts'), 'utf8');
for (const token of [`CARDVILLE_ASSET_VERSION = '${pkg.version}'`, 'dioramaBg', 'npcWizard', 'uiPanelWood']) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing premium token: ${token}`);
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '프리미엄 에셋 패스', 'check:premium-assets']) {
  if (!readme.includes(token)) throw new Error(`README missing premium update token: ${token}`);
}
const handoff = fs.readFileSync(path.join(root, 'AI_HANDOFF_CARDVILLE.md'), 'utf8');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.28 프리미엄 에셋 패스', '프리미엄 에셋 검증']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing premium token: ${token}`);
}

const pkgScripts = pkg.scripts ?? {};
if (pkgScripts['check:premium-assets'] !== 'node tools/check-premium-assets.mjs') throw new Error('check:premium-assets script mismatch');
if (!pkgScripts.verify?.includes('check:premium-assets')) throw new Error('verify must include check:premium-assets');

console.log(`Premium asset check passed. Version ${pkg.version}, high-resolution PNG/WebP background/buildings/characters/NPC/UI verified.`);
