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
  }
];

export function getMemoryStage(stageId: number | undefined): MemoryStage {
  return MEMORY_STAGES.find((stage) => stage.id === stageId) ?? MEMORY_STAGES[0];
}
