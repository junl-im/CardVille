import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const maxJsKb = 2600;
const maxCssKb = 300;
const errors = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(dist);
const jsKb = files.filter((file) => file.endsWith('.js')).reduce((sum, file) => sum + fs.statSync(file).size / 1024, 0);
const cssKb = files.filter((file) => file.endsWith('.css')).reduce((sum, file) => sum + fs.statSync(file).size / 1024, 0);

if (jsKb > maxJsKb) errors.push(`JS bundle too large: ${jsKb.toFixed(1)} KB > ${maxJsKb} KB`);
if (cssKb > maxCssKb) errors.push(`CSS bundle too large: ${cssKb.toFixed(1)} KB > ${maxCssKb} KB`);

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Bundle budget check passed. JS ${jsKb.toFixed(1)} KB / CSS ${cssKb.toFixed(1)} KB`);
