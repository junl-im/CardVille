export type MathProblemKind = 'add' | 'subtract' | 'multiply' | 'balance';

export type MathProblem = {
  id: string;
  kind: MathProblemKind;
  prompt: string;
  expression: string;
  answer: number;
  choices: number[];
  hint: string;
};

export type MathStage = {
  id: number;
  title: string;
  subtitle: string;
  difficulty: '기본' | '집중' | '도전';
  problems: MathProblem[];
};

export const MATH_STAGES: readonly MathStage[] = [
  {
    id: 1,
    title: '숫자 불빛 켜기',
    subtitle: '연산 연구소 입문',
    difficulty: '기본',
    problems: [
      { id: 'm1-1', kind: 'add', prompt: '마법 전구에 필요한 숫자는?', expression: '7 + 5', answer: 12, choices: [10, 11, 12, 13], hint: '7에서 5칸 앞으로 걸어가요.' },
      { id: 'm1-2', kind: 'subtract', prompt: '남은 별가루는 몇 개인가요?', expression: '16 - 9', answer: 7, choices: [5, 6, 7, 8], hint: '16에서 10을 빼고 하나를 되돌려요.' },
      { id: 'm1-3', kind: 'add', prompt: '두 카드 상자의 합은?', expression: '8 + 6', answer: 14, choices: [12, 13, 14, 15], hint: '8 + 2 + 4로 나누면 쉬워요.' },
      { id: 'm1-4', kind: 'balance', prompt: '저울이 맞으려면?', expression: '9 + ? = 15', answer: 6, choices: [4, 5, 6, 7], hint: '15에서 9를 빼면 빈칸이 보여요.' },
      { id: 'm1-5', kind: 'multiply', prompt: '고양이 발자국 3줄, 한 줄에 4개', expression: '3 × 4', answer: 12, choices: [9, 10, 12, 14], hint: '4를 세 번 더해요.' }
    ]
  },
  {
    id: 2,
    title: '카드 에너지 맞추기',
    subtitle: '빠른 덧셈과 뺄셈',
    difficulty: '집중',
    problems: [
      { id: 'm2-1', kind: 'add', prompt: '보라 수정의 총 에너지', expression: '18 + 7', answer: 25, choices: [23, 24, 25, 26], hint: '18에서 2를 더해 20, 남은 5를 더해요.' },
      { id: 'm2-2', kind: 'subtract', prompt: '문을 열고 남은 열쇠', expression: '31 - 14', answer: 17, choices: [15, 16, 17, 18], hint: '31 - 10 - 4로 나눠요.' },
      { id: 'm2-3', kind: 'balance', prompt: '빈 카드에 들어갈 수', expression: '? + 19 = 42', answer: 23, choices: [21, 22, 23, 24], hint: '42에서 19를 빼요.' },
      { id: 'm2-4', kind: 'multiply', prompt: '상점 선반 5칸, 한 칸에 6팩', expression: '5 × 6', answer: 30, choices: [25, 28, 30, 36], hint: '6을 다섯 번 더해요.' },
      { id: 'm2-5', kind: 'subtract', prompt: '날아간 카드 뒤 남은 카드', expression: '50 - 27', answer: 23, choices: [21, 22, 23, 24], hint: '50 - 20 - 7로 계산해요.' }
    ]
  },
  {
    id: 3,
    title: '별빛 회로 연결',
    subtitle: '곱셈과 빈칸 집중 훈련',
    difficulty: '도전',
    problems: [
      { id: 'm3-1', kind: 'multiply', prompt: '수정 회로 4줄, 한 줄에 7개', expression: '4 × 7', answer: 28, choices: [24, 27, 28, 32], hint: '7을 네 번 더하거나 4 × 5 + 4 × 2로 나눠요.' },
      { id: 'm3-2', kind: 'balance', prompt: '마법 저울의 빈칸 숫자', expression: '36 = ? + 19', answer: 17, choices: [15, 16, 17, 18], hint: '36에서 19를 빼요.' },
      { id: 'm3-3', kind: 'subtract', prompt: '항구로 보낸 카드 뒤 남은 카드', expression: '72 - 38', answer: 34, choices: [32, 33, 34, 35], hint: '72 - 40 + 2로 생각해요.' },
      { id: 'm3-4', kind: 'add', prompt: '도서관과 학교의 별가루 합', expression: '47 + 26', answer: 73, choices: [71, 72, 73, 74], hint: '47 + 20 + 6으로 나눠요.' },
      { id: 'm3-5', kind: 'balance', prompt: '연구소 문양을 완성할 수', expression: '8 × ? = 48', answer: 6, choices: [5, 6, 7, 8], hint: '48 안에 8이 몇 번 들어가는지 찾아요.' }
    ]
  },
  {
    id: 4,
    title: '상점 계산 장부',
    subtitle: '구매팩 가격을 빠르게 맞춰요',
    difficulty: '집중',
    problems: [
      { id: 'm4-1', kind: 'add', prompt: '일반팩 2개와 반짝 카드의 합', expression: '24 + 18', answer: 42, choices: [40, 41, 42, 44], hint: '24에 20을 더하고 2를 빼요.' },
      { id: 'm4-2', kind: 'subtract', prompt: '상점 코인에서 남은 금액', expression: '85 - 39', answer: 46, choices: [44, 45, 46, 48], hint: '85 - 40 + 1로 계산해요.' },
      { id: 'm4-3', kind: 'multiply', prompt: '진열대 6칸, 한 칸에 카드 7장', expression: '6 × 7', answer: 42, choices: [36, 40, 42, 49], hint: '7을 여섯 번 더하거나 3 × 7을 두 번 해요.' },
      { id: 'm4-4', kind: 'balance', prompt: '상점 저울이 맞는 빈칸', expression: '64 = ? + 28', answer: 36, choices: [34, 35, 36, 38], hint: '64에서 28을 빼요.' },
      { id: 'm4-5', kind: 'subtract', prompt: '카드팩을 사고 남은 보석 조각', expression: '93 - 57', answer: 36, choices: [34, 36, 38, 40], hint: '93 - 60 + 3으로 되돌려요.' }
    ]
  },
  {
    id: 5,
    title: '왕관 회로 시험',
    subtitle: '큰 수와 곱셈을 섞은 보스 문제팩',
    difficulty: '도전',
    problems: [
      { id: 'm5-1', kind: 'multiply', prompt: '왕관 회로 8줄, 한 줄에 6개', expression: '8 × 6', answer: 48, choices: [42, 46, 48, 54], hint: '6을 4번 더한 값을 두 배로 해요.' },
      { id: 'm5-2', kind: 'add', prompt: '성문 양쪽 별가루 합', expression: '68 + 27', answer: 95, choices: [93, 94, 95, 96], hint: '68 + 30 - 3으로 생각해요.' },
      { id: 'm5-3', kind: 'balance', prompt: '빈 카드가 왕관을 완성하려면?', expression: '9 × ? = 72', answer: 8, choices: [6, 7, 8, 9], hint: '72 안에 9가 몇 번 들어가나요?' },
      { id: 'm5-4', kind: 'subtract', prompt: '마법 열차가 떠난 뒤 남은 카드', expression: '120 - 75', answer: 45, choices: [35, 40, 45, 55], hint: '120 - 70 - 5로 나눠요.' },
      { id: 'm5-5', kind: 'balance', prompt: '마지막 회로의 빠진 숫자', expression: '? + 49 = 108', answer: 59, choices: [57, 58, 59, 60], hint: '108에서 49를 빼면 됩니다.' }
    ]
  }

];

export function getMathStage(stageId: number | undefined): MathStage {
  return MATH_STAGES.find((stage) => stage.id === stageId) ?? MATH_STAGES[0];
}
