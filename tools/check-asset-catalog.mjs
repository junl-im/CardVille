import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const indexPath = path.join(root, 'public/assets/json/cards_image_index.json');
const manifestPath = path.join(root, 'public/assets/json/asset_manifest.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON: ${path.relative(root, file)} (${error.message})`);
    return null;
  }
}

function isPng(file) {
  const buf = fs.readFileSync(file);
  return buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
}

if (!fs.existsSync(indexPath)) errors.push('Missing cards image index: public/assets/json/cards_image_index.json');
if (!fs.existsSync(manifestPath)) errors.push('Missing asset manifest: public/assets/json/asset_manifest.json');

const index = fs.existsSync(indexPath) ? readJson(indexPath) : [];
const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : {};

if (Array.isArray(index)) {
  if (index.length < 5000) errors.push(`Expected at least 5000 card images, found ${index.length}`);
  const ids = new Set();
  const categories = new Map();
  for (const item of index) {
    if (!item || typeof item !== 'object') {
      errors.push('Invalid index item object.');
      continue;
    }
    if (!item.id || !item.category || !item.label || !item.file) errors.push(`Invalid index item fields: ${JSON.stringify(item)}`);
    if (ids.has(item.id)) errors.push(`Duplicate card image id: ${item.id}`);
    ids.add(item.id);
    categories.set(item.category, (categories.get(item.category) ?? 0) + 1);
    const target = path.join(root, 'public/assets', item.file);
    if (!fs.existsSync(target)) {
      errors.push(`Index references missing file: ${item.file}`);
      continue;
    }
    if (path.extname(target).toLowerCase() !== '.png') errors.push(`Card image must be PNG: ${item.file}`);
    if (!isPng(target)) errors.push(`Card image has invalid PNG signature: ${item.file}`);
  }
  if (categories.size < 15) errors.push(`Expected many categories, found ${categories.size}`);
} else {
  errors.push('cards_image_index.json must be an array.');
}

if (manifest && typeof manifest === 'object' && manifest.counts) {
  const expected = manifest.counts.card_images;
  if (typeof expected === 'number' && Array.isArray(index) && index.length < expected) {
    errors.push(`Manifest expects ${expected} card images but index has ${index.length}`);
  }
}

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

for (const file of walk(path.join(root, 'public/assets'))) {
  if (file.endsWith('~')) errors.push(`Backup/temp file is not allowed: ${path.relative(root, file)}`);
  if (fs.statSync(file).size === 0 && path.basename(file) !== '.gitkeep') errors.push(`Zero-byte asset file: ${path.relative(root, file)}`);
}

if (errors.length > 0) {
  console.error(errors.slice(0, 60).join('\n'));
  if (errors.length > 60) console.error(`...and ${errors.length - 60} more errors`);
  process.exit(1);
}

console.log(`Asset catalog check passed. Card images: ${Array.isArray(index) ? index.length : 0}`);
