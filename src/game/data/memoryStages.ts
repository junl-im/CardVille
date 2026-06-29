export type MemoryPair = {
  id: string;
  icon: string;
  label: string;
};

export type MemoryStage = {
  id: number;
  title: string;
  subtitle: string;
  pairs: MemoryPair[];
  previewSeconds: number;
};

export const MEMORY_STAGES: readonly MemoryStage[] = [
  {
    id: 1,
    title: '숲속 짝 카드',
    subtitle: '같은 그림 두 장을 찾아요',
    previewSeconds: 2,
    pairs: [
      { id: 'moon', icon: '🌙', label: '달빛' },
      { id: 'leaf', icon: '🍃', label: '잎새' },
      { id: 'cat', icon: '🐾', label: '발자국' },
      { id: 'star', icon: '⭐', label: '별' },
      { id: 'mushroom', icon: '🍄', label: '버섯' },
      { id: 'butterfly', icon: '🦋', label: '나비' },
      { id: 'gem', icon: '💎', label: '수정' },
      { id: 'key', icon: '🗝️', label: '열쇠' }
    ]
  },
  {
    id: 2,
    title: '달빛 숲길 기억하기',
    subtitle: '더 많은 그림을 짧게 보고 짝을 찾아요',
    previewSeconds: 3,
    pairs: [
      { id: 'crown', icon: '👑', label: '왕관' },
      { id: 'book', icon: '📖', label: '책' },
      { id: 'potion', icon: '🧪', label: '물약' },
      { id: 'bell', icon: '🔔', label: '종' },
      { id: 'lamp', icon: '🏮', label: '등불' },
      { id: 'shell', icon: '🐚', label: '조개' },
      { id: 'apple', icon: '🍎', label: '사과' },
      { id: 'shield', icon: '🛡️', label: '방패' },
      { id: 'map', icon: '🗺️', label: '지도' },
      { id: 'flower', icon: '🌼', label: '꽃' }
    ]
  },
  {
    id: 3,
    title: '반딧불 카드길',
    subtitle: '반딧불이 비춘 위치를 기억해요',
    previewSeconds: 3.5,
    pairs: [
      { id: 'acorn', icon: '🌰', label: '도토리' },
      { id: 'fox', icon: '🦊', label: '여우' },
      { id: 'owl', icon: '🦉', label: '부엉이' },
      { id: 'clover', icon: '☘️', label: '클로버' },
      { id: 'crystal', icon: '🔮', label: '수정구' },
      { id: 'scroll', icon: '📜', label: '두루마리' },
      { id: 'wand', icon: '🪄', label: '지팡이' },
      { id: 'rainbow', icon: '🌈', label: '무지개' },
      { id: 'teacup', icon: '🫖', label: '찻주전자' },
      { id: 'cookie', icon: '🍪', label: '쿠키' },
      { id: 'compass', icon: '🧭', label: '나침반' },
      { id: 'feather', icon: '🪶', label: '깃털' }
    ]
  },
  {
    id: 4,
    title: '고양이 그림자 숲',
    subtitle: '작은 카드가 많아도 차분히 짝을 찾아요',
    previewSeconds: 4,
    pairs: [
      { id: 'castle', icon: '🏰', label: '성' },
      { id: 'ticket', icon: '🎟️', label: '티켓' },
      { id: 'violin', icon: '🎻', label: '바이올린' },
      { id: 'planet', icon: '🪐', label: '행성' },
      { id: 'dragon', icon: '🐉', label: '용' },
      { id: 'basket', icon: '🧺', label: '바구니' },
      { id: 'seed', icon: '🌱', label: '새싹' },
      { id: 'candle', icon: '🕯️', label: '촛불' },
      { id: 'mirror', icon: '🪞', label: '거울' },
      { id: 'ribbon', icon: '🎀', label: '리본' },
      { id: 'anchor', icon: '⚓', label: '닻' },
      { id: 'hat', icon: '🎩', label: '모자' }
    ]
  }

];

export function getMemoryStage(stageId: number | undefined): MemoryStage {
  return MEMORY_STAGES.find((stage) => stage.id === stageId) ?? MEMORY_STAGES[0];
}
