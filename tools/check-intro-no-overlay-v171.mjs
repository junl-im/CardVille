import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-intro-no-overlay-v171] ${message}`);
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
  const result = [];
  if (!exists(dir)) return result;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(rel));
    else result.push(rel);
  }
  return result;
};

const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.71', `expected package version 1.0.71, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:intro-no-overlay-v171'), 'verify must include check:intro-no-overlay-v171');
assert(pkg.scripts['check:intro-no-overlay-v171'] === 'node tools/check-intro-no-overlay-v171.mjs', 'check:intro-no-overlay-v171 script mismatch');
assert(exists('public/assets/video/cardville_intro_loading.mp4'), 'intro mp4 must exist');
assert(exists('public/assets/video/cardville_intro_poster.jpg'), 'intro poster shield image must exist');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.71'",
  "new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.71', document.baseURI).href",
  "new URL('./assets/video/cardville_intro_poster.jpg?v=1.0.71', document.baseURI).href",
  'cardville-intro-video-shield',
  'intro-no-native-video-ui-v171',
  'intro-playmark-shield-v171',
  'data-cardville-no-native-video-ui-v171',
  'data-cardville-intro-playmark-shield-v171',
  '::-webkit-media-controls-start-playback-button',
  '::-webkit-media-controls-timeline',
  "video.removeAttribute('controls')",
  "video.controls = false",
  "video.disablePictureInPicture = true",
  "video.setAttribute('x-webkit-airplay', 'deny')",
  'cardvilleHideIntroShield',
  'no generic loading copy/bar on boot'
]);
exclude('index.html', [
  "video.setAttribute('controls'",
  "video.style.opacity = '0'",
  "video.style.display = 'none'",
  '로딩중',
  '로딩 중',
  '로딩바',
  'progressbar',
  'progressBar = this.add'
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  'CARDVILLE_INTRO_NO_NATIVE_UI_TAG',
  'intro-no-native-video-ui-v171',
  'CARDVILLE_INTRO_PLAYMARK_SHIELD_TAG',
  'intro-playmark-shield-v171',
  'CARDVILLE_INTRO_NO_LOADING_SURFACE_TAG',
  'intro-no-loading-surface-v171',
  'const MIN_INTRO_VIDEO_MS = 3000',
  'expectedPoster',
  "video.removeAttribute('controls')",
  "video.controls = false",
  'disablePictureInPicture',
  'disableRemotePlayback',
  "video.setAttribute('x-webkit-airplay', 'deny')",
  "window.__CARDVILLE_INTRO_VIDEO_HIDE_SHIELD__?.()",
  'this.readyToContinue && this.minIntroDone'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'progressBar = this.add',
  'this.add.text(l.cx',
  '게임 준비 중',
  '마을 건물 이미지 준비 중',
  '로딩중',
  '로딩 중',
  '로딩바',
  'delayedCall(4200'
]);

include('src/styles/index.css', [
  '#cardville-intro-video',
  '#cardville-intro-video-shield',
  '::-webkit-media-controls-start-playback-button',
  '::-webkit-media-controls-timeline',
  'intro-no-native-video-ui-v171'
]);
include('public/build.json', ['"version": "1.0.71"', 'IntroNoOverlayPolish', 'intro-no-native-video-ui-v171', 'intro-no-loading-surface-v171']);
include('public/health.html', ['version 1.0.71', 'IntroNoOverlayPolish', 'intro-no-native-video-ui-v171', 'intro-playmark-shield-v171']);
include('README.md', ['# CardVille 1.0.71', '## 1.0.71 업데이트 내역', 'IntroNoOverlayPolish', 'CardVille_v1.0.71_IntroNoOverlayPolish_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.71', 'IntroNoOverlayPolish', 'intro-no-native-video-ui-v171', 'CardVille_v1.0.71_IntroNoOverlayPolish_Full.zip']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-intro-no-overlay-v171] OK');
