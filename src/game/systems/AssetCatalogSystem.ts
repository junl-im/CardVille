export interface CardImageIndexItem {
  id: string;
  category: string;
  category_ko: string;
  label: string;
  file: string;
}

export interface AssetPackSummary {
  totalImages: number;
  categories: Array<{ key: string; label: string; count: number }>;
}

const INDEX_URL = `${import.meta.env.BASE_URL}assets/json/cards_image_index.json`;
const MANIFEST_URL = `${import.meta.env.BASE_URL}assets/json/asset_manifest.json`;

export class AssetCatalogSystem {
  private static cardIndex?: CardImageIndexItem[];
  private static manifest?: Record<string, unknown>;

  static async loadCardIndex(): Promise<CardImageIndexItem[]> {
    if (this.cardIndex) return this.cardIndex;
    const response = await fetch(INDEX_URL);
    if (!response.ok) {
      console.warn('[CardVille] Card image index not found.');
      this.cardIndex = [];
      return this.cardIndex;
    }
    const raw = (await response.json()) as CardImageIndexItem[];
    this.cardIndex = Array.isArray(raw) ? raw.filter(this.isValidItem) : [];
    return this.cardIndex;
  }

  static async loadManifest(): Promise<Record<string, unknown>> {
    if (this.manifest) return this.manifest;
    const response = await fetch(MANIFEST_URL);
    if (!response.ok) {
      this.manifest = {};
      return this.manifest;
    }
    this.manifest = (await response.json()) as Record<string, unknown>;
    return this.manifest;
  }

  static async getSummary(): Promise<AssetPackSummary> {
    const items = await this.loadCardIndex();
    const map = new Map<string, { key: string; label: string; count: number }>();
    for (const item of items) {
      const current = map.get(item.category) ?? { key: item.category, label: item.category_ko || item.category, count: 0 };
      current.count += 1;
      map.set(item.category, current);
    }
    return {
      totalImages: items.length,
      categories: [...map.values()].sort((a, b) => a.label.localeCompare(b.label, 'ko'))
    };
  }

  static async getItems(category = 'all', query = ''): Promise<CardImageIndexItem[]> {
    const items = await this.loadCardIndex();
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryOk = category === 'all' || item.category === category;
      if (!categoryOk) return false;
      if (!normalized) return true;
      return item.label.toLowerCase().includes(normalized) || item.id.toLowerCase().includes(normalized);
    });
  }

  static page<T>(items: T[], page: number, pageSize: number): T[] {
    return items.slice(page * pageSize, page * pageSize + pageSize);
  }

  static maxPage(total: number, pageSize: number): number {
    return Math.max(0, Math.ceil(total / pageSize) - 1);
  }

  static clampPage(page: number, total: number, pageSize: number): number {
    return Math.min(Math.max(0, page), this.maxPage(total, pageSize));
  }

  static textureKey(item: CardImageIndexItem): string {
    return `catalog:${item.id}`;
  }

  static assetUrl(item: CardImageIndexItem): string {
    return `${import.meta.env.BASE_URL}assets/${this.encodePath(item.file)}`;
  }

  static encodePath(file: string): string {
    return file.split('/').map((part) => encodeURIComponent(part)).join('/');
  }

  private static isValidItem(item: CardImageIndexItem): boolean {
    return Boolean(item && item.id && item.category && item.label && item.file && item.file.endsWith('.png'));
  }
}
