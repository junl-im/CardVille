import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'index.html',
  'vite.config.ts',
  'src/main.ts',
  'src/diagnostics/startupGuard.ts',
  'src/game/config/phaserConfig.ts',
  'src/game/scenes/BootScene.ts',
  'src/game/scenes/SplashScene.ts',
  'src/game/scenes/LoadingScene.ts',
  'src/game/scenes/LoginScene.ts',
  'src/pwa/registerServiceWorker.ts',
  'public/reset.html',
  'public/sw.js',
  'public/build.json',
  'public/assets/video/cardville_intro_loading.mp4',
  'public/assets/manifest/assets.manifest.json',
  'public/assets/json/cards_image_index.json',
  'public/assets/data/modes/catalog.json'
];

const missing = requiredFiles.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('Boot file check failed. Missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
if (!viteConfig.includes("base: '/CardVille/'")) {
  console.error('Boot file check failed. vite.config.ts must keep base: /CardVille/.');
  process.exit(1);
}

const phaserConfig = fs.readFileSync('src/game/config/phaserConfig.ts', 'utf8');
if (!phaserConfig.includes('type: Phaser.CANVAS')) {
  console.error('Boot file check failed. Runtime-safe RC build must use Phaser.CANVAS.');
  process.exit(1);
}

const main = fs.readFileSync('src/main.ts', 'utf8');
for (const token of ['installStartupGuard', 'showBootError', 'prepareRuntimeCache', 'Phaser.Core.Events.READY']) {
  if (!main.includes(token)) {
    console.error(`Boot file check failed. src/main.ts does not contain ${token}.`);
    process.exit(1);
  }
}

const sceneFiles = fs.readdirSync('src/game/scenes').filter((file) => file.endsWith('.ts'));
const sceneKeys = [];
for (const file of sceneFiles) {
  const body = fs.readFileSync(path.join('src/game/scenes', file), 'utf8');
  const matches = [...body.matchAll(/super\(['"]([^'"]+)['"]\)/g)].map((match) => match[1]);
  sceneKeys.push(...matches.map((key) => ({ key, file })));
}
const seen = new Map();
const duplicates = [];
for (const item of sceneKeys) {
  if (seen.has(item.key)) duplicates.push(`${item.key}: ${seen.get(item.key)} / ${item.file}`);
  seen.set(item.key, item.file);
}
if (duplicates.length) {
  console.error('Boot file check failed. Duplicate scene keys:');
  for (const item of duplicates) console.error(`- ${item}`);
  process.exit(1);
}

const resetHtml = fs.readFileSync('public/reset.html', 'utf8');
if (!resetHtml.includes('getRegistrations') || !resetHtml.includes('caches.keys')) {
  console.error('Boot file check failed. reset.html must unregister service workers and clear caches.');
  process.exit(1);
}

const sw = fs.readFileSync('public/sw.js', 'utf8');
for (const token of ['CARDVILLE_BUILD_ID', 'client.navigate', "cache: 'no-store'", 'deleteLegacyCaches']) {
  if (!sw.includes(token)) {
    console.error(`Boot file check failed. public/sw.js does not contain ${token}.`);
    process.exit(1);
  }
}

const registerSw = fs.readFileSync('src/pwa/registerServiceWorker.ts', 'utf8');
for (const token of ['prepareRuntimeCache', 'updateViaCache', 'reloadOnceAfterMigration']) {
  if (!registerSw.includes(token)) {
    console.error(`Boot file check failed. registerServiceWorker.ts does not contain ${token}.`);
    process.exit(1);
  }
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
if (!indexHtml.includes('cardville-html-fallback')) {
  console.error('Boot file check failed: index.html needs an inline HTML fallback.');
  process.exit(1);
}
if (!indexHtml.includes('__CARDVILLE_MARK_HTML_BOOTED__')) {
  console.error('Boot file check failed: index.html needs HTML boot completion hook.');
  process.exit(1);
}
console.log(`Boot file check passed. Scenes: ${sceneKeys.length}.`);
