export type WordCategory =
  | 'tired'
  | 'strong'
  | 'cute'
  | 'place'
  | 'taste'
  | 'guard'
  | 'animal'
  | 'nature'
  | 'food'
  | 'tool'
  | 'motion'
  | 'magic';

export type WordCard = {
  id: string;
  label: string;
  category: WordCategory;
  tag: string;
};

export type GoalCard = {
  label: string;
  category: WordCategory;
  needed: number;
};

export type StageDeck = {
  id: number;
  title: string;
  note: string;
  difficulty: '쉬움' | '보통' | '도전';
  steps: number;
  goals: GoalCard[];
  columns: WordCard[][];
};

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  tired: '피로/졸림',
  strong: '단단함/강함',
  cute: '귀여움/행운',
  place: '장소',
  taste: '맛/감각',
  guard: '방어/보호',
  animal: '동물',
  nature: '자연',
  food: '음식',
  tool: '도구',
  motion: '움직임',
  magic: '마법/반짝임'
};

export const CATEGORY_COLOR: Record<WordCategory, number> = {
  tired: 0x94c8ff,
  strong: 0xffb24f,
  cute: 0xff8dc7,
  place: 0x8fd3ff,
  taste: 0xb9ff9d,
  guard: 0xc1b7ff,
  animal: 0xffd86f,
  nature: 0x7cf2bd,
  food: 0xffc56f,
  tool: 0xc8f0ff,
  motion: 0xa8ffcf,
  magic: 0xe0a7ff
};

export const WORD_STAGES: StageDeck[] = [
  {
    id: 1,
    title: '첫 말 카드 정리',
    note: '피곤함과 강한 느낌 계열을 찾아요.',
    difficulty: '쉬움',
    steps: 24,
    goals: [
      { label: '피곤함', category: 'tired', needed: 3 },
      { label: '강한 느낌', category: 'strong', needed: 2 }
    ],
    columns: [
      [
        { id: 'nap', label: '잠깐 눈붙임', category: 'tired', tag: '행동' },
        { id: 'drowsy', label: '나른함', category: 'tired', tag: '상태' },
        { id: 'sleepy', label: '졸림', category: 'tired', tag: '상태' }
      ],
      [
        { id: 'cute_smile', label: '귀여운 웃음', category: 'cute', tag: '표정' },
        { id: 'tough', label: '튼튼함', category: 'strong', tag: '성질' },
        { id: 'firm', label: '단단함', category: 'strong', tag: '성질' }
      ],
      [
        { id: 'yawn', label: '하품', category: 'tired', tag: '행동' },
        { id: 'watch', label: '경계', category: 'guard', tag: '방어' },
        { id: 'wall', label: '장벽', category: 'guard', tag: '방어' }
      ],
      [
        { id: 'heavy_eyes', label: '눈꺼풀 무거움', category: 'tired', tag: '상태' },
        { id: 'taste', label: '맛보다', category: 'taste', tag: '행동' },
        { id: 'underground', label: '지하 묘지', category: 'place', tag: '장소' }
      ]
    ]
  },
  {
    id: 2,
    title: '럭키와 방패',
    note: '귀여움, 행운, 보호 계열을 찾아요.',
    difficulty: '쉬움',
    steps: 23,
    goals: [
      { label: '럭키', category: 'cute', needed: 3 },
      { label: '방패', category: 'guard', needed: 3 }
    ],
    columns: [
      [
        { id: 'charm', label: '매력', category: 'cute', tag: '감정' },
        { id: 'wink', label: '윙크', category: 'cute', tag: '표정' },
        { id: 'smile', label: '방긋', category: 'cute', tag: '표정' }
      ],
      [
        { id: 'sweet', label: '달콤함', category: 'taste', tag: '맛' },
        { id: 'barrier', label: '보호막', category: 'guard', tag: '방어' },
        { id: 'shield', label: '방패', category: 'guard', tag: '도구' }
      ],
      [
        { id: 'ribbon', label: '리본', category: 'cute', tag: '장식' },
        { id: 'gate', label: '성문', category: 'guard', tag: '방어' },
        { id: 'castle', label: '요새', category: 'place', tag: '장소' }
      ],
      [
        { id: 'guard', label: '지키다', category: 'guard', tag: '행동' },
        { id: 'luck', label: '행운', category: 'cute', tag: '기분' },
        { id: 'sleep', label: '졸음', category: 'tired', tag: '상태' }
      ]
    ]
  },
  {
    id: 3,
    title: '큐브와 장소',
    note: '모양과 장소 계열을 정리해요.',
    difficulty: '쉬움',
    steps: 22,
    goals: [
      { label: '정육면체', category: 'strong', needed: 3 },
      { label: '장소 카드', category: 'place', needed: 3 }
    ],
    columns: [
      [
        { id: 'village', label: '마을 광장', category: 'place', tag: '장소' },
        { id: 'block', label: '블록', category: 'strong', tag: '모양' },
        { id: 'cube', label: '큐브', category: 'strong', tag: '모양' }
      ],
      [
        { id: 'soft', label: '폭신함', category: 'cute', tag: '감촉' },
        { id: 'shop', label: '카드 상점', category: 'place', tag: '장소' },
        { id: 'tower', label: '카드 타워', category: 'place', tag: '장소' }
      ],
      [
        { id: 'hard', label: '단단함', category: 'strong', tag: '성질' },
        { id: 'home', label: '작은 집', category: 'place', tag: '장소' },
        { id: 'fort', label: '요새', category: 'guard', tag: '장소' }
      ],
      [
        { id: 'square', label: '정사각형', category: 'strong', tag: '모양' },
        { id: 'look', label: '보다', category: 'taste', tag: '행동' },
        { id: 'grave', label: '지하 묘지', category: 'place', tag: '장소' }
      ]
    ]
  },
  {
    id: 4,
    title: '동물과 자연',
    note: '동물 친구와 자연 카드를 분류해요.',
    difficulty: '보통',
    steps: 26,
    goals: [
      { label: '동물 친구', category: 'animal', needed: 4 },
      { label: '자연 카드', category: 'nature', needed: 3 }
    ],
    columns: [
      [
        { id: 'leaf', label: '나뭇잎', category: 'nature', tag: '자연' },
        { id: 'cat', label: '고양이', category: 'animal', tag: '동물' },
        { id: 'puppy', label: '강아지', category: 'animal', tag: '동물' },
        { id: 'bird', label: '새', category: 'animal', tag: '동물' }
      ],
      [
        { id: 'mountain', label: '산', category: 'nature', tag: '자연' },
        { id: 'river', label: '강물', category: 'nature', tag: '자연' },
        { id: 'fox', label: '여우', category: 'animal', tag: '동물' }
      ],
      [
        { id: 'shield2', label: '보호막', category: 'guard', tag: '방어' },
        { id: 'flower', label: '꽃', category: 'nature', tag: '자연' },
        { id: 'rabbit', label: '토끼', category: 'animal', tag: '동물' }
      ],
      [
        { id: 'sleep2', label: '나른함', category: 'tired', tag: '상태' },
        { id: 'forest', label: '숲', category: 'nature', tag: '장소' },
        { id: 'horse', label: '말', category: 'animal', tag: '동물' }
      ]
    ]
  },
  {
    id: 5,
    title: '맛있는 시장',
    note: '음식과 맛 표현을 빠르게 구분해요.',
    difficulty: '보통',
    steps: 27,
    goals: [
      { label: '음식 카드', category: 'food', needed: 4 },
      { label: '맛 표현', category: 'taste', needed: 3 }
    ],
    columns: [
      [
        { id: 'rice', label: '주먹밥', category: 'food', tag: '음식' },
        { id: 'spicy', label: '매콤함', category: 'taste', tag: '맛' },
        { id: 'cake', label: '케이크', category: 'food', tag: '음식' }
      ],
      [
        { id: 'sour', label: '새콤함', category: 'taste', tag: '맛' },
        { id: 'bread', label: '빵', category: 'food', tag: '음식' },
        { id: 'honey', label: '달콤함', category: 'taste', tag: '맛' }
      ],
      [
        { id: 'cat2', label: '고양이', category: 'animal', tag: '동물' },
        { id: 'noodle', label: '국수', category: 'food', tag: '음식' },
        { id: 'salty', label: '짭짤함', category: 'taste', tag: '맛' }
      ],
      [
        { id: 'apple', label: '사과', category: 'food', tag: '음식' },
        { id: 'shield3', label: '방패', category: 'guard', tag: '도구' },
        { id: 'cookie', label: '쿠키', category: 'food', tag: '음식' }
      ]
    ]
  },
  {
    id: 6,
    title: '도구 가게',
    note: '도구와 움직임 단어를 골라요.',
    difficulty: '보통',
    steps: 28,
    goals: [
      { label: '도구 카드', category: 'tool', needed: 4 },
      { label: '움직임', category: 'motion', needed: 4 }
    ],
    columns: [
      [
        { id: 'hammer', label: '망치', category: 'tool', tag: '도구' },
        { id: 'run', label: '달리다', category: 'motion', tag: '동작' },
        { id: 'scissors', label: '가위', category: 'tool', tag: '도구' },
        { id: 'jump', label: '뛰다', category: 'motion', tag: '동작' }
      ],
      [
        { id: 'brush', label: '붓', category: 'tool', tag: '도구' },
        { id: 'slide', label: '미끄러지다', category: 'motion', tag: '동작' },
        { id: 'needle', label: '바늘', category: 'tool', tag: '도구' }
      ],
      [
        { id: 'spin', label: '빙글 돌다', category: 'motion', tag: '동작' },
        { id: 'leaf2', label: '나뭇잎', category: 'nature', tag: '자연' },
        { id: 'shovel', label: '삽', category: 'tool', tag: '도구' }
      ],
      [
        { id: 'walk', label: '걷다', category: 'motion', tag: '동작' },
        { id: 'magic1', label: '반짝임', category: 'magic', tag: '마법' },
        { id: 'key', label: '열쇠', category: 'tool', tag: '도구' }
      ]
    ]
  },
  {
    id: 7,
    title: '반짝 마법 쇼',
    note: '마법과 귀여운 표현을 이어서 찾아요.',
    difficulty: '도전',
    steps: 29,
    goals: [
      { label: '마법', category: 'magic', needed: 4 },
      { label: '귀여움', category: 'cute', needed: 4 }
    ],
    columns: [
      [
        { id: 'spark', label: '반짝', category: 'magic', tag: '마법' },
        { id: 'starfall', label: '별가루', category: 'magic', tag: '마법' },
        { id: 'hug', label: '꼬옥 안기', category: 'cute', tag: '행동' },
        { id: 'wand', label: '마법봉', category: 'magic', tag: '도구' }
      ],
      [
        { id: 'blush', label: '발그레', category: 'cute', tag: '표정' },
        { id: 'spell', label: '주문', category: 'magic', tag: '마법' },
        { id: 'ribbon2', label: '리본', category: 'cute', tag: '장식' }
      ],
      [
        { id: 'smol', label: '쪼꼬미', category: 'cute', tag: '느낌' },
        { id: 'portal', label: '포털', category: 'magic', tag: '마법' },
        { id: 'cookie2', label: '쿠키', category: 'food', tag: '음식' }
      ],
      [
        { id: 'cute_hat', label: '동글 모자', category: 'cute', tag: '장식' },
        { id: 'shine', label: '빛나다', category: 'magic', tag: '동작' },
        { id: 'smile2', label: '방긋', category: 'cute', tag: '표정' }
      ]
    ]
  },
  {
    id: 8,
    title: '카드마을 대청소',
    note: '여러 계열을 섞어 고르는 종합 스테이지예요.',
    difficulty: '도전',
    steps: 31,
    goals: [
      { label: '도구', category: 'tool', needed: 3 },
      { label: '장소', category: 'place', needed: 3 },
      { label: '자연', category: 'nature', needed: 3 }
    ],
    columns: [
      [
        { id: 'broom', label: '빗자루', category: 'tool', tag: '도구' },
        { id: 'plaza', label: '광장', category: 'place', tag: '장소' },
        { id: 'tree', label: '나무', category: 'nature', tag: '자연' },
        { id: 'bucket', label: '양동이', category: 'tool', tag: '도구' }
      ],
      [
        { id: 'park', label: '공원', category: 'place', tag: '장소' },
        { id: 'cloud', label: '구름', category: 'nature', tag: '자연' },
        { id: 'cloth', label: '걸레', category: 'tool', tag: '도구' }
      ],
      [
        { id: 'flower2', label: '꽃밭', category: 'nature', tag: '자연' },
        { id: 'shop2', label: '상점', category: 'place', tag: '장소' },
        { id: 'gloves', label: '장갑', category: 'tool', tag: '도구' }
      ],
      [
        { id: 'street', label: '골목길', category: 'place', tag: '장소' },
        { id: 'wind', label: '바람', category: 'nature', tag: '자연' },
        { id: 'lucky2', label: '행운', category: 'cute', tag: '기분' }
      ]
    ]
  }
];

export const STAGE_DATA: Record<number, StageDeck> = Object.fromEntries(WORD_STAGES.map((stage) => [stage.id, stage]));

export function getStageDeck(stage: number): StageDeck {
  return STAGE_DATA[stage] ?? WORD_STAGES[0];
}

export function getStageSummary(stage: number): StageDeck | undefined {
  return STAGE_DATA[stage];
}
