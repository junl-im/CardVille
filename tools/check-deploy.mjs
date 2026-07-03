import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const requiredSource = ['index.html', 'vite.config.ts', 'src/main.ts', '.github/workflows/deploy.yml'];
for (const file of requiredSource) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing ${file}`);
}
const vite = fs.readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
if (!vite.includes("base: '/CardVille/'")) throw new Error('vite.config.ts must use base /CardVille/');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('/src/main.ts')) throw new Error('index.html must point to /src/main.ts for Vite build');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
if (!workflow.includes('VERSION=$(node -p')) throw new Error('deploy workflow must write deploy proof from package.json version');
if (/version:\s*<b>1\.0\.\d+<\/b>/.test(workflow)) throw new Error('deploy workflow contains a hard-coded proof version');
if (!workflow.includes('dist/version.json')) throw new Error('deploy workflow must write dist/version.json');
if (!workflow.includes('actions/upload-pages-artifact@v4')) throw new Error('deploy workflow must use upload-pages-artifact@v4');
if (!workflow.includes('actions/deploy-pages@v5')) throw new Error('deploy workflow must use deploy-pages@v5');
if (workflow.includes('actions/upload-pages-artifact@v3')) throw new Error('deploy workflow must not use upload-pages-artifact@v3');
if (workflow.includes('actions/deploy-pages@v4')) throw new Error('deploy workflow must not use deploy-pages@v4');
if (!workflow.includes('Validate Pages artifact input')) throw new Error('deploy workflow must validate Pages artifact input before upload');
if (!workflow.includes('cancel-in-progress: false')) throw new Error('deploy workflow must queue Pages deployments instead of cancelling in-progress deploys');
if (!workflow.includes('artifact_name: github-pages')) throw new Error('deploy workflow must explicitly deploy the github-pages artifact');
const build = JSON.parse(fs.readFileSync(path.join(root, 'public/build.json'), 'utf8'));
if (build.version !== pkg.version) throw new Error(`public/build.json version ${build.version} != package ${pkg.version}`);
console.log(`Deploy source check passed. Version ${pkg.version}.`);
