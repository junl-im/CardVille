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
    if (!text.includes(token)) throw new Error(`${file} missing content-scale token: ${token}`);
  }
  return text;
}

const math = must('src/game/data/mathStages.ts', [
  '상점 계산 장부',
  '왕관 회로 시험',
  "id: 'm5-5'",
  "difficulty: '도전'"
]);
const mathStages = (math.match(/\n\s+id: \d+,\n\s+title: '/g) ?? []).length;
const mathProblems = (math.match(/id: 'm\d+-\d+'/g) ?? []).length;
if (mathStages < 5) throw new Error(`Expected at least 5 math stages, found ${mathStages}`);
if (mathProblems < 25) throw new Error(`Expected at least 25 math problems, found ${mathProblems}`);

const memory = must('src/game/data/memoryStages.ts', [
  '반딧불 카드길',
  '고양이 그림자 숲',
  'previewSeconds: 4'
]);
const memoryStages = (memory.match(/\n\s+id: \d+,\n\s+title: '/g) ?? []).length;
const memoryPairs = (memory.match(/id: '[a-z]+', icon:/g) ?? []).length;
if (memoryStages < 4) throw new Error(`Expected at least 4 memory stages, found ${memoryStages}`);
if (memoryPairs < 42) throw new Error(`Expected at least 42 memory pairs, found ${memoryPairs}`);

must('src/game/scenes/StageSelectScene.ts', ['rewardPreview', '보상 +', '기억 보상', '단어 보상']);
must('src/game/scenes/MathLabScene.ts', ['progressFill', 'difficultyRewardLabel', 'difficultyBonus', '단계 보상이 같이 적용됩니다']);
must('src/game/scenes/MemoryForestScene.ts', ['const columns = deck.length > 20 ? 5 : 4', 'maxBoardHeight', 'targetMoves', 'stageBonus']);
must('src/game/scenes/RewardScene.ts', ['progressionRewardBonus', '연구소 난이도 보너스', '숲 기억력 보너스', '도서관 숙련 보너스']);

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '콘텐츠 스케일/보상 차등', '추가 디자인 이미지 에셋 요청서', 'check:content-scale']) {
  if (!readme.includes(token)) throw new Error(`README missing content-scale token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.37', '콘텐츠 스케일/보상 차등', '추가 디자인 이미지 에셋 요청서']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing content-scale token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);
const scripts = pkg.scripts ?? {};
if (scripts['check:content-scale'] !== 'node tools/check-content-scale.mjs') throw new Error('check:content-scale script mismatch');
if (!scripts.verify?.includes('check:content-scale')) throw new Error('verify must include check:content-scale');

console.log(`Content scale check passed. Version ${pkg.version}, math stages ${mathStages}, math problems ${mathProblems}, memory stages ${memoryStages}, memory pairs ${memoryPairs}.`);
