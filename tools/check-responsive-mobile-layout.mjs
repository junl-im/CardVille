import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const include = (file, token) => assert(read(file).includes(token), `${file} missing token: ${token}`);
const exclude = (file, token) => assert(!read(file).includes(token), `${file} must not include token: ${token}`);

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.71', `expected package version 1.0.71, got ${pkg.version}`);

include('src/game/systems/LayoutSystem.ts', 'RESPONSIVE_MOBILE_LAYOUT_TAG');
include('src/game/systems/LayoutSystem.ts', 'RESPONSIVE_SURFACE_SPREAD_TAG');
include('src/game/systems/LayoutSystem.ts', 'responsiveSurfaceWidth');
include('src/game/systems/LayoutSystem.ts', 'responsiveSurfaceBox');
include('src/game/systems/LayoutSystem.ts', 'visualViewport');
include('src/game/systems/LayoutSystem.ts', 'safe-area-inset-top');
include('src/game/systems/LayoutSystem.ts', 'safe-area-inset-bottom');
include('src/game/systems/LayoutSystem.ts', 'export function responsiveX');
include('src/game/systems/LayoutSystem.ts', 'export function responsiveY');
include('src/game/systems/LayoutSystem.ts', 'export function responsiveScale');
include('src/game/systems/LayoutSystem.ts', 'window.visualViewport.addEventListener');
include('src/game/systems/LayoutSystem.ts', 'never shrink below 390x844');

include('src/game/scenes/MainLobbyScene.ts', 'RESPONSIVE_MOBILE_VIEWPORT_TAG');
include('src/game/scenes/MainLobbyScene.ts', 'responsivePoint');
include('src/game/scenes/MainLobbyScene.ts', 'responsiveScale');
include('src/game/scenes/MainLobbyScene.ts', 'private buildingTarget');
include('src/game/scenes/MainLobbyScene.ts', 'this.buildingPoint(building)');
include('src/game/scenes/MainLobbyScene.ts', 'this.vx(npc.x)');
include('src/game/scenes/MainLobbyScene.ts', 'this.vy(npc.y)');
include('src/game/scenes/MainLobbyScene.ts', 'layout(this).bottom');
include('src/game/scenes/MainLobbyScene.ts', 'safeRight');
include('src/game/scenes/MainLobbyScene.ts', 'safeLeft');
include('src/game/scenes/MainLobbyScene.ts', 'target.x');
include('src/game/scenes/MainLobbyScene.ts', 'target.y');

include('src/game/systems/DrawSystem.ts', 'l.safeLeft');
include('src/game/systems/DrawSystem.ts', 'l.safeRight');
include('src/game/systems/DrawSystem.ts', 'titleW = Math.min(430');
include('src/main.ts', '1.0.71 silent intro and exit/copy fit');
include('index.html', "window.__CARDVILLE_VERSION__ = '1.0.71'");
include('index.html', 'no generic loading copy on boot');
exclude('index.html', '시작 화면 준비가 지연돼요');
include('public/build.json', 'IntroVideoMinFit');
include('public/build.json', '1.0.71');
include('README.md', '## 1.0.71 업데이트 내역');
include('README.md', 'responsive-surface-spread-v163');
include('AI_HANDOFF_CARDVILLE.md', '현재 기준 버전은 1.0.71');
include('AI_HANDOFF_CARDVILLE.md', '스크린샷만 기준');
include('AI_HANDOFF_CARDVILLE.md', '패치 ZIP이 통파일과 비슷한 용량인 이유');
include('AI_HANDOFF_CARDVILLE.md', 'CardVille_v1.0.71_IntroGuardUIPolish_Full.zip');

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

console.log('check:responsive-mobile-layout passed');
