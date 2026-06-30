export const CARDVILLE_BRAND = {
  projectNameKo: '카드마을',
  projectNameEn: 'CardVille',
  slogan: '카드를 모아 꿈의 마을을 완성하세요.',
  version: '1.0.57',
  fixedCharacterReference: 'assets/brand/cardville_fixed_character_reference.png',
  identity: ['소년', '검은 고양이', '카드', '따뜻한 판타지 마을'],
  hero: {
    temporaryName: '루카',
    ageFeeling: 'around 8 years old, premium fantasy traveler, natural stylized proportions',
    traits: ['밝음', '용감함', '모험심', '고급스러운 판타지 주인공', '초딩 느낌 금지'],
    proportionRule: 'head-to-body ratio around 1:4.5, expressive but not oversized eyes',
    lockedOutfit: ['파란 망토', '갈색 부츠', '흰 셔츠', '갈색 바지']
  },
  mascot: {
    type: '검은 고양이',
    roles: ['힌트', '튜토리얼', '이벤트', '이모션']
  },
  style: {
    mood: ['Premium Fantasy Village', 'Stylized Realism', 'Warm Sunset Lighting', 'Cinematic', 'Soft Bloom', 'AAA Casual Game', 'High-end UI'],
    quality: ['Premium mobile game', 'AAA mobile game', 'Pixar-quality rendering', 'Disney-inspired cinematic lighting', 'Console-quality assets', 'Mobile Game of the Year quality'],
    colors: ['warm gold', 'purple', 'blue', 'brown', 'cream', 'emerald accent'],
    lightDirection: 'upper-left warm sunset key light',
    characterRatio: '1:4.5',
    commonNegativeLock: ['NOT a children\'s game', 'NOT educational style', 'NOT preschool', 'NOT kindergarten', 'NOT cheap mobile game', 'NOT flat design', 'NOT vector illustration', 'NOT SVG', 'NOT childish', 'NOT toy-like'],
    allowedGraphicFormats: ['png', 'webp', 'sprite atlas', 'mp4'],
    bannedGraphicFormats: ['svg']
  },
  lobbyDesign: {
    type: 'one-screen diorama',
    camera: 'fixed',
    scrolling: 'disabled',
    tileFeeling: '64x64 or 96x96 scale, large illustration look',
    movement: 'boy and black cat run 3 to 5 steps to tapped building before transition',
    backgroundLife: ['clouds', 'flags', 'smoke', 'birds', 'butterflies', 'floating cards', 'fireflies', 'window glow'],
    assetManifest: 'src/game/data/assetManifest.ts',
    assetPolicy: 'large diorama background plus individual PNG/WebP buildings, NPCs, props, UI assets, and a single TypeScript asset manifest to prevent duplicate loading'
  },
  npcRoster: ['상인', '요리사', '마법사', '경비병', '아이', '마을고양이', '사서', '선생님'],
  villageBuildings: [
    { id: 'library', title: '도서관', mode: '낱말' },
    { id: 'laboratory', title: '연구소', mode: '연산' },
    { id: 'school', title: '학교', mode: '영어' },
    { id: 'forest', title: '숲', mode: '기억력' },
    { id: 'plaza', title: '광장', mode: '이벤트' },
    { id: 'shop', title: '상점', mode: '카드팩' }
  ]
} as const;
