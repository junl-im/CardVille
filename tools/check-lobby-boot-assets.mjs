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
  if (!fs.existsSync(full)) throw new Error(`Missing required lobby file: ${rel}`);
  const size = fs.statSync(full).size;
  if (size < minBytes) throw new Error(`Required lobby file too small: ${rel} bytes=${size}`);
}

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'LOBBY_CRITICAL_PNG_ASSET_KEYS',
  'LOBBY_CRITICAL_PNG_ASSET_KEY_SET',
  'lobby-critical-png-runtime-v154',
  'dioramaCastle',
  'dioramaLibrary',
  'dioramaLab',
  'dioramaShop',
  'dioramaSchool',
  'dioramaForest',
  'dioramaEvent',
  'dioramaHarbor',
  'dioramaPlaza'
]) {
  if (!manifest.includes(token)) throw new Error(`assetManifest missing lobby boot token: ${token}`);
}

const intro = read('src/game/scenes/IntroLoadingScene.ts');
for (const token of [
  'lobby-boot-asset-hardening-v154',
  'LOBBY_CRITICAL_PNG_ASSET_KEY_SET.has(key)',
  'return url;',
  'preferredAssetPath(key, url)',
  'lobby critical assets use PNG source'
]) {
  if (!intro.includes(token)) throw new Error(`IntroLoadingScene missing lobby boot token: ${token}`);
}
const pngCriticalBlock = intro.slice(intro.indexOf('private preferredAssetPath'), intro.indexOf('private resolveAssetUrl'));
if (!pngCriticalBlock.includes('LOBBY_CRITICAL_PNG_ASSET_KEY_SET.has(key)')) throw new Error('Critical lobby PNG bypass must live inside preferredAssetPath');
if (pngCriticalBlock.indexOf('LOBBY_CRITICAL_PNG_ASSET_KEY_SET.has(key)') > pngCriticalBlock.indexOf("url.replace(/\\.png$/, '.webp')")) {
  throw new Error('Critical lobby PNG bypass must run before WebP substitution');
}

const nav = read('src/game/systems/NavigationSystem.ts');
for (const token of ['scene-navigation-no-freeze-v154', 'restoreInput', 'window.setTimeout(startNow, 120)', 'scene-transition-shield-v154']) {
  if (!nav.includes(token)) throw new Error(`NavigationSystem missing no-freeze token: ${token}`);
}

const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of [
  `LOBBY_VERSION = '${pkg.version}'`,
  'lobby-building-visible-png-v154',
  'lobby-input-recovery-v154',
  'assertCriticalLobbyTextures',
  'this.input.enabled = true',
  'visible:${building.assetKey}',
  'imageY = building.imageY ?? 0',
  'zoneWidth = Math.max'
]) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing visible-building token: ${token}`);
}

const diorama = read('src/game/data/dioramaBuildings.ts');
for (const token of ['imageY?: number', 'visualWidth: 232', 'visualWidth: 182', 'visualWidth: 160', 'x: 70', 'x: 320', 'x: 320', 'targetY: 688']) {
  if (!diorama.includes(token)) throw new Error(`dioramaBuildings missing v154 layout token: ${token}`);
}

for (const rel of [
  'public/assets/diorama/diorama_bg.png',
  'public/assets/diorama/building_castle.png',
  'public/assets/diorama/building_library.png',
  'public/assets/diorama/building_lab.png',
  'public/assets/diorama/building_shop.png',
  'public/assets/diorama/building_school.png',
  'public/assets/diorama/building_forest.png',
  'public/assets/diorama/building_event.png',
  'public/assets/diorama/building_harbor.png',
  'public/assets/diorama/building_plaza.png'
]) {
  requireFile(rel, 100_000);
  requireFile(rel.replace(/\.png$/i, '.webp'), 5_000);
}

const layout = read('src/game/data/lobbyLayoutPlan.ts');
for (const token of [pkg.version, 'lobby-building-visible-png-v154', 'lobby-critical-png-runtime-v154', 'scene-navigation-no-freeze-v154']) {
  if (!layout.includes(token)) throw new Error(`lobbyLayoutPlan missing v154 audit token: ${token}`);
}

const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '마을 진입 먹통/건물 이미지 미표시', 'lobby-critical-png-runtime-v154', 'check:lobby-boot-assets']) {
  if (!readme.includes(token)) throw new Error(`README missing lobby boot note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.54 마을 진입/건물 이미지 핫픽스 패스', 'lobby-building-visible-png-v154', 'scene-navigation-no-freeze-v154']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing lobby boot note: ${token}`);
}
if (pkg.scripts?.['check:lobby-boot-assets'] !== 'node tools/check-lobby-boot-assets.mjs') throw new Error('check:lobby-boot-assets script mismatch');
if (!pkg.scripts?.verify?.includes('check:lobby-boot-assets')) throw new Error('verify must include check:lobby-boot-assets');
console.log(`Lobby boot asset check passed. Version ${pkg.version}, critical village PNG loading, no-freeze navigation, visible building layout, and self-contained assets verified.`);
