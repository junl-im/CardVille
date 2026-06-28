import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const required = [
  'src/game/data/wordStages.ts',
  'src/game/data/rewardCards.ts',
  'src/game/systems/LayoutSystem.ts',
  'src/game/systems/BackButtonSystem.ts',
  'src/game/ui/GameButton.ts',
  'src/game/scenes/PlayScene.ts',
  'src/game/scenes/IntroLoadingScene.ts',
  'src/game/scenes/BackConfirmScene.ts',
  'public/assets/ui/cardville_login_bg.png',
  'public/assets/video/cardville_intro_loading.mp4',
  'public/assets/backgrounds/cherry_blossom_day.png',
  'public/assets/icons/icon_game_coin.png',
  'public/assets/icons/icon_mode_word.png',
  'public/assets/cards/backs/card_back_star.png',
  'public/assets/cards/frames/frame_rare_gold_normal.png'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing UI/system file: ${file}`);
}
const play = fs.readFileSync(path.join(root, 'src/game/scenes/PlayScene.ts'), 'utf8');
for (const token of ['bonusMeter', 'useHint', 'useShuffle', 'fitTextSize', 'hasTouchDebug', 'boardLayout', 'assetCardBackStar']) {
  if (!play.includes(token)) throw new Error(`PlayScene missing ${token}`);
}
const back = fs.readFileSync(path.join(root, 'src/game/scenes/BackConfirmScene.ts'), 'utf8');
for (const token of ['첫 화면가기', '나가기', 'requestExit']) {
  if (!back.includes(token)) throw new Error(`BackConfirmScene missing ${token}`);
}
const login = fs.readFileSync(path.join(root, 'src/game/scenes/LoginScene.ts'), 'utf8');
for (const token of ['loginBg', '게스트로 게임 시작', 'Google 로그인']) {
  if (!login.includes(token)) throw new Error(`LoginScene missing ${token}`);
}
const stages = fs.readFileSync(path.join(root, 'src/game/data/wordStages.ts'), 'utf8');
const stageCount = (stages.match(/id: \d+,/g) ?? []).length;
if (stageCount < 8) throw new Error(`Expected at least 8 word stages, found ${stageCount}`);
const build = fs.readFileSync(path.join(root, 'public/build.json'), 'utf8');
if (!build.includes(version)) throw new Error('public/build.json version does not match package.json');
const svgHits = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.toLowerCase().endsWith('.svg')) svgHits.push(path.relative(root, full));
  }
}
walk(path.join(root, 'public'));
if (svgHits.length) throw new Error(`SVG files are not allowed: ${svgHits.join(', ')}`);
console.log(`UI/content check passed. Version ${version}, word stages ${stageCount}, SVG files 0, opening/UI assets OK.`);
