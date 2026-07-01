import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-intro-video-min-v168] ${message}`);
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
  const out = [];
  if (!exists(dir)) return out;
  for (const name of fs.readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, name);
    const stat = fs.statSync(path.join(root, rel));
    if (stat.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.69', `expected package version 1.0.69, got ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:intro-video-min-v168'), 'verify must include check:intro-video-min-v168');
assert(pkg.scripts['check:intro-video-min-v168'] === 'node tools/check-intro-video-min-v168.mjs', 'check script mismatch');
assert(exists('public/assets/video/cardville_intro_loading.mp4'), 'intro video asset missing from public/assets/video');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.69'",
  '__CARDVILLE_INTRO_VIDEO_STARTED_AT__',
  "new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.69', document.baseURI).href",
  'data-cardville-min-intro-ms-v168',
  'data-cardville-video-only-loading-v168',
  "video.style.zIndex = '2147482000'",
  'try { video.load(); }',
]);
exclude('index.html', [
  "video.src = '/CardVille/assets/video/cardville_intro_loading.mp4",
  '로딩중',
  '로딩 중',
  'loading copy on start. The opening video is forced visible for at least 3 seconds, then remains until assets are ready.'
]);

include('src/game/scenes/IntroLoadingScene.ts', [
  "intro-min-3s-video-v168",
  "video-only-loading-v168",
  'const MIN_INTRO_VIDEO_MS = 3000',
  'armMinimumIntroHold',
  'MIN_INTRO_VIDEO_MS - elapsed',
  'this.minIntroDone = true',
  'this.readyToContinue && this.minIntroDone',
  'video.loop = true',
  'this.progressBar = undefined',
  'data-cardville-min-intro-ms-v168',
  'tryReplayVideo'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', [
  'delayedCall(4200',
  'this.minIntroDone = true;\n    // 1.0.63',
  'const width = Phaser.Math.Clamp(value',
  'this.add.text(l.cx',
  '게임 준비 중',
  '마을 건물 이미지 준비 중'
]);

include('src/game/scenes/MainLobbyScene.ts', [
  'lobby-recommend-copy-fit-v168',
  'building-nameplate-lift-v168',
  'settings-copy-safe-v168',
  'plaza-touch-route-expand-v168',
  'applyTightCopyBox(goldText(7)',
  'compactText(building.title, 6)',
  '화면과 조작을 편하게 조정해요.',
  'zone.setName(building.id === \'plaza\' ? PLAZA_TAP_ROUTE_EXPAND_TAG'
]);
exclude('src/game/scenes/MainLobbyScene.ts', [
  '현재 로비 안전 규칙',
  '개별 PNG 사용',
  'READY 1'
]);

include('src/game/ui/TextStyles.ts', [
  'ultra-copy-fit-v168',
  'global-micro-copy-v169',
  'prefs.largeText ? 1.08 : 0.98',
  'prefs.largeText ? 0.92 : 0.84',
  'size <= 11 ? 12'
]);
include('src/game/systems/CoachMarkSystem.ts', ['coach-copy-fit-v168', 'applyTightCopyBox(bodyText(bodySize), width - 48, 72']);
include('src/game/systems/RewardPopupSystem.ts', ['popup-copy-room-v168', 'popup-copy-safe-v169', 'popupW, 320', 'noticeText(9)', '128']);
include('src/game/systems/BackButtonSystem.ts', ['double-back-exit-v168', 'requestKakaoInAppClose', 'BackButtonSystem.requestExit(); // double-back-exit-v168']);
include('src/game/scenes/BackConfirmScene.ts', ['뒤로가기 한 번 더 또는 나가기 버튼으로 창 닫기를 시도합니다.']);
include('public/build.json', ['"version": "1.0.69"', 'IntroVideoMinFit', 'intro-min-3s-video-v168']);
include('public/health.html', ['version 1.0.69', 'IntroVideoMinFit', 'intro-min-3s-video-v168']);
include('README.md', ['# CardVille 1.0.69', '## 1.0.69 업데이트 내역', 'intro-min-3s-video-v168', 'CardVille_v1.0.69_IntroGuardUIPolish_Full.zip']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.69', 'IntroVideoMinFit', 'MIN_INTRO_VIDEO_MS = 3000', '새 docs 문서 생성 금지']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-intro-video-min-v168] OK');
