import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`[check-doc-hygiene-v179] ${message}`);
    process.exit(1);
  }
};
const include = (file, tokens) => {
  const text = read(file);
  for (const token of Array.isArray(tokens) ? tokens : [tokens]) assert(text.includes(token), `${file} missing ${token}`);
};
const walk = (dir) => {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
};

const pkg = JSON.parse(read('package.json'));
const build = JSON.parse(read('public/build.json'));
assert(pkg.version === '1.0.80', `expected package version 1.0.80, got ${pkg.version}`);
assert(build.version === pkg.version, `build version ${build.version} != package ${pkg.version}`);
assert(build.assetVersion === pkg.version, `assetVersion ${build.assetVersion} != package ${pkg.version}`);
assert(pkg.scripts.verify.includes('check:doc-hygiene-v179'), 'verify must include check:doc-hygiene-v179');
assert(pkg.scripts['check:doc-hygiene-v179'] === 'node tools/check-doc-hygiene-v179.mjs', 'doc hygiene script mismatch');

include('README.md', ['1.0.80', 'DocsHygieneDeltaPatch', 'PATCH_NOTES', '패치 정보는 README.md와 AI_HANDOFF_CARDVILLE.md에만']);
include('AI_HANDOFF_CARDVILLE.md', ['1.0.80 - DocsHygieneDeltaPatch', 'PATCH_NOTES', 'README.md와 AI_HANDOFF_CARDVILLE.md 외 기록 파일 금지']);
include('public/build.json', ['DocsHygieneDeltaPatch', 'no-extra-patch-notes-v179', 'README-and-AI_HANDOFF-only-v179']);
include('public/health.html', ['version 1.0.80', 'DocsHygieneDeltaPatch', 'no-extra-patch-notes-v179']);
include('index.html', ["window.__CARDVILLE_VERSION__ = '1.0.80'", 'cardville_intro_loading.mp4?v=1.0.80']);

const allowedMarkdown = new Set([
  'README.md',
  'AI_HANDOFF_CARDVILLE.md',
  'docs/CARDVILLE_ART_DIRECTION_BIBLE.md',
  'docs/CARDVILLE_ASSET_PROMPT_PACK.md'
]);
const files = walk('.').map((file) => file.replace(/^\.\//, '').replaceAll('\\\\', '/'));
for (const file of files) {
  const base = path.basename(file);
  const lower = base.toLowerCase();
  if (lower.endsWith('.md')) assert(allowedMarkdown.has(file), `unexpected markdown record file: ${file}`);
  assert(!/patch[_-]?notes|release[_-]?notes|changelog|update[_-]?notes/i.test(base), `unexpected patch/release note artifact: ${file}`);
  assert(!lower.endsWith('.txt'), `unexpected txt record file: ${file}`);
  assert(!lower.endsWith('.svg'), `SVG files are not allowed: ${file}`);
}

console.log('[check-doc-hygiene-v179] OK');
