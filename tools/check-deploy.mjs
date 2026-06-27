import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredSource = ['index.html', 'vite.config.ts', 'src/main.ts', '.github/workflows/deploy.yml'];
for (const file of requiredSource) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing ${file}`);
}
const vite = fs.readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
if (!vite.includes("base: '/CardVille/'")) throw new Error('vite.config.ts must use base /CardVille/');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('/src/main.ts')) throw new Error('index.html must point to /src/main.ts for Vite build');
console.log('Deploy source check passed.');
