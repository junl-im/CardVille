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

export const DIORAMA_BUILDINGS: DioramaBuilding[] = [
  {
    id: 'castle',
    title: '카드 성',
    subtitle: '왕실 홀',
    assetKey: 'dioramaCastle',
    iconKey: 'iconCvCastle',
    npcKey: 'npcGuard',
    x: 195,
    y: 258,
    width: 210,
    height: 198,
    visualWidth: 216,
    visualHeight: 216,
    imageY: -4,
    nameplateY: 78,
    nameplateWidth: 132,
    statusY: -100,
    recommendLabelY: -116,
    targetX: 195,
    targetY: 296,
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
    x: 66,
    y: 400,
    width: 174,
    height: 164,
    visualWidth: 184,
    visualHeight: 184,
    imageY: -8,
    nameplateY: 72,
    nameplateWidth: 112,
    statusX: 31,
    statusY: -90,
    targetX: 104,
    targetY: 428,
    touchWidth: 104,
    touchHeight: 96,
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
    y: 470,
    width: 146,
    height: 138,
    visualWidth: 132,
    visualHeight: 132,
    imageY: -8,
    nameplateY: 58,
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
    x: 324,
    y: 400,
    width: 174,
    height: 164,
    visualWidth: 184,
    visualHeight: 184,
    imageY: -8,
    nameplateY: 72,
    nameplateWidth: 112,
    statusX: -31,
    statusY: -90,
    targetX: 286,
    targetY: 428,
    touchWidth: 104,
    touchHeight: 96,
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
    x: 66,
    y: 548,
    width: 164,
    height: 154,
    visualWidth: 168,
    visualHeight: 168,
    imageY: -8,
    nameplateY: 66,
    nameplateWidth: 112,
    statusX: 31,
    statusY: -82,
    targetX: 104,
    targetY: 584,
    touchWidth: 100,
    touchHeight: 90,
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
    x: 324,
    y: 548,
    width: 164,
    height: 154,
    visualWidth: 168,
    visualHeight: 168,
    imageY: -8,
    nameplateY: 66,
    nameplateWidth: 112,
    statusX: -31,
    statusY: -82,
    targetX: 286,
    targetY: 584,
    touchWidth: 100,
    touchHeight: 90,
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
    x: 58,
    y: 678,
    width: 150,
    height: 142,
    visualWidth: 158,
    visualHeight: 158,
    imageY: -13,
    nameplateY: 42,
    nameplateWidth: 106,
    statusX: 28,
    statusY: -78,
    targetX: 102,
    targetY: 706,
    touchWidth: 92,
    touchHeight: 82,
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
    y: 668,
    width: 150,
    height: 142,
    visualWidth: 154,
    visualHeight: 154,
    imageY: -13,
    nameplateY: 42,
    nameplateWidth: 108,
    statusX: 0,
    statusY: -80,
    targetX: 195,
    targetY: 700,
    touchWidth: 94,
    touchHeight: 82,
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
    x: 332,
    y: 678,
    width: 150,
    height: 142,
    visualWidth: 158,
    visualHeight: 158,
    imageY: -13,
    nameplateY: 42,
    nameplateWidth: 106,
    statusX: -28,
    statusY: -78,
    targetX: 288,
    targetY: 706,
    touchWidth: 92,
    touchHeight: 82,
    touchOffsetY: 1,
    open: false
  }
];
