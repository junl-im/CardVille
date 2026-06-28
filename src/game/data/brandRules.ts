export const CARDVILLE_BRAND = {
  projectNameKo: '카드마을',
  projectNameEn: 'CardVille',
  slogan: '카드를 모아 꿈의 마을을 완성하세요.',
  version: '1.0.24',
  fixedCharacterReference: 'assets/brand/cardville_fixed_character_reference.png',
  identity: ['소년', '검은 고양이', '카드', '따뜻한 판타지 마을'],
  hero: {
    temporaryName: '루카',
    ageFeeling: '12~14세',
    traits: ['밝음', '용감함', '모험심', '항상 웃음'],
    lockedOutfit: ['파란 망토', '갈색 부츠', '흰 셔츠', '갈색 바지']
  },
  mascot: {
    type: '검은 고양이',
    roles: ['힌트', '튜토리얼', '이벤트', '이모션']
  },
  style: {
    mood: ['Pixar 감성', 'Disney 판타지', '2.5D', 'Premium'],
    colors: ['warm gold', 'purple', 'blue', 'brown'],
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
    assetPolicy: 'large diorama background plus individual PNG/WebP buildings and objects'
  },
  villageBuildings: [
    { id: 'library', title: '도서관', mode: '낱말' },
    { id: 'laboratory', title: '연구소', mode: '연산' },
    { id: 'school', title: '학교', mode: '영어' },
    { id: 'forest', title: '숲', mode: '기억력' },
    { id: 'plaza', title: '광장', mode: '이벤트' },
    { id: 'shop', title: '상점', mode: '카드팩' }
  ]
} as const;
