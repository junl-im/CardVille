import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-lobby-comfort-v180] ${message}`);
    process.exit(1);
  }
};
const include = (file, tokens) => {
  const text = read(file);
  for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(text.includes(token), `${file} missing ${token}`);
};
const walk = (dir) => {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel.replaceAll('\\', '/'));
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.80', `expected package version 1.0.80, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(build.assetVersion === pkg.version, `assetVersion ${build.assetVersion} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:lobby-comfort-v180'), 'verify must include check:lobby-comfort-v180');
assert(pkg.scripts['check:lobby-comfort-v180'] === 'node tools/check-lobby-comfort-v180.mjs', 'lobby comfort script mismatch');

include('src/game/scenes/MainLobbyScene.ts', [
  "const LOBBY_VERSION = '1.0.80'",
  'floor-walk-comfort-timing-v180',
  'floor-walk-trail-follow-v180',
  'npc-clear-building-lane-v180',
  'const naturalSpeed = 112 * scale',
  'Phaser.Math.Clamp(Math.round((distance / naturalSpeed) * 1000), 920, 2400)',
  'this.startWalkAnimation(135)',
  'duration: Math.round(duration * 1.10)',
  'delay: 180',
  'Math.hypot(dx, dy)',
  'targetX - (dx / distance) * 34 * scale',
  'targetY - (dy / distance) * 20 * scale + 20 * scale',
  'npc-touch:${npc.key}:${NPC_BUILDING_TOUCH_SEPARATION_TAG}:${NPC_CLEAR_BUILDING_LANE_TAG}'
]);

include('src/game/data/lobbyEntities.ts', [
  'LOBBY_NPC_CLEAR_LANE_TAG',
  "x: 24, y: 512",
  "x: 366, y: 512",
  "x: 24, y: 646",
  "x: 366, y: 646",
  "x: 24, y: 746",
  "x: 366, y: 746",
  "x: 24, y: 574",
  '좌우 가장자리 보행 동선으로 분리 배치',
  'NPC 터치 박스는 건물보다 작게 유지'
]);

include('public/build.json', ['LobbyComfortCleanDelta', 'floor-walk-comfort-timing-v180', 'npc-clear-building-lane-v180']);
include('public/health.html', ['version 1.0.80', 'LobbyComfortCleanDelta', 'floor-walk-comfort-timing-v180', 'npc-clear-building-lane-v180']);
include('README.md', ['1.0.80', 'LobbyComfortCleanDelta', 'floor-walk-comfort-timing-v180', 'Delta Patch']);
include('AI_HANDOFF_CARDVILLE.md', ['1.0.80 - LobbyComfortCleanDelta', 'floor-walk-comfort-timing-v180', 'npc-clear-building-lane-v180']);

const mainLobby = read('src/game/scenes/MainLobbyScene.ts');
assert(!mainLobby.includes('duration: 430'), 'old fixed 430ms walk dash must not return');
assert(!mainLobby.includes('const naturalSpeed = 145 * scale'), 'old too-fast floor walk speed must not return');
assert(!mainLobby.includes('duration: Math.round(duration * 1.04)'), 'old cat follow timing must not return');
assert(!mainLobby.includes('side * 28 * scale'), 'old side-only cat follow target must not return');

const bannedLoadingTokens = ['로딩중', '로딩 중', '이동 중...', 'progressBar = this.add'];
for (const file of ['index.html', 'src/game/scenes/IntroLoadingScene.ts', 'src/game/scenes/MainLobbyScene.ts']) {
  const text = read(file);
  for (const token of bannedLoadingTokens) assert(!text.includes(token), `${file} must not revive ${token}`);
}

const allowedMarkdown = new Set([
  'README.md',
  'AI_HANDOFF_CARDVILLE.md',
  'docs/CARDVILLE_ART_DIRECTION_BIBLE.md',
  'docs/CARDVILLE_ASSET_PROMPT_PACK.md'
]);
for (const rel of walk('.').map((file) => file.replace(/^\.\//, ''))) {
  const base = path.basename(rel);
  const lower = base.toLowerCase();
  if (lower.endsWith('.md')) assert(allowedMarkdown.has(rel), `unexpected markdown record file: ${rel}`);
  assert(!/patch[_-]?notes|release[_-]?notes|changelog|update[_-]?notes/i.test(base), `unexpected patch/release note artifact: ${rel}`);
  assert(!lower.endsWith('.txt'), `unexpected txt record file: ${rel}`);
  assert(!lower.endsWith('.svg'), `SVG files are not allowed: ${rel}`);
}

console.log('[check-lobby-comfort-v180] OK');
