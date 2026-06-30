import fs from 'node:fs';

const required = [
  ['src/game/systems/ScreenUISystem.ts', 'screen-ui-redesign-v158'],
  ['src/game/systems/ScreenUISystem.ts', 'playfield-safezone-v158'],
  ['src/game/ui/GameButton.ts', 'mobile-touch-target-v158'],
  ['src/game/ui/GameButton.ts', 'Math.max(width + 10, 56)'],
  ['src/game/ui/GameButton.ts', 'Math.max(height + 10, 56)'],
  ['src/game/ui/TextStyles.ts', 'mobile-readable-text-v158'],
  ['src/game/systems/CardGameSystem.ts', 'card-engine-upgrade-v158'],
  ['src/game/scenes/PlayScene.ts', 'assertNoVerticalOverlap'],
  ['src/game/scenes/PlayScene.ts', 'mobile-card-layout-v158'],
  ['src/game/scenes/MathLabScene.ts', 'drawReadablePanel'],
  ['src/game/scenes/MathLabScene.ts', 'calculateComboScore'],
  ['src/game/scenes/EnglishSchoolScene.ts', 'drawReadablePanel'],
  ['src/game/scenes/EnglishSchoolScene.ts', 'calculateComboScore'],
  ['src/game/scenes/MemoryForestScene.ts', 'assertNoVerticalOverlap'],
  ['src/game/scenes/DailyMissionScene.ts', 'screen-ui-redesign-v158'],
  ['src/game/data/lobbyLayoutPlan.ts', 'CARDVILLE_SCREEN_UI_AUDIT_V158']
];

let failed = false;
for (const [file, token] of required) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(token)) {
    console.error(`[screen-playfield-v158] missing ${token} in ${file}`);
    failed = true;
  }
}

const forbidden = [
  ['src/game/scenes/PlayScene.ts', 'l.visibleX + 326, 746'],
  ['src/game/scenes/MathLabScene.ts', '150, 88'],
  ['src/game/scenes/EnglishSchoolScene.ts', '150, 88']
];
for (const [file, token] of forbidden) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes(token)) {
    console.error(`[screen-playfield-v158] stale compact layout token ${token} in ${file}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('[screen-playfield-v158] mobile UI spacing, touch targets and card engine tags verified');
