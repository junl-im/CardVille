export type EnglishLessonKind = 'word' | 'phrase' | 'sound';

export type EnglishCard = {
  id: string;
  word: string;
  meaning: string;
  hint: string;
  example: string;
  kind: EnglishLessonKind;
};

export type EnglishStage = {
  id: number;
  title: string;
  subtitle: string;
  difficulty: '입문' | '연습' | '도전';
  theme: string;
  cards: EnglishCard[];
};

export const ENGLISH_STAGES: readonly EnglishStage[] = [
  {
    id: 1,
    title: '인사 카드 수업',
    subtitle: '짧은 인사말과 의미를 연결해요',
    difficulty: '입문',
    theme: '학교 첫 수업',
    cards: [
      { id: 'e1-hello', word: 'hello', meaning: '안녕', hint: '친구를 처음 만날 때 쓰는 말', example: 'Hello, CardVille!', kind: 'word' },
      { id: 'e1-goodbye', word: 'goodbye', meaning: '잘 가', hint: '헤어질 때 쓰는 인사', example: 'Goodbye, see you!', kind: 'word' },
      { id: 'e1-thanks', word: 'thanks', meaning: '고마워', hint: '도움을 받았을 때', example: 'Thanks, cat!', kind: 'word' },
      { id: 'e1-please', word: 'please', meaning: '부탁해', hint: '정중하게 말할 때 붙여요', example: 'Please open the pack.', kind: 'word' },
      { id: 'e1-sorry', word: 'sorry', meaning: '미안해', hint: '실수했을 때', example: 'Sorry, my mistake.', kind: 'word' },
      { id: 'e1-friend', word: 'friend', meaning: '친구', hint: '함께 노는 사람', example: 'You are my friend.', kind: 'word' }
    ]
  },
  {
    id: 2,
    title: '마을 물건 카드',
    subtitle: '카드마을에서 자주 보는 물건 이름',
    difficulty: '입문',
    theme: '상점과 도서관',
    cards: [
      { id: 'e2-card', word: 'card', meaning: '카드', hint: '게임에서 뒤집고 모으는 것', example: 'This is a card.', kind: 'word' },
      { id: 'e2-book', word: 'book', meaning: '책', hint: '도서관에 많아요', example: 'Open the book.', kind: 'word' },
      { id: 'e2-coin', word: 'coin', meaning: '동전', hint: '상점에서 쓰는 재화', example: 'I have one coin.', kind: 'word' },
      { id: 'e2-gem', word: 'gem', meaning: '보석', hint: '반짝이는 재화', example: 'The gem is blue.', kind: 'word' },
      { id: 'e2-pack', word: 'pack', meaning: '팩', hint: '카드가 들어 있는 묶음', example: 'Open a pack.', kind: 'word' },
      { id: 'e2-star', word: 'star', meaning: '별', hint: '클리어 결과에 보여요', example: 'Get a star.', kind: 'word' }
    ]
  },
  {
    id: 3,
    title: '행동 카드 수업',
    subtitle: '게임에서 자주 쓰는 움직임 표현',
    difficulty: '연습',
    theme: '광장 훈련',
    cards: [
      { id: 'e3-look', word: 'look', meaning: '보다', hint: '카드를 자세히 볼 때', example: 'Look at the card.', kind: 'word' },
      { id: 'e3-find', word: 'find', meaning: '찾다', hint: '같은 그림을 찾아요', example: 'Find the cat.', kind: 'word' },
      { id: 'e3-match', word: 'match', meaning: '짝을 맞추다', hint: '기억의 숲 핵심 행동', example: 'Match two cards.', kind: 'word' },
      { id: 'e3-open', word: 'open', meaning: '열다', hint: '팩이나 문을 열 때', example: 'Open the door.', kind: 'word' },
      { id: 'e3-choose', word: 'choose', meaning: '고르다', hint: '정답을 선택할 때', example: 'Choose one answer.', kind: 'word' },
      { id: 'e3-learn', word: 'learn', meaning: '배우다', hint: '학교에서 하는 일', example: 'Learn new words.', kind: 'word' }
    ]
  },
  {
    id: 4,
    title: '짧은 문장 수업',
    subtitle: '인게임 안내문으로 쓸 수 있는 표현',
    difficulty: '도전',
    theme: '교실 챌린지',
    cards: [
      { id: 'e4-my-turn', word: 'my turn', meaning: '내 차례', hint: '내가 행동할 순서', example: 'It is my turn.', kind: 'phrase' },
      { id: 'e4-great-job', word: 'great job', meaning: '잘했어', hint: '성공했을 때 칭찬', example: 'Great job!', kind: 'phrase' },
      { id: 'e4-try-again', word: 'try again', meaning: '다시 해봐', hint: '실패 후 복구 안내', example: 'Try again.', kind: 'phrase' },
      { id: 'e4-one-more', word: 'one more', meaning: '하나 더', hint: '추가 카드나 추가 시도', example: 'One more card.', kind: 'phrase' },
      { id: 'e4-ready-go', word: 'ready, go', meaning: '준비, 시작', hint: '수업을 시작할 때', example: 'Ready, go!', kind: 'phrase' },
      { id: 'e4-see-you', word: 'see you', meaning: '또 만나', hint: '다음에 다시 볼 때', example: 'See you soon.', kind: 'phrase' }
    ]
  }
];

export function getEnglishStage(stageId: number | undefined): EnglishStage {
  return ENGLISH_STAGES.find((stage) => stage.id === stageId) ?? ENGLISH_STAGES[0];
}
