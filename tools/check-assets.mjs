import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const manifestPath = path.join(root, 'src/game/data/assetManifest.ts');
if (!fs.existsSync(manifestPath)) throw new Error('Missing src/game/data/assetManifest.ts');
const manifest = fs.readFileSync(manifestPath, 'utf8');

const records = [...manifest.matchAll(/\{ key: '([^']+)', path: '([^']+)', category: '([^']+)', role: '([^']+)', required: (true|false) \}/g)]
  .map((m) => ({ key: m[1], assetPath: m[2], category: m[3], role: m[4], required: m[5] === 'true' }));
if (records.length < 100) throw new Error(`Expected at least 100 manifest assets, found ${records.length}`);

const seen = new Map();
for (const record of records) {
  if (seen.has(record.key)) throw new Error(`Duplicate asset key: ${record.key}`);
  seen.set(record.key, record.assetPath);
  const full = path.join(root, 'public', record.assetPath);
  if (record.required && !fs.existsSync(full)) throw new Error(`Required asset missing: ${record.key} -> ${record.assetPath}`);
  if (record.assetPath.toLowerCase().endsWith('.svg')) throw new Error(`SVG is banned in manifest: ${record.assetPath}`);
}

const requiredKeys = [
  'dioramaCastle', 'dioramaLibrary', 'dioramaLab', 'dioramaShop', 'dioramaSchool', 'dioramaForest', 'dioramaEvent', 'dioramaHarbor', 'dioramaPlaza',
  'heroIdle', 'heroWalk01', 'heroWalk02', 'heroWalk03', 'catIdle', 'catWalk01', 'catWalk02', 'catHint',
  'npcLibrarian', 'npcWizard', 'npcMerchant', 'npcTeacher', 'npcGuard', 'npcCook', 'npcChild01', 'npcTownCat',
  'propFountain', 'propTreeOak', 'propBench', 'propFlagRed', 'propSignpost', 'propLantern', 'propSmokePuff', 'propWindowLight', 'propBird', 'propFirefly', 'propCardTrail', 'propFlowerPot', 'propPlazaTile96',
  'uiPanelGlass', 'uiPanelWood', 'uiPanelGold', 'uiNameplateGold', 'uiSpeechBubble', 'uiLockBadge', 'uiBuildingGlow', 'uiDoorLight', 'uiToast', 'uiTouchRipple', 'uiQuestMarker', 'uiCloseRound', 'uiSettingsButton',
  'iconCvLibrary', 'iconCvLab', 'iconCvForest', 'iconCvSchool', 'iconCvEvent', 'iconCvCastle', 'iconCvHarbor', 'iconCvPlaza', 'iconCvNpc', 'iconCvAsset'
];
for (const key of requiredKeys) {
  if (!seen.has(key)) throw new Error(`Manifest missing required CardVille asset key: ${key}`);
}

const categories = records.reduce((acc, record) => {
  acc[record.category] = (acc[record.category] ?? 0) + 1;
  return acc;
}, {});
for (const [category, min] of Object.entries({ building: 9, hero: 6, mascot: 5, npc: 8, prop: 13, ui: 13, icon: 22 })) {
  if ((categories[category] ?? 0) < min) throw new Error(`Category ${category} has ${categories[category] ?? 0}, expected at least ${min}`);
}

const publicAssets = path.join(root, 'public/assets');
const svgHits = [];
const webpCompanions = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const rel = path.relative(root, full).replaceAll('\\', '/');
      if (entry.name.toLowerCase().endsWith('.svg')) svgHits.push(rel);
      if (entry.name.toLowerCase().endsWith('.webp')) webpCompanions.push(rel);
    }
  }
}
walk(publicAssets);
if (svgHits.length) throw new Error(`SVG files are not allowed: ${svgHits.join(', ')}`);
if (webpCompanions.length < 40) throw new Error(`Expected WebP companion assets, found ${webpCompanions.length}`);

const intro = fs.readFileSync(path.join(root, 'src/game/scenes/IntroLoadingScene.ts'), 'utf8');
for (const token of ['ASSET_MANIFEST', 'queuedKeys', 'for (const asset of ASSET_MANIFEST)', 'this.queueImage(asset.key, asset.path)']) {
  if (!intro.includes(token)) throw new Error(`IntroLoadingScene missing manifest loading token: ${token}`);
}
const lobby = fs.readFileSync(path.join(root, 'src/game/scenes/MainLobbyScene.ts'), 'utf8');
for (const token of ['LOBBY_PROPS', 'LOBBY_NPCS', 'startWalkAnimation', 'uiDoorLight', 'uiTouchRipple', 'npcMerchant', 'propFountain']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing asset integration token: ${token}`);
}
const workflow = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
if (!workflow.includes('npm run verify')) throw new Error('GitHub Actions workflow must run npm run verify');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const token of ['# CardVille 1.0.25', '## 1.0.25 업데이트 내역', 'src/game/data/assetManifest.ts', 'check:assets']) {
  if (!readme.includes(token)) throw new Error(`README missing ${token}`);
}
const handoff = fs.readFileSync(path.join(root, 'AI_HANDOFF_CARDVILLE.md'), 'utf8');
for (const token of ['현재 기준 버전은 1.0.25', '1.0.25 자산 기반 업데이트', 'assetManifest.ts', 'GitHub Actions']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing ${token}`);
}
const build = JSON.parse(fs.readFileSync(path.join(root, 'public/build.json'), 'utf8'));
if (build.version !== pkg.version) throw new Error(`build.json version ${build.version} != package ${pkg.version}`);

console.log(`Asset check passed. Version ${pkg.version}, manifest ${records.length} assets, categories ${JSON.stringify(categories)}, WebP companions ${webpCompanions.length}, SVG files 0, GitHub Actions verify connected.`);
