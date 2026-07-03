import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-focused-cleanup-v181] ${message}`);
    process.exit(1);
  }
};
const walk = (dir) => {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel.replaceAll('\\', '/'));
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.81', `expected package version 1.0.81, got ${pkg.version}`);
assert(build.version === pkg.version, 'build version must match package version');
assert(build.assetVersion === pkg.version, 'asset version must match package version');
assert(pkg.scripts.verify.includes('check:focused-cleanup-v181'), 'verify must include focused cleanup check');

const index = read('index.html');
assert(index.includes("window.__CARDVILLE_VERSION__ = '1.0.81'"), 'index version must be 1.0.81');
assert(index.includes('cardville_intro_loading.mp4?v=1.0.81'), 'intro video cache key must use 1.0.81');
for (const token of [
  '__CARDVILLE_INTRO_TOUCH_PRIME_TAG__',
  '__CARDVILLE_INTRO_HARD_VISIBLE_TAG__',
  '__CARDVILLE_INTRO_NO_NATIVE_UI_TAG__',
  '__CARDVILLE_INTRO_PREPLAY_SHIELD_TAG__',
  '__CARDVILLE_INTRO_NO_PROGRESS_SURFACE_TAG__',
  '__CARDVILLE_INTRO_NO_PHASER_PROGRESS_TAG__',
  '__CARDVILLE_LEGACY_CODE_GUARD_TAG__',
  '__CARDVILLE_DELTA_PATCH_TAG__',
  '__CARDVILLE_INTRO_CANVAS_ONLY_TAG__',
  '__CARDVILLE_INTRO_RAW_OFFSCREEN_TAG__',
  '__CARDVILLE_CANVAS_PREROLL_TAG__'
]) assert(!index.includes(token), `unused intro tag global must be deleted: ${token}`);

const intro = read('src/game/scenes/IntroLoadingScene.ts');
for (const token of ['__CARDVILLE_DELTA_PATCH_TAG__?: string', '__CARDVILLE_INTRO_CANVAS_ONLY_TAG__?: string', '__CARDVILLE_INTRO_RAW_OFFSCREEN_TAG__?: string', '__CARDVILLE_CANVAS_PREROLL_TAG__?: string']) {
  assert(!intro.includes(token), `unused intro global type declaration must be deleted: ${token}`);
}

const stage = read('src/game/scenes/StageSelectScene.ts');
assert(stage.includes("private title = '낱말 카드'"), 'word stage default title must be 낱말 카드');
assert(stage.includes('stage-select-single-title-header'), 'StageSelect must mark the integrated single-title header');
assert(!stage.includes("`${mode?.fallbackIcon ?? '🎴'} ${this.title}`"), 'duplicate lower mode title must be removed');

const play = read('src/game/scenes/PlayScene.ts');
assert(play.includes('낱말 카드'), 'PlayScene word label must use 낱말 카드');
assert(!play.includes('DrawSystem.background(this, `말 카드'), 'old word play title must not remain');

const text = read('src/game/ui/TextStyles.ts');
assert(text.includes('return prefs.largeText ? 1.08 : 0.97'), 'global text scale must be slightly raised');
assert(text.includes('return prefs.largeText ? 0.91 : 0.83'), 'notice text scale must be slightly raised');

const lobby = read('src/game/scenes/MainLobbyScene.ts');
assert(lobby.includes("const LOBBY_VERSION = '1.0.81'"), 'lobby version must be 1.0.81');
assert(lobby.includes('floor-walk-smooth-no-container-bounce'), 'smooth walk cleanup tag must be present');
assert(lobby.includes('const naturalSpeed = 96 * scale'), 'free walk speed must be calmer');
assert(lobby.includes('this.startWalkAnimation(150)'), 'walk frame timing must be calmer');
assert(!lobby.includes('this.addStepBounce(this.hero, stepCount, 3)'), 'free-walk container y-bounce must be deleted');
assert(!lobby.includes('this.addStepBounce(this.cat, Math.max(3, stepCount - 1), 2)'), 'free-walk cat container y-bounce must be deleted');

for (const file of ['index.html', 'src/game/scenes/IntroLoadingScene.ts', 'src/game/scenes/MainLobbyScene.ts']) {
  const body = read(file);
  for (const token of ['로딩중', '로딩 중', '이동 중...', 'progressBar = this.add']) assert(!body.includes(token), `${file} must not revive ${token}`);
}

const allowedMarkdown = new Set(['README.md', 'AI_HANDOFF_CARDVILLE.md', 'docs/CARDVILLE_ART_DIRECTION_BIBLE.md', 'docs/CARDVILLE_ASSET_PROMPT_PACK.md']);
for (const rel of walk('.').map((file) => file.replace(/^\.\//, ''))) {
  const base = path.basename(rel);
  const lower = base.toLowerCase();
  if (lower.endsWith('.md')) assert(allowedMarkdown.has(rel), `unexpected markdown record file: ${rel}`);
  assert(!/patch[_-]?notes|release[_-]?notes|changelog|update[_-]?notes/i.test(base), `unexpected patch/release note artifact: ${rel}`);
  assert(!lower.endsWith('.txt'), `unexpected txt record file: ${rel}`);
  assert(!lower.endsWith('.svg'), `SVG files are not allowed: ${rel}`);
}

console.log('[check-focused-cleanup-v181] OK');
