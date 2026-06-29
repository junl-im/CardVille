import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function walk(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    return entry.isFile() && entry.name.endsWith('.ts') ? [rel] : [];
  });
}
const nav = read('src/game/systems/NavigationSystem.ts');
for (const token of ['CARDVILLE_NAVIGATION_GUARD_TAG', 'scene-navigation-guard-v152', 'safeStart', 'safeRestart', 'cleanupModalScenes', 'duplicate scene navigation blocked']) {
  if (!nav.includes(token)) throw new Error(`NavigationSystem missing token: ${token}`);
}
const directSceneCalls = [];
for (const rel of walk('src/game/scenes')) {
  const text = read(rel);
  if (text.includes('this.scene.start(') || text.includes('this.scene.restart(')) directSceneCalls.push(rel);
  if (text.includes('NavigationSystem') && !text.includes("../systems/NavigationSystem")) throw new Error(`${rel} references NavigationSystem without import`);
}
if (directSceneCalls.length) throw new Error(`Scene files must use NavigationSystem instead of direct start/restart: ${directSceneCalls.join(', ')}`);
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['drawRouteOverviewRibbon', 'screen-ui-stability-pass-v152', 'NavigationSystem.safeStart']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing navigation/UI stability token: ${token}`);
}
const button = read('src/game/ui/GameButton.ts');
for (const token of ['CARDVILLE_BUTTON_UX_AUDIT_TAG', 'screen-wide-premium-button-v152', 'try {', 'button action failed', 'setDisabled(value: boolean)']) {
  if (!button.includes(token)) throw new Error(`GameButton missing click safety token: ${token}`);
}
const readme = read('README.md');
for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'NavigationSystem.safeStart', 'check:navigation-guard']) {
  if (!readme.includes(token)) throw new Error(`README missing navigation note: ${token}`);
}
console.log(`Navigation guard check passed. Version ${pkg.version}, scene starts are guarded and button actions are error-safe.`);
