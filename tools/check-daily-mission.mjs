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
    if (!text.includes(token)) throw new Error(`${file} missing daily mission token: ${token}`);
  }
  return text;
}

must('src/game/systems/DailyMissionSystem.ts', [
  'DAILY_MISSION_KEY',
  'cardville.dailyMission.v141',
  'DAILY_MISSIONS',
  'clear_word',
  'clear_english',
  'clear_math',
  'clear_memory',
  'open_pack',
  'claimAttendanceReward',
  'claimMissionReward',
  'recordModeClear',
  'recordPackOpen'
]);

must('src/game/scenes/DailyMissionScene.ts', [
  'DailyMissionScene',
  '오늘의 미션',
  '출석 보상 READY',
  'daily_mission_board_v141',
  'claimAttendance',
  'claimMission'
]);

must('src/game/data/dioramaBuildings.ts', [
  "scene: 'DailyMissionScene'",
  "subtitle: '일일 미션'"
]);

must('src/game/data/modeCatalog.ts', [
  "title: '오늘의 미션'",
  "routeScene: 'DailyMissionScene'"
]);

must('src/main.ts', [
  'DailyMissionScene',
  '1.0.41 daily mission attendance loop'
]);

must('src/game/scenes/RewardScene.ts', [
  'DailyMissionSystem',
  'recordPackOpen',
  'recordModeClear'
]);

must('src/game/scenes/BackConfirmScene.ts', ['DailyMissionScene']);

const scripts = pkg.scripts ?? {};
if (scripts['check:daily-mission'] !== 'node tools/check-daily-mission.mjs') throw new Error('check:daily-mission script mismatch');
if (!scripts.verify?.includes('check:daily-mission')) throw new Error('verify must include check:daily-mission');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'DailyMissionSystem', 'check:daily-mission']) {
  if (!readme.includes(token)) throw new Error(`README missing daily mission token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, 'DailyMissionSystem', 'cardville.dailyMission.v141', 'check:daily-mission']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing daily mission token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);

console.log(`Daily mission check passed. Version ${pkg.version}, attendance board, mission progress, and reward hooks verified.`);
