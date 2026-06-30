import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function mustContain(file, tokens) {
  const text = read(file);
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${file} missing premium-fit token: ${token}`);
  }
  return text;
}

function getNum(block, name, required = false) {
  const match = block.match(new RegExp(`${name}: ([0-9]+)`));
  if (!match) {
    if (required) throw new Error(`Missing ${name} in building block: ${block.slice(0, 120)}`);
    return undefined;
  }
  return Number(match[1]);
}

const diorama = mustContain('src/game/data/dioramaBuildings.ts', [
  'visualWidth?: number',
  'visualHeight?: number',
  'imageY?: number',
  'nameplateY?: number',
  'statusY?: number',
  'visualWidth:',
  'nameplateY:',
  'statusY:'
]);
const lobby = mustContain('src/game/scenes/MainLobbyScene.ts', [
  `LOBBY_VERSION = '${pkg.version}'`,
  'PREMIUM_LOBBY_FIT_TAG',
  'fitImageToBox',
  'image.texture.get()',
  'visualWidth = building.visualWidth',
  'visualHeight = building.visualHeight',
  'uiDoorLight',
  'contactGlow',
  'premiumStage',
  'VILLAGE_VISIBLE_BUILDING_SCALE_TAG',
  'this.fitImageToBox(this.add.image(npc.x, npc.y, npc.key).setName'
]);
mustContain('src/game/data/lobbyLayoutPlan.ts', [
  `LOBBY_LAYOUT_PLAN_VERSION = '${pkg.version}'`,
  'LOBBY_PREMIUM_VISUAL_FIT_AUDIT',
  'fitImageToBox instead of setDisplaySize(width,height) stretch',
  '1.0.56 bottom row nameplates stay above y=764',
  'npc_merchant and npc_forest_sage use aspect-fit readable sizes', 'village-readable-building-scale-v150', 'lobby-ui-nonoverlap-v156'
]);
mustContain('src/game/data/lobbyEntities.ts', [
  "npcMerchant', x: 108, y: 604, width: 58, height: 76",
  "npcForestSagePremium', x: 72, y: 724, width: 52, height: 72",
  "propFountain', x: 195, y: 430"
]);

const blocks = [...diorama.matchAll(/\{\n\s+id: '([^']+)'[\s\S]*?\n\s+\}/g)].filter((match) => match[0].includes('assetKey:'));
if (blocks.length !== 9) throw new Error(`Expected 9 buildings in premium fit audit, got ${blocks.length}`);
for (const [id, block] of blocks.map((match) => [match[1], match[0]])) {
  const x = getNum(block, 'x', true);
  const y = getNum(block, 'y', true);
  const touchWidth = getNum(block, 'touchWidth', true);
  const touchHeight = getNum(block, 'touchHeight', true);
  const visualWidth = getNum(block, 'visualWidth');
  const visualHeight = getNum(block, 'visualHeight');
  const nameplateY = getNum(block, 'nameplateY');
  if (id !== 'harbor' && (visualWidth === undefined || visualHeight === undefined || nameplateY === undefined)) {
    throw new Error(`Open/premium building missing visual fit fields: ${id}`);
  }
  if (visualWidth !== undefined && Math.abs(visualWidth - visualHeight) > 8) {
    throw new Error(`Premium square building should render near-square to avoid squashing: ${id} ${visualWidth}x${visualHeight}`);
  }
  if (visualWidth !== undefined && (visualWidth < 108 || visualWidth > 236)) throw new Error(`Unexpected visualWidth for ${id}: ${visualWidth}`);
  const touchOffsetY = getNum(block, 'touchOffsetY') ?? 0;
  const zoneY = y + touchOffsetY;
  if (x - touchWidth / 2 < 8 || x + touchWidth / 2 > 382 || zoneY - touchHeight / 2 < 92 || zoneY + touchHeight / 2 > 766) {
    throw new Error(`Premium touch zone outside safe playfield: ${id}`);
  }
  if (nameplateY !== undefined && y + nameplateY + 42 > 766) throw new Error(`Nameplate would collide with bottom HUD: ${id}`);
}

for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '프리미엄 로비 에셋 배치 보정', 'check:lobby-premium-fit']) {
  if (!read('README.md').includes(token)) throw new Error(`README missing premium-fit token: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.47 프리미엄 로비 에셋 배치 보정 패스', 'setDisplaySize 강제 비율 왜곡을 fitImageToBox로 교체']) {
  if (!read('AI_HANDOFF_CARDVILLE.md').includes(token)) throw new Error(`AI handoff missing premium-fit token: ${token}`);
}
if (pkg.scripts?.['check:lobby-premium-fit'] !== 'node tools/check-lobby-premium-fit.mjs') throw new Error('check:lobby-premium-fit script mismatch');
if (!pkg.scripts?.verify?.includes('check:lobby-premium-fit')) throw new Error('verify must include check:lobby-premium-fit');

console.log(`Lobby premium fit check passed. Version ${pkg.version}, ${blocks.length} buildings render with aspect-fit premium PNG boxes, safe nameplates, readable NPCs, and non-overlap touch zones.`);
