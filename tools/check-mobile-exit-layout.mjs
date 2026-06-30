import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
const back = read('src/game/systems/BackButtonSystem.ts');
for (const token of ['exit-real-close-v153', 'requestNativeCloseBridge', 'window.close()', 'CardVilleNative', 'Android', 'cardvilleClose']) {
  if (!back.includes(token)) throw new Error(`Real close flow missing token: ${token}`);
}
const exitMethods = back.slice(back.indexOf('static requestExit'), back.indexOf('private static showExitBlockedRecovery'));
const blockedRecovery = back.slice(back.indexOf('private static showExitBlockedRecovery'));
for (const forbidden of ['about:blank', '빈 페이지로 이동', 'history.back', 'location.href', 'location.replace']) {
  if (exitMethods.includes(forbidden) || blockedRecovery.includes(forbidden)) throw new Error(`Forbidden exit fallback remains in exit flow: ${forbidden}`);
}
const text = read('src/game/ui/TextStyles.ts');
for (const token of ['mobile-readable-text-v156', 'return prefs.largeText ? 1.34 : 1.17', 'size <= 9 ? 12', 'size <= 11 ? 14']) {
  if (!text.includes(token)) throw new Error(`Mobile text sizing missing token: ${token}`);
}
const diorama = read('src/game/data/dioramaBuildings.ts');
for (const token of ['x: 66', 'x: 324', 'visualWidth: 184', 'visualWidth: 158', 'statusX: -31', 'statusX: 31', 'npcForestSagePremium']) {
  if (!diorama.includes(token)) throw new Error(`Village edge spacing missing token: ${token}`);
}
const blocks = [...diorama.matchAll(/\{\n\s+id: '([^']+)'[\s\S]*?\n\s+\}/g)].filter((match) => match[0].includes('assetKey:'));
if (blocks.length !== 9) throw new Error(`Expected 9 diorama building blocks, got ${blocks.length}`);
function num(block, key) {
  const m = block.match(new RegExp(`${key}: ([0-9]+)`));
  if (!m) throw new Error(`Missing ${key} in ${block.slice(0,80)}`);
  return Number(m[1]);
}
const rects = blocks.map(([block, id]) => {
  const x = num(block, 'x');
  const y = num(block, 'y') + Number(block.match(/touchOffsetY: ([0-9]+)/)?.[1] ?? 0);
  const width = num(block, 'touchWidth');
  const height = num(block, 'touchHeight');
  if (x - width / 2 < 8 || x + width / 2 > 382) throw new Error(`${id} touch zone out of horizontal safe area`);
  if (y - height / 2 < 92 || y + height / 2 > 746) throw new Error(`${id} touch zone out of vertical safe area`);
  return { id, x, y, width, height };
});
for (let i = 0; i < rects.length; i += 1) {
  for (let j = i + 1; j < rects.length; j += 1) {
    const a = rects[i], b = rects[j];
    const ox = Math.max(0, Math.min(a.x + a.width / 2, b.x + b.width / 2) - Math.max(a.x - a.width / 2, b.x - b.width / 2));
    const oy = Math.max(0, Math.min(a.y + a.height / 2, b.y + b.height / 2) - Math.max(a.y - a.height / 2, b.y - b.height / 2));
    if (ox > 0 && oy > 0) throw new Error(`Overlapping touch zones after edge spacing: ${a.id}/${b.id}`);
  }
}
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['mobile-readable-layout-v153', 'village-edge-spacing-v153', 'bodyText(14)', 'mutedText(10)', 'fontSize: \'11px\'']) {
  if (!lobby.includes(token)) throw new Error(`Lobby mobile UI missing token: ${token}`);
}
const readme = read('README.md');
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '모바일 글씨 가독성', '좌우 끝 공간']) {
  if (!readme.includes(token)) throw new Error(`README missing mobile layout note: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, 'mobile-readable-text-v156', 'village-edge-spacing-v153']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing mobile layout note: ${token}`);
}
if (pkg.scripts?.['check:mobile-exit-layout'] !== 'node tools/check-mobile-exit-layout.mjs') throw new Error('check:mobile-exit-layout script mismatch');
if (!pkg.scripts?.verify?.includes('check:mobile-exit-layout')) throw new Error('verify must include check:mobile-exit-layout');
console.log(`Mobile exit/layout check passed. Version ${pkg.version}, real close only, mobile readable text, and edge-spaced lobby touch zones verified.`);
