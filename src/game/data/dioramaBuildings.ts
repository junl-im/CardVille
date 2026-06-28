export type DioramaRoute =
  | { scene: 'StageSelectScene'; data: { modeId: 'word'; title: string } }
  | { scene: 'ModeSelectScene'; data?: Record<string, never> }
  | { scene: 'CollectionScene'; data?: Record<string, never> }
  | { scene: 'RewardScene'; data: { score: number; bestCombo: number; stars: number } };

export type DioramaBuilding = {
  id: string;
  title: string;
  subtitle: string;
  assetKey: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  open: boolean;
  route?: DioramaRoute;
};

export const DIORAMA_BUILDINGS: DioramaBuilding[] = [
  {
    id: 'castle',
    title: '카드 성',
    subtitle: '마을의 중심',
    assetKey: 'dioramaCastle',
    x: 195,
    y: 138,
    width: 114,
    height: 96,
    targetX: 195,
    targetY: 198,
    open: false
  },
  {
    id: 'library',
    title: '도서관',
    subtitle: '낱말 카드',
    assetKey: 'dioramaLibrary',
    x: 78,
    y: 280,
    width: 106,
    height: 92,
    targetX: 103,
    targetY: 350,
    open: true,
    route: { scene: 'StageSelectScene', data: { modeId: 'word', title: '말 카드' } }
  },
  {
    id: 'plaza',
    title: '광장',
    subtitle: '출발점',
    assetKey: 'dioramaPlaza',
    x: 195,
    y: 305,
    width: 82,
    height: 64,
    targetX: 195,
    targetY: 370,
    open: false
  },
  {
    id: 'laboratory',
    title: '연구소',
    subtitle: '연산 준비실',
    assetKey: 'dioramaLab',
    x: 312,
    y: 280,
    width: 106,
    height: 92,
    targetX: 286,
    targetY: 350,
    open: true,
    route: { scene: 'ModeSelectScene' }
  },
  {
    id: 'shop',
    title: '상점',
    subtitle: '카드 앨범',
    assetKey: 'dioramaShop',
    x: 82,
    y: 455,
    width: 106,
    height: 86,
    targetX: 104,
    targetY: 520,
    open: true,
    route: { scene: 'CollectionScene' }
  },
  {
    id: 'school',
    title: '학교',
    subtitle: '영어 예정',
    assetKey: 'dioramaSchool',
    x: 308,
    y: 455,
    width: 106,
    height: 88,
    targetX: 284,
    targetY: 520,
    open: false
  },
  {
    id: 'forest',
    title: '기억의 숲',
    subtitle: '기억력',
    assetKey: 'dioramaForest',
    x: 82,
    y: 660,
    width: 106,
    height: 90,
    targetX: 115,
    targetY: 705,
    open: true,
    route: { scene: 'ModeSelectScene' }
  },
  {
    id: 'event',
    title: '이벤트',
    subtitle: '카드팩',
    assetKey: 'dioramaEvent',
    x: 200,
    y: 670,
    width: 106,
    height: 84,
    targetX: 200,
    targetY: 720,
    open: true,
    route: { scene: 'RewardScene', data: { score: 520, bestCombo: 4, stars: 2 } }
  },
  {
    id: 'harbor',
    title: '항구',
    subtitle: '모험 예정',
    assetKey: 'dioramaHarbor',
    x: 312,
    y: 660,
    width: 106,
    height: 86,
    targetX: 278,
    targetY: 705,
    open: false
  }
];
