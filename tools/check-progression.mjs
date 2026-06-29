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

const save = must('src/game/systems/SaveSystem.ts', [
  'ProgressModeId',
  'cardville.progress.v131',
  'getModeStageRecord',
  'nextPlayableModeStage',
  'saveModeStageResult',
  "'word' | 'math' | 'memory' | 'daily' | 'english'"
]);
if (!/\^\(word\|math\|memory\|daily\|english\)/.test(save)) throw new Error('Progress regex must include all mode ids');

must('src/game/scenes/RewardScene.ts', ['ProgressModeId', 'saveModeStageResult', 'rewardTitle()', "modeId === 'math'", "modeId === 'memory'"]);
must('src/game/scenes/MathLabScene.ts', ["modeId: 'math'", 'stepsLeft: this.hearts', 'this.stage.id']);
must('src/game/scenes/MemoryForestScene.ts', ["modeId: 'memory'", 'stepsLeft: efficiency', 'const compact = deck.length > 16']);
must('src/game/scenes/ModeSelectScene.ts', ['nextPlayableModeStage', 'MATH_STAGES.length', 'MEMORY_STAGES.length', "mode.routeScene === 'DailyMissionScene'", 'modeProgressSummary']);
must('src/game/scenes/StageSelectScene.ts', ['getModeStageRecord', 'isModeStageUnlocked', 'nextPlayableModeStage', "routeScene: 'MathLabScene'", "routeScene: 'MemoryForestScene'"]);
must('src/game/data/modeCatalog.ts', ["id: 'daily'", "status: 'open'", "routeScene: 'DailyMissionScene'"]);

const math = read('src/game/data/mathStages.ts');
const mathProblems = (math.match(/id: 'm\d+-\d+'/g) ?? []).length;
if (mathProblems < 15) throw new Error(`Expected at least 15 math problems after progression pass, found ${mathProblems}`);
const memory = read('src/game/data/memoryStages.ts');
const memoryPairs = (memory.match(/id: '[a-z]+', icon:/g) ?? []).length;
if (memoryPairs < 18) throw new Error(`Expected at least 18 memory pairs after progression pass, found ${memoryPairs}`);

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '진행 저장 확장', 'check:progression']) {
  if (!readme.includes(token)) throw new Error(`README missing progression token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '진행 저장/콘텐츠 확장', 'cardville.progress.v131']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing progression token: ${token}`);
}
if (pkg.scripts?.['check:progression'] !== 'node tools/check-progression.mjs') throw new Error('check:progression script mismatch');
if (!pkg.scripts?.verify?.includes('check:progression')) throw new Error('verify must include check:progression');

console.log(`Progression check passed. Version ${pkg.version}, math problems ${mathProblems}, memory pairs ${memoryPairs}.`);
