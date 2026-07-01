# CardVille Premium Asset Prompt Pack 1.0.75

Use this file when generating or requesting CardVille image assets. Do not request SVG. Runtime delivery must be PNG/WebP.

## 1. Universal Positive Direction

```txt
Premium Fantasy Village, Stylized Realism, Warm Sunset Lighting, Cinematic, Soft Bloom, AAA Casual Game, Fantasy RPG Town, Disney-like atmosphere, Pixar-quality rendering, Console-quality assets, 2.5D game assets, Rich textures, Detailed materials, Beautiful lighting, High-end UI, Mobile Game of the Year quality
```

## 2. Universal Negative Direction

```txt
NOT a children's game, NOT educational style, NOT preschool, NOT kindergarten, NOT cheap mobile game, NOT flat design, NOT vector illustration, NOT SVG, NOT childish, NOT toy-like
```

## 3. Common Prompt Tail

```txt
Premium AAA mobile game artwork,
Stylized realism,
Pixar-quality rendering,
Disney-inspired cinematic lighting,
Rich textures,
Warm fantasy atmosphere,
High-end casual game,
Professional game concept art,
Console-quality materials,
Beautiful volumetric lighting,
Soft bloom,
Depth of field,
2.5D game illustration,
NOT children's illustration,
NOT educational,
NOT preschool,
NOT flat design,
NOT vector,
NOT SVG,
NOT cheap mobile game,
Ultra detailed,
8K concept art
```

## 4. Character Prompt Template

```txt
[ASSET_NAME], CardVille premium fantasy traveler character, around 8 years old, natural stylized body proportions, head-to-body ratio about 1:4.5, expressive face but not oversized eyes, elegant adventure costume, layered cloth, leather boots, premium blue cloak, warm upper-left sunset key light, soft purple-blue bounce shadow, transparent background, isolated full-body game character cutout, readable mobile silhouette, no text, no logo,
Premium AAA mobile game artwork,
Stylized realism,
Pixar-quality rendering,
Disney-inspired cinematic lighting,
Rich textures,
Warm fantasy atmosphere,
High-end casual game,
Professional game concept art,
Console-quality materials,
Beautiful volumetric lighting,
Soft bloom,
Depth of field,
2.5D game illustration,
NOT children's illustration,
NOT educational,
NOT preschool,
NOT flat design,
NOT vector,
NOT SVG,
NOT cheap mobile game,
Ultra detailed,
8K concept art
```

## 5. Black Cat Prompt Template

```txt
[ASSET_NAME], CardVille magical black cat companion, sleek elegant black fur, warm golden rim light from upper-left, expressive eyes but not plush toy style, subtle purple-gold magical accent, premium fantasy mascot, natural cat body, transparent background, isolated full-body game asset, readable mobile silhouette, no text, no logo,
Premium AAA mobile game artwork,
Stylized realism,
Pixar-quality rendering,
Disney-inspired cinematic lighting,
Rich textures,
Warm fantasy atmosphere,
High-end casual game,
Professional game concept art,
Console-quality materials,
Beautiful volumetric lighting,
Soft bloom,
Depth of field,
2.5D game illustration,
NOT children's illustration,
NOT educational,
NOT preschool,
NOT flat design,
NOT vector,
NOT SVG,
NOT cheap mobile game,
Ultra detailed,
8K concept art
```

## 6. Building Prompt Template

```txt
[ASSET_NAME], CardVille premium fantasy village building, 2.5D diorama cutout, rich wood stone glass and gold materials, warm upper-left sunset lighting, soft bloom, magical window glow, rounded fantasy silhouette, detailed material textures, transparent background, isolated building game asset, no text, no logo, designed for mobile portrait lobby,
Premium AAA mobile game artwork,
Stylized realism,
Pixar-quality rendering,
Disney-inspired cinematic lighting,
Rich textures,
Warm fantasy atmosphere,
High-end casual game,
Professional game concept art,
Console-quality materials,
Beautiful volumetric lighting,
Soft bloom,
Depth of field,
2.5D game illustration,
NOT children's illustration,
NOT educational,
NOT preschool,
NOT flat design,
NOT vector,
NOT SVG,
NOT cheap mobile game,
Ultra detailed,
8K concept art
```

## 7. UI Prompt Template

```txt
[ASSET_NAME], CardVille premium fantasy mobile game UI asset, console-quality UI, high-end casual game interface, polished gold and wood and glass materials, rounded bevels, soft inner glow, warm upper-left highlight, readable mobile tap target, transparent background, no text unless explicitly required, no logo,
Premium AAA mobile game artwork,
Stylized realism,
Pixar-quality rendering,
Disney-inspired cinematic lighting,
Rich textures,
Warm fantasy atmosphere,
High-end casual game,
Professional game concept art,
Console-quality materials,
Beautiful volumetric lighting,
Soft bloom,
Depth of field,
2.5D game illustration,
NOT children's illustration,
NOT educational,
NOT preschool,
NOT flat design,
NOT vector,
NOT SVG,
NOT cheap mobile game,
Ultra detailed,
8K concept art
```

## 8. Card Frame Prompt Template

```txt
[ASSET_NAME], CardVille collectible fantasy card frame, premium beveled card border, rich rarity material, polished gold trim, inner art window, warm upper-left highlight, cool purple-blue lower-right shadow, soft bloom, transparent center window if needed, transparent background, no text, no logo, mobile game card asset,
Premium AAA mobile game artwork,
Stylized realism,
Pixar-quality rendering,
Disney-inspired cinematic lighting,
Rich textures,
Warm fantasy atmosphere,
High-end casual game,
Professional game concept art,
Console-quality materials,
Beautiful volumetric lighting,
Soft bloom,
Depth of field,
2.5D game illustration,
NOT children's illustration,
NOT educational,
NOT preschool,
NOT flat design,
NOT vector,
NOT SVG,
NOT cheap mobile game,
Ultra detailed,
8K concept art
```

## 9. First High-Priority Asset Batch

Create these first after the art direction is approved:

1. `public/assets/characters/hero_idle_premium.png`
2. `public/assets/characters/hero_walk_01_premium.png`
3. `public/assets/characters/hero_walk_02_premium.png`
4. `public/assets/characters/hero_walk_03_premium.png`
5. `public/assets/characters/cat_idle_premium.png`
6. `public/assets/characters/cat_hint_premium.png`
7. `public/assets/characters/npc_shopkeeper_premium.png`
8. `public/assets/ui/ui_math_console_premium.png`
9. `public/assets/ui/ui_memory_board_premium.png`
10. `public/assets/ui/ui_reward_panel_legendary.png`
11. `public/assets/effects/effect_card_pack_open_gold.png`
12. `public/assets/icons/icon_coin_premium.png`
13. `public/assets/icons/icon_gem_premium.png`
14. `public/assets/icons/icon_xp_star_premium.png`

Delivery rule for each runtime asset:

```txt
PNG master + WebP companion + assetManifest registration + no SVG
```
