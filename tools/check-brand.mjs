import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const banned = ['꿈의 서고', '꿈의서고', 'Dream Library'];
const allow = new Set([
  'docs/PATCH_NOTES_1.0.8.md',
  'tools/check-brand.mjs'
]);
const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.html', '.json', '.md']);
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const rel = path.relative(root, full).replaceAll('\\', '/');
      if (allow.has(rel)) continue;
      if (!exts.has(path.extname(full))) continue;
      const text = fs.readFileSync(full, 'utf8');
      for (const word of banned) {
        if (text.includes(word)) hits.push(`${rel}: contains ${word}`);
      }
    }
  }
}

walk(root);
if (hits.length) {
  console.error('Brand check failed:');
  hits.forEach((h) => console.error(`- ${h}`));
  process.exit(1);
}
console.log('Brand check passed.');
