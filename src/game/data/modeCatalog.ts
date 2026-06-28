export type GameModeId = 'word' | 'math' | 'memory' | 'english' | 'daily';

export type GameModeStatus = 'open' | 'planned';

export type GameMode = {
  id: GameModeId;
  title: string;
  buildingId: string;
  iconKey: string;
  fallbackIcon: string;
  note: string;
  status: GameModeStatus;
  nextWork: string;
};

export const GAME_MODES: readonly GameMode[] = [
  {
    id: 'word',
    title: '낱말 카드',
    buildingId: 'library',
    iconKey: 'iconCvLibrary',
    fallbackIcon: '📚',
    note: '단어 계열을 찾아 카드 스택을 정리하는 기본 모드',
    status: 'open',
    nextWork: 'CardVille 브랜드형 도서관 UI로 계속 강화'
  },
  {
    id: 'math',
    title: '연산 연구소',
    buildingId: 'laboratory',
    iconKey: 'iconCvLab',
    fallbackIcon: '➕',
    note: '숫자 카드, 식 카드, 보너스 연산 콤보를 준비하는 모드',
    status: 'planned',
    nextWork: '1차 연산 미니게임 규칙과 보드 생성'
  },
  {
    id: 'memory',
    title: '기억의 숲',
    buildingId: 'forest',
    iconKey: 'iconCvForest',
    fallbackIcon: '🧠',
    note: '잠깐 본 카드를 기억해 짝과 순서를 찾는 모드',
    status: 'planned',
    nextWork: '카드 뒤집기/짝찾기 프로토타입'
  },
  {
    id: 'english',
    title: '영어 학교',
    buildingId: 'school',
    iconKey: 'iconCvSchool',
    fallbackIcon: '🎓',
    note: '영단어와 그림 카드를 연결하는 학교 수업 모드',
    status: 'planned',
    nextWork: '기본 영단어 데이터와 발음 힌트 구조'
  },
  {
    id: 'daily',
    title: '오늘의 카드팩',
    buildingId: 'event',
    iconKey: 'iconCvEvent',
    fallbackIcon: '🎁',
    note: '매일 다른 미션과 보상 카드팩을 받는 이벤트 모드',
    status: 'planned',
    nextWork: '일일 보상 저장 구조와 카드팩 오픈 연출 강화'
  }
];

export function getModeById(id: string | undefined): GameMode | undefined {
  return GAME_MODES.find((mode) => mode.id === id);
}
