import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => { if (!condition) { console.error(`[check-delta-patch-v177] ${message}`); process.exit(1); } };
const include = (file, tokens) => { const text = read(file); for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(text.includes(token), `${file} missing ${token}`); };
const walk = (dir) => {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['node_modules','dist','.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel)); else out.push(rel);
  }
  return out;
};
const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.78', `expected package version 1.0.78, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:delta-patch-v177'), 'verify must include check:delta-patch-v177');
assert(pkg.scripts.verify.includes('check:canvas-hardening-v177'), 'verify must include check:canvas-hardening-v177');
include('README.md', [
  'RawOffscreenCanvasGuard',
  'CardVille_v1.0.76_DeltaPatchCanvasGuard_Full.zip',
  'CardVille_v1.0.78_RawOffscreenCanvasGuard_DeltaPatch.zip',
  '변경 파일 중심 Delta Patch',
  'public/assets` 전체를 넣지 않습니다'
]);
include('AI_HANDOFF_CARDVILLE.md', [
  'RawOffscreenCanvasGuard',
  'CardVille_v1.0.76_DeltaPatchCanvasGuard_Full.zip',
  'CardVille_v1.0.78_RawOffscreenCanvasGuard_DeltaPatch.zip',
  'raw-video-offscreen-v177',
  'canvas-frame-preroll-v177'
]);
include('public/build.json', ['RawOffscreenCanvasGuard', 'delta-patch-overwrite-v176', 'raw-video-offscreen-v177', 'canvas-frame-preroll-v177']);
include('index.html', ["cardvilleIntroSrc(){ return new URL('./assets/video/cardville_intro_loading.mp4?v=1.0.78'", 'raw-video-offscreen-v177']);
assert(walk('.').filter((file) => file.toLowerCase().endsWith('.svg')).length === 0, 'SVG files are not allowed');
console.log('[check-delta-patch-v177] OK');
