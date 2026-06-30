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

export const USER_LOBBY_ASSET_ASSIGNMENT_TAG = 'user-lobby-asset-assignment-v156' as const;
export const LOBBY_SPACING_REPAIR_TAG = 'lobby-wide-village-spacing-v159' as const;

export const DIORAMA_BUILDINGS: DioramaBuilding[] = [
  {
    id: 'castle',
    title: '카드 성',
    subtitle: '왕실 홀',
    assetKey: 'dioramaCastle',
    iconKey: 'iconCvCastle',
    npcKey: 'npcGuard',
    x: 195,
    y: 300,
    width: 178,
    height: 170,
    visualWidth: 176,
    visualHeight: 176,
    imageY: -10,
    nameplateY: 62,
    nameplateWidth: 132,
    statusY: -86,
    recommendLabelY: -102,
    targetX: 195,
    targetY: 330,
    touchWidth: 134,
    touchHeight: 104,
    touchOffsetY: 12,
    open: false
  },
  {
    id: 'library',
    title: '도서관',
    subtitle: '낱말 카드',
    assetKey: 'dioramaLibrary',
    iconKey: 'iconCvLibrary',
    npcKey: 'npcLibrarian',
    x: 73,
    y: 438,
    width: 142,
    height: 136,
    visualWidth: 144,
    visualHeight: 144,
    imageY: -10,
    nameplateY: 49,
    nameplateWidth: 112,
    statusX: 31,
    statusY: -74,
    targetX: 104,
    targetY: 456,
    touchWidth: 96,
    touchHeight: 86,
    touchOffsetY: 6,
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
    width: 120,
    height: 114,
    visualWidth: 112,
    visualHeight: 112,
    imageY: -10,
    nameplateY: 42,
    nameplateWidth: 104,
    statusY: -70,
    targetX: 195,
    targetY: 492,
    touchWidth: 90,
    touchHeight: 78,
    touchOffsetY: 2,
    open: false
  },
  {
    id: 'laboratory',
    title: '연구소',
    subtitle: '연산 연구소',
    assetKey: 'dioramaLab',
    iconKey: 'iconCvLab',
    npcKey: 'npcWizard',
    x: 317,
    y: 438,
    width: 142,
    height: 136,
    visualWidth: 144,
    visualHeight: 144,
    imageY: -10,
    nameplateY: 49,
    nameplateWidth: 112,
    statusX: -31,
    statusY: -74,
    targetX: 286,
    targetY: 456,
    touchWidth: 96,
    touchHeight: 86,
    touchOffsetY: 6,
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
    x: 71,
    y: 578,
    width: 134,
    height: 128,
    visualWidth: 136,
    visualHeight: 136,
    imageY: -10,
    nameplateY: 46,
    nameplateWidth: 112,
    statusX: 31,
    statusY: -70,
    targetX: 104,
    targetY: 604,
    touchWidth: 92,
    touchHeight: 82,
    touchOffsetY: 4,
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
    x: 319,
    y: 578,
    width: 134,
    height: 128,
    visualWidth: 136,
    visualHeight: 136,
    imageY: -10,
    nameplateY: 46,
    nameplateWidth: 112,
    statusX: -31,
    statusY: -70,
    targetX: 286,
    targetY: 604,
    touchWidth: 92,
    touchHeight: 82,
    touchOffsetY: 4,
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
    x: 70,
    y: 708,
    width: 116,
    height: 112,
    visualWidth: 118,
    visualHeight: 118,
    imageY: -10,
    nameplateY: 31,
    nameplateWidth: 106,
    statusX: 28,
    statusY: -62,
    targetX: 102,
    targetY: 724,
    touchWidth: 82,
    touchHeight: 72,
    touchOffsetY: 1,
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
    y: 704,
    width: 116,
    height: 112,
    visualWidth: 118,
    visualHeight: 118,
    imageY: -10,
    nameplateY: 31,
    nameplateWidth: 108,
    statusX: 0,
    statusY: -62,
    targetX: 195,
    targetY: 724,
    touchWidth: 82,
    touchHeight: 72,
    touchOffsetY: 1,
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
    y: 708,
    width: 116,
    height: 112,
    visualWidth: 118,
    visualHeight: 118,
    imageY: -10,
    nameplateY: 31,
    nameplateWidth: 106,
    statusX: -28,
    statusY: -62,
    targetX: 288,
    targetY: 724,
    touchWidth: 82,
    touchHeight: 72,
    touchOffsetY: 1,
    open: false
  }
];
