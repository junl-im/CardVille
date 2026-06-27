export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ModeType = 'match_pairs' | 'memory_flip' | 'math_match' | 'word_match' | 'english_match' | 'color_select';

export type GameCardData = {
  id: string;
  frontText: string;
  answerKey: string;
  rarity: Rarity;
  imageKey?: string;
  audioKey?: string;
};

export type StageGoal = {
  type: string;
  targetCount: number;
};

export type StageRewards = {
  xp: number;
  coins: number;
  packChance: number;
};

export type StageData = {
  stageId: string;
  title: string;
  goal: StageGoal;
  cards: GameCardData[];
  rewards: StageRewards;
};

export type ModeData = {
  version: number;
  modeId: string;
  title: string;
  type: ModeType;
  world: string;
  difficulty: number;
  description: string;
  stages: StageData[];
};

export type ModeMeta = {
  modeId: string;
  title: string;
  description: string;
  dataPath: string;
  emoji: string;
};
