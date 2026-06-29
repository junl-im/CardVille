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
  { key: 'propBench', x: 30, y: 604, width: 52, height: 30, depth: 604 },
  { key: 'propBench', x: 360, y: 604, width: 52, height: 30, depth: 604 },
  { key: 'propSignpost', x: 292, y: 610, width: 44, height: 42, depth: 606 },
  { key: 'propFlowerPot', x: 27, y: 480, width: 38, height: 38, depth: 483, bob: 1 },
  { key: 'propFlowerPot', x: 359, y: 480, width: 38, height: 38, depth: 483, bob: 1 },
  { key: 'propLantern', x: 20, y: 650, width: 32, height: 56, depth: 650 },
  { key: 'propLantern', x: 370, y: 650, width: 32, height: 56, depth: 650 },
  { key: 'propSmokePuff', x: 111, y: 242, width: 42, height: 30, depth: 260, alpha: 0.46, bob: 8 },
  { key: 'propSmokePuff', x: 332, y: 428, width: 42, height: 30, depth: 440, alpha: 0.40, bob: 8 },
  { key: 'propCardTrail', x: 299, y: 175, width: 54, height: 44, depth: 185, alpha: 0.82, bob: 10 }
];

export const LOBBY_NPCS: readonly LobbyNpc[] = [
  {
    key: 'npcGuard', x: 250, y: 220, width: 34, height: 48, label: '경비병', delay: 0, animation: 'salute',
    lines: ['카드 성은 아직 준비 중이지만, 마을의 불빛은 제가 지키고 있어요.', '건물을 누르면 소년과 고양이가 먼저 길을 열어 줍니다.']
  },
  {
    key: 'npcLibrarian', x: 110, y: 392, width: 42, height: 54, label: '사서', delay: 100, animation: 'book',
    lines: ['도서관에는 낱말 카드가 가득해요. 오늘은 단어를 모아 볼까요?', '책장이 반짝이면 새 단어 카드가 숨어 있다는 뜻이에요.']
  },
  {
    key: 'npcWizard', x: 280, y: 392, width: 42, height: 54, label: '마법사', delay: 200, animation: 'sparkle',
    lines: ['연구소의 숫자 마법은 곧 더 강해질 거예요.', '반짝이는 카드는 보너스 보상을 부르는 신호랍니다.']
  },
  {
    key: 'npcMerchant', x: 108, y: 578, width: 46, height: 58, label: '상인', delay: 300, animation: 'wave',
    lines: ['수집한 카드는 앨범에서 바로 확인할 수 있어요!', '새 카드팩이 들어오면 이벤트 광장에 먼저 놓아둘게요.']
  },
  {
    key: 'npcTeacher', x: 282, y: 578, width: 38, height: 52, label: '선생님', delay: 400, animation: 'teach',
    lines: ['학교는 영어 카드 수업을 준비 중이에요.', '카드마을 수업은 문제풀이보다 모험처럼 느껴져야 해요.']
  },
  {
    key: 'npcForestSagePremium', x: 45, y: 724, width: 48, height: 60, label: '숲지기', delay: 500, animation: 'book',
    lines: ['기억의 숲 길은 오래 보아야 열립니다. 카드 위치를 천천히 기억해 보세요.', '숲의 등불이 켜지면 다음 짝을 찾을 준비가 된 거예요.']
  },
  {
    key: 'npcCook', x: 242, y: 724, width: 34, height: 46, label: '요리사', delay: 600, animation: 'cook',
    lines: ['이벤트 광장에는 오늘의 보상 냄새가 솔솔 나요!', '카드팩을 열 때는 반짝임을 꼭 확인하세요.']
  },
  {
    key: 'npcChild01', x: 225, y: 444, width: 30, height: 42, label: '아이', delay: 700, animation: 'child',
    lines: ['광장에 서 있으면 마을 전체가 한눈에 보여요!', '소년과 고양이가 뛰어가는 모습이 제일 좋아요.']
  }
];

export const LOBBY_SAFE_RULES = [
  '한 화면 세로 디오라마 유지',
  '건물/NPC 터치 영역은 시각 오브젝트보다 약간 크게',
  '주인공과 고양이 기본 위치는 중앙 하단 고정',
  '잠금 건물은 이동하지 않고 안내 토스트만 표시',
  '새 오브젝트는 PNG/WebP 자산과 매니페스트 등록을 먼저 확인',
  '1.0.55 로비 NPC는 새 개인 컷아웃 기준으로 건물 이름표와 겹치지 않음',
  '저품질 임시 그림 금지: 기준 이미지와 같은 따뜻한 판타지 프리미엄 톤 유지'
] as const;
