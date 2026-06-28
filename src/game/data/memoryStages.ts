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
  }

];

export function getMemoryStage(stageId: number | undefined): MemoryStage {
  return MEMORY_STAGES.find((stage) => stage.id === stageId) ?? MEMORY_STAGES[0];
}
