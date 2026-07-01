import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-canvas-intro-floor-v175] ${message}`);
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
assert(pkg.version === '1.0.75', `expected package version 1.0.75, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:canvas-intro-floor-v175'), 'verify must include check:canvas-intro-floor-v175');
assert(pkg.scripts['check:canvas-intro-floor-v175'] === 'node tools/check-canvas-intro-floor-v175.mjs', 'check script mismatch');
assert(exists('public/assets/video/cardville_intro_loading.mp4'), 'intro mp4 must exist');
assert(exists('public/assets/video/cardville_intro_poster.jpg'), 'intro poster must exist');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.75'",
  'cardville-intro-video-canvas',
  'intro-canvas-video-surface-v175',
  'legacy-loading-ui-deadlock-v175',
  'cardvilleEnsureIntroCanvas',
  'cardvillePaintIntroCanvasFrame',
  'cardvilleStartIntroCanvasMirror',
  'cardvilleStopIntroCanvasMirror',
  'data-cardville-canvas-video-v175',
  'data-cardville-canvas-painted-v175',
  'window.__CARDVILLE_INTRO_CANVAS_START__',
  'window.__CARDVILLE_INTRO_CANVAS_STOP__',
  'video.removeAttribute(\'controls\')',
  'cardvilleStripNativeVideoUi',
  'intro-native-control-mask-v174',
  'intro-no-progress-surface-v172'
]);
exclude('index.html', [
  "video.setAttribute('controls'",
  'progressBar = this.add',
  '로딩중',
  '로딩 중',
  '이동 중...'
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_INTRO_CANVAS_VIDEO_TAG',
  'intro-canvas-video-surface-v175',
  'CARDVILLE_LEGACY_LOADING_DEADLOCK_TAG',
  'legacy-loading-ui-deadlock-v175',
  'window.__CARDVILLE_INTRO_CANVAS_START__?.(video)',
  'window.__CARDVILLE_INTRO_CANVAS_STOP__?.()',
  'CARDVILLE_INTRO_NATIVE_CONTROL_MASK_TAG',
  'const MIN_INTRO_VIDEO_MS = 3000',
  'this.readyToContinue && this.minIntroDone'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'private progressBar',
  'updateProgressBar',
  'progressBar = this.add',
  'this.add.text(l.cx',
  'delayedCall(4200',
  '로딩중',
  '로딩 중'
]);

include('src/game/scenes/MainLobbyScene.ts', [
  'FLOOR_WALK_HIT_GUARD_TAG',
  'floor-walk-hit-guard-v175',
  'FREE_PLAZA_FLOOR_WALK_TAG',
  'drawFreeWalkFloor()',
  'walkPartyToFreePoint',
  'blockedByInteractiveSurface',
  'targetObjects.some'
]);
exclude('src/game/scenes/MainLobbyScene.ts', [
  'const barBg = this.add.rectangle',
  'const bar = this.add.rectangle',
  'targets: bar'
]);

include('src/styles/index.css', ['#cardville-intro-video-canvas', 'data-cardville-canvas-video-v175']);
include('public/build.json', ['"version": "1.0.75"', 'CanvasIntroFloorPolish', 'intro-canvas-video-surface-v175', 'floor-walk-hit-guard-v175']);
include('public/health.html', ['version 1.0.75', 'CanvasIntroFloorPolish', 'intro-canvas-video-surface-v175']);
include('README.md', ['# CardVille 1.0.75', '## 1.0.75 업데이트 내역', 'CanvasIntroFloorPolish', 'CardVille_v1.0.75_CanvasIntroFloorPolish_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.75', 'CanvasIntroFloorPolish', 'intro-canvas-video-surface-v175', 'floor-walk-hit-guard-v175']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
  assert(!text.includes('progressBar = this.add'), `${file} must not recreate a Phaser progress surface`);
  assert(!text.includes("video.setAttribute('controls'"), `${file} must not enable native video controls`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-canvas-intro-floor-v175] OK');
