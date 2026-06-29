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
    y: 172,
    width: 190,
    height: 184,
    visualWidth: 188,
    visualHeight: 188,
    nameplateY: 78,
    nameplateWidth: 126,
    statusY: -92,
    targetX: 195,
    targetY: 232,
    touchWidth: 128,
    touchHeight: 104,
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
    x: 84,
    y: 314,
    width: 166,
    height: 158,
    visualWidth: 164,
    visualHeight: 164,
    nameplateY: 66,
    nameplateWidth: 116,
    statusY: -76,
    targetX: 105,
    targetY: 366,
    touchWidth: 94,
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
    y: 414,
    width: 142,
    height: 132,
    visualWidth: 138,
    visualHeight: 138,
    nameplateY: 56,
    nameplateWidth: 106,
    statusY: -64,
    targetX: 195,
    targetY: 430,
    touchWidth: 80,
    touchHeight: 68,
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
    x: 306,
    y: 314,
    width: 166,
    height: 158,
    visualWidth: 164,
    visualHeight: 164,
    nameplateY: 66,
    nameplateWidth: 116,
    statusY: -76,
    targetX: 286,
    targetY: 366,
    touchWidth: 94,
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
    x: 84,
    y: 512,
    width: 166,
    height: 158,
    visualWidth: 164,
    visualHeight: 164,
    nameplateY: 66,
    nameplateWidth: 116,
    statusY: -76,
    targetX: 106,
    targetY: 548,
    touchWidth: 94,
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
    x: 306,
    y: 512,
    width: 166,
    height: 158,
    visualWidth: 164,
    visualHeight: 164,
    nameplateY: 66,
    nameplateWidth: 116,
    statusY: -76,
    targetX: 284,
    targetY: 548,
    touchWidth: 94,
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
    x: 78,
    y: 668,
    width: 150,
    height: 144,
    visualWidth: 148,
    visualHeight: 148,
    nameplateY: 35,
    nameplateWidth: 112,
    statusY: -70,
    targetX: 116,
    targetY: 708,
    touchWidth: 92,
    touchHeight: 86,
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
    x: 198,
    y: 670,
    width: 146,
    height: 140,
    visualWidth: 144,
    visualHeight: 144,
    nameplateY: 33,
    nameplateWidth: 110,
    statusX: 14,
    statusY: -69,
    targetX: 200,
    targetY: 720,
    touchWidth: 90,
    touchHeight: 86,
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
    x: 314,
    y: 668,
    width: 150,
    height: 144,
    visualWidth: 148,
    visualHeight: 148,
    nameplateY: 35,
    nameplateWidth: 112,
    statusY: -70,
    targetX: 278,
    targetY: 708,
    touchWidth: 98,
    touchHeight: 92,
    touchOffsetY: 8,
    open: false
  }
];
