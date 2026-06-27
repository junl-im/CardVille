import fs from 'node:fs';
import path from 'node:path';

const roots = ['src'];
const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'];
const missing = [];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function existsImport(basePath) {
  for (const ext of extensions) {
    if (fs.existsSync(basePath + ext) && fs.statSync(basePath + ext).isFile()) return true;
  }
  for (const ext of extensions.slice(1)) {
    const indexPath = path.join(basePath, 'index' + ext);
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) return true;
  }
  return false;
}

for (const root of roots) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, 'utf8');
    const patterns = [
      /from\s+['"](\.{1,2}\/[^'"]+)['"]/g,
      /import\s*\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g,
    ];
    for (const re of patterns) {
      let match;
      while ((match = re.exec(text))) {
        const importPath = match[1];
        const target = path.normalize(path.join(path.dirname(file), importPath));
        if (!existsImport(target)) missing.push({ file, importPath, target });
      }
    }
  }
}

if (missing.length > 0) {
  console.error('Missing relative imports detected:');
  for (const item of missing) {
    console.error(`- ${item.file}: ${item.importPath} -> ${item.target}`);
  }
  process.exit(1);
}

console.log('Relative import check passed.');
