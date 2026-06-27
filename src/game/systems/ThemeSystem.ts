export interface WorldThemeDefinition {
  id: string;
  title: string;
  subtitle: string;
  textureKey: string;
  path: string;
  accent: number;
  available: boolean;
}

export interface CardBackDefinition {
  id: string;
  title: string;
  textureKey: string;
  path: string;
  accent: number;
  available: boolean;
}

const SELECTED_WORLD_KEY = 'cardville.selectedWorld.v1';
const SELECTED_CARD_BACK_KEY = 'cardville.selectedCardBack.v1';

export const WORLD_THEMES: WorldThemeDefinition[] = [
  { id: 'dream_library', title: '꿈의 서고', subtitle: '기본 월드 · 책과 별빛', textureKey: 'bg:dream_library_day', path: 'assets/backgrounds/dream_library_day.png', accent: 0x8fd3ff, available: true },
  { id: 'magic_school', title: '마법 학교', subtitle: '연산과 퍼즐에 어울리는 푸른 마법', textureKey: 'bg:magic_school_day', path: 'assets/backgrounds/magic_school_day.png', accent: 0xc59bff, available: true },
  { id: 'forest', title: '숲의 정원', subtitle: '동물과 자연 카드에 어울리는 초록빛', textureKey: 'bg:forest_day', path: 'assets/backgrounds/forest_day.png', accent: 0x9fffd0, available: true },
  { id: 'ocean', title: '유리 바다', subtitle: '바다 생물과 시원한 글래스 UI', textureKey: 'bg:ocean_day', path: 'assets/backgrounds/ocean_day.png', accent: 0x62d9ff, available: true },
  { id: 'space', title: '별의 우주', subtitle: '전설 카드와 밤하늘 파티클', textureKey: 'bg:space_night', path: 'assets/backgrounds/space_night.png', accent: 0xffd86f, available: true },
  { id: 'winter', title: '겨울 서고', subtitle: '눈빛과 얼음 프레임', textureKey: 'bg:winter_day', path: 'assets/backgrounds/winter_day.png', accent: 0xdff7ff, available: true },
  { id: 'sakura', title: '벚꽃 축제', subtitle: '이벤트 시즌용 분홍빛 월드', textureKey: 'bg:cherry_blossom_day', path: 'assets/backgrounds/cherry_blossom_day.png', accent: 0xff9fcf, available: true },
  { id: 'crystal_cave', title: '수정 동굴', subtitle: '신화 카드 전용 분위기', textureKey: 'bg:crystal_cave_day', path: 'assets/backgrounds/crystal_cave_day.png', accent: 0xb7ffd8, available: true }
];

export const CARD_BACKS: CardBackDefinition[] = [
  { id: 'star', title: '별빛', textureKey: 'back:star', path: 'assets/cards/backs/back_star.webp', accent: 0xffd86f, available: true },
  { id: 'book', title: '마법서', textureKey: 'back:book', path: 'assets/cards/backs/back_book.webp', accent: 0x8fd3ff, available: true },
  { id: 'moon', title: '달빛', textureKey: 'back:moon', path: 'assets/cards/backs/back_moon.webp', accent: 0xc59bff, available: true },
  { id: 'crown', title: '왕관', textureKey: 'back:crown', path: 'assets/cards/backs/back_crown.webp', accent: 0xffd86f, available: true },
  { id: 'crystal', title: '수정', textureKey: 'back:crystal', path: 'assets/cards/backs/back_crystal.webp', accent: 0xb7ffd8, available: true },
  { id: 'magic_circle', title: '마법진', textureKey: 'back:magic_circle', path: 'assets/cards/backs/back_magic_circle.webp', accent: 0xff8fd8, available: true },
  { id: 'rainbow', title: '무지개', textureKey: 'back:rainbow', path: 'assets/cards/backs/back_rainbow.webp', accent: 0xff8fd8, available: true },
  { id: 'space', title: '우주', textureKey: 'back:space', path: 'assets/cards/backs/back_space.webp', accent: 0x8fd3ff, available: true }
];

function read(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function write(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

export class ThemeSystem {
  static getSelectedWorldId(): string {
    return read(SELECTED_WORLD_KEY, WORLD_THEMES[0].id);
  }

  static setSelectedWorldId(id: string): void {
    if (WORLD_THEMES.some((world) => world.id === id && world.available)) write(SELECTED_WORLD_KEY, id);
  }

  static getSelectedWorld(): WorldThemeDefinition {
    return WORLD_THEMES.find((world) => world.id === this.getSelectedWorldId()) ?? WORLD_THEMES[0];
  }

  static getSelectedCardBackId(): string {
    return read(SELECTED_CARD_BACK_KEY, CARD_BACKS[0].id);
  }

  static setSelectedCardBackId(id: string): void {
    if (CARD_BACKS.some((back) => back.id === id && back.available)) write(SELECTED_CARD_BACK_KEY, id);
  }

  static getSelectedCardBack(): CardBackDefinition {
    return CARD_BACKS.find((back) => back.id === this.getSelectedCardBackId()) ?? CARD_BACKS[0];
  }

  static preloadableAssets(): Array<{ key: string; path: string }> {
    return [
      ...WORLD_THEMES.filter((world) => world.available).map((world) => ({ key: world.textureKey, path: world.path })),
      ...CARD_BACKS.filter((back) => back.available).map((back) => ({ key: back.textureKey, path: back.path }))
    ];
  }
}
