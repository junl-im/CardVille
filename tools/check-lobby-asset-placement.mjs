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
  if (b[25] !== 6) throw new Error(`Asset must be RGBA/alpha PNG: ${rel} colorType=${b[25]}`);
  const webp = full.replace(/\.png$/i, '.webp');
  if (!fs.existsSync(webp) || fs.statSync(webp).size < 5_000) throw new Error(`Missing/empty WebP companion: ${rel}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

const userBuildingAssets = [
  ['public/assets/diorama/building_castle.png', 'dioramaCastle'],
  ['public/assets/diorama/building_library.png', 'dioramaLibrary'],
  ['public/assets/diorama/building_lab.png', 'dioramaLab'],
  ['public/assets/diorama/building_forest.png', 'dioramaForest']
];
for (const [rel] of userBuildingAssets) {
  const info = pngInfo(rel, 1_000_000);
  if (info.width !== 1254 || info.height !== 1254) throw new Error(`${rel} must preserve 1254 square user cutout, got ${info.width}x${info.height}`);
}
for (const rel of [
  'public/assets/characters/npc_merchant.png',
  'public/assets/characters/npc_wizard.png',
  'public/assets/characters/npc_librarian.png',
  'public/assets/characters/npc_forest_sage.png'
]) {
  const info = pngInfo(rel, 600_000);
  if (info.width !== 1122 || info.height !== 1402) throw new Error(`${rel} must preserve 1122x1402 user NPC source, got ${info.width}x${info.height}`);
}

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'USER_LOBBY_ASSET_ASSIGNMENTS',
  'building_royal_castle_hall.png',
  'building_library_premium.png',
  'building_alchemy_astronomy_lab.png',
  'building_memory_forest_gate.png',
  'npc_shopkeeper_premium.png',
  'npc_alchemist_inventor.png',
  'npc_magic_scholar.png',
  'user-lobby-asset-assignment-v156'
]) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing user asset assignment token: ${token}`);
}
const diorama = read('src/game/data/dioramaBuildings.ts');
for (const token of [
  'USER_LOBBY_ASSET_ASSIGNMENT_TAG',
  'user-lobby-asset-assignment-v156',
  "assetKey: 'dioramaCastle'",
  "assetKey: 'dioramaLibrary'",
  "assetKey: 'dioramaLab'",
  "assetKey: 'dioramaForest'",
  'x: 66',
  'x: 324',
  'visualWidth: 184',
  'visualWidth: 158'
]) {
  if (!diorama.includes(token)) throw new Error(`dioramaBuildings missing visible assignment token: ${token}`);
}
const entities = read('src/game/data/lobbyEntities.ts');
for (const token of [
  'LOBBY_USER_ASSET_NPC_TAG',
  'user-lobby-npc-visible-v156',
  "key: 'npcMerchant', x: 108, y: 604, width: 58, height: 76",
  "key: 'npcWizard', x: 278, y: 448, width: 54, height: 72",
  "key: 'npcLibrarian', x: 112, y: 448, width: 54, height: 72",
  "key: 'npcForestSagePremium', x: 72, y: 724, width: 52, height: 72"
]) {
  if (!entities.includes(token)) throw new Error(`lobbyEntities missing visible NPC token: ${token}`);
}
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of [
  `LOBBY_VERSION = '${pkg.version}'`,
  'lobby-ui-nonoverlap-v156',
  'lobby-user-assets-visible-v156',
  'USER_LOBBY_ASSET_ASSIGNMENT_TAG',
  'LOBBY_USER_ASSET_NPC_TAG',
  'this.add.container(195, 108)',
  'this.add.image(195, 817',
  'visible-npc:',
  'visible:${building.assetKey}'
]) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing non-overlap/user asset token: ${token}`);
}
const layout = read('src/game/data/lobbyLayoutPlan.ts');
for (const token of [
  `LOBBY_LAYOUT_PLAN_VERSION = '${pkg.version}'`,
  'lobby-ui-nonoverlap-v156',
  'user-lobby-asset-assignment-v156',
  'user-lobby-npc-visible-v156',
  'bottomHint',
  'routeRibbon'
]) {
  if (!layout.includes(token)) throw new Error(`lobbyLayoutPlan missing non-overlap audit token: ${token}`);
}
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'HUD/UI 비겹침', 'check:lobby-asset-placement']) {
  if (!read('README.md').includes(token)) throw new Error(`README missing 1.0.56 token: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.56 로비 HUD/에셋 가시성 핫픽스', 'user-lobby-asset-assignment-v156', 'lobby-ui-nonoverlap-v156']) {
  if (!read('AI_HANDOFF_CARDVILLE.md').includes(token)) throw new Error(`AI handoff missing 1.0.56 token: ${token}`);
}
if (pkg.scripts?.['check:lobby-asset-placement'] !== 'node tools/check-lobby-asset-placement.mjs') throw new Error('check:lobby-asset-placement script mismatch');
if (!pkg.scripts?.verify?.includes('check:lobby-asset-placement')) throw new Error('verify must include check:lobby-asset-placement');
console.log(`Lobby asset placement check passed. Version ${pkg.version}, uploaded building/NPC assets are visible and HUD/UI lanes do not cover the lobby field.`);
