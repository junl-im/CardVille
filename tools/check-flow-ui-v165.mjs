import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-flow-ui-v165] ${message}`);
    process.exit(1);
  }
};
const includesAll = (file, tokens) => {
  const text = read(file);
  for (const token of tokens) assert(text.includes(token), `${file} must include ${token}`);
};
const excludesAll = (file, tokens) => {
  const text = read(file);
  for (const token of tokens) assert(!text.includes(token), `${file} must not include ${token}`);
};

const pkg = JSON.parse(read('package.json'));
includesAll('package.json', [`"version": "${pkg.version}"`, 'check:flow-ui-v165']);
includesAll('src/game/systems/ScreenUISystem.ts', ['list-card-fit-v165', 'action-bar-fit-v165', 'copy-box-guard-v165', 'stackedListMetrics', 'actionButtonCenters', 'safeToastPosition']);
includesAll('src/game/systems/LayoutSystem.ts', ['dynamic-phone-frame-v165', 'scene-input-recovery-v165', 'if (scene.input) scene.input.enabled = true']);
includesAll('src/game/systems/NavigationSystem.ts', ['restart-input-recovery-v165', 'if (scene.input) scene.input.enabled = true']);
includesAll('src/game/ui/TextStyles.ts', ['copy-box-guard-v165', 'applyCopyBox', 'fitOneLine']);
includesAll('src/game/ui/GameButton.ts', ['button-copy-guard-v165', 'button-input-recovery-v165', 'button-corner-sweep-v166', 'pressed ? 0.026 : 0.038', 'this.scene.tweens.killTweensOf(this)']);
includesAll('src/game/scenes/StageSelectScene.ts', ['stackedListMetrics', 'actionButtonCenters', 'safeToastPosition', 'CARDVILLE_LIST_CARD_FIT_TAG']);
includesAll('src/game/scenes/ModeSelectScene.ts', ['stackedListMetrics', 'safeToastPosition', 'CARDVILLE_LIST_CARD_FIT_TAG']);
includesAll('src/game/scenes/DailyMissionScene.ts', ['actionButtonCenters', 'safeToastPosition']);
includesAll('src/game/scenes/ShopScene.ts', ['actionButtonCenters', 'safeToastPosition']);
includesAll('src/game/systems/RewardPopupSystem.ts', ['responsiveSurfaceWidth', 'copy-box-guard-v165']);

for (const file of ['src/game/scenes/IntroLoadingScene.ts', 'src/game/systems/NavigationSystem.ts']) {
  excludesAll(file, ['로딩중', '로딩 중', '이동 중...']);
}

const docs = fs.existsSync(path.join(root, 'docs')) ? fs.readdirSync(path.join(root, 'docs')).filter((name) => name.endsWith('.md')).sort() : [];
assert(docs.join('|') === 'CARDVILLE_ART_DIRECTION_BIBLE.md|CARDVILLE_ASSET_PROMPT_PACK.md', `unexpected docs files: ${docs.join(', ')}`);
assert(!fs.existsSync(path.join(root, 'package-lock.json')), 'package-lock.json must not be present in source package');
console.log('[check-flow-ui-v165] OK');
