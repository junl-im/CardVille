import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const bannedExtensions = new Set(['.svg']);
const allowedImageExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg']);

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

for (const file of walk(path.join(root, 'public'))) {
  const ext = path.extname(file).toLowerCase();
  if (bannedExtensions.has(ext)) errors.push(`SVG is forbidden: ${path.relative(root, file)}`);
  if (file.includes(`${path.sep}assets${path.sep}`) && ['.gif', '.bmp', '.tiff'].includes(ext)) {
    errors.push(`Unsupported asset format: ${path.relative(root, file)}`);
  }
  if (file.includes(`${path.sep}icons${path.sep}`) && ext && !allowedImageExtensions.has(ext) && ext !== '.gitkeep') {
    errors.push(`Icon must be PNG/WebP/JPG: ${path.relative(root, file)}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Asset policy check passed.');
