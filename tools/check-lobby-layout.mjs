import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function must(file, tokens) {
  const text = read(file);
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${file} missing token: ${token}`);
  }
  return text;
}

const diorama = must('src/game/data/dioramaBuildings.ts', ['touchWidth', 'touchHeight', 'touchOffsetY', "modeId: 'daily'"]);
must('src/game/data/lobbyLayoutPlan.ts', ['LOBBY_LAYOUT_PLAN_VERSION', 'LOBBY_SAFE_ZONES', 'LOBBY_DESIGN_CHECKS', 'MIN_TOUCH_SIZE', 'rectsOverlap']);
must('src/game/scenes/MainLobbyScene.ts', ['drawAtmosphericPolish', 'getRecommendedBuildingId', 'drawRecommendedTrail', 'drawBuildingStatusChip', 'addCoverImage', 'LOBBY_LAYOUT_PLAN_VERSION', 'building.touchWidth']);

const objectBlocks = [...diorama.matchAll(/\{\n\s+id: '([^']+)'[\s\S]*?\n\s+\}/g)].filter((match) => match[0].includes('assetKey:'));
if (objectBlocks.length !== 9) throw new Error(`Expected 9 diorama buildings, found ${objectBlocks.length}`);

function getNum(block, name) {
  const match = block.match(new RegExp(`${name}: ([0-9]+)`));
  if (!match) throw new Error(`Missing ${name} in block: ${block.slice(0, 80)}`);
  return Number(match[1]);
}

const rects = objectBlocks.map((match) => {
  const block = match[0];
  const id = match[1];
  const x = getNum(block, 'x');
  const y = getNum(block, 'y') + (block.match(/touchOffsetY: ([0-9]+)/)?.[1] ? Number(block.match(/touchOffsetY: ([0-9]+)/)[1]) : 0);
  const width = getNum(block, 'touchWidth');
  const height = getNum(block, 'touchHeight');
  if (width < 44 || height < 44) throw new Error(`Touch zone too small for ${id}: ${width}x${height}`);
  if (x - width / 2 < 8 || x + width / 2 > 382 || y - height / 2 < 92 || y + height / 2 > 746) {
    throw new Error(`Touch zone outside mobile safe playfield for ${id}: ${JSON.stringify({ x, y, width, height })}`);
  }
  return { id, x, y, width, height };
});

for (let i = 0; i < rects.length; i += 1) {
  for (let j = i + 1; j < rects.length; j += 1) {
    const a = rects[i];
    const b = rects[j];
    const overlapX = Math.max(0, Math.min(a.x + a.width / 2, b.x + b.width / 2) - Math.max(a.x - a.width / 2, b.x - b.width / 2));
    const overlapY = Math.max(0, Math.min(a.y + a.height / 2, b.y + b.height / 2) - Math.max(a.y - a.height / 2, b.y - b.height / 2));
    if (overlapX > 0 && overlapY > 0) throw new Error(`Overlapping lobby touch zones: ${a.id} / ${b.id} (${overlapX}x${overlapY})`);
  }
}

const openBuildings = objectBlocks.filter((match) => match[0].includes('open: true')).map((match) => match[1]);
for (const required of ['library', 'laboratory', 'shop', 'forest', 'event']) {
  if (!openBuildings.includes(required)) throw new Error(`Expected open building: ${required}`);
}

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '로비 배치/겹침 감사', 'cover 배경', 'check:lobby-layout']) {
  if (!readme.includes(token)) throw new Error(`README missing lobby-layout token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.32 디자인/성능/품질 패스', 'touchWidth']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing lobby-layout token: ${token}`);
}
if (pkg.scripts?.['check:lobby-layout'] !== 'node tools/check-lobby-layout.mjs') throw new Error('check:lobby-layout script mismatch');
if (!pkg.scripts?.verify?.includes('check:lobby-layout')) throw new Error('verify must include check:lobby-layout');

console.log(`Lobby layout check passed. Version ${pkg.version}, ${rects.length} non-overlapping touch zones and design status checks verified.`);
