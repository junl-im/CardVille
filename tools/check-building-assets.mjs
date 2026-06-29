import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function pngInfo(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing building PNG: ${rel}`);
  const b = fs.readFileSync(full);
  if (b.length < 24 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

const buildingFiles = [
  'building_castle', 'building_library', 'building_lab', 'building_shop', 'building_school', 'building_forest', 'building_event', 'building_harbor', 'building_plaza'
];
const sizes = [];
for (const file of buildingFiles) {
  const rel = `public/assets/diorama/${file}.png`;
  const info = pngInfo(rel);
  if (info.width < 512 || info.height < 512) throw new Error(`True building cutout must be at least 512x512: ${rel} is ${info.width}x${info.height}`);
  if (info.bytes < 30000) throw new Error(`Building asset looks too small/simple: ${rel} is ${info.bytes} bytes`);
  const webp = path.join(root, `public/assets/diorama/${file}.webp`);
  if (!fs.existsSync(webp)) throw new Error(`Missing WebP companion: ${file}.webp`);
  if (fs.statSync(webp).size < 20000) throw new Error(`WebP companion too small/empty: ${file}.webp`);
  sizes.push(info.bytes);
}
const uniqueSizes = new Set(sizes);
if (uniqueSizes.size < buildingFiles.length - 1) throw new Error('Building assets look duplicated; expected distinct file footprints');

const diorama = read('src/game/data/dioramaBuildings.ts');
for (const token of ['visualWidth: 226', 'visualHeight: 226', 'visualWidth: 172', 'visualWidth: 146', 'imageY:', 'nameplateWidth', 'targetY: 682']) {
  if (!diorama.includes(token)) throw new Error(`dioramaBuildings.ts missing updated building placement token: ${token}`);
}
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['baseShadow', 'fitImageToBox', 'visualWidth', 'building.assetKey', 'premiumStage']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing true-building presentation token: ${token}`);
}
const manifest = read('src/game/data/assetManifest.ts');
for (const token of [`CARDVILLE_ASSET_VERSION = '${pkg.version}'`, 'dioramaCastle', 'dioramaHarbor', 'dioramaPlaza']) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing building token: ${token}`);
}
const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '마을 건물', 'check:building-assets']) {
  if (!readme.includes(token)) throw new Error(`README missing building-asset token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.30 마을 건물 에셋 패스', '프레임형 크롭 자산 금지']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing building-asset token: ${token}`);
}
if (pkg.scripts?.['check:building-assets'] !== 'node tools/check-building-assets.mjs') throw new Error('check:building-assets script mismatch');
if (!pkg.scripts?.verify?.includes('check:building-assets')) throw new Error('verify must include check:building-assets');

console.log(`Building asset check passed. Version ${pkg.version}, ${buildingFiles.length} true 512x512 village building cutouts and WebP companions verified.`);
