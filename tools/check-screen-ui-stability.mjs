import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
const layout = read('src/game/data/lobbyLayoutPlan.ts');
for (const token of ['1.0.52', 'screen-ui-stability-pass-v152', 'scene-navigation-guard-v152', 'route ribbon must not overlap']) {
  if (!layout.includes(token)) throw new Error(`lobbyLayoutPlan missing UI stability token: ${token}`);
}
const lobby = read('src/game/scenes/MainLobbyScene.ts');
for (const token of ['drawRouteOverviewRibbon', 'SCREEN_UI_STABILITY_TAG', '배치 플랜', '추천 건물을 따라가면']) {
  if (!lobby.includes(token)) throw new Error(`MainLobbyScene missing route/UI token: ${token}`);
}
const button = read('src/game/ui/GameButton.ts');
for (const token of ['this.disabled ? 0x9aa4ba', 'this.draw(false)', 'resolveButtonPalette(this.disabled ? 0x9aa4ba', 'screen-wide-premium-button-v152']) {
  if (!button.includes(token)) throw new Error(`GameButton missing disabled/readable token: ${token}`);
}
const handoff = read('AI_HANDOFF_CARDVILLE.md');
for (const token of [`현재 기준 버전은 ${pkg.version}`, '화면 단위 안정성', 'screen-ui-stability-pass-v152']) {
  if (!handoff.includes(token)) throw new Error(`AI handoff missing UI stability note: ${token}`);
}
console.log(`Screen UI stability check passed. Version ${pkg.version}, lobby route ribbon, button disabled styling, and layout audit tags are present.`);
