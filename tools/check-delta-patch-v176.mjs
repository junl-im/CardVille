import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-delta-patch-v176] ${message}`);
    process.exit(1);
  }
};
const include = (file, tokens) => {
  const text = read(file);
  for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(text.includes(token), `${file} missing ${token}`);
};
const exclude = (file, tokens) => {
  const text = read(file);
  for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(!text.includes(token), `${file} must not include ${token}`);
};
const walk = (dir) => {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.79', `expected package version 1.0.79, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:delta-patch-v176'), 'verify must include check:delta-patch-v176');
assert(pkg.scripts['check:delta-patch-v176'] === 'node tools/check-delta-patch-v176.mjs', 'delta check script mismatch');

include('public/build.json', ['DeltaPatchCanvasGuard', 'delta-patch-overwrite-v176', 'intro-canvas-only-video-surface-v176', 'floor-walk-interaction-v176']);
include('README.md', [
  'DeltaPatchCanvasGuard',
  'CardVille_v1.0.75_CanvasIntroFloorPolish_Full.zip',
  'CardVille_v1.0.79_DeltaPatchCanvasGuard_DeltaPatch.zip',
  '덮어쓰기용 Delta Patch',
  'public/assets` 전체를 넣지 않습니다'
]);
include('AI_HANDOFF_CARDVILLE.md', [
  'DeltaPatchCanvasGuard',
  'CardVille_v1.0.75_CanvasIntroFloorPolish_Full.zip',
  'CardVille_v1.0.79_DeltaPatchCanvasGuard_DeltaPatch.zip',
  'delta-patch-overwrite-v176',
  'intro-canvas-only-video-surface-v176'
]);
include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.79'",
  "cardvilleIntroSrc(){ return new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.79'",
  'delta-patch-overwrite-v176',
  'intro-canvas-only-video-surface-v176',
  "data-cardville-canvas-only-video-surface-v176",
  'cardvilleStartIntroCanvasMirror',
  'cardvilleStripNativeVideoUi'
]);
include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_INTRO_CANVAS_ONLY_VIDEO_TAG',
  'intro-canvas-only-video-surface-v176',
  'CARDVILLE_DELTA_PATCH_OVERWRITE_TAG',
  'delta-patch-overwrite-v176',
  'data-cardville-canvas-only-video-surface-v176'
]);
include('src/game/scenes/MainLobbyScene.ts', [
  'FLOOR_WALK_INTERACTION_TAG',
  'floor-walk-interaction-v176',
  'lobby-settings-button',
  'bottom-hint',
  'settings:',
  'blockedByInteractiveSurface'
]);
include('src/styles/index.css', ['intro-canvas-only-video-surface-v176', 'clip-path:inset(50%)']);

for (const file of walk('.').filter((name) => /\.(ts|tsx|html|css)$/.test(name) || name === 'index.html')) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
  assert(!text.includes('progressBar = this.add'), `${file} must not recreate Phaser progress surfaces`);
  assert(!text.includes("video.setAttribute('controls'"), `${file} must not enable native video controls`);
}
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-delta-patch-v176] OK');
