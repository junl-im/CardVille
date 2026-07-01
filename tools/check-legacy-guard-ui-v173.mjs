import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-legacy-guard-ui-v173] ${message}`);
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
assert(pkg.version === '1.0.76', `expected package version 1.0.76, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:legacy-guard-ui-v173'), 'verify must include check:legacy-guard-ui-v173');
assert(pkg.scripts['check:legacy-guard-ui-v173'] === 'node tools/check-legacy-guard-ui-v173.mjs', 'check script mismatch');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.76'",
  "new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.76', document.baseURI).href",
  "new URL('./assets/video/cardville_intro_poster.jpg?v=1.0.76', document.baseURI).href",
  'cardvilleStripNativeVideoUi',
  'cardvilleScrubNativeVideoUi',
  'intro-no-phaser-progress-v173',
  'legacy-code-revival-guard-v173',
  'production-debug-overlay-kill-v173',
  '::-webkit-media-controls-loading-panel',
  'data-cardville-no-phaser-progress-v173'
]);
exclude('index.html', [
  "video.setAttribute('controls'",
  'progressBar = this.add',
  '로딩중',
  '로딩 중',
  '이동 중...'
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_NO_PHASER_PROGRESS_TAG',
  'intro-no-phaser-progress-v173',
  'CARDVILLE_LEGACY_CODE_GUARD_TAG',
  'legacy-code-revival-guard-v173',
  'const MIN_INTRO_VIDEO_MS = 3000',
  'this.readyToContinue && this.minIntroDone',
  "video.controls = false",
  "video.removeAttribute('controls')",
  'disablePictureInPicture',
  'disableRemotePlayback'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'private progressBar',
  'updateProgressBar',
  'progressBar = this.add',
  'this.add.text(l.cx',
  'delayedCall(4200',
  '게임 준비 중',
  '마을 건물 이미지 준비 중',
  '로딩중',
  '로딩 중'
]);

include('src/game/systems/LayoutSystem.ts', [
  'PRODUCTION_DEBUG_OVERLAY_KILL_TAG',
  'production-debug-overlay-kill-v173',
  'if (import.meta.env.PROD) return false',
  "window.localStorage?.getItem('cardvilleTouchDebug')"
]);
exclude('src/game/systems/LayoutSystem.ts', "new URLSearchParams(window.location.search).has('touchDebug')");
include('src/game/ui/GameButton.ts', ['hasTouchDebug()']);
exclude('src/game/ui/GameButton.ts', "new URLSearchParams(window.location.search).has('touchDebug')");
include('public/build.json', ['"version": "1.0.76"', 'LegacyGuardUIPolish', 'intro-no-phaser-progress-v173', 'legacy-code-revival-guard-v173']);
include('public/health.html', ['version 1.0.76', 'LegacyGuardUIPolish', 'production-debug-overlay-kill-v173']);
include('README.md', ['# CardVille 1.0.76', '## 1.0.76 업데이트 내역', 'LegacyGuardUIPolish', 'CardVille_v1.0.76_LegacyGuardUIPolish_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.76', 'LegacyGuardUIPolish', 'legacy-code-revival-guard-v173', 'CardVille_v1.0.76_LegacyGuardUIPolish_Full.zip']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
  assert(!text.includes('progressBar = this.add'), `${file} must not recreate a Phaser progress surface`);
  assert(!text.includes("video.setAttribute('controls'"), `${file} must not enable native video controls`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-legacy-guard-ui-v173] OK');
