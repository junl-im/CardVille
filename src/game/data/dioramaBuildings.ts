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
    y: 214,
    width: 218,
    height: 206,
    visualWidth: 226,
    visualHeight: 226,
    imageY: -8,
    nameplateY: 90,
    nameplateWidth: 132,
    statusY: -112,
    targetX: 195,
    targetY: 258,
    touchWidth: 150,
    touchHeight: 122,
    touchOffsetY: 14,
    open: false
  },
  {
    id: 'library',
    title: '도서관',
    subtitle: '낱말 카드',
    assetKey: 'dioramaLibrary',
    iconKey: 'iconCvLibrary',
    npcKey: 'npcLibrarian',
    x: 74,
    y: 360,
    width: 174,
    height: 164,
    visualWidth: 172,
    visualHeight: 172,
    imageY: -8,
    nameplateY: 74,
    nameplateWidth: 112,
    statusX: 28,
    statusY: -90,
    targetX: 100,
    targetY: 400,
    touchWidth: 112,
    touchHeight: 106,
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
    y: 452,
    width: 156,
    height: 146,
    visualWidth: 144,
    visualHeight: 144,
    imageY: -10,
    nameplateY: 62,
    nameplateWidth: 106,
    statusY: -76,
    targetX: 195,
    targetY: 478,
    touchWidth: 98,
    touchHeight: 88,
    touchOffsetY: 4,
    open: false
  },
  {
    id: 'laboratory',
    title: '연구소',
    subtitle: '연산 연구소',
    assetKey: 'dioramaLab',
    iconKey: 'iconCvLab',
    npcKey: 'npcWizard',
    x: 316,
    y: 360,
    width: 174,
    height: 164,
    visualWidth: 172,
    visualHeight: 172,
    imageY: -8,
    nameplateY: 74,
    nameplateWidth: 112,
    statusX: -28,
    statusY: -90,
    targetX: 290,
    targetY: 400,
    touchWidth: 112,
    touchHeight: 106,
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
    x: 74,
    y: 528,
    width: 174,
    height: 164,
    visualWidth: 164,
    visualHeight: 164,
    imageY: -8,
    nameplateY: 72,
    nameplateWidth: 112,
    statusX: 28,
    statusY: -86,
    targetX: 100,
    targetY: 570,
    touchWidth: 112,
    touchHeight: 102,
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
    x: 316,
    y: 528,
    width: 174,
    height: 164,
    visualWidth: 164,
    visualHeight: 164,
    imageY: -8,
    nameplateY: 72,
    nameplateWidth: 112,
    statusX: -28,
    statusY: -86,
    targetX: 290,
    targetY: 570,
    touchWidth: 112,
    touchHeight: 102,
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
    npcKey: 'npcForestSagePremium',
    x: 74,
    y: 657,
    width: 154,
    height: 146,
    visualWidth: 146,
    visualHeight: 146,
    imageY: -15,
    nameplateY: 45,
    nameplateWidth: 106,
    statusX: 25,
    statusY: -80,
    targetX: 102,
    targetY: 686,
    touchWidth: 104,
    touchHeight: 96,
    touchOffsetY: 4,
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
    y: 650,
    width: 158,
    height: 148,
    visualWidth: 146,
    visualHeight: 146,
    imageY: -15,
    nameplateY: 45,
    nameplateWidth: 108,
    statusX: 0,
    statusY: -82,
    targetX: 195,
    targetY: 682,
    touchWidth: 104,
    touchHeight: 98,
    touchOffsetY: 5,
    open: true,
    route: { scene: 'DailyMissionScene' }
  },
  {
    id: 'harbor',
    title: '항구',
    subtitle: '모험 예정',
    assetKey: 'dioramaHarbor',
    iconKey: 'iconCvHarbor',
    x: 316,
    y: 657,
    width: 154,
    height: 146,
    visualWidth: 146,
    visualHeight: 146,
    imageY: -15,
    nameplateY: 45,
    nameplateWidth: 106,
    statusX: -25,
    statusY: -80,
    targetX: 288,
    targetY: 686,
    touchWidth: 104,
    touchHeight: 96,
    touchOffsetY: 4,
    open: false
  }
];
