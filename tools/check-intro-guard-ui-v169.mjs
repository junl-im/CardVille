import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-intro-guard-ui-v169] ${message}`);
    process.exit(1);
  }
};
const include = (file, tokens) => {
  const text = read(file);
  for (const token of tokens) assert(text.includes(token), `${file} missing ${token}`);
};
const exclude = (file, tokens) => {
  const text = read(file);
  for (const token of tokens) assert(!text.includes(token), `${file} must not include ${token}`);
};
const walk = (dir) => {
  const output = [];
  if (!exists(dir)) return output;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...walk(rel));
    else output.push(rel);
  }
  return output;
};

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.71', `expected package version 1.0.71, got ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:intro-guard-ui-v169'), 'verify must include check:intro-guard-ui-v169');
assert(pkg.scripts['check:intro-guard-ui-v169'] === 'node tools/check-intro-guard-ui-v169.mjs', 'check:intro-guard-ui-v169 script mismatch');
assert(exists('public/assets/video/cardville_intro_loading.mp4'), 'intro video file missing');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.71'",
  '__CARDVILLE_INTRO_VIDEO_PRIME__',
  '__CARDVILLE_INTRO_VIDEO_PREPARE__',
  "new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.71', document.baseURI).href",
  'data-cardville-intro-touch-prime-v169',
  'data-cardville-started-at-zero-guard-v169',
  'video.style.display = \'block\'',
  "window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__ <= 0",
  'no generic loading copy/bar on boot'
]);
exclude('index.html', [
  "video.src = '/CardVille/assets/video/cardville_intro_loading.mp4",
  '로딩중',
  '로딩 중',
  'loading bar/copy on start'
]);

include('src/game/scenes/LoginScene.ts', [
  "start.on('buttondown', showIntro)",
  "google.on('buttondown', showIntro)",
  "email.on('buttondown', primeIntro)",
  "signup.on('buttondown', primeIntro)",
  "this.status.setText('')"
]);
include('src/game/scenes/IntroLoadingScene.ts', [
  'intro-touch-prime-v169',
  'intro-started-at-zero-guard-v169',
  'const rawStarted',
  'const started = rawStarted > 0 ? rawStarted : Date.now()',
  'MIN_INTRO_VIDEO_MS = 3000',
  'this.readyToContinue && this.minIntroDone',
  'data-cardville-started-at-zero-guard-v169',
  'video.loop = true'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'delayedCall(4200',
  'this.add.text(l.cx',
  'const width = Phaser.Math.Clamp(value',
  '게임 준비 중',
  '마을 건물 이미지 준비 중'
]);

include('src/game/ui/TextStyles.ts', [
  'global-micro-copy-v169',
  'prefs.largeText ? 1.08 : 0.98',
  'prefs.largeText ? 0.92 : 0.84',
  'size <= 11 ? 12'
]);
include('src/game/scenes/MainLobbyScene.ts', [
  'intro-guard-ui-polish-v169',
  'global-micro-copy-v169',
  'settings-panel-clamp-v169',
  'applyTightCopyBox(goldText(6)',
  'compactText(building.title, 6), goldText(8)',
  'const panelH = 354',
  '뒤로가기 한 번: 확인 · 한 번 더: 닫기 시도',
  'applyTightCopyBox(bodyText(11), panelW - 24, 28)'
]);
exclude('src/game/scenes/MainLobbyScene.ts', [
  'READY 1',
  "'OPEN'",
  "'LOCK'",
  '현재 로비 안전 규칙',
  '개별 PNG 사용'
]);
include('src/game/systems/RewardPopupSystem.ts', [
  'popup-copy-safe-v169',
  'popupW, 320',
  'noticeText(9)',
  '128'
]);
include('public/build.json', ['"version": "1.0.71"', 'IntroVideoHardVisible', 'intro-hard-visible-v170']);
include('public/health.html', ['version 1.0.71', 'IntroVideoHardVisible', 'intro-started-at-zero-guard-v169']);
include('README.md', ['# CardVille 1.0.71', '## 1.0.71 업데이트 내역', 'intro-hard-visible-v170', 'CardVille_v1.0.71_IntroVideoHardVisible_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.71', 'IntroVideoHardVisible', 'window.__CARDVILLE_INTRO_VIDEO_STARTED_AT__', 'CardVille_v1.0.71_IntroVideoHardVisible_Full.zip']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-intro-guard-ui-v169] OK');
