export type LobbyProp = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth?: number;
  alpha?: number;
  bob?: number;
};

export type LobbyNpcAnimation = 'salute' | 'book' | 'sparkle' | 'wave' | 'teach' | 'cat' | 'cook' | 'child';

export type LobbyNpc = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  delay: number;
  animation: LobbyNpcAnimation;
  lines: string[];
};

export const LOBBY_USER_ASSET_NPC_TAG = 'user-lobby-npc-visible-v156' as const;

export const LOBBY_PROPS: readonly LobbyProp[] = [
  { key: 'propPlazaTile96', x: 195, y: 416, width: 64, height: 44, alpha: 0.26, depth: 382 },
  { key: 'propFountain', x: 195, y: 430, width: 56, height: 50, depth: 430, bob: 2 },
  { key: 'propTreeOak', x: 24, y: 245, width: 52, height: 64, depth: 246, bob: 2 },
  { key: 'propTreeOak', x: 366, y: 245, width: 52, height: 64, depth: 246, bob: 2 },
  { key: 'propFlagRed', x: 122, y: 196, width: 38, height: 62, depth: 198, bob: 2 },
  { key: 'propFlagRed', x: 268, y: 196, width: 38, height: 62, depth: 198, bob: 2 },
  { key: 'propBench', x: 27, y: 623, width: 48, height: 28, depth: 623 },
  { key: 'propBench', x: 363, y: 623, width: 48, height: 28, depth: 623 },
  { key: 'propSignpost', x: 292, y: 626, width: 40, height: 38, depth: 626 },
  { key: 'propFlowerPot', x: 24, y: 492, width: 34, height: 34, depth: 494, bob: 1 },
  { key: 'propFlowerPot', x: 366, y: 492, width: 34, height: 34, depth: 494, bob: 1 },
  { key: 'propLantern', x: 22, y: 705, width: 28, height: 48, depth: 704 },
  { key: 'propLantern', x: 368, y: 705, width: 28, height: 48, depth: 704 },
  { key: 'propSmokePuff', x: 112, y: 282, width: 36, height: 26, depth: 284, alpha: 0.42, bob: 7 },
  { key: 'propSmokePuff', x: 320, y: 468, width: 36, height: 26, depth: 470, alpha: 0.36, bob: 7 },
  { key: 'propCardTrail', x: 302, y: 208, width: 48, height: 38, depth: 210, alpha: 0.78, bob: 8 }
];

export const LOBBY_NPCS: readonly LobbyNpc[] = [
  {
    key: 'npcGuard', x: 251, y: 308, width: 34, height: 48, label: '경비병', delay: 0, animation: 'salute',
    lines: ['카드 성은 왕실 홀 에셋 앞으로 다시 배치했어요.', '위쪽 HUD와 성이 겹치지 않도록 길을 넓혔습니다.']
  },
  {
    key: 'npcLibrarian', x: 112, y: 448, width: 54, height: 72, label: '마법 사서', delay: 100, animation: 'book',
    lines: ['이번엔 네가 준 마법 학자 NPC를 도서관 안내자로 크게 세웠어요.', '도서관 건물도 새 프리미엄 컷아웃이 바로 보이게 키웠답니다.']
  },
  {
    key: 'npcWizard', x: 278, y: 448, width: 54, height: 72, label: '연금술사', delay: 200, animation: 'sparkle',
    lines: ['연구소는 새 연금술/천문 연구소 건물과 발명가 NPC를 연결했어요.', '숫자 마법을 시작하려면 오른쪽 연구소를 눌러 보세요.']
  },
  {
    key: 'npcMerchant', x: 108, y: 604, width: 58, height: 76, label: '상점 주인', delay: 300, animation: 'wave',
    lines: ['새 상점 주인 컷아웃을 더 크게 보이도록 다시 배치했어요.', '상점 건물과 카드팩 버튼 사이도 더 넓혔답니다.']
  },
  {
    key: 'npcTeacher', x: 282, y: 604, width: 38, height: 52, label: '선생님', delay: 400, animation: 'teach',
    lines: ['학교는 영어 카드 수업을 준비 중이에요.', '오른쪽 건물 사이 간격을 넓혀 터치가 섞이지 않게 했어요.']
  },
  {
    key: 'npcForestSagePremium', x: 72, y: 724, width: 52, height: 72, label: '숲지기', delay: 500, animation: 'book',
    lines: ['기억의 숲 게이트와 숲지기 NPC가 하단 HUD에 가리지 않도록 위로 정리했어요.', '숲의 등불이 켜지면 다음 짝을 찾을 준비가 된 거예요.']
  },
  {
    key: 'npcCook', x: 211, y: 724, width: 32, height: 44, label: '요리사', delay: 600, animation: 'cook',
    lines: ['이벤트 광장에는 오늘의 보상 냄새가 솔솔 나요!', '보상이 준비되면 중앙 이벤트 건물이 먼저 반짝입니다.']
  },
  {
    key: 'npcChild01', x: 225, y: 498, width: 28, height: 40, label: '아이', delay: 700, animation: 'child',
    lines: ['광장 주변은 조금 더 여유 있게 비워 두었어요.', '건물 그림이 HUD보다 먼저 눈에 들어오게 정리했답니다.']
  }
];

export const LOBBY_SAFE_RULES = [
  '한 화면 세로 디오라마 유지',
  '건물/NPC 터치 영역은 시각 오브젝트보다 약간 크게',
  '주인공과 고양이 기본 위치는 중앙 하단 고정',
  '잠금 건물은 이동하지 않고 안내 토스트만 표시',
  '새 오브젝트는 PNG/WebP 자산과 매니페스트 등록을 먼저 확인',
  '1.0.56 로비는 상단 HUD, 추천 리본, 하단 힌트가 건물 컷아웃을 덮지 않도록 별도 안전 구역에 배치',
  '사용자 제공 건물 4종과 NPC 4종은 실제 로비 키에 연결되어 크게 보이도록 배치',
  '저품질 임시 그림 금지: 기준 이미지와 같은 따뜻한 판타지 프리미엄 톤 유지'
] as const;
