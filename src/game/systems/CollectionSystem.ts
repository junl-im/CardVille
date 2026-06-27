import Phaser from 'phaser';
import { CardRarity } from '../types/ModeTypes';
import {
  CollectionCatalog,
  CollectionCardDefinition,
  OwnedCardRecord,
  PackCatalog,
  PackDefinition,
  PackOpenResult
} from '../types/CollectionTypes';
import { AuthSystem } from './AuthSystem';
import { saveCollectedCard } from '../../firebase/firestore';

const OWNED_CARDS_STORAGE_KEY = 'cardville.ownedCards.v1';

const RARITY_ORDER: CardRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export class CollectionSystem {
  private static collectionCatalog?: CollectionCatalog;
  private static packCatalog?: PackCatalog;

  static async loadCollectionCatalog(): Promise<CollectionCatalog> {
    if (this.collectionCatalog) return this.collectionCatalog;
    const response = await fetch(`${import.meta.env.BASE_URL}assets/data/cards/collection.base.json`);
    if (!response.ok) throw new Error('Collection catalog not found.');
    this.collectionCatalog = (await response.json()) as CollectionCatalog;
    return this.collectionCatalog;
  }

  static async loadPackCatalog(): Promise<PackCatalog> {
    if (this.packCatalog) return this.packCatalog;
    const response = await fetch(`${import.meta.env.BASE_URL}assets/data/packs/card_packs.json`);
    if (!response.ok) throw new Error('Pack catalog not found.');
    this.packCatalog = (await response.json()) as PackCatalog;
    return this.packCatalog;
  }

  static async getAllCards(): Promise<CollectionCardDefinition[]> {
    const catalog = await this.loadCollectionCatalog();
    return catalog.sets.flatMap((set) => set.cards.map((card) => ({
      ...card,
      setId: set.setId,
      setTitle: set.title,
      world: set.world
    })));
  }

  static getOwnedCards(): OwnedCardRecord[] {
    if (typeof window === 'undefined') return [];

    try {
      const raw = window.localStorage.getItem(OWNED_CARDS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as OwnedCardRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('[CardVille] Failed to read owned cards.', error);
      return [];
    }
  }

  static getOwnedMap(): Map<string, OwnedCardRecord> {
    return new Map(this.getOwnedCards().map((card) => [card.cardId, card]));
  }

  static getTotalOwnedCount(): number {
    return this.getOwnedCards().reduce((sum, card) => sum + card.count, 0);
  }

  static async openPack(packId = 'starter_pack'): Promise<PackOpenResult> {
    const pack = await this.getPack(packId);
    const allCards = await this.getAllCards();
    const availableCards = allCards.filter((card) => pack.availableSets.includes(card.setId));
    const cards: CollectionCardDefinition[] = [];

    for (let i = 0; i < pack.slots; i += 1) {
      const rarity = i === 0 && pack.guaranteedRarity
        ? this.rollGuaranteedOrBetter(pack.guaranteedRarity, pack.rarityWeights)
        : this.rollRarity(pack.rarityWeights);
      cards.push(this.pickCardByRarity(availableCards, rarity));
    }

    const ownedAfterOpen: OwnedCardRecord[] = [];
    for (const card of cards) {
      ownedAfterOpen.push(await this.addOwnedCard(card));
    }

    return { pack, cards, ownedAfterOpen };
  }

  static async addOwnedCard(card: CollectionCardDefinition): Promise<OwnedCardRecord> {
    const now = new Date().toISOString();
    const owned = this.getOwnedCards();
    const index = owned.findIndex((item) => item.cardId === card.cardId);
    let record: OwnedCardRecord;

    if (index >= 0) {
      record = {
        ...owned[index],
        count: owned[index].count + 1,
        updatedAt: now
      };
      owned[index] = record;
    } else {
      record = {
        cardId: card.cardId,
        name: card.name,
        rarity: card.rarity,
        imageKey: card.imageKey,
        setId: card.setId,
        count: 1,
        firstObtainedAt: now,
        updatedAt: now
      };
      owned.push(record);
    }

    this.saveOwnedCards(owned);

    const user = AuthSystem.currentUser;
    if (user) {
      try {
        await saveCollectedCard(user.uid, record);
      } catch (error) {
        console.warn('[CardVille] Firestore collection save failed.', error);
      }
    }

    return record;
  }

  static getRarityLabel(rarity: CardRarity): string {
    const labels: Record<CardRarity, string> = {
      common: '일반',
      uncommon: '고급',
      rare: '희귀',
      epic: '영웅',
      legendary: '전설',
      mythic: '신화'
    };
    return labels[rarity];
  }

  static getRarityColor(rarity: CardRarity): number {
    const colors: Record<CardRarity, number> = {
      common: 0xd8ecff,
      uncommon: 0x9fffd0,
      rare: 0x8fd3ff,
      epic: 0xc49bff,
      legendary: 0xffd86f,
      mythic: 0xff8fd8
    };
    return colors[rarity];
  }

  static getRarityRank(rarity: CardRarity): number {
    return RARITY_ORDER.indexOf(rarity);
  }

  private static saveOwnedCards(cards: OwnedCardRecord[]): void {
    if (typeof window === 'undefined') return;
    const sorted = [...cards].sort((a, b) => {
      const rarityDiff = this.getRarityRank(b.rarity) - this.getRarityRank(a.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name, 'ko');
    });
    window.localStorage.setItem(OWNED_CARDS_STORAGE_KEY, JSON.stringify(sorted));
  }

  private static async getPack(packId: string): Promise<PackDefinition> {
    const catalog = await this.loadPackCatalog();
    const pack = catalog.packs.find((item) => item.packId === packId);
    if (!pack) throw new Error(`Pack not found: ${packId}`);
    return pack;
  }

  private static rollRarity(weights: Record<CardRarity, number>): CardRarity {
    const entries = RARITY_ORDER.map((rarity) => [rarity, Math.max(0, weights[rarity] ?? 0)] as const);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    if (total <= 0) return 'common';

    let target = Math.random() * total;
    for (const [rarity, weight] of entries) {
      target -= weight;
      if (target <= 0) return rarity;
    }
    return 'common';
  }

  private static rollGuaranteedOrBetter(guaranteed: CardRarity, weights: Record<CardRarity, number>): CardRarity {
    const minRank = this.getRarityRank(guaranteed);
    const adjusted = { ...weights };
    RARITY_ORDER.forEach((rarity, index) => {
      if (index < minRank) adjusted[rarity] = 0;
    });
    return this.rollRarity(adjusted);
  }

  private static pickCardByRarity(cards: CollectionCardDefinition[], rarity: CardRarity): CollectionCardDefinition {
    const candidates = cards.filter((card) => card.rarity === rarity);
    if (candidates.length > 0) return Phaser.Math.RND.pick(candidates);

    for (let offset = 1; offset < RARITY_ORDER.length; offset += 1) {
      const lower = RARITY_ORDER[this.getRarityRank(rarity) - offset];
      const higher = RARITY_ORDER[this.getRarityRank(rarity) + offset];
      const fallback = cards.filter((card) => card.rarity === higher || card.rarity === lower);
      if (fallback.length > 0) return Phaser.Math.RND.pick(fallback);
    }

    if (cards.length === 0) throw new Error('No cards available for pack.');
    return Phaser.Math.RND.pick(cards);
  }
}
