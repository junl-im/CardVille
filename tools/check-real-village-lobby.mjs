import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const include = (file, token) => assert(read(file).includes(token), `${file} missing token: ${token}`);
const exclude = (file, token) => assert(!read(file).includes(token), `${file} must not include token: ${token}`);

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.64', `expected package version 1.0.64, got ${pkg.version}`);

include('src/game/data/assetManifest.ts', "CARDVILLE_ASSET_VERSION = '1.0.64'");
include('src/game/data/assetManifest.ts', 'LOBBY_INTRO_VIDEO_HOLD_TAG');
include('src/game/scenes/IntroLoadingScene.ts', 'video.loop = true');
include('src/game/scenes/IntroLoadingScene.ts', 'updateProgressBar');
exclude('src/game/scenes/IntroLoadingScene.ts', 'delayedCall(4200');
exclude('src/game/scenes/IntroLoadingScene.ts', '게임 준비 중');
exclude('src/game/scenes/IntroLoadingScene.ts', '마을 건물 이미지 준비 중');
exclude('src/game/scenes/IntroLoadingScene.ts', '마을 건물 이미지를 끝까지 불러오는 중');

include('src/game/scenes/MainLobbyScene.ts', 'this.busy = false');
include('src/game/scenes/MainLobbyScene.ts', 'lobby-input-reset-v160');
include('src/game/scenes/MainLobbyScene.ts', 'responsive-mobile-viewport-v163');
include('src/game/scenes/MainLobbyScene.ts', 'lobby-fullscreen-spread-v160');
include('src/game/scenes/MainLobbyScene.ts', 'hidden-missing:${building.assetKey}');
include('src/game/scenes/MainLobbyScene.ts', "const label = hasMissionBadge && missionStatus ? missionStatus.lobbyBadgeLabel : '추천'");
exclude('src/game/scenes/MainLobbyScene.ts', "'OPEN'");
exclude('src/game/scenes/MainLobbyScene.ts', "'LOCK'");
exclude('src/game/scenes/MainLobbyScene.ts', 'badgeOpen');
exclude('src/game/scenes/MainLobbyScene.ts', '이미지 로딩');
exclude('src/game/scenes/MainLobbyScene.ts', '이미지 재시도');
exclude('src/game/scenes/MainLobbyScene.ts', '다음 업데이트');
exclude('src/game/scenes/MainLobbyScene.ts', '대기 에셋');

include('src/game/data/dioramaBuildings.ts', 'lobby-edge-to-edge-spread-v160');
for (const token of ['x: 60', 'x: 330', 'x: 56', 'x: 334', 'x: 52', 'x: 338', 'visualWidth: 150', 'visualWidth: 142', 'visualWidth: 124']) {
  include('src/game/data/dioramaBuildings.ts', token);
}
include('src/game/data/lobbyEntities.ts', 'lobby-edge-npc-spread-v160');
for (const token of ["key: 'npcMerchant', x: 91", "key: 'npcWizard', x: 296", "key: 'npcLibrarian', x: 94", "key: 'npcForestSagePremium', x: 54"]) {
  include('src/game/data/lobbyEntities.ts', token);
}

const requiredAssets = [
  'public/assets/diorama/diorama_bg.png',
  'public/assets/diorama/building_castle.png',
  'public/assets/diorama/building_library.png',
  'public/assets/diorama/building_lab.png',
  'public/assets/diorama/building_shop.png',
  'public/assets/diorama/building_school.png',
  'public/assets/diorama/building_forest.png',
  'public/assets/diorama/building_event.png',
  'public/assets/diorama/building_harbor.png',
  'public/assets/diorama/building_plaza.png',
  'public/assets/characters/npc_merchant.png',
  'public/assets/characters/npc_wizard.png',
  'public/assets/characters/npc_librarian.png',
  'public/assets/characters/npc_forest_sage.png'
];
for (const file of requiredAssets) assert(fs.existsSync(path.join(root, file)), `missing required real village asset: ${file}`);

const svgFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.toLowerCase().endsWith('.svg')) svgFiles.push(rel);
  }
};
for (const dir of ['src', 'public', 'tools']) walk(dir);
assert(svgFiles.length === 0, `SVG files are not allowed: ${svgFiles.join(', ')}`);

include('README.md', '## 1.0.64 업데이트 내역');
include('README.md', '## 1.0.60 업데이트 내역');
include('README.md', 'intro-video-holds-until-assets-v160');
include('README.md', 'lobby-input-reset-v160');
include('README.md', 'lobby-fullscreen-spread-v160');
include('AI_HANDOFF_CARDVILLE.md', '현재 기준 버전은 1.0.64');
include('AI_HANDOFF_CARDVILLE.md', '1.0.64 전역 UI 흐름/텍스트/전환 안정화 패스');
include('AI_HANDOFF_CARDVILLE.md', '1.0.60 오프닝 유지/로비 입력 복구/전체폭 마을 폴리시 패스');
include('public/build.json', 'FlowFitUIPolish');
include('index.html', "window.__CARDVILLE_VERSION__ = '1.0.64'");

console.log('check:real-village-lobby passed');
