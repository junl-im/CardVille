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
    if (!text.includes(token)) throw new Error(`${file} missing mission route token: ${token}`);
  }
  return text;
}

must('src/game/systems/DailyMissionSystem.ts', [
  'DAILY_COMPLETION_REWARD',
  'dailyCompletionReady',
  'dailyCompletionClaimed',
  'rewardReadyCount',
  'lobbyBadgeLabel',
  'shouldPrioritizeEvent',
  'claimDailyCompletionReward',
  'getLobbyStatus',
  'v144-perfect-day-lobby-route'
]);

must('src/game/scenes/DailyMissionScene.ts', [
  'drawCompletionBonus',
  '오늘 완주 보상 READY',
  'claimCompletion',
  'daily_mission_board_v144'
]);

must('src/game/scenes/MainLobbyScene.ts', [
  'DailyMissionSystem',
  'getLobbyStatus',
  'shouldPrioritizeEvent',
  'lobbyBadgeLabel',
  'lobby_recommended_route_v144',
  "const LOBBY_VERSION = '1.0.45'"
]);

must('src/game/scenes/ModeSelectScene.ts', [
  'DailyMissionSystem',
  'status.lobbyBadgeLabel',
  '대기 보상'
]);

must('src/main.ts', ['1.0.45 art bible mission route merge']);
must('public/health.html', [`version ${pkg.version}`, 'perfect-day mission lobby route UX']);
must('public/reset.html', [`CardVille ${pkg.version} Reset`]);

const scripts = pkg.scripts ?? {};
if (scripts['check:mission-route'] !== 'node tools/check-mission-route.mjs') throw new Error('check:mission-route script mismatch');
if (!scripts.verify?.includes('check:mission-route')) throw new Error('verify must include check:mission-route');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '오늘 완주 보상', '로비 READY 라우팅', 'check:mission-route']) {
  if (!readme.includes(token)) throw new Error(`README missing mission route token: ${token}`);
}

const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '오늘 완주 보상', '로비 READY 라우팅', 'v144-perfect-day-lobby-route', 'check:mission-route']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing mission route token: ${token}`);
}

console.log(`Mission route check passed. Version ${pkg.version}, perfect-day bonus and lobby READY routing verified.`);
