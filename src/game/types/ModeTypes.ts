export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ModeCardData {
  id: string;
  frontText: string;
  answerKey: string;
  rarity: CardRarity;
}

export interface ModeStageData {
  stageId: string;
  goal: {
    type: 'match_pairs' | 'memory_flip' | 'math_answer' | 'color_select';
    targetCount: number;
  };
  cards: ModeCardData[];
  rewards: {
    xp: number;
    coins: number;
    packChance: number;
  };
}

export interface ModeData {
  modeId: string;
  title: string;
  type: string;
  world: string;
  difficulty: number;
  stages: ModeStageData[];
}
