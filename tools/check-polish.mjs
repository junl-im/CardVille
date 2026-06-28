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
    if (!text.includes(token)) throw new Error(`${file} missing token: ${token}`);
  }
  return text;
}

const main = mustContain('src/main.ts', ['type: Phaser.AUTO', 'Phaser.Scale.EXPAND', 'polish audit engine']);
if (main.includes('type: Phaser.CANVAS')) throw new Error('Renderer must not be hard-forced to Phaser.CANVAS');

mustContain('src/game/systems/QualitySystem.ts', ['getCardVilleQuality', 'scaledCount', 'qualitySummary', 'prefers-reduced-motion']);
mustContain('src/game/data/lobbyEntities.ts', ['LOBBY_PROPS', 'LOBBY_NPCS', 'LOBBY_SAFE_RULES', 'npcMerchant', 'propFountain']);
mustContain('src/game/data/modeCatalog.ts', ['GAME_MODES', "id: 'math'", "id: 'memory'", 'nextWork']);
mustContain('src/game/scenes/MainLobbyScene.ts', ['getCardVilleQuality', 'scaledCount', 'qualitySummary', 'LOBBY_SAFE_RULES', 'toastBg?.destroy']);
mustContain('src/game/scenes/ModeSelectScene.ts', ['GAME_MODES', 'focusModeId', 'showPlannedToast', '추천']);
mustContain('src/game/data/dioramaBuildings.ts', ["scene: 'MathLabScene'", "scene: 'MemoryForestScene'", "scene: 'ModeSelectScene'"]);
mustContain('src/game/systems/LayoutSystem.ts', ['b.visibleX + b.visibleWidth / 2', 'b.visibleY + b.visibleHeight / 2']);

const buildings = read('src/game/data/dioramaBuildings.ts');
const buildingIds = [...buildings.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);
const duplicateBuildings = buildingIds.filter((id, index) => buildingIds.indexOf(id) !== index);
if (duplicateBuildings.length) throw new Error(`Duplicate building ids: ${duplicateBuildings.join(', ')}`);
if (buildingIds.length < 9) throw new Error(`Expected at least 9 diorama buildings, found ${buildingIds.length}`);

const modeCatalog = read('src/game/data/modeCatalog.ts');
for (const required of ['library', 'laboratory', 'forest', 'school', 'event']) {
  if (!modeCatalog.includes(`buildingId: '${required}'`)) throw new Error(`modeCatalog missing building assignment: ${required}`);
}

const lobbyEntities = read('src/game/data/lobbyEntities.ts');
const npcKeys = new Set([...lobbyEntities.matchAll(/key: '(npc[^']+)'/g)].map((match) => match[1]));
for (const npc of [...buildings.matchAll(/npcKey: '([^']+)'/g)].map((match) => match[1])) {
  if (!npcKeys.has(npc)) throw new Error(`Building references missing NPC key in lobbyEntities: ${npc}`);
}

const pkgScripts = pkg.scripts ?? {};
if (!pkgScripts.verify?.includes('check:polish')) throw new Error('verify must include check:polish');
if (pkgScripts['check:polish'] !== 'node tools/check-polish.mjs') throw new Error('check:polish script mismatch');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'QualitySystem', 'modeCatalog.ts', 'check:polish']) {
  if (!readme.includes(token)) throw new Error(`README missing ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, 'QualitySystem.ts', 'modeCatalog.ts', 'Phaser AUTO']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing ${token}`);
}

console.log(`Polish check passed. Version ${pkg.version}, renderer AUTO, quality system, lobby entities, mode catalog, and diorama assignments OK.`);
