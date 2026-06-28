import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const main = fs.readFileSync(path.join(root, 'src/main.ts'), 'utf8');
if (!main.includes('Phaser.Scale.EXPAND')) throw new Error('Expected Phaser.Scale.EXPAND for full-bleed mobile layout');
const layoutText = fs.readFileSync(path.join(root, 'src/game/systems/LayoutSystem.ts'), 'utf8');
for (const token of ['visibleBounds', 'applyResponsiveCamera', 'addCoverImage']) {
  if (!layoutText.includes(token)) throw new Error(`Responsive layout token missing: ${token}`);
}
const mustContain = [
  ['src/game/scenes/PlayScene.ts', ['layout(this).boardWidth', 'xs: [96, 179, 262, 345]', 'effectCorrect', 'effectWrong', '0xfffbef']],
  ['src/game/scenes/RewardScene.ts', ['packPrefix', 'assetPackLegendary', '터치해서 열기', 'spawnSparkles']],
  ['src/game/scenes/IntroLoadingScene.ts', ['mountOpeningVideo', 'queueGameAssets', 'this.load.start()']],
  ['src/game/scenes/LoginScene.ts', ['window.__CARDVILLE_BOOT_OK__', 'IntroLoadingScene', 'LOGIN_ACTION_START_Y', 'LOGIN_ACTION_SECONDARY_Y']],
  ['src/game/scenes/BootScene.ts', ['Only load the opening screen assets here']],
  ['src/game/ui/GameButton.ts', ['assetButton${size}', 'chooseButtonSkin', 'skinImage']],
  ['src/game/systems/DrawSystem.ts', ['particleStar', '2.5D plaza', 'assetVillageBg']]
];
for (const [file, tokens] of mustContain) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${file} missing token: ${token}`);
  }
}
const build = JSON.parse(fs.readFileSync(path.join(root, 'public/build.json'), 'utf8'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);
const requiredAssets = [
  'public/assets/packs/pack_common_closed.png',
  'public/assets/packs/pack_rare_open.png',
  'public/assets/packs/pack_epic_open.png',
  'public/assets/packs/pack_legendary_open.png',
  'public/assets/effects/effect_correct_01.png',
  'public/assets/particles/particle_sparkle_01.png',
  'public/assets/buttons/button_large_plain_normal.png'
];
for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(root, asset))) throw new Error(`Missing required 1.0.18 asset: ${asset}`);
}
console.log(`Layout/asset check passed. Version ${pkg.version}, full-bleed responsive canvas, lifted login controls, delayed intro and solid-card UI assets OK.`);
