import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-intro-mask-floor-v174] ${message}`);
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
assert(pkg.scripts.verify.includes('check:intro-mask-floor-v174'), 'verify must include check:intro-mask-floor-v174');
assert(pkg.scripts['check:intro-mask-floor-v174'] === 'node tools/check-intro-mask-floor-v174.mjs', 'check script mismatch');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.75'",
  "cardville_intro_loading.mp4?v=1.0.75",
  'cardville-intro-video-control-mask',
  'intro-native-control-mask-v174',
  'cardvilleEnsureIntroControlMask',
  'cardvilleRemoveIntroControlMask',
  'window.__CARDVILLE_INTRO_VIDEO_KEEP_MASK__',
  'window.__CARDVILLE_INTRO_VIDEO_REMOVE_MASK__',
  '::-webkit-media-controls-progress-bar',
  'intro-no-progress-surface-v172',
  'legacy-code-revival-guard-v173'
]);
exclude('index.html', [
  "video.setAttribute('controls'",
  'progressBar = this.add',
  '로딩중',
  '로딩 중',
  '이동 중...'
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_INTRO_NATIVE_CONTROL_MASK_TAG',
  'intro-native-control-mask-v174',
  'window.__CARDVILLE_INTRO_VIDEO_KEEP_MASK__',
  'window.__CARDVILLE_INTRO_VIDEO_REMOVE_MASK__',
  'const MIN_INTRO_VIDEO_MS = 3000',
  'this.readyToContinue && this.minIntroDone',
  "video.controls = false",
  "video.removeAttribute('controls')"
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
  'INTRO_MASK_FLOOR_MOVE_TAG',
  'intro-mask-floor-move-v174',
  'FREE_PLAZA_FLOOR_WALK_TAG',
  'free-plaza-floor-walk-v174',
  'drawFreeWalkFloor()',
  'walkPartyToFreePoint',
  'silent-critical-asset-gate-no-bar'
]);
exclude('src/game/scenes/MainLobbyScene.ts', [
  'const barBg = this.add.rectangle',
  'const bar = this.add.rectangle',
  'targets: bar'
]);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
  assert(!text.includes('progressBar = this.add'), `${file} must not recreate a Phaser progress surface`);
  assert(!text.includes("video.setAttribute('controls'"), `${file} must not enable native video controls`);
}

include('public/build.json', ['"version": "1.0.75"', 'IntroMaskFloorMove', 'intro-native-control-mask-v174']);
include('public/health.html', ['version 1.0.75', 'IntroMaskFloorMove', 'intro-native-control-mask-v174']);
include('README.md', ['# CardVille 1.0.75', '## 1.0.75 업데이트 내역', 'IntroMaskFloorMove', 'CardVille_v1.0.75_IntroMaskFloorMove_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.75', 'IntroMaskFloorMove', 'intro-native-control-mask-v174', 'free-plaza-floor-walk-v174']);

const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-intro-mask-floor-v174] OK');
