import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function mustContain(file, tokens, context = 'CI coherence') {
  const text = read(file);
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${context}: ${file} missing token: ${token}`);
  }
  return text;
}

const version = pkg.version;
const build = JSON.parse(read('public/build.json'));
if (build.version !== version) throw new Error(`CI coherence: public/build.json version ${build.version} != package ${version}`);

mustContain('index.html', [`window.__CARDVILLE_VERSION__ = '${version}'`]);
mustContain('public/health.html', [`version ${version}`]);
mustContain('public/reset.html', [`CardVille ${version} Reset`]);
mustContain('src/game/scenes/MainLobbyScene.ts', [`const LOBBY_VERSION = '${version}'`]);
mustContain('README.md', [`# CardVille ${version}`, `## ${version} 업데이트 내역`, '패치 표면 완전성']);
mustContain('AI_HANDOFF_CARDVILLE.md', [`현재 기준 버전은 ${version}`, '패치 표면 완전성', 'ModeSelectScene.ts']);

const modeSelect = mustContain('src/game/scenes/ModeSelectScene.ts', [
  'modeProgressSummary',
  "mode.id === 'math'",
  "mode.id === 'memory'",
  "mode.id === 'english'",
  '문제팩 선택',
  '숲 카드 선택',
  '뜻 카드 연결'
], 'ModeSelect stale-file guard');

const modeSummaryCalls = (modeSelect.match(/modeProgressSummary/g) ?? []).length;
if (modeSummaryCalls < 2) throw new Error('ModeSelect stale-file guard: modeProgressSummary must be implemented and called');

const polish = read('tools/check-polish.mjs');
for (const file of [
  'src/game/scenes/ModeSelectScene.ts',
  'src/game/scenes/StageSelectScene.ts',
  'src/game/scenes/RewardScene.ts',
  'src/game/scenes/MainLobbyScene.ts',
  'src/game/scenes/PlayScene.ts'
]) {
  if (!polish.includes(file)) throw new Error(`CI coherence: check-polish no longer watches ${file}`);
}

const scripts = pkg.scripts ?? {};
if (scripts['check:ci-coherence'] !== 'node tools/check-ci-coherence.mjs') throw new Error('CI coherence script mismatch');
if (!scripts.verify?.includes('check:ci-coherence')) throw new Error('verify must include check:ci-coherence');
if (!scripts.verify?.includes('check:polish')) throw new Error('verify must include check:polish');

console.log(`CI coherence check passed. Version ${version}, ModeSelect polish surface and version sync verified.`);
