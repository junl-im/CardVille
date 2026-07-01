import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-intro-exit-copy-v167] ${message}`);
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
assert(pkg.version === '1.0.75', `expected package version 1.0.75, got ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:intro-exit-copy-v167'), 'verify must include check:intro-exit-copy-v167');
assert(pkg.scripts['check:intro-exit-copy-v167'] === 'node tools/check-intro-exit-copy-v167.mjs', 'check script mismatch');

include('index.html', [
  "window.__CARDVILLE_VERSION__ = '1.0.75'",
  '__CARDVILLE_INTRO_VIDEO_PREPARE__',
  '__CARDVILLE_INTRO_VIDEO_DONE__',
  'cardville_intro_loading.mp4?v=1.0.75',
  'data-cardville-silent-intro-video-v167',
  'zIndex = \'2147482000\''
]);
include('src/game/scenes/LoginScene.ts', [
  "const LOGIN_VERSION = '';",
  '__CARDVILLE_INTRO_VIDEO_PREPARE__?.();',
  "this.status.setText('');",
  'no developer/version label'
]);
exclude('src/game/scenes/LoginScene.ts', ['오프닝 영상과 함께 게임을 준비합니다.', 'this.add.text(342, 28']);

include('src/game/scenes/IntroLoadingScene.ts', [
  'intro-video-restore-v167',
  '__CARDVILLE_INTRO_VIDEO_PREPARE__?.()',
  'document.body.appendChild(video)',
  'video.loop = true',
  'keepSilentFallback',
  '__CARDVILLE_INTRO_VIDEO_DONE__?.()'
]);
exclude('src/game/scenes/IntroLoadingScene.ts', ['onVideoBlocked', 'video.remove();\n        this.videoEl = undefined', 'this.add.text(l.cx']);

include('src/game/scenes/MainLobbyScene.ts', [
  'lobby-copy-collision-fix-v167',
  'applyTightCopyBox(goldText(6)',
  'compactText(building.title',
  'settings:${LOBBY_COPY_COLLISION_FIX_TAG}',
  '화면과 조작을 편하게 조정해요.'
]);
exclude('src/game/scenes/MainLobbyScene.ts', [
  '마을 입장 준비',
  '건물과 NPC 원본 PNG 확인 후 바로 입장합니다.',
  '현재 로비 안전 규칙',
  '카메라:',
  '개별 PNG 사용',
  'READY 1'
]);

include('src/game/data/dioramaBuildings.ts', ['plaza-tap-route-v167', "route: { scene: 'ModeSelectScene', data: { title: '광장 선택' } }"]);
include('src/game/systems/DailyMissionSystem.ts', ["lobbyBadgeLabel: rewardReadyCount > 0 ? `보상 ${rewardReadyCount}`", "allMissionsClaimed ? '완료' : '미션'"]);
exclude('src/game/systems/DailyMissionSystem.ts', ['`READY ${rewardReadyCount}`', "'DONE'", "'MISSION'"]);
exclude('src/game/scenes/DailyMissionScene.ts', ['출석 보상 READY', '오늘 완주 보상 READY', 'READY 보상']);
exclude('src/game/scenes/ShopScene.ts', ['무료팩 READY']);

include('src/game/systems/BackButtonSystem.ts', [
  'kakao-inapp-close-v167',
  'requestKakaoInAppClose',
  'kakaotalk://inappbrowser/close',
  'kakaoweb://closeBrowser',
  'if (BackButtonSystem.overlay) {',
  'BackButtonSystem.requestExit();'
]);
include('src/game/scenes/BackConfirmScene.ts', ['뒤로가기 한 번 더 또는 나가기 버튼으로 창 닫기를 시도합니다.']);

include('src/game/ui/TextStyles.ts', ['micro-text-fit-v167', 'global-micro-copy-v169', 'prefs.largeText ? 1.08 : 0.98', 'prefs.largeText ? 0.92 : 0.84']);
include('src/game/systems/RewardPopupSystem.ts', ['popup-copy-fit-v167', 'popup-copy-safe-v169', 'popupW, 320', 'noticeText(9)', '128']);
include('public/build.json', ['"version": "1.0.75"', 'IntroVideoHardVisible', 'intro-hard-visible-v170']);
include('public/health.html', ['version 1.0.75', 'IntroVideoHardVisible']);
include('README.md', ['# CardVille 1.0.75', '## 1.0.75 업데이트 내역', 'intro-min-3s-video-v168', 'double-back-exit-v168']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.75', 'IntroVideoHardVisible', 'MIN_INTRO_VIDEO_MS = 3000', '새 docs 문서 생성 금지']);

for (const file of walk('src').filter((name) => /\.(ts|tsx|js|mjs)$/.test(name))) {
  const text = read(file);
  for (const banned of ['로딩중', '로딩 중', '이동 중...']) assert(!text.includes(banned), `${file} must not expose ${banned}`);
}
const docs = fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort();
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-intro-exit-copy-v167] OK');
