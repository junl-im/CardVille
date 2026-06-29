import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function listFiles(dir, suffix) {
  const out = [];
  function walk(abs) {
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const full = path.join(abs, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(suffix)) out.push(path.relative(root, full));
    }
  }
  walk(path.join(root, dir));
  return out.sort();
}
const pngs = listFiles('public/assets', '.png');
const missing = pngs.filter((rel) => !fs.existsSync(path.join(root, rel.replace(/\.png$/, '.webp'))));
if (missing.length) throw new Error(`PNG assets missing WebP companions: ${missing.slice(0, 20).join(', ')}`);
const intro = read('src/game/scenes/IntroLoadingScene.ts');
for (const token of ['CARDVILLE_WEBP_RUNTIME_TAG', 'webp-asset-runtime-v152', 'detectWebpSupport', 'preferredAssetPath', "url.replace(/\\.png$/, '.webp')"]) {
  if (!intro.includes(token)) throw new Error(`IntroLoadingScene missing WebP runtime token: ${token}`);
}
const manifest = read('src/game/data/assetManifest.ts');
if (!manifest.includes(`CARDVILLE_ASSET_VERSION = '${pkg.version}'`)) throw new Error('Asset manifest version must match package version');
const readme = read('README.md');
for (const token of ['WebP companion', 'check:webp-runtime', `# CardVille ${pkg.version}`]) {
  if (!readme.includes(token)) throw new Error(`README missing WebP runtime note: ${token}`);
}
console.log(`WebP runtime check passed. Version ${pkg.version}, ${pngs.length} PNG assets have WebP companions and runtime preference is enabled.`);
