import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const include = (file, token) => assert(read(file).includes(token), `${file} missing ${token}`);
const exclude = (file, token) => assert(!read(file).includes(token), `${file} must not include ${token}`);

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.65', `expected package version 1.0.65, got ${pkg.version}`);

include('package.json', 'check:flow-fit');
include('package.json', 'tools/check-flow-fit-v164.mjs');
include('src/game/systems/NavigationSystem.ts', 'silent-scene-transition-v164');
include('src/game/systems/NavigationSystem.ts', 'scene-transition-shield-v154:${CARDVILLE_SILENT_TRANSITION_TAG}');
exclude('src/game/systems/NavigationSystem.ts', '이동 중...');
exclude('src/game/systems/NavigationSystem.ts', 'scene.add.text(l.cx');

include('src/game/scenes/IntroLoadingScene.ts', 'intro-video-lifecycle-cleanup-v164');
include('src/game/scenes/IntroLoadingScene.ts', 'video.loop = true');
include('src/game/scenes/IntroLoadingScene.ts', 'this.removeOpeningVideo();');
exclude('src/game/scenes/IntroLoadingScene.ts', 'this.add.text(l.cx');
exclude('src/game/scenes/IntroLoadingScene.ts', 'delayedCall(4200');

include('src/game/scenes/MainLobbyScene.ts', 'scale-tween-dedupe-v164');
include('src/game/scenes/MainLobbyScene.ts', 'stopScaleTween');
include('src/game/scenes/MainLobbyScene.ts', "target.setData('cvScaleTween'");
include('src/game/scenes/MainLobbyScene.ts', 'this.tweenRelativeScale(container, 1.025');
include('src/game/scenes/MainLobbyScene.ts', 'cleanupLobbyRuntime');
exclude('src/game/scenes/MainLobbyScene.ts', "scale: 1.035");
exclude('src/game/scenes/MainLobbyScene.ts', '이동 중');

include('src/game/ui/GameButton.ts', 'button-lineless-surface-v164');
include('src/game/ui/GameButton.ts', 'fixedWidth: Math.max(48, width - 24)');
include('src/game/ui/GameButton.ts', 'pressed ? 0.055 : 0.075');
include('src/game/ui/Panel.ts', 'panel-lineless-surface-v164');
include('src/game/systems/ScreenUISystem.ts', 'flow-fit-ui-v164');
include('src/game/systems/DrawSystem.ts', 'screen-frame-lineless-v164');
include('src/game/ui/TextStyles.ts', 'mobile-copy-fit-v164');
include('src/game/ui/TextStyles.ts', 'prefs.largeText ? 1.28 : 1.14');
include('src/game/ui/TextStyles.ts', 'prefs.largeText ? 1.06 : 0.98');

for (const file of ['src', 'index.html', 'public/health.html']) {
  const full = path.join(root, file);
  const stack = [full];
  while (stack.length) {
    const cur = stack.pop();
    const stat = fs.statSync(cur);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(cur)) stack.push(path.join(cur, name));
      continue;
    }
    const text = fs.readFileSync(cur, 'utf8');
    assert(!text.includes('로딩중'), `${path.relative(root, cur)} must not include 로딩중`);
    assert(!text.includes('이동 중'), `${path.relative(root, cur)} must not include 이동 중`);
  }
}

include('README.md', '## 1.0.65 업데이트 내역');
include('README.md', 'CardVille_v1.0.65_FlowListInputPolish_Full.zip');
include('AI_HANDOFF_CARDVILLE.md', '현재 기준 버전은 1.0.65');
include('AI_HANDOFF_CARDVILLE.md', '1.0.65 전역 UI 흐름/텍스트/전환 안정화 패스');
include('public/build.json', 'FlowListInputPolish');
include('index.html', "window.__CARDVILLE_VERSION__ = '1.0.65'");

console.log('check:flow-fit v1.0.65 passed: silent transitions, text fit, line-soft surfaces, and scale tween dedupe verified.');
