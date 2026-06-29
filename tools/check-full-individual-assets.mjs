import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

function pngInfo(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing FullIndividual PNG: ${rel}`);
  const b = fs.readFileSync(full);
  if (b.length < 33 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) throw new Error(`Not a PNG: ${rel}`);
  const width = b.readUInt32BE(16);
  const height = b.readUInt32BE(20);
  const colorType = b[25];
  if (![4, 6].includes(colorType)) throw new Error(`FullIndividual asset must be alpha PNG: ${rel} colorType=${colorType}`);
  const webp = rel.replace(/\.png$/i, '.webp');
  const webpFull = path.join(root, webp);
  if (!fs.existsSync(webpFull)) throw new Error(`Missing FullIndividual WebP companion: ${webp}`);
  if (fs.statSync(webpFull).size < 800) throw new Error(`FullIndividual WebP companion too small: ${webp}`);
  if (b.length < 3000) throw new Error(`FullIndividual PNG looks too small/empty: ${rel}`);
  return { width, height, colorType, bytes: b.length };
}

for (const rel of [
  'public/assets/backgrounds/bg_shop_interior.png',
  'public/assets/backgrounds/bg_lobby_day.png',
  'public/assets/backgrounds/bg_lobby_night.png',
  'public/assets/cards/card_back_library.png',
  'public/assets/cards/card_back_math.png',
  'public/assets/cards/card_back_memory.png',
  'public/assets/cards/card_back_rare.png',
  'public/assets/ui/ui_offer_card_daily.png',
  'public/assets/ui/ui_offer_card_coin.png',
  'public/assets/ui/ui_offer_card_gem.png',
  'public/assets/ui/ui_offer_card_featured.png',
  'public/assets/ui/ui_stage_card_word.png',
  'public/assets/ui/ui_stage_card_math.png',
  'public/assets/ui/ui_stage_card_memory.png',
  'public/assets/ui/icon_coin_premium.png',
  'public/assets/ui/icon_gem_premium.png',
  'public/assets/ui/icon_xp_star.png',
  'public/assets/ui/icon_card_dust.png',
  'public/assets/ui/badge_next.png',
  'public/assets/ui/badge_ready.png',
  'public/assets/ui/badge_best.png',
  'public/assets/ui/badge_locked.png',
  'public/assets/ui/badge_clear.png',
  'public/assets/ui/ui_cat_paw_pointer.png',
  'public/assets/ui/ui_cat_paw_tap.png',
  'public/assets/ui/ui_result_ribbon.png',
  'public/assets/ui/ui_result_crown.png',
  'public/assets/ui/ui_result_stars.png',
  'public/assets/props/chest_common.png',
  'public/assets/props/chest_rare.png',
  'public/assets/props/chest_epic.png',
  'public/assets/props/chest_legendary.png',
  'public/assets/characters/npc_shopkeeper.png',
  'public/assets/illustrations/illu_library_corner.png',
  'public/assets/illustrations/illu_math_lab_corner.png',
  'public/assets/illustrations/illu_memory_forest_corner.png'
]) pngInfo(rel);

const manifest = read('src/game/data/assetManifest.ts');
for (const token of [
  `CARDVILLE_ASSET_VERSION = '${pkg.version}'`,
  'bgShopInteriorPremium',
  'uiOfferCardDaily', 'uiOfferCardCoin', 'uiOfferCardGem', 'uiOfferCardFeatured',
  'uiStageCardWord', 'uiStageCardMath', 'uiStageCardMemory',
  'cardBackLibraryPremium', 'cardBackMathPremium', 'cardBackMemoryPremium', 'cardBackRarePremium',
  'iconCoinPremium', 'iconGemPremium', 'iconXpStarPremium', 'iconCardDustPremium',
  'badgeNextPremium', 'badgeReadyPremium', 'badgeBestPremium', 'badgeLockedPremium', 'badgeClearPremium',
  'uiCatPawPointer', 'uiCatPawTap', 'uiResultRibbon', 'uiResultCrown', 'uiResultStars',
  'chestCommonPremium', 'chestRarePremium', 'chestEpicPremium', 'chestLegendaryPremium',
  'illuLibraryCorner', 'illuMathLabCorner', 'illuMemoryForestCorner', 'npcShopkeeperPremium'
]) if (!manifest.includes(token)) throw new Error(`assetManifest missing FullIndividual token: ${token}`);

for (const [file, tokens] of Object.entries({
  'src/game/scenes/ShopScene.ts': ['shop-interior-backdrop-v151', 'shop-offer-premium-frame-v151', 'offerCardFrameKey', 'iconCoinPremium', 'iconGemPremium'],
  'src/game/scenes/StageSelectScene.ts': ['stage-card-frame-v151', 'stageFrameKey', 'stageCardBackKey', 'cardBackMemoryPremium'],
  'src/game/scenes/ModeSelectScene.ts': ['mode-illustration-v151', 'modeIllustrationKey', 'illuLibraryCorner'],
  'src/game/systems/RewardPopupSystem.ts': ['uiResultRibbon', 'uiResultStars', 'uiResultCrown', 'chestEpicPremium'],
  'src/game/scenes/RewardScene.ts': ['uiResultRibbon', 'uiResultStars', 'chestKey', 'chestLegendaryPremium'],
  'src/game/scenes/PlayScene.ts': ['cardBackLibraryPremium'],
  'src/game/scenes/MemoryForestScene.ts': ['cardBackMemoryPremium'],
  'src/game/systems/CoachMarkSystem.ts': ['coach-paw-pointer-v151', 'uiCatPawPointer']
})) {
  const text = read(file);
  for (const token of tokens) if (!text.includes(token)) throw new Error(`${file} missing FullIndividual token: ${token}`);
}

for (const token of [`# CardVille ${pkg.version}`, `## ${pkg.version} 업데이트 내역`, 'FullIndividual 프리미엄 에셋 적용', 'check:full-individual-assets']) {
  if (!read('README.md').includes(token)) throw new Error(`README missing FullIndividual token: ${token}`);
}
for (const token of [`현재 기준 버전은 ${pkg.version}`, 'FullIndividual 프리미엄 에셋 적용 패스', 'ui_reward_popup_premium.png는 텍스트 박힘 정책 충돌로 계속 보류']) {
  if (!read('AI_HANDOFF_CARDVILLE.md').includes(token)) throw new Error(`AI handoff missing FullIndividual token: ${token}`);
}
if (pkg.scripts?.['check:full-individual-assets'] !== 'node tools/check-full-individual-assets.mjs') throw new Error('check:full-individual-assets script mismatch');
if (!pkg.scripts?.verify?.includes('check:full-individual-assets')) throw new Error('verify must include check:full-individual-assets');

// Guard no baked-text reward popup is wired into runtime.
for (const forbidden of ['uiRewardPopupPremium', 'ui_reward_popup_premium.png']) {
  if (manifest.includes(forbidden)) throw new Error(`Forbidden text-baked reward popup was wired into manifest: ${forbidden}`);
}

console.log(`FullIndividual asset check passed. Version ${pkg.version}, shop offer frames, stage cards, card backs, icons, badges, reward chrome, chests, coach paws, and scene wiring verified.`);
