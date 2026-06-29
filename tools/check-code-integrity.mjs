import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function unique(label, values) {
  const seen = new Set();
  const duplicates = [];
  for (const value of values) {
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  if (duplicates.length) throw new Error(`${label} duplicates found: ${duplicates.join(', ')}`);
}

const build = JSON.parse(read('public/build.json'));
if (build.version !== pkg.version) throw new Error(`build.json ${build.version} != package ${pkg.version}`);
for (const [file, token] of [
  ['index.html', `__CARDVILLE_VERSION__ = '${pkg.version}'`],
  ['src/main.ts', pkg.version],
  ['src/game/scenes/LoginScene.ts', `LOGIN_VERSION = '${pkg.version}'`],
  ['src/game/scenes/MainLobbyScene.ts', `LOBBY_VERSION = '${pkg.version}'`],
  ['src/game/data/assetManifest.ts', `CARDVILLE_ASSET_VERSION = '${pkg.version}'`],
  ['src/game/data/brandRules.ts', `version: '${pkg.version}'`],
  ['src/game/data/lobbyLayoutPlan.ts', `LOBBY_LAYOUT_PLAN_VERSION = '${pkg.version}'`],
  ['src/game/data/loginLayoutPlan.ts', `LOGIN_LAYOUT_PLAN_VERSION = '${pkg.version}'`]
]) {
  if (!read(file).includes(token)) throw new Error(`${file} missing version token ${token}`);
}
if (!read('public/health.html').includes(`version ${pkg.version}`)) throw new Error('health.html version mismatch');
if (!read('public/reset.html').includes(`CardVille ${pkg.version} Reset`)) throw new Error('reset.html version mismatch');

const main = read('src/main.ts');
const sceneImports = [...main.matchAll(/import \{ ([A-Za-z0-9_]+) \} from '\.\/game\/scenes\/([A-Za-z0-9_]+)'/g)].map((m) => m[1]);
unique('scene imports', sceneImports);
const sceneListBlock = main.match(/scene: \[([\s\S]*?)\]/)?.[1] ?? '';
const sceneList = [...sceneListBlock.matchAll(/\b([A-Za-z0-9_]+Scene)\b/g)].map((m) => m[1]);
unique('scene registry', sceneList);
if (sceneList.length < 10) throw new Error(`Expected full scene registry, found ${sceneList.length}`);

const manifest = read('src/game/data/assetManifest.ts');
const assetKeys = [...manifest.matchAll(/key: '([^']+)'/g)].map((m) => m[1]);
const assetPaths = [...manifest.matchAll(/path: '([^']+)'/g)].map((m) => m[1]);
unique('asset manifest keys', assetKeys);
unique('asset manifest paths', assetPaths);
for (const pathValue of assetPaths) {
  if (pathValue.toLowerCase().endsWith('.svg')) throw new Error(`SVG path in manifest: ${pathValue}`);
}

const diorama = read('src/game/data/dioramaBuildings.ts');
const buildingIds = [...diorama.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
unique('diorama building ids', buildingIds);
const modeCatalog = read('src/game/data/modeCatalog.ts');
const modeIds = [...modeCatalog.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
unique('mode ids', modeIds);

const intro = read('src/game/scenes/IntroLoadingScene.ts');
if (!intro.includes('queuedKeys')) throw new Error('IntroLoadingScene must retain queuedKeys duplicate-load guard');

const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, '코드 무결성', 'check:code-integrity']) {
  if (!readme.includes(token)) throw new Error(`README missing code integrity token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '코드 무결성', '중복 scene']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing code integrity token: ${token}`);
}

if (pkg.scripts?.['check:code-integrity'] !== 'node tools/check-code-integrity.mjs') throw new Error('check:code-integrity script mismatch');
if (!pkg.scripts?.verify?.includes('check:code-integrity')) throw new Error('verify must include check:code-integrity');

console.log(`Code integrity check passed. Version ${pkg.version}, scenes ${sceneList.length}, manifest assets ${assetKeys.length}, no duplicate ids/paths.`);
