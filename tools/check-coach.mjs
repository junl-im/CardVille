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
    if (!text.includes(token)) throw new Error(`${file} missing coach token: ${token}`);
  }
  return text;
}

must('src/game/systems/CoachMarkSystem.ts', [
  'COACH_SEEN_KEY',
  'cardville.coach.seen.v140',
  'showOnce',
  'markSeen',
  'catHint',
  '알겠어요'
]);
must('src/game/scenes/MainLobbyScene.ts', ['CoachMarkSystem', 'showLobbyCoach', 'lobby_recommended_route_v144', '고양이 길잡이']);
must('src/game/scenes/StageSelectScene.ts', ['CoachMarkSystem', 'showStageCoach', 'stage_select_', '스테이지 선택 팁']);
must('src/game/scenes/PlayScene.ts', ['CoachMarkSystem', 'showWordCoach', 'word_top_card_coach_v140', '도서관 카드 정리법']);
must('src/game/scenes/EnglishSchoolScene.ts', ['CoachMarkSystem', 'showEnglishCoach', 'english_meaning_choice_v140', '영어 학교 수업 팁']);
must('src/game/scenes/ShopScene.ts', ['CoachMarkSystem', 'showShopCoach', 'shop_offer_coach_v140', '상점 이용 팁']);

const scripts = pkg.scripts ?? {};
if (scripts['check:coach'] !== 'node tools/check-coach.mjs') throw new Error('check:coach script mismatch');
if (!scripts.verify?.includes('check:coach')) throw new Error('verify must include check:coach');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '고양이 코치', 'check:coach']) {
  if (!readme.includes(token)) throw new Error(`README missing coach token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, 'CoachMarkSystem', 'cardville.coach.seen.v140', 'check:coach']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing coach token: ${token}`);
}
const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);

console.log(`Coach check passed. Version ${pkg.version}, no-asset guide bubbles and first-run storage verified.`);
