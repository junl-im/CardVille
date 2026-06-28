import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function must(file, tokens) {
  const text = read(file);
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${file} missing token: ${token}`);
  }
  return text;
}

must('src/main.ts', ['MathLabScene', 'MemoryForestScene', '1.0.29 content engine']);
must('src/game/scenes/MathLabScene.ts', ['export class MathLabScene', 'getMathStage', 'chooseAnswer', 'RewardScene', '연산 연구소']);
must('src/game/scenes/MemoryForestScene.ts', ['export class MemoryForestScene', 'getMemoryStage', 'revealPreview', '짝 발견', 'RewardScene']);
must('src/game/data/mathStages.ts', ['MATH_STAGES', 'MathProblem', '7 + 5', '3 × 4']);
must('src/game/data/memoryStages.ts', ['MEMORY_STAGES', 'MemoryPair', 'previewSeconds']);
must('src/game/data/modeCatalog.ts', ["routeScene: 'MathLabScene'", "routeScene: 'MemoryForestScene'", "id: 'math'", "id: 'memory'", "status: 'open'"]);
must('src/game/data/dioramaBuildings.ts', ["scene: 'MathLabScene'", "scene: 'MemoryForestScene'", "subtitle: '연산 연구소'"]);
must('src/game/scenes/ModeSelectScene.ts', ['startMode(mode', "mode.routeScene === 'MathLabScene'", "mode.routeScene === 'MemoryForestScene'"]);
must('src/game/systems/BackButtonSystem.ts', ['MathLabScene', 'MemoryForestScene']);

const modeCatalog = read('src/game/data/modeCatalog.ts');
const openModeIds = [...modeCatalog.matchAll(/id: '([^']+)'[\s\S]*?status: 'open'/g)].map((m) => m[1]);
for (const id of ['word', 'math', 'memory']) {
  if (!openModeIds.includes(id)) throw new Error(`Open mode missing: ${id}`);
}

const routeScenes = [...modeCatalog.matchAll(/routeScene: '([^']+)'/g)].map((m) => m[1]);
const duplicateRoutes = routeScenes.filter((value, index) => routeScenes.indexOf(value) !== index && value !== 'StageSelectScene');
if (duplicateRoutes.length) throw new Error(`Unexpected duplicate special route scenes: ${duplicateRoutes.join(', ')}`);

const math = read('src/game/data/mathStages.ts');
const problemCount = (math.match(/id: 'm\d+-\d+'/g) ?? []).length;
if (problemCount < 10) throw new Error(`Expected at least 10 math problems, found ${problemCount}`);

const memory = read('src/game/data/memoryStages.ts');
const pairCount = (memory.match(/id: '[a-z]+', icon:/g) ?? []).length;
if (pairCount < 8) throw new Error(`Expected at least 8 memory pairs, found ${pairCount}`);

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '연산 연구소 1차 플레이', '기억의 숲 1차 플레이', 'check:content-engine']) {
  if (!readme.includes(token)) throw new Error(`README missing content-engine token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.29 콘텐츠 엔진 패스', 'MathLabScene', 'MemoryForestScene', 'check:content-engine']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing content-engine token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);
const scripts = pkg.scripts ?? {};
if (scripts['check:content-engine'] !== 'node tools/check-content-engine.mjs') throw new Error('check:content-engine script mismatch');
if (!scripts.verify?.includes('check:content-engine')) throw new Error('verify must include check:content-engine');

console.log(`Content engine check passed. Version ${pkg.version}, math problems ${problemCount}, memory pairs ${pairCount}, MathLabScene and MemoryForestScene registered.`);
