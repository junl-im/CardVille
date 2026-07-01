import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-intro-clean-sweep-v172] ${message}`);
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
    const rel = path.join(dir, entry.name);
    if (['node_modules', 'dist'].includes(entry.name)) continue;
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.76', `expected package version 1.0.76, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:intro-clean-sweep-v172'), 'verify must include check:intro-clean-sweep-v172');
assert(pkg.scripts['check:intro-clean-sweep-v172'] === 'node tools/check-intro-clean-sweep-v172.mjs', 'check script mismatch');
assert(exists('public/assets/video/cardville_intro_loading.mp4'), 'intro mp4 missing');
assert(exists('public/assets/video/cardville_intro_poster.jpg'), 'intro poster missing');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.76'",
  "new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.76', document.baseURI).href",
  "new URL('./assets/video/cardville_intro_poster.jpg?v=1.0.76', document.baseURI).href",
  'intro-preplay-shield-v172',
  'intro-no-progress-surface-v172',
  'data-cardville-video-playing-v172',
  "#cardville-intro-video[data-cardville-video-playing-v172='false']",
  'cardvilleKeepIntroShield',
  'cardvilleRevealIntroVideo',
  'window.__CARDVILLE_INTRO_VIDEO_KEEP_SHIELD__',
  'window.__CARDVILLE_INTRO_VIDEO_REVEAL__',
  '::-webkit-media-controls-overlay-play-button',
  '::-webkit-media-controls-progress-bar',
  "video.removeAttribute('controls')",
  "video.controls = false",
  "video.disablePictureInPicture = true",
  "video.setAttribute('x-webkit-airplay', 'deny')",
  'old loading bars are quarantined'
]);
exclude('index.html', [
  "video.setAttribute('controls'",
  '로딩중',
  '로딩 중',
  '로딩바',
  'progressbar',
  'loading bar/copy on start',
  "video.src = '/CardVille/assets/video/cardville_intro_loading.mp4"
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_INTRO_PREPLAY_SHIELD_TAG',
  'intro-preplay-shield-v172',
  'CARDVILLE_INTRO_NO_PROGRESS_SURFACE_TAG',
  'intro-no-progress-surface-v172',
  'CARDVILLE_LEGACY_LOADING_QUARANTINE_TAG',
  'legacy-loading-code-quarantine-v172',
  "video.setAttribute('data-cardville-video-playing-v172', 'false')",
  "video.setAttribute('data-cardville-video-playing-v172', 'true')",
  'window.__CARDVILLE_INTRO_VIDEO_KEEP_SHIELD__?.(video)',
  'window.__CARDVILLE_INTRO_VIDEO_REVEAL__?.(video)',
  "video.addEventListener('loadeddata', keepShielded",
  "video.addEventListener('canplay', keepShielded",
  'this.readyToContinue && this.minIntroDone',
  'const MIN_INTRO_VIDEO_MS = 3000'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'progressBar = this.add',
  'this.add.text(l.cx',
  '게임 준비 중',
  '마을 건물 이미지 준비 중',
  '로딩중',
  '로딩 중',
  'delayedCall(4200'
]);

include('src/styles/index.css', [
  "#cardville-intro-video[data-cardville-video-playing-v172='false']",
  '::-webkit-media-controls-overlay-play-button',
  '::-webkit-media-controls-progress-bar'
]);
include('public/build.json', ['"version": "1.0.76"', 'IntroCleanSweep', 'intro-preplay-shield-v172', 'legacy-loading-code-quarantine-v172']);
include('public/health.html', ['version 1.0.76', 'IntroCleanSweep', 'intro-preplay-shield-v172', 'intro-no-progress-surface-v172']);
include('README.md', ['# CardVille 1.0.76', '## 1.0.76 업데이트 내역', 'IntroCleanSweep', 'CardVille_v1.0.76_IntroCleanSweep_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.76', 'IntroCleanSweep', 'legacy-loading-code-quarantine-v172', 'CardVille_v1.0.76_IntroCleanSweep_Full.zip']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
  assert(!text.includes('progressBar = this.add'), `${file} must not recreate old loading progress bar`);
  assert(!text.includes("video.setAttribute('controls'"), `${file} must not re-enable native video controls`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-intro-clean-sweep-v172] OK');
