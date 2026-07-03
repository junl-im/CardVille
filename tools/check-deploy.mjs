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
if (workflow.includes("-printf '%f\n'")) throw new Error('deploy workflow must avoid newline-sensitive find -printf in YAML literal blocks');
if (/^' \| sort$/m.test(workflow)) throw new Error('deploy workflow contains a broken split shell quote near find output listing');
if (!workflow.includes('find dist -maxdepth 1 -type f -exec basename {} \\; | sort')) throw new Error('deploy workflow must list dist root files with YAML-safe basename -exec');

if (!workflow.includes('actions/upload-pages-artifact@v4')) throw new Error('deploy workflow must use upload-pages-artifact@v4');
if (!workflow.includes('actions/deploy-pages@v5')) throw new Error('deploy workflow must use deploy-pages@v5');
if (workflow.includes('timeout: 900000')) throw new Error('deploy workflow must not set deploy-pages timeout above the supported 600000ms maximum');
if (workflow.includes('reporting_interval: 10000')) throw new Error('deploy workflow must not override deploy-pages reporting interval after deployment is stable');
if (workflow.includes('error_count: 20')) throw new Error('deploy workflow must not override deploy-pages error_count after deployment is stable');
if (workflow.includes('Diagnose failed Pages deployment')) throw new Error('deploy workflow must not keep temporary Pages diagnostics after successful deployment');
if (workflow.includes('gh api "repos/${GITHUB_REPOSITORY}/pages"')) throw new Error('deploy workflow must not require extra Pages API diagnostics in the clean deploy path');
if (/^  actions: read$/m.test(workflow) || /^  deployments: read$/m.test(workflow)) throw new Error('deploy workflow must keep least-privilege Pages permissions after diagnostics cleanup');
if (workflow.includes('actions/upload-pages-artifact@v3')) throw new Error('deploy workflow must not use upload-pages-artifact@v3');
if (workflow.includes('actions/deploy-pages@v4')) throw new Error('deploy workflow must not use deploy-pages@v4');

if (!workflow.includes('id: deploy_primary')) throw new Error('deploy workflow must use a primary Pages deploy step');
if (!workflow.includes('continue-on-error: true')) throw new Error('primary Pages deploy must allow one retry for transient syncing_files failures');
if (!workflow.includes('Wait before retrying Pages deploy')) throw new Error('deploy workflow must wait before retrying Pages backend failures');
if (!workflow.includes("if: ${{ steps.deploy_primary.outcome == 'failure' }}")) throw new Error('Pages retry must run only after the primary deploy step fails');
if (!workflow.includes('id: deploy_retry')) throw new Error('deploy workflow must include a retry Pages deploy step');
if (!workflow.includes('steps.deploy_retry.outputs.page_url || steps.deploy_primary.outputs.page_url')) throw new Error('deploy workflow must print the retry or primary Pages URL');
if (!workflow.includes('Validate Pages artifact input')) throw new Error('deploy workflow must validate Pages artifact input before upload');
if (!workflow.includes('cancel-in-progress: false')) throw new Error('deploy workflow must queue Pages deployments instead of cancelling in-progress deploys');
if (!workflow.includes('artifact_name: github-pages')) throw new Error('deploy workflow must explicitly deploy the github-pages artifact');
if (!workflow.includes('dist files:')) throw new Error('deploy workflow must print Pages artifact file count before upload');
const verifyScript = pkg.scripts?.verify || '';
if (!verifyScript.includes('npm run check:deploy')) throw new Error('npm run verify must include check:deploy so workflow syntax regressions fail before upload');
const build = JSON.parse(fs.readFileSync(path.join(root, 'public/build.json'), 'utf8'));
if (build.version !== pkg.version) throw new Error(`public/build.json version ${build.version} != package ${pkg.version}`);
console.log(`Deploy source check passed. Version ${pkg.version}.`);
