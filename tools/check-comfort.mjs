import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const login = fs.readFileSync(path.join(root, 'src/game/scenes/LoginScene.ts'), 'utf8');
const play = fs.readFileSync(path.join(root, 'src/game/scenes/PlayScene.ts'), 'utf8');
const stages = fs.readFileSync(path.join(root, 'src/game/data/wordStages.ts'), 'utf8');
const reward = fs.readFileSync(path.join(root, 'src/game/data/rewardCards.ts'), 'utf8');
const feedback = fs.readFileSync(path.join(root, 'src/game/systems/FeedbackSystem.ts'), 'utf8');

for (const token of ['LOGIN_ACTION_START_Y = 596', 'LOGIN_ACTION_GOOGLE_Y = LOGIN_ACTION_START_Y + 54', 'LOGIN_ACTION_SECONDARY_Y = LOGIN_ACTION_START_Y + 100']) {
  if (!login.includes(token)) throw new Error(`Login layout polish missing: ${token}`);
}
for (const token of ['CATEGORY_ICON', 'remainingExamplesForGoal', '같은 계열 예', 'FeedbackSystem.pulse']) {
  if (!play.includes(token)) throw new Error(`Play feedback/association polish missing: ${token}`);
}
for (const token of ['id: 20,', '카드마을 마스터 시험', "{ label: '모양 재료', category: 'shape'", "{ id: 'work_cube', label: '정육면체', category: 'shape'"]) {
  if (!stages.includes(token)) throw new Error(`Stage balance polish missing: ${token}`);
}
for (const token of ['마스터 배지 카드', '보석 공방 카드']) {
  if (!reward.includes(token)) throw new Error(`Reward content polish missing: ${token}`);
}
for (const token of ['navigator.vibrate', 'AudioContext', "'correct'", "'wrong'"]) {
  if (!feedback.includes(token)) throw new Error(`FeedbackSystem missing: ${token}`);
}
const stageCount = (stages.match(/id: \d+,/g) ?? []).length;
if (stageCount < 20) throw new Error(`Expected at least 20 stages, found ${stageCount}`);
console.log(`Comfort/system check passed. Version ${pkg.version}, compact login, association teaching, haptic feedback and ${stageCount} stages OK.`);
