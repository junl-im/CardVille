import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-corner-sweep-v166] ${message}`);
    process.exit(1);
  }
};
const include = (file, tokens) => {
  const text = read(file);
  for (const token of tokens) assert(text.includes(token), `${file} must include ${token}`);
};
const exclude = (file, tokens) => {
  const text = read(file);
  for (const token of tokens) assert(!text.includes(token), `${file} must not include ${token}`);
};
const walk = (dir) => {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
assert(pkg.version === '1.0.76', `expected package version 1.0.76, got ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:corner-sweep-v166'), 'verify must include check:corner-sweep-v166');
assert(pkg.scripts['check:corner-sweep-v166'] === 'node tools/check-corner-sweep-v166.mjs', 'check script mismatch');

include('src/game/systems/LayoutSystem.ts', ['corner-sweep-v166', 'input-watchdog-v166', 'clampToSafeX', 'clampToSafeY', 'ensureInputWatchdog(scene)']);
include('src/game/systems/ScreenUISystem.ts', ['holistic-ui-audit-v166', 'safe-area-copy-clamp-v166', 'safeCopyWidth', 'safeActionY', 'clampToSafeY']);
include('src/game/ui/TextStyles.ts', ['holistic-copy-fit-v166', 'applyTightCopyBox', 'fixedWidth', 'fixedHeight']);
include('src/game/ui/GameButton.ts', ['button-corner-sweep-v166', 'pressed ? 0.026 : 0.038', 'this.setName']);
include('src/game/ui/Panel.ts', ['line-free-surface-v166', '0.045']);
include('src/game/systems/DrawSystem.ts', ['screen-frame-corner-sweep-v166']);
include('src/game/scenes/CollectionScene.ts', ['mobileCardLane', 'safeActionY', '미획득', 'CARDVILLE_CORNER_SWEEP_UI_TAG']);
include('src/game/scenes/ShopScene.ts', ['safeCopyWidth', 'safeActionY', 'CARDVILLE_SAFE_COPY_CLAMP_TAG', '카드팩 보상 화면으로 이어집니다.']);
include('src/game/scenes/DailyMissionScene.ts', ['mobileCardLane', 'safeCopyWidth', 'safeActionY']);
include('src/game/scenes/RewardScene.ts', ['applyCopyBox', 'safeCopyWidth', 'safeActionY']);
include('src/game/scenes/ResultScene.ts', ['safeCopyWidth', 'safeActionY']);
include('src/game/scenes/MainLobbyScene.ts', ['baseGlow.x * 1.08', 'baseGlow.y * 1.08', 'rememberBaseScale(this.add.image(0, 8 * scale']);

for (const file of walk(path.join(root, 'src')).filter((f) => /\.(ts|tsx|js|mjs)$/.test(f))) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  for (const banned of ['로딩중', '로딩 중', '이동 중...', '이미지 재시도']) {
    assert(!text.includes(banned), `${rel} must not expose ${banned}`);
  }
}
exclude('src/game/scenes/CollectionScene.ts', ['LOCKED']);
exclude('src/game/scenes/IntroLoadingScene.ts', ['delayedCall(4200', 'this.add.text(l.cx']);
exclude('src/game/scenes/MainLobbyScene.ts', ['이미지 로딩', "'OPEN'", "'LOCK'"]);

const docs = exists('docs') ? fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort() : [];
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(!exists('package-lock.json'), 'package-lock.json must not be present in the source package');
// node_modules/dist may exist in the local build workspace after npm install/build; packaging excludes them later.

const svgFiles = walk(root).filter((file) => file.toLowerCase().endsWith('.svg'));
assert(svgFiles.length === 0, `SVG files are not allowed: ${svgFiles.map((file) => path.relative(root, file)).slice(0, 8).join(', ')}`);

include('README.md', ['# CardVille 1.0.76', '## 1.0.76 업데이트 내역', 'corner-sweep-v166', 'safe-area-copy-clamp-v166']);
include('AI_HANDOFF_CARDVILLE.md', ['현재 기준 버전은 1.0.76', 'IntroVideoMinFit', 'input-watchdog-v166', '새 docs 문서 생성 금지']);
include('public/build.json', ['"version": "1.0.76"', 'IntroVideoMinFit']);
include('public/health.html', ['version 1.0.76', 'IntroVideoMinFit']);

console.log('[check-corner-sweep-v166] OK');
