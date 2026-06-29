import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const failures = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function mustContain(rel, tokens) {
  const text = read(rel);
  for (const token of tokens) {
    if (!text.includes(token)) failures.push(`${rel} missing token: ${token}`);
  }
}

function walk(dir, visitor) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visitor);
    else visitor(full);
  }
}

const svgFiles = [];
walk(root, (file) => {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  if (rel.toLowerCase().endsWith('.svg')) svgFiles.push(rel);
});
if (svgFiles.length) failures.push(`SVG files are banned: ${svgFiles.join(', ')}`);

mustContain('src/game/data/artDirection.ts', [
  `CARDVILLE_ART_DIRECTION_VERSION = '${version}'`,
  'Premium mobile game',
  'AAA mobile game',
  'High-end casual game',
  'Stylized realism',
  'Pixar-quality',
  'DreamWorks-quality',
  'Disney-inspired lighting',
  'Console-quality UI',
  'Premium Fantasy Village',
  'Warm Sunset Lighting',
  'Mobile Game of the Year quality',
  "NOT a children's game",
  'NOT educational style',
  'NOT preschool',
  'NOT kindergarten',
  'NOT cheap mobile game',
  'NOT flat design',
  'NOT vector illustration',
  'NOT SVG',
  'NOT childish',
  'NOT toy-like',
  'Premium AAA mobile game artwork',
  'Disney-inspired cinematic lighting',
  "lightFrom: 'upper-left'",
  "heroHeadToBodyRatio: '1:4.5'",
  "allowedGraphicFormats: ['png', 'webp', 'sprite atlas', 'mp4']",
  "bannedGraphicFormats: ['svg']"
]);

mustContain('docs/CARDVILLE_ART_DIRECTION_BIBLE.md', [
  `CardVille Art Direction Bible ${version}`,
  'Color Palette: 20 Locked Colors',
  'Key light direction: **upper-left / 좌상단**',
  'Hero head-to-body ratio: about **1:4.5**',
  'Allowed: PNG, WebP, sprite atlas, MP4',
  'Banned: SVG',
  'NOT vector illustration',
  'NOT SVG'
]);

mustContain('docs/CARDVILLE_ASSET_PROMPT_PACK.md', [
  `CardVille Premium Asset Prompt Pack ${version}`,
  'Universal Positive Direction',
  'Universal Negative Direction',
  'Common Prompt Tail',
  'PNG master + WebP companion + assetManifest registration + no SVG'
]);

mustContain('src/game/data/brandRules.ts', [
  `version: '${version}'`,
  'Premium Fantasy Village',
  'Stylized Realism',
  'Warm Sunset Lighting',
  'NOT SVG',
  '1:4.5'
]);

mustContain('README.md', [
  `# CardVille ${version}`,
  `## ${version} 업데이트 내역`,
  '아트 디렉션 바이블',
  'check:art-direction'
]);

mustContain('AI_HANDOFF_CARDVILLE.md', [
  `현재 기준 버전은 ${version}`,
  '1.0.45 아트 바이블/미션 라우트 병합 패스',
  'SVG 사용 금지, PNG/WebP 전용'
]);

const scripts = pkg.scripts ?? {};
if (scripts['check:art-direction'] !== 'node tools/check-art-direction.mjs') failures.push('package.json check:art-direction script mismatch');
if (!scripts.verify?.includes('check:art-direction')) failures.push('package.json verify must include check:art-direction');

const build = JSON.parse(read('public/build.json'));
if (build.version !== version) failures.push(`public/build.json version ${build.version} != package ${version}`);

if (failures.length) {
  console.error('Art direction check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Art direction check passed. Version ${version}, CardVille AAA premium style bible, prompt lock, 20-color palette, 1:4.5 character ratio, upper-left lighting, and no-SVG policy verified.`);
