export const CARDVILLE_ART_DIRECTION_VERSION = '1.0.58' as const;

export const CARDVILLE_CORE_STYLE_KEYWORDS = [
  'Premium mobile game',
  'AAA mobile game',
  'High-end casual game',
  'Stylized realism',
  'Pixar-quality',
  'DreamWorks-quality',
  'Disney-inspired lighting',
  'Console-quality UI',
  'Premium fantasy',
  'Modern mobile game',
  'High production value',
  'Rich materials',
  'Cinematic lighting',
  'Premium Fantasy Village',
  'Warm Sunset Lighting',
  'Soft Bloom',
  'Fantasy RPG Town',
  '2.5D game assets',
  'High-end UI',
  'Mobile Game of the Year quality'
] as const;

export const CARDVILLE_BANNED_STYLE_KEYWORDS = [
  "NOT a children's game",
  'NOT educational style',
  'NOT preschool',
  'NOT kindergarten',
  'NOT cheap mobile game',
  'NOT flat design',
  'NOT vector illustration',
  'NOT SVG',
  'NOT childish',
  'NOT toy-like'
] as const;

export const CARDVILLE_COMMON_PROMPT_TAIL = `Premium AAA mobile game artwork,
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
8K concept art` as const;

export const CARDVILLE_COLOR_PALETTE = [
  { name: 'Sunset Gold', hex: '#F7B84A', usage: 'main warm key light, reward glow' },
  { name: 'Honey Light', hex: '#FFD98A', usage: 'soft highlight, button shine' },
  { name: 'Royal Gold', hex: '#C98A2E', usage: 'premium trim, legendary borders' },
  { name: 'Antique Brass', hex: '#9E6B2D', usage: 'metal shadow, old hinges' },
  { name: 'Arcane Purple', hex: '#7A4CE0', usage: 'magic, epic rarity, night accents' },
  { name: 'Twilight Violet', hex: '#4B2E83', usage: 'deep fantasy shadow' },
  { name: 'Sapphire Blue', hex: '#3276D9', usage: 'hero cloak, calm UI state' },
  { name: 'Sky Glow', hex: '#84C8FF', usage: 'magical rim light, water and air' },
  { name: 'Warm Cream', hex: '#FFF0CF', usage: 'text panels and parchment light' },
  { name: 'Parchment', hex: '#E6C98F', usage: 'cards, scrolls, quest paper' },
  { name: 'Oak Brown', hex: '#8B5A32', usage: 'wood, signs, floor details' },
  { name: 'Deep Walnut', hex: '#4A2B1A', usage: 'strong outlines and wood creases' },
  { name: 'Cocoa Shadow', hex: '#2E1B17', usage: 'warm occlusion shadows' },
  { name: 'Copper Rose', hex: '#C46A4A', usage: 'rooftops, warmth, selected states' },
  { name: 'Coral Accent', hex: '#FF7D66', usage: 'small alert accents and hearts' },
  { name: 'Emerald Accent', hex: '#34B978', usage: 'success, forest mode, fresh props' },
  { name: 'Mint Glow', hex: '#9BE7C4', usage: 'healing and positive particles' },
  { name: 'Shadow Navy', hex: '#0D1838', usage: 'night depth and UI backdrop' },
  { name: 'Smoke Blue', hex: '#7088A8', usage: 'fog, distant buildings, disabled UI' },
  { name: 'Soft White', hex: '#FFF8EA', usage: 'sparkle core, eye light, text shine' }
] as const;

export const CARDVILLE_LIGHTING_RULES = {
  lightFrom: 'upper-left',
  keyLight: 'warm sunset gold',
  fillLight: 'soft blue-purple bounce from lower-right',
  bloom: 'soft controlled bloom',
  shadows: 'soft contact shadows with stronger occlusion under feet, doors, roofs',
  depth: 'mild mobile-safe depth of field'
} as const;

export const CARDVILLE_CHARACTER_RULES = {
  heroAgeFeeling: 'around 8 years old but premium fantasy traveler, not preschool',
  heroHeadToBodyRatio: '1:4.5',
  npcHeadToBodyRatio: '1:4.2 to 1:5.0',
  proportions: 'natural stylized proportions, expressive face, elegant costume',
  avoid: ['huge head', 'huge eyes', 'tiny body', 'chibi', 'toy-like', 'kindergarten']
} as const;

export const CARDVILLE_ASSET_FORMAT_POLICY = {
  allowedGraphicFormats: ['png', 'webp', 'sprite atlas', 'mp4'],
  bannedGraphicFormats: ['svg'],
  runtimeCutoutRule: 'transparent PNG master plus WebP companion',
  manifestRule: 'runtime assets must be registered in src/game/data/assetManifest.ts'
} as const;

export const CARDVILLE_MATERIAL_RULES = {
  wood: 'rich oak and walnut grain with rounded bevels and warm highlights',
  gold: 'brushed gold and antique brass with bevels, scratches, and darker underside',
  glass: 'semi-transparent blue-purple depth with bright rim and internal glow',
  cloth: 'soft folds, stitched trims, layered adventure outfit',
  leather: 'warm brown boots, belts, bags, straps with edge wear',
  stone: 'soft stylized carved stone with warm bounce lighting',
  magic: 'gold-white particles with purple-blue secondary glow, no neon overload'
} as const;
