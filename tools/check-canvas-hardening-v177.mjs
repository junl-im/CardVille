import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => { if (!condition) { console.error(`[check-canvas-hardening-v177] ${message}`); process.exit(1); } };
const include = (file, tokens) => { const text = read(file); for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(text.includes(token), `${file} missing ${token}`); };
const walk = (dir) => {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['node_modules','dist','.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel)); else out.push(rel);
  }
  return out;
};
const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.78', `expected package version 1.0.78, got ${pkg.version}`);
include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.78'",
  'raw-video-offscreen-v177',
  'canvas-frame-preroll-v177',
  'cardvilleForceRawIntroOffscreen',
  'data-cardville-raw-offscreen-v177',
  'cardvilleStartIntroCanvasMirror',
  'cardvilleEnsureIntroCanvas',
  'height:max(176px,34dvh)'
]);
include('src/styles/index.css', ['raw-video-offscreen-v177', 'height:max(176px,34dvh)', 'clip-path:inset(50%)']);
include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_INTRO_RAW_OFFSCREEN_TAG',
  'CARDVILLE_CANVAS_PREROLL_TAG',
  'forceRawIntroOffscreen',
  "video.style.left = '-9999px'",
  "video.style.setProperty('opacity', '0')",
  'data-cardville-canvas-frame-preroll-v177'
]);
include('src/game/scenes/MainLobbyScene.ts', [
  'FLOOR_WALK_TAP_DEBOUNCE_TAG',
  'floor-walk-tap-debounce-v177',
  'FLOOR_WALK_TARGET_CLAMP_TAG',
  'floor-walk-target-clamp-v177',
  'this.lastFloorWalkAt',
  'Phaser.Math.Distance.Between',
  'setDepth'
]);
include('public/build.json', ['RawOffscreenCanvasGuard', 'raw-video-offscreen-v177', 'canvas-frame-preroll-v177', 'floor-walk-debounce-v177']);
include('public/health.html', ['version 1.0.78', 'raw-video-offscreen-v177', 'canvas-frame-preroll-v177']);
for (const file of walk('.').filter((name) => /\.(ts|tsx|html|css)$/.test(name) || name === 'index.html')) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
  assert(!text.includes('progressBar = this.add'), `${file} must not recreate Phaser progress surfaces`);
  assert(!text.includes("video.setAttribute('controls'"), `${file} must not enable native video controls`);
}
console.log('[check-canvas-hardening-v177] OK');
