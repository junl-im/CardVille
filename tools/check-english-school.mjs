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
    if (!text.includes(token)) throw new Error(`${file} missing english-school token: ${token}`);
  }
  return text;
}

const stages = must('src/game/data/englishStages.ts', [
  'ENGLISH_STAGES',
  '인사 카드 수업',
  '마을 물건 카드',
  '행동 카드 수업',
  '짧은 문장 수업',
  'getEnglishStage'
]);
const stageCount = (stages.match(/\n\s+id: \d+,\n\s+title: '/g) ?? []).length;
const cardCount = (stages.match(/id: 'e\d-[a-z0-9-]+'/g) ?? []).length;
if (stageCount < 4) throw new Error(`Expected at least 4 English stages, found ${stageCount}`);
if (cardCount < 24) throw new Error(`Expected at least 24 English cards, found ${cardCount}`);

must('src/game/scenes/EnglishSchoolScene.ts', [
  "super('EnglishSchoolScene')",
  'lessonRewardLabel',
  'makeChoices',
  "modeId: 'english'",
  '영어 단어와 뜻을 맞추면 콤보 보상이 올라가요'
]);
must('src/game/data/modeCatalog.ts', [
  "routeScene: 'EnglishSchoolScene'",
  "status: 'open'",
  '영어 학교'
]);
must('src/game/data/dioramaBuildings.ts', [
  "id: 'school'",
  "subtitle: '영어 학교'",
  "modeId: 'english'",
  'open: true'
]);
must('src/game/scenes/StageSelectScene.ts', [
  'ENGLISH_STAGES',
  "routeScene: 'EnglishSchoolScene'",
  '영어 보상',
  '영단어와 뜻 카드'
]);
must('src/game/scenes/ModeSelectScene.ts', [
  'ENGLISH_STAGES',
  "mode.id === 'english'",
  '뜻 카드 연결'
]);
must('src/game/scenes/MainLobbyScene.ts', [
  "const LOBBY_VERSION = '1.0.38'",
  'ENGLISH_STAGES',
  "return 'school'"
]);
must('src/game/scenes/RewardScene.ts', ['영어 카드팩 도착', '영어 학교 수업 보너스']);
must('src/main.ts', ['EnglishSchoolScene', '1.0.38 english school first class']);
must('src/game/scenes/BackConfirmScene.ts', ['EnglishSchoolScene']);

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '영어 학교 1차 수업', 'check:english-school']) {
  if (!readme.includes(token)) throw new Error(`README missing english-school token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '1.0.38', '영어 학교 1차 수업', 'check:english-school']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing english-school token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);
const scripts = pkg.scripts ?? {};
if (scripts['check:english-school'] !== 'node tools/check-english-school.mjs') throw new Error('check:english-school script mismatch');
if (!scripts.verify?.includes('check:english-school')) throw new Error('verify must include check:english-school');

console.log(`English school check passed. Version ${pkg.version}, stages ${stageCount}, cards ${cardCount}.`);
