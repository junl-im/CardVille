import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const mustInclude = (file, token) => assert(read(file).includes(token), `${file} missing token: ${token}`);
const mustNotInclude = (file, token) => assert(!read(file).includes(token), `${file} must not include token: ${token}`);

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.65', `package version expected 1.0.65, got ${pkg.version}`);

mustInclude('src/game/data/assetManifest.ts', "CARDVILLE_ASSET_VERSION = '1.0.65'");
mustInclude('src/game/data/assetManifest.ts', 'LOBBY_FORCE_LOAD_GATE_TAG');

mustInclude('src/game/scenes/IntroLoadingScene.ts', 'lobby force-load gate active');
mustInclude('src/game/scenes/IntroLoadingScene.ts', 'video.loop = true');
mustInclude('src/game/scenes/IntroLoadingScene.ts', 'updateProgressBar');
mustNotInclude('src/game/scenes/IntroLoadingScene.ts', 'delayedCall(4200');

mustInclude('src/game/scenes/MainLobbyScene.ts', 'ensureLobbyCriticalAssets');
mustInclude('src/game/scenes/MainLobbyScene.ts', 'LOBBY_CRITICAL_PNG_ASSET_KEYS');
mustInclude('src/game/scenes/MainLobbyScene.ts', 'ASSET_MANIFEST.filter');
mustInclude('src/game/scenes/MainLobbyScene.ts', 'lobby-screenshot-repair-v159');
mustInclude('src/game/scenes/MainLobbyScene.ts', 'lobby-no-bottom-patch-text-v159');
mustNotInclude('src/game/scenes/MainLobbyScene.ts', '건물/NPC 에셋 적용 · HUD 비겹침');
mustNotInclude('src/game/scenes/MainLobbyScene.ts', 'this.add.text(344, 28, LOBBY_VERSION');
mustNotInclude('src/game/scenes/MainLobbyScene.ts', '이미지 재시도');
mustNotInclude('src/game/scenes/MainLobbyScene.ts', "'OPEN'");
mustNotInclude('src/game/scenes/MainLobbyScene.ts', "'LOCK'");

mustInclude('src/game/data/dioramaBuildings.ts', 'lobby-wide-village-spacing-v159');
for (const token of ['x: 60', 'x: 330', 'x: 56', 'x: 334', 'x: 52', 'x: 338', 'y: 300', 'y: 438', 'y: 578', 'y: 704']) {
  mustInclude('src/game/data/dioramaBuildings.ts', token);
}

for (const file of [
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
]) {
  assert(fs.existsSync(path.join(root, file)), `missing runtime asset: ${file}`);
}

mustInclude('README.md', '1.0.65 업데이트 내역');
mustInclude('README.md', '1.0.60 업데이트 내역');
mustInclude('README.md', 'lobby-force-load-gate-v159');
mustInclude('README.md', 'lobby-no-bottom-patch-text-v159');
mustInclude('AI_HANDOFF_CARDVILLE.md', '현재 기준 버전은 1.0.65');
mustInclude('AI_HANDOFF_CARDVILLE.md', '1.0.59 로비 이미지 강제 로딩/스크린샷 기반 배치 핫픽스');
mustInclude('public/build.json', 'FlowListInputPolish');
mustInclude('index.html', "window.__CARDVILLE_VERSION__ = '1.0.65'");

console.log('check:lobby-screenshot-repair passed');
