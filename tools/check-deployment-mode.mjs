import fs from 'node:fs';

const required = [
  ['index.html', 'cardville-html-fallback'],
  ['index.html', '__CARDVILLE_BUILD_ID__'],
  ['.github/workflows/deploy.yml', 'actions/deploy-pages@v4'],
  ['.github/workflows/deploy.yml', 'path: ./dist'],
  ['vite.config.ts', "base: '/CardVille/'"]
];

let failed = false;
for (const [file, pattern] of required) {
  if (!fs.existsSync(file)) {
    console.error(`Deployment check failed: missing ${file}`);
    failed = true;
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(pattern)) {
    console.error(`Deployment check failed: ${file} does not include ${pattern}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Deployment mode check passed.');
