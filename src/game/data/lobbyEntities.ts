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

export const LOBBY_PROPS: readonly LobbyProp[] = [
  { key: 'propPlazaTile96', x: 195, y: 404, width: 70, height: 48, alpha: 0.36, depth: 376 },
  { key: 'propFountain', x: 195, y: 408, width: 66, height: 58, depth: 408, bob: 2 },
  { key: 'propTreeOak', x: 34, y: 215, width: 56, height: 68, depth: 220, bob: 2 },
  { key: 'propTreeOak', x: 354, y: 212, width: 60, height: 72, depth: 220, bob: 2 },
  { key: 'propFlagRed', x: 133, y: 158, width: 42, height: 70, depth: 172, bob: 2 },
  { key: 'propFlagRed', x: 255, y: 158, width: 42, height: 70, depth: 172, bob: 2 },
  { key: 'propBench', x: 48, y: 578, width: 62, height: 36, depth: 578 },
  { key: 'propBench', x: 337, y: 578, width: 62, height: 36, depth: 578 },
  { key: 'propSignpost', x: 255, y: 606, width: 44, height: 42, depth: 606 },
  { key: 'propFlowerPot', x: 27, y: 480, width: 38, height: 38, depth: 483, bob: 1 },
  { key: 'propFlowerPot', x: 359, y: 480, width: 38, height: 38, depth: 483, bob: 1 },
  { key: 'propLantern', x: 26, y: 624, width: 36, height: 62, depth: 624 },
  { key: 'propLantern', x: 362, y: 624, width: 36, height: 62, depth: 624 },
  { key: 'propSmokePuff', x: 111, y: 242, width: 42, height: 30, depth: 260, alpha: 0.46, bob: 8 },
  { key: 'propSmokePuff', x: 332, y: 428, width: 42, height: 30, depth: 440, alpha: 0.40, bob: 8 },
  { key: 'propCardTrail', x: 299, y: 175, width: 54, height: 44, depth: 185, alpha: 0.82, bob: 10 }
];

export const LOBBY_NPCS: readonly LobbyNpc[] = [
  {
    key: 'npcGuard', x: 240, y: 210, width: 34, height: 48, label: '경비병', delay: 0, animation: 'salute',
    lines: ['카드 성은 아직 준비 중이지만, 마을의 불빛은 제가 지키고 있어요.', '건물을 누르면 소년과 고양이가 먼저 길을 열어 줍니다.']
  },
  {
    key: 'npcLibrarian', x: 122, y: 365, width: 36, height: 50, label: '사서', delay: 100, animation: 'book',
    lines: ['도서관에는 낱말 카드가 가득해요. 오늘은 단어를 모아 볼까요?', '책장이 반짝이면 새 단어 카드가 숨어 있다는 뜻이에요.']
  },
  {
    key: 'npcWizard', x: 270, y: 365, width: 36, height: 50, label: '마법사', delay: 200, animation: 'sparkle',
    lines: ['연구소의 숫자 마법은 곧 더 강해질 거예요.', '반짝이는 카드는 보너스 보상을 부르는 신호랍니다.']
  },
  {
    key: 'npcMerchant', x: 124, y: 557, width: 42, height: 62, label: '상인', delay: 300, animation: 'wave',
    lines: ['수집한 카드는 앨범에서 바로 확인할 수 있어요!', '새 카드팩이 들어오면 이벤트 광장에 먼저 놓아둘게요.']
  },
  {
    key: 'npcTeacher', x: 267, y: 557, width: 38, height: 52, label: '선생님', delay: 400, animation: 'teach',
    lines: ['학교는 영어 카드 수업을 준비 중이에요.', '카드마을 수업은 문제풀이보다 모험처럼 느껴져야 해요.']
  },
  {
    key: 'npcTownCat', x: 44, y: 722, width: 48, height: 48, label: '마을고양이', delay: 500, animation: 'cat',
    lines: ['야옹! 기억의 숲에는 짝을 찾는 카드가 숨어 있어요.', '검은 고양이를 따라가면 힌트를 놓치지 않을 거예요.']
  },
  {
    key: 'npcCook', x: 250, y: 728, width: 34, height: 48, label: '요리사', delay: 600, animation: 'cook',
    lines: ['이벤트 광장에는 오늘의 보상 냄새가 솔솔 나요!', '카드팩을 열 때는 반짝임을 꼭 확인하세요.']
  },
  {
    key: 'npcChild01', x: 220, y: 430, width: 31, height: 44, label: '아이', delay: 700, animation: 'child',
    lines: ['광장에 서 있으면 마을 전체가 한눈에 보여요!', '소년과 고양이가 뛰어가는 모습이 제일 좋아요.']
  }
];

export const LOBBY_SAFE_RULES = [
  '한 화면 세로 디오라마 유지',
  '건물/NPC 터치 영역은 시각 오브젝트보다 약간 크게',
  '주인공과 고양이 기본 위치는 중앙 하단 고정',
  '잠금 건물은 이동하지 않고 안내 토스트만 표시',
  '새 오브젝트는 PNG/WebP 자산과 매니페스트 등록을 먼저 확인',
  '저품질 임시 그림 금지: 기준 이미지와 같은 따뜻한 판타지 프리미엄 톤 유지'
] as const;
