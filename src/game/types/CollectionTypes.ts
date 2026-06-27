import { CardRarity } from './ModeTypes';

export interface CollectionCardDefinition {
  cardId: string;
  name: string;
  rarity: CardRarity;
  imageKey: string;
  setId: string;
  setTitle: string;
  world: string;
}

export interface CollectionSetDefinition {
  setId: string;
  title: string;
  world: string;
  cards: Omit<CollectionCardDefinition, 'setId' | 'setTitle' | 'world'>[];
}

export interface CollectionCatalog {
  version: number;
  sets: CollectionSetDefinition[];
}

export interface OwnedCardRecord {
  cardId: string;
  name: string;
  rarity: CardRarity;
  imageKey: string;
  setId: string;
  count: number;
  firstObtainedAt: string;
  updatedAt: string;
}

export interface PackDefinition {
  packId: string;
  title: string;
  subtitle: string;
  slots: number;
  guaranteedRarity?: CardRarity;
  rarityWeights: Record<CardRarity, number>;
  availableSets: string[];
  visual: {
    mainColor: string;
    accentColor: string;
    symbol: string;
  };
}

export interface PackCatalog {
  version: number;
  packs: PackDefinition[];
}

export interface PackOpenResult {
  pack: PackDefinition;
  cards: CollectionCardDefinition[];
  ownedAfterOpen: OwnedCardRecord[];
}
