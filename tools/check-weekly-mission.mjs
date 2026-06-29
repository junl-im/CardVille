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
    if (!text.includes(token)) throw new Error(`${file} missing weekly mission token: ${token}`);
  }
  return text;
}

must('src/game/systems/DailyMissionSystem.ts', [
  'WEEKLY_TARGET',
  'weekToken',
  'streakDays',
  'bestStreakDays',
  'weeklyProgress',
  'weeklyReady',
  'weeklyCompletionRatio',
  'claimWeeklyReward',
  'addWeeklyProgress',
  'lastAttendanceToken',
  'attendanceRewardCoins'
]);

must('src/game/scenes/DailyMissionScene.ts', [
  'drawStreakWeekly',
  '연속 출석',
  '최고',
  '주간 보상',
  'claimWeekly',
  '주간 수령',
  'daily_mission_board_v144'
]);

must('src/main.ts', ['1.0.46 premium asset batch apply', '1.0.42 streak weekly mission loop']);
must('public/health.html', ['streak weekly mission loop', `version ${pkg.version}`]);
must('public/reset.html', [`CardVille ${pkg.version} Reset`]);

const scripts = pkg.scripts ?? {};
if (scripts['check:weekly-mission'] !== 'node tools/check-weekly-mission.mjs') throw new Error('check:weekly-mission script mismatch');
if (!scripts.verify?.includes('check:weekly-mission')) throw new Error('verify must include check:weekly-mission');

const readme = read('README.md');
for (const token of ['연속 출석', '주간 미션', 'check:weekly-mission', 'v144-perfect-day-lobby-route']) {
  if (!readme.includes(token)) throw new Error(`README missing weekly mission token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of ['연속 출석', '주간 미션', 'check:weekly-mission', 'v144-perfect-day-lobby-route']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing weekly mission token: ${token}`);
}

console.log(`Weekly mission check passed. Version ${pkg.version}, streak attendance and weekly reward loop verified.`);
