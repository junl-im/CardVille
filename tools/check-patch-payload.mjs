import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const exists = (file) => fs.existsSync(path.join(root, file));
const pkg = JSON.parse(read('package.json'));

assert(pkg.version === '1.0.72', `expected package version 1.0.72, got ${pkg.version}`);

const requiredSelfContainedFiles = [
  'src/main.ts',
  'public/assets/diorama/building_castle.png',
  'public/assets/diorama/building_library.png',
  'public/assets/diorama/building_lab.png',
  'public/assets/diorama/building_shop.png',
  'public/assets/diorama/building_school.png',
  'public/assets/diorama/building_forest.png',
  'public/assets/diorama/building_event.png',
  'public/assets/diorama/building_harbor.png',
  'public/assets/diorama/building_plaza.png',
  'public/assets/characters/npc_merchant.png',
  'public/assets/characters/npc_librarian.png',
  'public/assets/characters/npc_wizard.png',
  'public/assets/characters/npc_forest_sage.png',
  'README.md',
  'AI_HANDOFF_CARDVILLE.md',
  'package.json',
  'index.html'
];
for (const file of requiredSelfContainedFiles) assert(exists(file), `self-contained patch payload missing ${file}`);

const readmeForPackaging = read('README.md');
for (const entry of ['node_modules', 'dist', 'package-lock.json']) {
  assert(readmeForPackaging.includes(entry), `README must preserve packaging exclusion for ${entry}`);
}

let assetBytes = 0;
let assetFiles = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else {
      assetFiles += 1;
      assetBytes += fs.statSync(path.join(root, rel)).size;
      assert(!entry.name.toLowerCase().endsWith('.svg'), `SVG file is not allowed in payload: ${rel}`);
    }
  }
};
walk('public/assets');
assert(assetFiles >= 150, `public/assets looks incomplete: only ${assetFiles} files`);
assert(assetBytes > 100 * 1024 * 1024, `self-contained assets unexpectedly small: ${assetBytes} bytes`);

const readme = read('README.md');
assert(readme.includes(`## ${pkg.version} 업데이트 내역`), `README missing ${pkg.version} update section`);
assert(readme.includes('패치 ZIP 용량이 큰 이유'), 'README must explain large patch ZIP reason');
assert(readme.includes('self-contained-patch-payload-audit-v162'), 'README missing payload audit tag');
assert(readme.includes('notice-text-fit-v163'), 'README missing notice text fit tag');

const handoff = read('AI_HANDOFF_CARDVILLE.md');
assert(handoff.includes(`현재 기준 버전은 ${pkg.version}`), `handoff missing current ${pkg.version} version`);
assert(handoff.includes('패치 ZIP이 통파일과 비슷한 용량인 이유'), 'handoff must preserve patch-size reason');
assert(handoff.includes('CardVille_v1.0.72_IntroVideoHardVisible_Full.zip'), 'handoff missing final full ZIP name');

const layout = read('src/game/systems/LayoutSystem.ts');
for (const token of ['responsive-surface-spread-v163', 'responsiveSurfaceWidth', 'responsiveSurfaceBox', 'viewportCenterX']) {
  assert(layout.includes(token), `LayoutSystem missing ${token}`);
}
for (const [file, token] of [
  ['src/game/ui/Panel.ts', 'responsiveSurfaceBox'],
  ['src/game/ui/GameButton.ts', 'responsiveSurfaceWidth'],
  ['src/game/systems/ScreenUISystem.ts', 'CARDVILLE_RESPONSIVE_SURFACE_TAG']
]) {
  assert(read(file).includes(token), `${file} missing ${token}`);
}

console.log(`check:patch-payload passed. public/assets ${(assetBytes / 1048576).toFixed(1)}MB / ${assetFiles} files intentionally included for self-contained overwrite patches.`);
