import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const include = (p, token) => {
  const s = read(p);
  if (!s.includes(token)) throw new Error(`${p} missing ${token}`);
};
const exclude = (p, token) => {
  const s = read(p);
  if (s.includes(token)) throw new Error(`${p} must not contain ${token}`);
};

include('package.json', '1.0.71');
include('src/game/scenes/MainLobbyScene.ts', 'npc-relative-scale-lock-v163');
include('src/game/scenes/MainLobbyScene.ts', 'rememberBaseScale');
include('src/game/scenes/MainLobbyScene.ts', 'tweenRelativeScale');
include('src/game/scenes/MainLobbyScene.ts', 'scaleX: base.x');
include('src/game/scenes/IntroLoadingScene.ts', 'silent-intro-video-loop-v163');
include('src/game/scenes/IntroLoadingScene.ts', 'video.loop = true');
include('src/game/ui/GameButton.ts', 'button-seamless-touch-v163');
include('src/game/ui/Panel.ts', 'panel-seamless-surface-v163');
include('src/game/ui/TextStyles.ts', 'notice-text-fit-v163');
include('src/game/ui/TextStyles.ts', 'applyNoticeBox');
include('src/game/systems/RewardPopupSystem.ts', 'applyNoticeBox');
include('src/game/scenes/DailyMissionScene.ts', 'applyNoticeBox');
include('src/game/scenes/ShopScene.ts', 'applyNoticeBox');
include('src/game/scenes/StageSelectScene.ts', 'applyNoticeBox');
exclude('src/game/scenes/MainLobbyScene.ts', 'targets: npcImage, scale: 1.08');
exclude('src/game/scenes/MainLobbyScene.ts', 'targets: npcImage, scale: 1.14');
exclude('src/game/scenes/MainLobbyScene.ts', 'targets: ripple, scale: 1.75');
exclude('src/game/scenes/MainLobbyScene.ts', 'targets: glow, scale: 2.1');
exclude('src/game/scenes/IntroLoadingScene.ts', '오프닝 영상 뒤 바로 카드마을로 입장합니다');
exclude('src/game/scenes/IntroLoadingScene.ts', 'this.add.text(l.cx');
exclude('src/game/scenes/IntroLoadingScene.ts', 'delayedCall(4200');
console.log('Interaction polish v1.0.71 check passed: relative NPC scaling, silent video loading, seam-soft buttons, and fitted notices verified.');
