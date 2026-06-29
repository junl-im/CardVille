import type { GameModeId } from './modeCatalog';
export type DioramaRoute =
  | { scene: 'StageSelectScene'; data: { modeId: 'word' | 'math' | 'memory' | 'english'; title: string } }
  | { scene: 'MathLabScene'; data?: { stage?: number } }
  | { scene: 'MemoryForestScene'; data?: { stage?: number } }
  | { scene: 'ModeSelectScene'; data?: { focusModeId?: GameModeId; title?: string } }
  | { scene: 'CollectionScene'; data?: Record<string, never> }
  | { scene: 'ShopScene'; data?: Record<string, never> }
  | { scene: 'DailyMissionScene'; data?: Record<string, never> }
  | { scene: 'RewardScene'; data: { modeId?: GameModeId; stage?: number; score: number; bestCombo: number; stars: number; stepsLeft?: number } };

export type DioramaBuilding = {
  id: string;
  title: string;
  subtitle: string;
  assetKey: string;
  iconKey: string;
  npcKey?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visualWidth?: number;
  visualHeight?: number;
  nameplateY?: number;
  nameplateWidth?: number;
  statusX?: number;
  statusY?: number;
  iconX?: number;
  iconY?: number;
  lockX?: number;
  lockY?: number;
  shadowY?: number;
  recommendLabelY?: number;
  targetX: number;
  targetY: number;
  touchWidth: number;
  touchHeight: number;
  touchOffsetY?: number;
  open: boolean;
  route?: DioramaRoute;
};

export const DIORAMA_BUILDINGS: DioramaBuilding[] = [
  {
    id: 'castle',
    title: '카드 성',
    subtitle: '마을의 중심',
    assetKey: 'dioramaCastle',
    iconKey: 'iconCvCastle',
    npcKey: 'npcGuard',
    x: 195,
    y: 184,
    width: 196,
    height: 190,
    visualWidth: 194,
    visualHeight: 194,
    nameplateY: 80,
    nameplateWidth: 134,
    statusY: -96,
    targetX: 195,
    targetY: 242,
    touchWidth: 132,
    touchHeight: 106,
    touchOffsetY: 16,
    open: false
  },
  {
    id: 'library',
    title: '도서관',
    subtitle: '낱말 카드',
    assetKey: 'dioramaLibrary',
    iconKey: 'iconCvLibrary',
    npcKey: 'npcLibrarian',
    x: 62,
    y: 326,
    width: 160,
    height: 154,
    visualWidth: 156,
    visualHeight: 156,
    nameplateY: 66,
    nameplateWidth: 112,
    statusX: 22,
    statusY: -76,
    targetX: 91,
    targetY: 374,
    touchWidth: 92,
    touchHeight: 88,
    touchOffsetY: 8,
    open: true,
    route: { scene: 'StageSelectScene', data: { modeId: 'word', title: '낱말 카드' } }
  },
  {
    id: 'plaza',
    title: '광장',
    subtitle: '출발점',
    assetKey: 'dioramaPlaza',
    iconKey: 'iconCvPlaza',
    npcKey: 'npcChild01',
    x: 195,
    y: 438,
    width: 146,
    height: 136,
    visualWidth: 142,
    visualHeight: 142,
    nameplateY: 58,
    nameplateWidth: 110,
    statusY: -67,
    targetX: 195,
    targetY: 456,
    touchWidth: 82,
    touchHeight: 70,
    touchOffsetY: 6,
    open: false
  },
  {
    id: 'laboratory',
    title: '연구소',
    subtitle: '연산 연구소',
    assetKey: 'dioramaLab',
    iconKey: 'iconCvLab',
    npcKey: 'npcWizard',
    x: 328,
    y: 326,
    width: 160,
    height: 154,
    visualWidth: 156,
    visualHeight: 156,
    nameplateY: 66,
    nameplateWidth: 112,
    statusX: -22,
    statusY: -76,
    targetX: 299,
    targetY: 374,
    touchWidth: 92,
    touchHeight: 88,
    touchOffsetY: 8,
    open: true,
    route: { scene: 'MathLabScene', data: { stage: 1 } }
  },
  {
    id: 'shop',
    title: '상점',
    subtitle: '카드팩 상점',
    assetKey: 'dioramaShop',
    iconKey: 'iconCvAsset',
    npcKey: 'npcMerchant',
    x: 62,
    y: 540,
    width: 160,
    height: 154,
    visualWidth: 156,
    visualHeight: 156,
    nameplateY: 66,
    nameplateWidth: 112,
    statusX: 22,
    statusY: -76,
    targetX: 91,
    targetY: 574,
    touchWidth: 92,
    touchHeight: 86,
    touchOffsetY: 8,
    open: true,
    route: { scene: 'ShopScene' }
  },
  {
    id: 'school',
    title: '학교',
    subtitle: '영어 학교',
    assetKey: 'dioramaSchool',
    iconKey: 'iconCvSchool',
    npcKey: 'npcTeacher',
    x: 328,
    y: 540,
    width: 160,
    height: 154,
    visualWidth: 156,
    visualHeight: 156,
    nameplateY: 66,
    nameplateWidth: 112,
    statusX: -22,
    statusY: -76,
    targetX: 299,
    targetY: 574,
    touchWidth: 92,
    touchHeight: 86,
    touchOffsetY: 8,
    open: true,
    route: { scene: 'StageSelectScene', data: { modeId: 'english', title: '영어 학교' } }
  },
  {
    id: 'forest',
    title: '기억의 숲',
    subtitle: '기억력',
    assetKey: 'dioramaForest',
    iconKey: 'iconCvForest',
    npcKey: 'npcTownCat',
    x: 58,
    y: 690,
    width: 142,
    height: 138,
    visualWidth: 136,
    visualHeight: 136,
    nameplateY: 10,
    nameplateWidth: 106,
    statusX: 20,
    statusY: -66,
    targetX: 92,
    targetY: 718,
    touchWidth: 88,
    touchHeight: 82,
    touchOffsetY: 6,
    open: true,
    route: { scene: 'MemoryForestScene', data: { stage: 1 } }
  },
  {
    id: 'event',
    title: '이벤트',
    subtitle: '일일 미션',
    assetKey: 'dioramaEvent',
    iconKey: 'iconCvEvent',
    npcKey: 'npcCook',
    x: 195,
    y: 690,
    width: 144,
    height: 138,
    visualWidth: 136,
    visualHeight: 136,
    nameplateY: 10,
    nameplateWidth: 106,
    statusX: 0,
    statusY: -67,
    targetX: 195,
    targetY: 720,
    touchWidth: 86,
    touchHeight: 82,
    touchOffsetY: 6,
    open: true,
    route: { scene: 'DailyMissionScene' }
  },
  {
    id: 'harbor',
    title: '항구',
    subtitle: '모험 예정',
    assetKey: 'dioramaHarbor',
    iconKey: 'iconCvHarbor',
    x: 332,
    y: 690,
    width: 142,
    height: 138,
    visualWidth: 136,
    visualHeight: 136,
    nameplateY: 10,
    nameplateWidth: 106,
    statusX: -20,
    statusY: -66,
    targetX: 298,
    targetY: 718,
    touchWidth: 88,
    touchHeight: 82,
    touchOffsetY: 8,
    open: false
  }
];
