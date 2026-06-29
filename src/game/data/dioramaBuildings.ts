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
  imageY?: number;
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
    y: 206,
    width: 218,
    height: 206,
    visualWidth: 232,
    visualHeight: 232,
    imageY: -6,
    nameplateY: 94,
    nameplateWidth: 134,
    statusY: -116,
    targetX: 195,
    targetY: 254,
    touchWidth: 164,
    touchHeight: 132,
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
    x: 70,
    y: 354,
    width: 174,
    height: 164,
    visualWidth: 182,
    visualHeight: 182,
    imageY: -8,
    nameplateY: 78,
    nameplateWidth: 112,
    statusX: 31,
    statusY: -94,
    targetX: 102,
    targetY: 396,
    touchWidth: 124,
    touchHeight: 116,
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
    y: 462,
    width: 156,
    height: 146,
    visualWidth: 166,
    visualHeight: 166,
    imageY: -8,
    nameplateY: 70,
    nameplateWidth: 110,
    statusY: -84,
    targetX: 195,
    targetY: 482,
    touchWidth: 110,
    touchHeight: 96,
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
    x: 320,
    y: 354,
    width: 174,
    height: 164,
    visualWidth: 182,
    visualHeight: 182,
    imageY: -8,
    nameplateY: 78,
    nameplateWidth: 112,
    statusX: -31,
    statusY: -94,
    targetX: 288,
    targetY: 396,
    touchWidth: 124,
    touchHeight: 116,
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
    x: 70,
    y: 532,
    width: 174,
    height: 164,
    visualWidth: 182,
    visualHeight: 182,
    imageY: -8,
    nameplateY: 78,
    nameplateWidth: 112,
    statusX: 31,
    statusY: -94,
    targetX: 102,
    targetY: 574,
    touchWidth: 124,
    touchHeight: 116,
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
    x: 320,
    y: 532,
    width: 174,
    height: 164,
    visualWidth: 182,
    visualHeight: 182,
    imageY: -8,
    nameplateY: 78,
    nameplateWidth: 112,
    statusX: -31,
    statusY: -94,
    targetX: 288,
    targetY: 574,
    touchWidth: 124,
    touchHeight: 116,
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
    x: 70,
    y: 648,
    width: 154,
    height: 146,
    visualWidth: 156,
    visualHeight: 156,
    imageY: -18,
    nameplateY: 48,
    nameplateWidth: 106,
    statusX: 28,
    statusY: -88,
    targetX: 102,
    targetY: 682,
    touchWidth: 116,
    touchHeight: 108,
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
    y: 654,
    width: 158,
    height: 148,
    visualWidth: 160,
    visualHeight: 160,
    imageY: -18,
    nameplateY: 48,
    nameplateWidth: 106,
    statusX: 0,
    statusY: -90,
    targetX: 195,
    targetY: 688,
    touchWidth: 116,
    touchHeight: 110,
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
    x: 320,
    y: 648,
    width: 154,
    height: 146,
    visualWidth: 156,
    visualHeight: 156,
    imageY: -18,
    nameplateY: 48,
    nameplateWidth: 106,
    statusX: -28,
    statusY: -88,
    targetX: 288,
    targetY: 682,
    touchWidth: 116,
    touchHeight: 108,
    touchOffsetY: 8,
    open: false
  }
];
