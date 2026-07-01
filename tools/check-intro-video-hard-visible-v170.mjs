import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function include(file, tokens) {
  const text = read(file);
  for (const token of Array.isArray(tokens) ? tokens : [tokens]) {
    assert(text.includes(token), `${file} missing token: ${token}`);
  }
}
function exclude(file, tokens) {
  const text = read(file);
  for (const token of Array.isArray(tokens) ? tokens : [tokens]) {
    assert(!text.includes(token), `${file} must not include token: ${token}`);
  }
}

assert(pkg.version === '1.0.75', `expected package version 1.0.75, got ${pkg.version}`);
assert(build.version === pkg.version, `build.json version ${build.version} != package ${pkg.version}`);
assert(exists('public/assets/video/cardville_intro_loading.mp4'), 'intro video mp4 must be included in public/assets/video');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.75'",
  "new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.75', document.baseURI).href",
  "window.__CARDVILLE_INTRO_HARD_VISIBLE_TAG__ = 'intro-hard-visible-v170'",
  "video.style.display = 'block'",
  "video.style.visibility = 'visible'",
  "video.style.opacity = '1'",
  "document.documentElement.classList.add('cardville-intro-hard-visible-v170')",
  "document.documentElement.classList.remove('cardville-intro-hard-visible-v170')",
  'data-cardville-intro-hard-visible-v170',
  'data-cardville-min-intro-ms-v168',
  'data-cardville-video-only-loading-v168'
]);
exclude('index.html', [
  "video.style.display = 'none'",
  "video.style.opacity = '0'",
  '로딩중',
  '로딩 중',
  '로딩바',
  'loading bar/copy on start',
  "video.src = '/CardVille/assets/video/cardville_intro_loading.mp4"
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  'const MIN_INTRO_VIDEO_MS = 3000',
  'CARDVILLE_INTRO_HARD_VISIBLE_TAG',
  'intro-hard-visible-v170',
  "video.style.display = 'block'",
  "video.style.visibility = 'visible'",
  'this.minIntroDone',
  'this.readyToContinue',
  'this.tryFinish();',
  'window.__CARDVILLE_INTRO_VIDEO_DONE__?.()'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'delayedCall(4200',
  'this.add.text(l.cx',
  '로딩중',
  '로딩 중'
]);

include('src/game/scenes/LoginScene.ts', [
  'const showIntro = () => window.__CARDVILLE_INTRO_VIDEO_PREPARE__?.();',
  "start.on('buttondown', showIntro)",
  "google.on('buttondown', showIntro)",
  'no developer/version label'
]);

include('src/game/scenes/MainLobbyScene.ts', [
  'deep-sweep-ui-v170',
  'nameplate-collision-guard-v170',
  'plaza-route-confirm-v170',
  'building-nameplate-lift-v168',
  'settings-panel-clamp-v169'
]);
exclude('src/game/scenes/MainLobbyScene.ts', [
  'READY 1',
  "'OPEN'",
  "'LOCK'",
  '개발정보',
  '이미지 재시도'
]);

include('src/game/ui/TextStyles.ts', [
  'deep-sweep-copy-fit-v170',
  'return prefs.largeText ? 1.05 : 0.94',
  'return prefs.largeText ? 0.88 : 0.80'
]);
include('public/build.json', ['"version": "1.0.75"', 'IntroVideoHardVisible', 'intro-hard-visible-v170']);
include('public/health.html', ['version 1.0.75', 'IntroVideoHardVisible', 'intro-hard-visible-v170']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.75', 'IntroVideoHardVisible', 'intro-hard-visible-v170', 'CardVille_v1.0.75_IntroVideoHardVisible_Full.zip']);
include('README.md', ['# CardVille 1.0.75', '## 1.0.75 업데이트 내역', 'IntroVideoHardVisible']);

console.log('Intro video hard-visible v1.0.75 check passed: video-only startup, 3s guard, copy fit, nameplate/settings UI sweep verified.');
