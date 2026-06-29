import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function pngInfo(rel, minBytes = 20_000) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing village visual asset: ${rel}`);
  const b = fs.readFileSync(full);
  if (b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  if (b.length < minBytes) throw new Error(`Village visual asset too small: ${rel} bytes=${b.length}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), colorType: b[25], bytes: b.length };
}
const bg = pngInfo('public/assets/diorama/diorama_bg.png', 100_000);
if (bg.width !== 1080 || bg.height !== 1920) throw new Error(`Premium lobby background must be 1080x1920, got ${bg.width}x${bg.height}`);
for (const rel of [
  'building_castle.png','building_library.png','building_lab.png','building_shop.png','building_school.png','building_forest.png','building_event.png','building_harbor.png','building_plaza.png'
]) {
  const info = pngInfo(`public/assets/diorama/${rel}`, 100_000);
  if (info.width < 1000 || info.height < 1000) throw new Error(`${rel} should keep premium source resolution, got ${info.width}x${info.height}`);
  const webp = path.join(root, `public/assets/diorama/${rel.replace(/\.png$/, '.webp')}`);
  if (!fs.existsSync(webp) || fs.statSync(webp).size < 5_000) throw new Error(`Missing/empty WebP companion for ${rel}`);
}
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['VILLAGE_VISIBLE_BUILDING_SCALE_TAG', 'village-readable-building-scale-v150', 'premiumStage', 'fitImageToBox', 'drawMissingBuildingFallback', 'lobby-building-visible-png-v154']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing village visual token: ${token}`);
}
const diorama = read('src/game/data/dioramaBuildings.ts');
for (const token of ['visualWidth: 232', 'visualWidth: 182', 'visualWidth: 160', 'imageY:', 'nameplateWidth']) {
  if (!diorama.includes(token)) throw new Error(`dioramaBuildings missing readable-size token: ${token}`);
}
const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '마을 건물 가독성 확대', 'check:village-visuals']) {
  if (!readme.includes(token)) throw new Error(`README missing village visual note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.50 나가기/마을 비주얼 긴급 복구 패스', 'village-readable-building-scale-v150']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing village visual note: ${token}`);
}
if (pkg.scripts?.['check:village-visuals'] !== 'node tools/check-village-visuals.mjs') throw new Error('check:village-visuals script mismatch');
if (!pkg.scripts?.verify?.includes('check:village-visuals')) throw new Error('verify must include check:village-visuals');
console.log(`Village visual check passed. Version ${pkg.version}, premium buildings/background are included, readable, and guarded by visible fit tags.`);
