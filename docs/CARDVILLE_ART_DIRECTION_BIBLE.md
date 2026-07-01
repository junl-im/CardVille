# CardVille Art Direction Bible 1.0.75

## 0. Purpose

CardVille must look like one premium mobile game, not a collection of mixed generated images. This bible locks the visual language before any large asset batch is produced.

The target is **Premium Fantasy Village + Stylized Realism + Warm Sunset Lighting + AAA Casual Game**. Every asset must feel polished, expensive, cinematic, and production-ready for a modern mobile game.

## 1. Global Style Lock

Use these as the shared style direction for all CardVille assets:

```txt
Premium mobile game
AAA mobile game
High-end casual game
Stylized realism
Pixar-quality
DreamWorks-quality
Disney-inspired lighting
Console-quality UI
Premium fantasy
Modern mobile game
High production value
Rich materials
Cinematic lighting
Premium Fantasy Village
Stylized Realism
Warm Sunset Lighting
Cinematic
Soft Bloom
AAA Casual Game
Fantasy RPG Town
Disney-like atmosphere
Pixar-quality rendering
Console-quality assets
2.5D game assets
Rich textures
Detailed materials
Beautiful lighting
High-end UI
Mobile Game of the Year quality
```

## 2. Absolute Negative Lock

These must be rejected for every new image, prompt, UI asset, character, icon, effect, background, and card frame:

```txt
NOT a children's game
NOT educational style
NOT preschool
NOT kindergarten
NOT cheap mobile game
NOT flat design
NOT vector illustration
NOT SVG
NOT childish
NOT toy-like
```

Additional production bans:

- No SVG files in runtime assets.
- No flat icon-pack look.
- No preschool workbook look.
- No oversized baby head proportions.
- No toy plastic material unless the asset is intentionally a toy prop, and even then it must be premium.
- No random style mixing between screens.
- No thin unreadable UI borders.
- No pure white background for cutout assets.

## 3. CardVille Identity

CardVille is a premium fantasy card village where a young fantasy traveler and a black cat collect magical cards, unlock buildings, clear modes, and grow the village.

Core identity:

- Warm fantasy village
- Cards, stars, gold, magic, soft bloom
- One-screen 2.5D diorama lobby
- Console-quality mobile UI
- Premium casual game readability
- Emotional but not childish
- Elegant but still friendly
- High production value over cuteness

Reference feel, without copying layouts or IP:

- Clash Royale: strong premium mobile readability
- AFK Journey: high-end fantasy mood and lighting
- Archero 2: vivid modern casual color control
- Monument Valley: clean, iconic UI clarity
- Royal Match: polished casual production, not preschool
- Sky: Children of the Light: emotional light and atmosphere

## 4. Common Prompt Tail

Attach this to the end of every image prompt unless a prompt has a specific reason not to:

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

## 5. Color Palette: 20 Locked Colors

| No | Token | Hex | Usage |
|---:|---|---|---|
| 01 | Sunset Gold | `#F7B84A` | main warm key light, reward glow |
| 02 | Honey Light | `#FFD98A` | soft highlight, button shine |
| 03 | Royal Gold | `#C98A2E` | premium trim, legendary borders |
| 04 | Antique Brass | `#9E6B2D` | metal shadow, old hinges |
| 05 | Arcane Purple | `#7A4CE0` | magic, epic rarity, night accents |
| 06 | Twilight Violet | `#4B2E83` | deep fantasy shadow |
| 07 | Sapphire Blue | `#3276D9` | hero cloak, calm UI state |
| 08 | Sky Glow | `#84C8FF` | magical rim light, water/air |
| 09 | Warm Cream | `#FFF0CF` | readable text panels, parchment light |
| 10 | Parchment | `#E6C98F` | cards, scrolls, quest paper |
| 11 | Oak Brown | `#8B5A32` | wood, signs, floor details |
| 12 | Deep Walnut | `#4A2B1A` | strong outlines, wood creases |
| 13 | Cocoa Shadow | `#2E1B17` | warm occlusion shadows |
| 14 | Copper Rose | `#C46A4A` | rooftops, warmth, selected states |
| 15 | Coral Accent | `#FF7D66` | small alert accents, hearts |
| 16 | Emerald Accent | `#34B978` | success, forest mode, fresh props |
| 17 | Mint Glow | `#9BE7C4` | healing, positive particles |
| 18 | Shadow Navy | `#0D1838` | night depth, UI backdrop |
| 19 | Smoke Blue | `#7088A8` | fog, distant buildings, disabled UI |
| 20 | Soft White | `#FFF8EA` | sparkle core, eye light, text shine |

Palette rule: warm gold/cream must dominate the emotional lighting. Purple/blue are premium fantasy supports, not the main mood.

## 6. Lighting Bible

Global lighting must stay consistent.

- Key light direction: **upper-left / 좌상단**.
- Key light color: warm sunset gold.
- Fill light: soft blue/purple bounce from lower-right.
- Rim light: thin warm edge on silhouettes, especially characters, cards, and building roofs.
- Bloom: soft, controlled, never blurry.
- Shadows: soft contact shadow under characters/buildings; stronger occlusion at feet, doors, roof undersides.
- Volumetric light: subtle shafts in lobby, reward, card-pack opening, and magical UI.
- Depth of field: mild; never hide gameplay clarity.

Camera and composition:

- Mobile portrait first: 390×844 and 1080×1920 safe zones.
- 2.5D/isometric-friendly forms.
- Large readable silhouettes.
- Foreground, midground, background separation.
- Important interactables must read instantly at phone size.

## 7. Material Bible

### Wood

- Rich oak/walnut grain, rounded bevels, warm edge highlights.
- Used for fantasy panels, signs, shop counters, card tables.
- Avoid flat brown rectangles.

### Gold / Metal

- Brushed gold and antique brass, not yellow plastic.
- Use bevel, rim highlight, small scratches, and darker underside.
- Legendary card/UI elements use Royal Gold + Honey Light.

### Glass / Crystal

- Semi-transparent blue/purple depth, bright rim, internal glow.
- Used for magic lab, gems, premium panels.
- Avoid flat cyan icon style.

### Cloth / Costume

- Soft folds, stitched trims, layered adventure outfit.
- Hero cloak should stay Sapphire Blue with warm rim light.
- NPC costumes must feel functional, elegant, and village-based.

### Leather

- Boots, belts, bags, straps.
- Warm brown with edge wear and subtle seams.

### Stone

- Soft stylized carved stone with warm bounce lighting.
- Not realistic gritty medieval horror.

### Magic

- Soft particles, curved trails, luminous card dust.
- Core color: gold/white; secondary color: purple/blue.
- Avoid neon overload.

## 8. Character Design Rules

The current problem to avoid: huge eyes, huge head, tiny body, elementary-school/toy look.

New direction:

```txt
Stylized proportions
Around 8 years old
Natural body proportions
Expressive face
Elegant costume
Premium character design
Adventure outfit
Fantasy traveler
Modern stylized
Pixar proportions
```

Locked character proportions:

- Hero head-to-body ratio: about **1:4.5**.
- NPC head-to-body ratio: **1:4.2 to 1:5.0**, depending on role.
- Cat head-to-body: stylized but elegant, not plush toy.
- Eyes expressive but not enormous.
- Hands and feet slightly simplified for mobile readability.
- Costumes have layers, trims, folds, buckles, and material contrast.
- Face shape: warm and approachable, not preschool mascot.
- Silhouette must read clearly at 80–120 px display size.

Hero rule:

- Young fantasy traveler, premium adventure outfit.
- Blue cloak, white shirt, brown pants, brown boots remain the brand anchor.
- Braver and more elegant than cute.
- Avoid baby cheeks, bobblehead, chibi body, toy posture.

NPC rule:

- Each NPC must have a clear job silhouette: merchant, teacher, librarian, guard, cook, wizard, town child, town cat.
- Every NPC must share the same lighting, material, and proportion rules.
- NPCs can be charming, but never cheap or kindergarten-like.

## 9. Black Cat Mascot Rules

The black cat is a premium magical companion, not a toy mascot.

- Sleek black fur with warm rim light.
- Small gold/purple magical accent is allowed.
- Eyes bright and expressive but not oversized plush style.
- Tail motion can communicate emotion.
- Silhouette must remain readable on dark backgrounds.
- Cat expressions: idle, hint, cheer, curious, surprised, sleep, pointing, card-find.
- Avoid baby animal proportions and sticker-like flat rendering.

## 10. Building Style Rules

CardVille buildings must feel like a premium fantasy RPG town in a high-end casual mobile game.

Shared building rules:

- 2.5D cutout or diorama asset.
- Rounded fantasy silhouette.
- Warm sunset highlight from upper-left.
- Gold/purple/blue accents that connect to the mode.
- Rich material layering: wood, stone, glass, metal, banners, windows, signage.
- Door/window glow for interactivity.
- Transparent PNG cutout plus WebP companion.
- No white box background.

Building-specific anchors:

- Library: parchment, warm window light, floating cards, book spines.
- Math Laboratory: glass tubes, brass instruments, blue/purple crystal glow.
- School: elegant academy, not kindergarten classroom.
- Forest: magical trees, soft emerald glow, memory stones.
- Shop: premium card-pack boutique, gold trim, inviting display.
- Event Plaza: banners, stage glow, reward chest, festival lighting.
- Castle: card kingdom destination, crown motif, legendary gold.
- Harbor: future expansion, blue-gold fantasy docks, card sail motif.
- Central Plaza: fountain, tile, reward path, landmark readability.

## 11. Card Frame Rules

CardVille card frames must feel collectible and premium.

Common card rules:

- Rounded premium bevels.
- Strong silhouette at small size.
- Top-left warm highlight, lower-right cool shadow.
- Inner art window with subtle depth.
- Rarity materials must be obvious.
- No flat vector border.
- No plain rectangle.

Rarity direction:

- Common: warm parchment + light brass.
- Rare: polished gold + blue accent.
- Epic: purple crystal + gold edge.
- Legendary: royal gold + soft white bloom + crown/card motif.

## 12. UI Style Rules

Target: **Console-quality UI + High-end casual game + premium fantasy**.

UI rules:

- Large tap targets, mobile-first.
- Rounded panels with bevel and depth.
- Glass/wood/gold material families.
- Soft shadows, subtle highlights, clean readable text.
- Premium, polished, professional.
- Use motion carefully: bounce, glow, shimmer, ripple.
- Keep UI elegant, never worksheet-like.
- Keep icons detailed enough to feel premium, but readable at 48 px.

Button states:

- Normal: rich material, clear label area.
- Pressed: lower brightness, slight inset shadow.
- Disabled: Smoke Blue + low contrast but still readable.
- Reward CTA: gold glow, soft bloom, strong contrast.

## 13. Effects / Particle Rules

Effects must add premium feedback without clutter.

- Correct answer: gold/white sparkle burst, short and satisfying.
- Wrong answer: soft red/coral shake, not harsh failure screen.
- Reward: gold rays, card dust, star particles, subtle radial bloom.
- Card pack opening: layered glow, floating cards, anticipation timing.
- Building selection: door glow, ring ripple, warm beam.
- All effects must be raster PNG/WebP sprites or runtime particles, not SVG.

## 14. Export / File Rules

Runtime graphics:

```txt
Allowed: PNG, WebP, sprite atlas, MP4
Banned: SVG
```

Recommended output:

- Character cutouts: transparent PNG, 1024×1536 source, WebP companion.
- Building cutouts: transparent PNG, 1024×1024 or larger, WebP companion.
- Backgrounds: PNG/WebP, 1080×1920 master preferred.
- UI panels/buttons: transparent PNG, 2x mobile scale, WebP companion.
- Icons: transparent PNG/WebP, 256×256 or 512×512 master.
- Effects: transparent PNG/WebP, power-of-two friendly when practical.

Naming:

- Use lowercase English filenames.
- Use snake_case.
- Include category prefix: `hero_`, `cat_`, `npc_`, `building_`, `ui_`, `icon_`, `effect_`, `pack_`, `card_`.
- Every runtime asset must be registered in `src/game/data/assetManifest.ts` when it is used by the game.

## 15. Asset Acceptance Checklist

Before accepting a new asset, check:

- It follows the common prompt tail.
- It does not look childish, preschool, educational, flat, toy-like, or cheap.
- It uses warm upper-left lighting.
- It has rich textures and material depth.
- It fits the 20-color palette.
- It has transparent background when it is a cutout.
- It has PNG and WebP delivery when used at runtime.
- It has readable silhouette at mobile size.
- It does not include SVG.
- It feels like one CardVille world, not a separate art pack.

## 16. Final Art Direction Statement

CardVille is not a cute educational app. CardVille is a polished, premium fantasy card village game for mobile: warm, cinematic, stylish, elegant, readable, and emotionally inviting. Every image must look like it belongs in the same AAA casual fantasy world.
