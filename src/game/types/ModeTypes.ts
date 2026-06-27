export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface ModeCatalogItem {
  modeId: string;
  title: string;
  subtitle: string;
  icon: string;
  status: 'open' | 'locked' | 'soon';
  unlockText?: string;
  bookTitle?: string;
  bookSpine?: string;
  bookColor?: string;
  worldNote?: string;
}

export interface ModeCatalog {
  version: number;
  modes: ModeCatalogItem[];
}

export interface ModeCardData {
  id: string;
  frontText: string;
  frontSubText?: string;
  frontEmoji?: string;
  frontImageKey?: string;
  answerKey: string;
  rarity: CardRarity;
}

export interface ModeStageData {
  stageId: string;
  title: string;
  subtitle?: string;
  goal: {
    type: 'match_pairs' | 'memory_flip' | 'math_answer' | 'color_select' | 'puzzle_pair';
    targetCount: number;
  };
  cards: ModeCardData[];
  rewards: {
    xp: number;
    coins: number;
    packChance: number;
    packId?: string;
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

export interface PlayResultData {
  modeId: string;
  stageIndex: number;
  stageTitle: string;
  score: number;
  combo: number;
  clear: boolean;
  moves?: number;
  mistakes?: number;
  elapsedSec?: number;
  rewards: {
    xp: number;
    coins: number;
    packChance: number;
    packId?: string;
  };
}
