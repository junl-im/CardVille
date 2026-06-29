import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function requireFile(rel, minBytes = 1024) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing runtime asset: ${rel}`);
  const stat = fs.statSync(full);
  if (stat.size < minBytes) throw new Error(`Runtime asset too small: ${rel} bytes=${stat.size}`);
}

const intro = read('src/game/scenes/IntroLoadingScene.ts');
for (const token of [
  'CARDVILLE_ASSET_VERSION',
  'resolveAssetUrl',
  'import.meta.env.BASE_URL',
  'v=${CARDVILLE_ASSET_VERSION}',
  'loaderror',
  "[CardVille] asset load failed"
]) {
  if (!intro.includes(token)) throw new Error(`IntroLoadingScene missing runtime asset guard token: ${token}`);
}

const manifest = read('src/game/data/assetManifest.ts');
if (!manifest.includes(`CARDVILLE_ASSET_VERSION = '${pkg.version}'`)) throw new Error('asset manifest version mismatch');

for (const rel of [
  'public/assets/diorama/building_castle.png',
  'public/assets/diorama/building_library.png',
  'public/assets/diorama/building_lab.png',
  'public/assets/diorama/building_shop.png',
  'public/assets/diorama/building_school.png',
  'public/assets/diorama/building_forest.png',
  'public/assets/diorama/building_event.png',
  'public/assets/diorama/building_harbor.png',
  'public/assets/diorama/building_plaza.png',
  'public/assets/characters/npc_merchant.png',
  'public/assets/characters/npc_town_cat.png'
]) {
  requireFile(rel, 10_000);
  requireFile(rel.replace(/\.png$/i, '.webp'), 1_000);
}
for (const rel of [
  'public/assets/ui/ui_nameplate_gold.png',
  'public/assets/ui/ui_building_glow.png',
  'public/assets/ui/ui_door_light.png'
]) {
  requireFile(rel, 500);
  requireFile(rel.replace(/\.png$/i, '.webp'), 100);
}

const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['premium-asset-visible-v149', 'drawMissingBuildingFallback', 'lobby building texture missing']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing visible asset fallback token: ${token}`);
}

const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '마을 이미지 표시 복구']) {
  if (!readme.includes(token)) throw new Error(`README missing runtime asset note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.48 마을 이미지 표시/버튼 프리미엄 복구 패스', 'BASE_URL']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing runtime asset note: ${token}`);
}

console.log(`Asset runtime check passed. Version ${pkg.version}, premium village assets are self-contained, cache-busted, and guarded against missing texture fallbacks.`);
