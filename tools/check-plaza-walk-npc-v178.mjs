import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => { if (!condition) { console.error(`[check-plaza-walk-npc-v178] ${message}`); process.exit(1); } };
const include = (file, tokens) => { const text = read(file); for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(text.includes(token), `${file} missing ${token}`); };
const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.79', `expected package version 1.0.79, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:plaza-walk-npc-v178'), 'verify must include check:plaza-walk-npc-v178');
include('src/game/scenes/MainLobbyScene.ts', [
  "const LOBBY_VERSION = '1.0.79'",
  'floor-walk-natural-pace-v178',
  'floor-walk-diagonal-v178',
  'npc-building-touch-separation-v178',
  'clampFreeWalkTarget',
  'freeWalkDuration',
  'trailingCatTarget',
  'faceWalkDirection',
  'duration: Math.round(duration * 1.04)',
  'npc-touch:${npc.key}',
  'Math.round((distance / naturalSpeed) * 1000)'
]);
include('src/game/data/lobbyEntities.ts', [
  'LOBBY_NPC_TAP_SEPARATION_TAG',
  'touchWidth?: number',
  "x: 128, y: 512",
  "x: 254, y: 512",
  "x: 132, y: 646",
  "x: 260, y: 646",
  "x: 128, y: 746",
  "x: 270, y: 746",
  '건물 터치와 NPC 터치가 겹치지 않도록'
]);
include('README.md', [
  'PlazaWalkNpcPolish',
  'CardVille_v1.0.79_RawOffscreenCanvasGuard_Full.zip',
  'CardVille_v1.0.79_PlazaWalkNpcPolish_DeltaPatch.zip',
  'public/assets` 전체는 포함하지 않습니다'
]);
include('AI_HANDOFF_CARDVILLE.md', [
  '1.0.79 PlazaWalkNpcPolish',
  'floor-walk-natural-pace-v178',
  'npc-tap-zone-shrink-v178'
]);
include('public/build.json', ['PlazaWalkNpcPolish', 'floor-walk-natural-pace-v178', 'floor-walk-diagonal-v178', 'npc-building-touch-separation-v178']);
include('public/health.html', ['version 1.0.79', 'PlazaWalkNpcPolish', 'floor-walk-natural-pace-v178']);
assert(!read('src/game/scenes/MainLobbyScene.ts').includes('duration: 430'), 'old fixed 430ms floor dash must not remain');
assert(!read('src/game/scenes/MainLobbyScene.ts').includes('width + 34 * scale, height + 42 * scale'), 'old oversized NPC hit zone must not remain');
const banned = ['로딩중', '로딩 중', '이동 중...', 'progressBar = this.add'];
for (const file of ['index.html','src/game/scenes/IntroLoadingScene.ts','src/game/scenes/MainLobbyScene.ts']) {
  const text = read(file);
  for (const token of banned) assert(!text.includes(token), `${file} must not revive ${token}`);
}
console.log('[check-plaza-walk-npc-v178] OK');
